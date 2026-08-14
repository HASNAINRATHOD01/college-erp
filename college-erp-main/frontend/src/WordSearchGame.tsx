import { useEffect, useMemo, useState } from 'react';
import './WordSearchGame.css';

type Position = {
  row: number;
  col: number;
};

type WordSearchGameProps = {
  words?: string[];
  grid?: string[][];
  initialTimeSeconds?: number;
  title?: string;
  description?: string;
};

const DEFAULT_WORDS = ['REACT', 'BUILD', 'LOGIC', 'CODE', 'NODE'];

const DEFAULT_GRID = [
  ['R', 'E', 'A', 'C', 'T', 'O'],
  ['U', 'B', 'U', 'I', 'L', 'D'],
  ['L', 'O', 'G', 'I', 'C', 'E'],
  ['C', 'O', 'D', 'E', 'X', 'L'],
  ['N', 'O', 'D', 'E', 'S', 'P'],
  ['A', 'R', 'T', 'S', 'Y', 'N'],
];

const formatTime = (seconds: number) => {
  const safe = Math.max(seconds, 0);
  const mins = String(Math.floor(safe / 60)).padStart(2, '0');
  const secs = String(safe % 60).padStart(2, '0');
  return `${mins}:${secs}`;
};

const isAdjacent = (from: Position, to: Position) => {
  const rowDelta = Math.abs(from.row - to.row);
  const colDelta = Math.abs(from.col - to.col);
  return rowDelta <= 1 && colDelta <= 1 && (rowDelta !== 0 || colDelta !== 0);
};

export default function WordSearchGame({
  words = DEFAULT_WORDS,
  grid = DEFAULT_GRID,
  initialTimeSeconds = 45,
  title = 'Daily Word Search',
  description = 'Find the hidden tech words before the timer ends.',
}: WordSearchGameProps) {
  const [selection, setSelection] = useState<Position[]>([]);
  const [selectionActive, setSelectionActive] = useState(false);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(initialTimeSeconds);
  const [status, setStatus] = useState('Tap and drag across adjacent letters.');
  const [gameState, setGameState] = useState<'playing' | 'finished'>('playing');
  const [shareMessage, setShareMessage] = useState('');

  const normalizedWords = useMemo(() => words.map((word) => word.toUpperCase()), [words]);

  useEffect(() => {
    if (gameState !== 'playing') {
      return;
    }

    if (timeLeft <= 0) {
      setGameState('finished');
      setStatus('Time is up. Tap restart to try again.');
      return;
    }

    const timer = window.setInterval(() => {
      setTimeLeft((value) => value - 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [gameState, timeLeft]);

  useEffect(() => {
    if (foundWords.length === normalizedWords.length && normalizedWords.length > 0) {
      setGameState('finished');
      setStatus('You cleared the board. Nice work!');
    }
  }, [foundWords, normalizedWords]);

  const handleStartSelection = (row: number, col: number) => {
    setSelection([{ row, col }]);
    setSelectionActive(true);
    setStatus('Drag over adjacent letters.');
  };

  const handleHoverCell = (row: number, col: number) => {
    if (!selectionActive || selection.length === 0) {
      return;
    }

    const last = selection[selection.length - 1];
    const target = { row, col };
    const alreadySelected = selection.some((cell) => cell.row === target.row && cell.col === target.col);

    if (!alreadySelected && isAdjacent(last, target)) {
      setSelection((prev) => [...prev, target]);
    }
  };

  const finishSelection = () => {
    setSelectionActive(false);
  };

  const clearSelection = () => {
    setSelection([]);
    setSelectionActive(false);
    setStatus('Selection cleared.');
  };

  const submitSelection = () => {
    if (selection.length < 2) {
      setStatus('Select at least two letters.');
      return;
    }

    const formedWord = selection.map((cell) => grid[cell.row][cell.col]).join('').toUpperCase();
    const reversedWord = [...selection].reverse().map((cell) => grid[cell.row][cell.col]).join('').toUpperCase();
    const candidateWords = [formedWord, reversedWord];

    const matchedWord = normalizedWords.find((word) => candidateWords.includes(word));

    if (!matchedWord) {
      setStatus('That word is not on the board. Try again.');
      return;
    }

    if (foundWords.includes(matchedWord)) {
      setStatus('You already found that word.');
      return;
    }

    setFoundWords((prev) => [...prev, matchedWord]);
    setScore((prev) => prev + 100 + timeLeft);
    setStatus(`Found ${matchedWord}!`);
    setSelection([]);
    setSelectionActive(false);
  };

  const resetGame = () => {
    setSelection([]);
    setSelectionActive(false);
    setFoundWords([]);
    setScore(0);
    setTimeLeft(initialTimeSeconds);
    setStatus('New round started.');
    setGameState('playing');
    setShareMessage('');
  };

  const completionTime = initialTimeSeconds - timeLeft;

  const shareResult = async () => {
    const blocks = normalizedWords.map((word) => (foundWords.includes(word) ? '🟩' : '⬜')).join('');
    const text = `Campuzz Daily Word Search\nScore: ${score}\nTime: ${formatTime(completionTime)}\n${blocks}`;

    try {
      if (navigator.share) {
        await navigator.share({ title: 'Campuzz Daily Game', text });
      } else {
        await navigator.clipboard.writeText(text);
        setShareMessage('Result copied to clipboard.');
      }
    } catch {
      setShareMessage('Share cancelled.');
    }
  };

  return (
    <div className="word-search-shell">
      <div className="word-search-header">
        <div>
          <p className="word-search-pill">Daily challenge</p>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
        <div className="word-search-stats">
          <div className="word-search-stat-card">
            <span>Score</span>
            <strong>{score}</strong>
          </div>
          <div className="word-search-stat-card">
            <span>Time</span>
            <strong>{formatTime(timeLeft)}</strong>
          </div>
        </div>
      </div>

      <div className="word-search-body">
        <div className="word-search-board-card">
          <div className="word-search-actions">
            <button type="button" className="word-search-action-btn" onClick={submitSelection}>
              Submit Word
            </button>
            <button type="button" className="word-search-action-btn secondary" onClick={clearSelection}>
              Clear
            </button>
          </div>

          <div className="word-search-grid" role="grid" aria-label="Word search board">
            {grid.map((row, rowIndex) =>
              row.map((letter, colIndex) => {
                const isSelected = selection.some((cell) => cell.row === rowIndex && cell.col === colIndex);
                const isFound = normalizedWords.some((word) => {
                  const positions = getWordPositions(word, grid);
                  return positions.some((p) => p.row === rowIndex && p.col === colIndex);
                });

                return (
                  <button
                    key={`${rowIndex}-${colIndex}`}
                    type="button"
                    className={`word-search-cell ${isSelected ? 'selected' : ''} ${isFound ? 'found' : ''}`}
                    onPointerDown={() => handleStartSelection(rowIndex, colIndex)}
                    onPointerEnter={() => handleHoverCell(rowIndex, colIndex)}
                    onPointerUp={finishSelection}
                    onPointerLeave={() => {
                      if (selectionActive) {
                        return;
                      }
                    }}
                  >
                    {letter}
                  </button>
                );
              })
            )}
          </div>

          <div className="word-search-status">{status}</div>
        </div>

        <div className="word-search-progress-card">
          <h4>Target words</h4>
          <ul className="word-search-list">
            {normalizedWords.map((word) => {
              const found = foundWords.includes(word);
              return (
                <li key={word} className={found ? 'done' : ''}>
                  <span>{found ? '✓' : '•'}</span>
                  <span>{word}</span>
                </li>
              );
            })}
          </ul>

          <button type="button" className="word-search-primary-btn" onClick={resetGame}>
            Restart Game
          </button>
        </div>
      </div>

      {(gameState === 'finished' || foundWords.length === normalizedWords.length) && (
        <div className="word-search-modal">
          <div className="word-search-modal-card">
            <p className="word-search-pill">Challenge complete</p>
            <h3>{foundWords.length === normalizedWords.length ? 'You found them all!' : 'Time is up!'}</h3>
            <p>
              Score: <strong>{score}</strong>
            </p>
            <p>
              Completion time: <strong>{formatTime(completionTime)}</strong>
            </p>
            <div className="word-search-modal-actions">
              <button type="button" className="word-search-action-btn" onClick={shareResult}>
                Share Result
              </button>
              <button type="button" className="word-search-action-btn secondary" onClick={resetGame}>
                Play Again
              </button>
            </div>
            {shareMessage && <p className="word-search-share-message">{shareMessage}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

function getWordPositions(word: string, grid: string[][]): Position[] {
  const letters = word.split('');
  const size = grid.length;
  const positions: Position[] = [];

  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      if (grid[row][col] !== letters[0]) {
        continue;
      }

      for (const deltaRow of [-1, 0, 1]) {
        for (const deltaCol of [-1, 0, 1]) {
          if (deltaRow === 0 && deltaCol === 0) {
            continue;
          }

          const path: Position[] = [];
          let valid = true;

          for (let index = 0; index < letters.length; index += 1) {
            const nextRow = row + deltaRow * index;
            const nextCol = col + deltaCol * index;

            if (nextRow < 0 || nextRow >= size || nextCol < 0 || nextCol >= size) {
              valid = false;
              break;
            }

            if (grid[nextRow][nextCol] !== letters[index]) {
              valid = false;
              break;
            }

            path.push({ row: nextRow, col: nextCol });
          }

          if (valid) {
            positions.push(...path);
          }
        }
      }
    }
  }

  return positions;
}
