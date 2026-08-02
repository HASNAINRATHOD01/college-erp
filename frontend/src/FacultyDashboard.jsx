import React, { useState, useEffect } from 'react';
import './FacultyDashboard.css';
import GrowingPlant from './GrowingPlant';
import ApiService from './apiService';

// Inline SVG Icons for clean, zero-dependency deployment
const AttendanceIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
);

const StudentsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);

const LibraryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/></svg>
);

const CloudIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19A5.5 5.5 0 0 0 18 8.02a9 9 0 0 0-17.44 2.18 5.5 5.5 0 0 0 .94 10.78H17.5Z"/></svg>
);

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
);

const CollapseIcon = ({ collapsed }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}><polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/></svg>
);

const SearchIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/></svg>
);

const AssignmentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
);

const CampuzzLogo = ({ subtitle = "Faculty Desk", collapsed = false }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', userSelect: 'none' }}>
    <div style={{
      width: '38px',
      height: '38px',
      borderRadius: '10px',
      background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
      flexShrink: 0
    }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
        <path d="M6 12v5c3 3 9 3 12 0v-5"/>
      </svg>
    </div>
    {!collapsed && (
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
        <span style={{ fontSize: '17px', fontWeight: '800', letterSpacing: '-0.3px', background: 'linear-gradient(90deg, #ffffff 0%, #cbd5e1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Campuzz<span style={{ color: '#38bdf8', WebkitTextFillColor: '#38bdf8' }}>.ERP</span>
        </span>
        <span style={{ fontSize: '10px', fontWeight: '600', color: '#94a3b8', letterSpacing: '0.5px', textTransform: 'uppercase', marginTop: '1px' }}>
          {subtitle}
        </span>
      </div>
    )}
  </div>
);


const GIPHY_URLS = [
  "https://media.giphy.com/media/3oKIP4X86UT3wKmKAo/giphy.gif",
  "https://media.giphy.com/media/qgQUGGAC3P4FmEPQf2/giphy.gif",
  "https://media.giphy.com/media/xT9C25UNTwEZ11f58Q/giphy.gif",
  "https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif",
  "https://media.giphy.com/media/julfEI74xe7GUTnUaZ/giphy.gif"
];

export default function FacultyDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('attendance');
  const [collapsed, setCollapsed] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [randomGiphyUrl, setRandomGiphyUrl] = useState(GIPHY_URLS[0]);
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);

  useEffect(() => {
    if (activeTab === 'cloud') {
      const randIdx = Math.floor(Math.random() * GIPHY_URLS.length);
      setRandomGiphyUrl(GIPHY_URLS[randIdx]);
    }
  }, [activeTab]);

  const handleRandomizeGiphy = () => {
    const filtered = GIPHY_URLS.filter(url => url !== randomGiphyUrl);
    const randIdx = Math.floor(Math.random() * filtered.length);
    setRandomGiphyUrl(filtered[randIdx]);
  };

  // --- Core State & LocalStorage Loaders ---
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);

  // AI Predictor State
  const [selectedPredictStudentId, setSelectedPredictStudentId] = useState('');
  const [predicting, setPredicting] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [predictionHistory, setPredictionHistory] = useState([]);
  
  // --- Timetable State ---
  const [timetableImage, setTimetableImage] = useState(null);

  const activeFacultyProfile = {
    id: user?.id || 'F000',
    name: user?.name || user?.username || 'Faculty Member',
    dept: user?.dept || 'Computer Engineering',
    email: user?.email || 'Not Provided',
    subject: user?.subject || 'Not Assigned'
  };

  const loadData = async () => {
    try {
      const apiStudents = await ApiService.getStudents();
      const apiAssignments = await ApiService.getAssignments();
      
      try {
        const apiTimetable = await ApiService.getLatestTimetableImage();
        if (apiTimetable && apiTimetable.image) {
          setTimetableImage(apiTimetable.image);
        }
      } catch (e) {
        console.log('Timetable not found:', e);
      }

      setStudents(apiStudents.map(s => {
        const rawClass = s.class_assigned || s.class || s.course;
        const resolvedClass = (rawClass && /^D[1-7]$/i.test(rawClass.trim()))
          ? rawClass.trim().toUpperCase()
          : ('D' + (((parseInt(s.id, 10) || 1) % 7) + 1));
        return {
          id: String(s.id),
          name: s.first_name ? `${s.first_name} ${s.last_name || ''}`.trim() : s.username,
          email: s.email,
          dept: s.department || 'Computer Engineering',
          phone: 'Not Provided',
          fatherName: 'Not Provided',
          motherName: 'Not Provided',
          guardianContact: 'Not Provided',
          attendance: s.attendance_pct !== null ? s.attendance_pct : null,
          username: s.username,
          class: resolvedClass,
          classAssigned: resolvedClass
        };
      }));

      setAssignments(apiAssignments.map(a => ({
        id: a.id,
        title: a.title,
        subject: a.subject,
        dept: a.dept,
        dueDate: a.dueDate,
        marks: a.marks,
        desc: a.desc
      })));
    } catch (err) {
      console.error('Failed to load faculty dashboard data:', err);
    }
  };

  const loadPredictionHistory = async () => {
    try {
      const history = await ApiService.getPredictionHistory();
      setPredictionHistory(history);
    } catch (err) {
      console.error('Failed to load prediction history:', err);
    }
  };

  const handleRunPrediction = async () => {
    if (!selectedPredictStudentId) return;
    setPredicting(true);
    setPredictionResult(null);
    try {
      const res = await ApiService.predictPerformance(parseInt(selectedPredictStudentId, 10));
      setPredictionResult(res);
      showToast('AI Risk assessment completed successfully!');
      await loadPredictionHistory();
    } catch (err) {
      showToast(`AI Predictor Error: ${err.message}`);
    } finally {
      setPredicting(false);
    }
  };

  useEffect(() => {
    loadData();
    loadPredictionHistory();
  }, []);

  // Toast Helpers
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // --- Attendance State & Logic ---
  const [selectedDept] = useState(activeFacultyProfile.dept);
  const [availableClasses] = useState(['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7']);
  const [selectedClass, setSelectedClass] = useState('D1');
  // Attendance records is a dictionary of { studentId: boolean (present/absent) }
  const [attendanceToggles, setAttendanceToggles] = useState({});

  const getStudentClass = (s) => {
    if (!s) return 'D1';
    const raw = s.classAssigned || s.class || s.course;
    if (raw && /^D[1-7]$/i.test(String(raw).trim())) {
      return String(raw).trim().toUpperCase();
    }
    const num = parseInt(s.username || s.id, 10);
    if (!isNaN(num)) {
      return 'D' + ((Math.abs(num) % 7) + 1);
    }
    return 'D1';
  };

  // Filter students based on chosen class (D1 to D7)
  const deptStudents = students.filter(s => getStudentClass(s) === selectedClass);

  // Initialize attendance checklist toggles when class changes
  useEffect(() => {
    const classStudents = students.filter(s => getStudentClass(s) === selectedClass);
    const initialToggles = {};
    classStudents.forEach(s => {
      initialToggles[s.id] = true;
    });
    setAttendanceToggles(initialToggles);
  }, [selectedClass, students]);

  const handleToggleAttendance = (studentId) => {
    setAttendanceToggles(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  const handleSaveAttendance = async () => {
    if (deptStudents.length === 0) {
      showToast(`No students registered in Class ${selectedClass}.`);
      return;
    }

    try {
      // Execute sequentially to prevent SQLite database locks
      for (const s of deptStudents) {
        const isPresent = attendanceToggles[s.id] === true;
        await ApiService.markAttendance({
          student: parseInt(s.id, 10),
          subject: activeFacultyProfile.subject || 'FSD',
          date: new Date().toISOString().split('T')[0],
          status: isPresent ? 'present' : 'absent'
        });
      }
      
      await loadData();
      showToast(`Attendance updated for ${deptStudents.length} students in Class ${selectedClass}!`);
    } catch (err) {
      showToast(`Failed to save attendance: ${err.message}`);
    }
  };

  // --- Assignment Manager Logic ---
  const handlePublishAssignment = async (e) => {
    e.preventDefault();
    const title = e.target.elements.assTitle.value.trim();
    const subject = e.target.elements.assSubject.value;
    const dueDate = e.target.elements.assDueDate.value;
    const marks = parseInt(e.target.elements.assMarks.value, 10) || 30;
    const desc = e.target.elements.assDesc.value.trim();

    if (!title || !dueDate || !desc) {
      showToast('Please fill in Title, Due Date, and Description.');
      return;
    }

    const payload = {
      title,
      subject,
      dept: activeFacultyProfile.dept || 'Computer Engineering',
      dueDate,
      marks,
      desc
    };

    try {
      await ApiService.createAssignment(payload);
      await loadData();
      e.target.reset();
      showToast(`Assignment "${title}" published successfully!`);
    } catch (err) {
      showToast(`Failed to publish assignment: ${err.message}`);
    }
  };

  const handleDeleteAssignment = async (id, title) => {
    if (window.confirm(`Are you sure you want to retract assignment: "${title}"?`)) {
      try {
        await ApiService.deleteAssignment(id);
        await loadData();
        showToast('Assignment retracted.');
      } catch (err) {
        showToast(`Failed to retract assignment: ${err.message}`);
      }
    }
  };

  // --- Student & Guardian Profile State & Logic ---
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState(deptStudents[0]?.id || students[0]?.id || '');
  const [facultyNotesText, setFacultyNotesText] = useState('');
  const [facultyNoticeChannels, setFacultyNoticeChannels] = useState({ email: true, whatsapp: true });

  const DEFAULT_SUBJECTS = [
    { key: 'Maths', name: 'Mathematics IV (Maths)' },
    { key: 'PY', name: 'Python Programming (PY)' },
    { key: 'FSD', name: 'Full Stack Web Development (FSD)' },
    { key: 'COA', name: 'Computer Organization & Architecture (COA)' },
    { key: 'TOC', name: 'Theory of Computation (TOC)' }
  ];

  const [studentMarksForm, setStudentMarksForm] = useState({});

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.id.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const activeDetailStudent = students.find(s => s.id === selectedStudentId);

  // Load existing notes and marks of student when selection changes
  useEffect(() => {
    if (activeDetailStudent) {
      setFacultyNotesText(activeDetailStudent.facultyNotes || '');
    }
  }, [selectedStudentId, activeDetailStudent]);

  useEffect(() => {
    if (!activeDetailStudent?.id) return;
    const local = localStorage.getItem(`cms_student_marks_${activeDetailStudent.id}`);
    if (local) {
      try {
        const parsed = JSON.parse(local);
        const marksObj = {};
        parsed.forEach(item => {
          if (item.subject.includes('Maths')) marksObj['Maths'] = item;
          else if (item.subject.includes('PY') || item.subject.includes('Python')) marksObj['PY'] = item;
          else if (item.subject.includes('FSD') || item.subject.includes('Full Stack')) marksObj['FSD'] = item;
          else if (item.subject.includes('COA') || item.subject.includes('Organization')) marksObj['COA'] = item;
          else if (item.subject.includes('TOC') || item.subject.includes('Computation')) marksObj['TOC'] = item;
        });
        setStudentMarksForm({
          Maths: marksObj['Maths'] || { t1: 22, t2: 24, t3: 21, t4: 44 },
          PY: marksObj['PY'] || { t1: 25, t2: 23, t3: 24, t4: 48 },
          FSD: marksObj['FSD'] || { t1: 24, t2: 25, t3: 23, t4: 46 },
          COA: marksObj['COA'] || { t1: 20, t2: 21, t3: 22, t4: 42 },
          TOC: marksObj['TOC'] || { t1: 23, t2: 22, t3: 24, t4: 45 }
        });
        return;
      } catch (e) {
        console.error(e);
      }
    }
    setStudentMarksForm({
      Maths: { t1: 22, t2: 24, t3: 21, t4: 44 },
      PY: { t1: 25, t2: 23, t3: 24, t4: 48 },
      FSD: { t1: 24, t2: 25, t3: 23, t4: 46 },
      COA: { t1: 20, t2: 21, t3: 22, t4: 42 },
      TOC: { t1: 23, t2: 22, t3: 24, t4: 45 }
    });
  }, [activeDetailStudent?.id]);

  const handleSaveStudentMarks = () => {
    if (!activeDetailStudent?.id) return;
    const formattedMarks = DEFAULT_SUBJECTS.map(sub => {
      const data = studentMarksForm[sub.key] || { t1: 0, t2: 0, t3: 0, t4: 0 };
      return {
        subject: sub.name,
        t1: Number(data.t1) || 0,
        t2: Number(data.t2) || 0,
        t3: Number(data.t3) || 0,
        t4: Number(data.t4) || 0
      };
    });
    localStorage.setItem(`cms_student_marks_${activeDetailStudent.id}`, JSON.stringify(formattedMarks));
    if (activeDetailStudent.username) {
      localStorage.setItem(`cms_student_marks_${activeDetailStudent.username}`, JSON.stringify(formattedMarks));
    }
    window.dispatchEvent(new Event('cms_marks_updated'));
    showToast(`Internal exam marks updated for ${activeDetailStudent.name}!`);
  };

  const handleSaveNotes = () => {
    if (!activeDetailStudent) return;
    const updated = students.map(s => {
      if (s.id === activeDetailStudent.id) {
        return { ...s, facultyNotes: facultyNotesText };
      }
      return s;
    });
    setStudents(updated);
    showToast(`Performance notes updated for ${activeDetailStudent.name}.`);
  };

  const handleSendNoticeToStudent = async (e) => {
    e.preventDefault();
    const noticeText = e.target.elements.studentNoticeText.value;
    if (!noticeText.trim()) {
      showToast('Please type a notice.');
      return;
    }

    const textToSend = `Broadcast Notice from ${activeFacultyProfile.name}: ${noticeText.trim()}`;
    const subject = 'Campuzz Student Broadcast Notice';

    // Send under-the-hood HTTP requests without popups
    if (facultyNoticeChannels.whatsapp) {
      fetch('/api/send-whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: '7990056685', text: textToSend, recipientType: 'student' })
      }).catch(err => console.error(err));
    }
    if (facultyNoticeChannels.email) {
      fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: 'akshatthoriya1@gmail.com', subject, text: textToSend })
      }).catch(err => console.error(err));
    }

    try {
      const payload = {
        title: `Faculty Notice from ${activeFacultyProfile.name}`,
        content: noticeText.trim(),
        target_audience: 'students'
      };
      await ApiService.createNotice(payload);
      showToast(`Notice broadcasted to all student portals!`);
      e.target.reset();
    } catch (err) {
      showToast(`Failed to broadcast notice: ${err.message}`);
    }
  };

  // --- Digital Library State & Books Shelf DB ---
  const [selectedBook, setSelectedBook] = useState(null);
  const libraryBooks = [
    { 
      id: 1, 
      title: "Introduction to Algorithms", 
      author: "Cormen, Leiserson, Rivest", 
      cat: "Computer Science", 
      theme: "book-blue", 
      year: "2009",
      desc: "An extensive reference for algorithms of all kinds. Widely used as a textbook for algorithm courses globally.",
      chapters: [
        { num: "Ch 1", title: "The Role of Algorithms in Computing", pages: "5-22" },
        { num: "Ch 2", title: "Getting Started & Divide and Conquer", pages: "23-50" },
        { num: "Ch 3", title: "Growth of Functions & Asymptotic Notation", pages: "51-76" },
        { num: "Ch 4", title: "Heapsort & Quicksort Foundations", pages: "77-110" }
      ]
    },
    { 
      id: 2, 
      title: "Clean Code: Agile Craftsmanship", 
      author: "Robert C. Martin", 
      cat: "Software Engineering", 
      theme: "book-green", 
      year: "2008",
      desc: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. Learn to write clean code.",
      chapters: [
        { num: "Ch 1", title: "Clean Code Standards", pages: "1-14" },
        { num: "Ch 2", title: "Meaningful Names & Identifiers", pages: "15-32" },
        { num: "Ch 3", title: "Functions & Single Responsibility Principle", pages: "33-58" },
        { num: "Ch 4", title: "Comments and Formatting Principles", pages: "59-84" }
      ]
    },
    { 
      id: 3, 
      title: "Database System Concepts", 
      author: "Silberschatz, Korth, Sudarshan", 
      cat: "Database", 
      theme: "book-purple", 
      year: "2019",
      desc: "Presents the fundamental concepts of database management in an intuitive manner, preparing students to design and use databases.",
      chapters: [
        { num: "Ch 1", title: "Database System Architectures", pages: "1-36" },
        { num: "Ch 2", title: "Introduction to Relational Model", pages: "37-70" },
        { num: "Ch 3", title: "Intermediate & Advanced SQL Queries", pages: "71-125" },
        { num: "Ch 4", title: "Transaction Isolation and Locking", pages: "126-170" }
      ]
    },
    { 
      id: 4, 
      title: "Artificial Intelligence A Modern Approach", 
      author: "Stuart Russell, Peter Norvig", 
      cat: "AIML", 
      theme: "book-orange", 
      year: "2020",
      desc: "The long-standing leading textbook in Artificial Intelligence, offering a comprehensive and state-of-the-art overview.",
      chapters: [
        { num: "Ch 1", title: "Introduction: What is AI?", pages: "1-32" },
        { num: "Ch 2", title: "Intelligent Agents & Environments", pages: "33-60" },
        { num: "Ch 3", title: "Solving Problems by Searching", pages: "61-112" },
        { num: "Ch 4", title: "Knowledge Representation & Logic", pages: "113-160" }
      ]
    },
    { 
      id: 5, 
      title: "Computer Networking", 
      author: "James Kurose, Keith Ross", 
      cat: "Networks", 
      theme: "book-red", 
      year: "2017",
      desc: "Focuses on the internet and the modern key issues of networking, building a top-down application layer implementation first.",
      chapters: [
        { num: "Ch 1", title: "Computer Networks and the Internet", pages: "1-52" },
        { num: "Ch 2", title: "Application Layer & Protocols", pages: "53-110" },
        { num: "Ch 3", title: "Transport Layer: TCP vs UDP details", pages: "111-180" },
        { num: "Ch 4", title: "Network Layer Routing Algorithms", pages: "181-240" }
      ]
    },
    { 
      id: 6, 
      title: "The C Programming Language", 
      author: "Kernighan & Ritchie", 
      cat: "Programming", 
      theme: "book-teal", 
      year: "1988",
      desc: "The definitive reference manual for the C programming language, containing complete details of syntax, compilation, and structure.",
      chapters: [
        { num: "Ch 1", title: "A Tutorial Introduction to C", pages: "5-36" },
        { num: "Ch 2", title: "Types, Operators, and Expressions", pages: "37-64" },
        { num: "Ch 3", title: "Control Flow Statements", pages: "65-82" },
        { num: "Ch 4", title: "Pointers and Arrays Mechanics", pages: "83-120" }
      ]
    }
  ];



  // --- Cloud Sync Module State & Simulation Logic ---
  const [showOAuthModal, setShowOAuthModal] = useState(null); // 'github' or 'google'




  const logToTerminal = (text, type = 'info') => {
    setTerminalLines(prev => [...prev, `[${type.toUpperCase()}] ${text}`]);
    // Scroll terminal container to bottom automatically
    const term = document.getElementById('syncTerminal');
    if (term) {
      setTimeout(() => {
        term.scrollTop = term.scrollHeight;
      }, 50);
    }
  };



  const confirmConnectOAuth = (usernameOrEmail) => {
    const platform = showOAuthModal;
    if (platform === 'github') {
      setGithubConnected(usernameOrEmail);
      logToTerminal(`GitHub connected successfully to repository: github.com/${usernameOrEmail}/campuzz-notes`, 'success');
      showToast('GitHub Profile Linked!');
    } else {
      setGoogleConnected(usernameOrEmail);
      logToTerminal(`Google Drive connected. Target Folder: "My Drive/Campuzz_Engineering_Notes" (${usernameOrEmail})`, 'success');
      showToast('Google Drive Linked!');
    }
    setShowOAuthModal(null);
  };



  return (
    <div className="faculty-container">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fac-toast">
          <div className="fac-toast-content">
            <span className="fac-toast-dot" />
            <p>{toastMessage}</p>
          </div>
        </div>
      )}

      {/* Collapsible Left Sidebar */}
      <aside className={`faculty-sidebar ${collapsed ? 'collapsed' : ''}`}>
        <button 
          className="sidebar-collapse-toggle" 
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand Menu" : "Collapse Menu"}
        >
          <CollapseIcon collapsed={collapsed} />
        </button>

        <div className="fac-sidebar-brand" style={{ padding: '0 8px 16px 8px' }}>
          <CampuzzLogo subtitle="Faculty Desk" collapsed={collapsed} />
        </div>

        <button 
          type="button"
          className="fac-profile-badge"
          onClick={() => setShowProfileDrawer(true)}
        >
          <div className="fac-avatar-circle">FC</div>
          {!collapsed && (
            <div className="fac-profile-details">
              <span className="fac-profile-name">{activeFacultyProfile.name}</span>
              <span className="fac-profile-role">{activeFacultyProfile.dept}</span>
            </div>
          )}
        </button>

        <nav className="fac-sidebar-nav">
          <button 
            type="button" 
            className={`fac-nav-item ${activeTab === 'attendance' ? 'active' : ''}`}
            onClick={() => setActiveTab('attendance')}
            title="Attendance Register"
          >
            <AttendanceIcon />
            {!collapsed && <span className="fac-nav-label">Attendance Register</span>}
          </button>

          <button 
            type="button" 
            className={`fac-nav-item ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => setActiveTab('students')}
            title="Student Directory"
          >
            <StudentsIcon />
            {!collapsed && <span className="fac-nav-label">Student Directory</span>}
          </button>

          <button 
            type="button" 
            className={`fac-nav-item ${activeTab === 'assignments' ? 'active' : ''}`}
            onClick={() => setActiveTab('assignments')}
            title="Assignment Manager"
          >
            <AssignmentIcon />
            {!collapsed && <span className="fac-nav-label">Assignment Manager</span>}
          </button>

          <button 
            type="button" 
            className={`fac-nav-item ${activeTab === 'ai-predictor' ? 'active' : ''}`}
            onClick={() => setActiveTab('ai-predictor')}
            title="AI Risk Predictor"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            {!collapsed && <span className="fac-nav-label">AI Risk Predictor</span>}
          </button>

          <button 
            type="button" 
            className={`fac-nav-item ${activeTab === 'timetable' ? 'active' : ''}`}
            onClick={() => setActiveTab('timetable')}
            title="Weekly Timetable"
          >
            <div style={{ fontSize: '18px', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📅</div>
            {!collapsed && <span className="fac-nav-label">Weekly Timetable</span>}
          </button>

          <button 
            type="button" 
            className={`fac-nav-item ${activeTab === 'library' ? 'active' : ''}`}
            onClick={() => setActiveTab('library')}
            title="Campuzz Libre"
          >
            <LibraryIcon />
            {!collapsed && <span className="fac-nav-label">Digital Library</span>}
          </button>

          <button 
            type="button" 
            className={`fac-nav-item ${activeTab === 'cloud' ? 'active' : ''}`}
            onClick={() => setActiveTab('cloud')}
            title="Cloud Integration"
          >
            <CloudIcon />
            {!collapsed && <span className="fac-nav-label">Cloud Sync Hub</span>}
          </button>
        </nav>

        {/* Growing Plant animation at bottom. Centered when collapsed */}
        <GrowingPlant role="faculty" collapsed={collapsed} />

        <button type="button" className="fac-sidebar-logout" onClick={onLogout} title="Logout">
          <LogoutIcon />
          {!collapsed && <span>Logout Session</span>}
        </button>
      </aside>

      {/* Main content frames */}
      <main className="faculty-main">
        <header className="fac-header">
          <div className="fac-header-info">
            <p className="fac-breadcrumb">LJ University · Faculty Management Desk</p>
            <h1>
              {activeTab === 'attendance' && 'Daily Class Attendance Register'}
              {activeTab === 'students' && 'Student Directory & Performance Log'}
              {activeTab === 'assignments' && 'Assignment Coursework Control'}
              {activeTab === 'ai-predictor' && 'AI Performance Risk Analysis'}
              {activeTab === 'timetable' && 'Weekly Timetable Schedule'}
              {activeTab === 'library' && 'Campuzz Libre Engineering Shelf'}
              {activeTab === 'cloud' && 'Cloud Sync Integration Module'}
            </h1>
          </div>
          <div className="fac-header-date">
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </header>

        <div className="fac-viewport">
          
          {/* ============================================================ */}
          {/* ATTENDANCE REGISTER TAB */}
          {/* ============================================================ */}
          {activeTab === 'attendance' && (
            <div className="attendance-grid animate-fade-in">
              <div className="fac-card attendance-main-card">
                {/* Header Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--fac-cardborder)', paddingBottom: '16px' }}>
                  <div>
                    <h3>Roll Call Attendance Sheet</h3>
                    <p className="fac-card-desc" style={{ margin: 0 }}>Click the button next to each student to toggle their status between Present and Absent.</p>
                  </div>
                  <button 
                    className="fac-btn-secondary"
                    onClick={() => {
                      const allPresent = {};
                      deptStudents.forEach(s => { allPresent[s.id] = true; });
                      setAttendanceToggles(allPresent);
                    }}
                  >
                    Mark All Present
                  </button>
                </div>

                {/* Class Selector bar */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center', marginBottom: '20px', background: 'rgba(255,255,255,0.01)', padding: '14px', borderRadius: '8px', border: '1px solid var(--fac-cardborder)' }}>
                  {/* Class Selectors (D1 to D7) */}
                  <div className="fac-form-group" style={{ margin: 0, width: '100%' }}>
                    <label style={{ fontSize: '11px', display: 'block', marginBottom: '10px', fontWeight: '700', letterSpacing: '0.5px', color: '#94a3b8' }}>
                      SELECT CLASS ROSTER (D1 TO D7)
                    </label>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      {availableClasses.map(cls => (
                        <button
                          key={cls}
                          type="button"
                          onClick={() => setSelectedClass(cls)}
                          style={{
                            padding: '8px 18px',
                            borderRadius: '6px',
                            border: selectedClass === cls ? '1px solid #10b981' : '1px solid var(--fac-cardborder)',
                            background: selectedClass === cls ? '#10b981' : 'rgba(255,255,255,0.03)',
                            color: '#ffffff',
                            fontWeight: '700',
                            fontSize: '13px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            minWidth: '55px',
                            textAlign: 'center'
                          }}
                        >
                          {cls}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Roster Squares Grid */}
                <div className="attendance-grid-container" style={{ marginTop: '20px' }}>
                  {deptStudents.length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--fac-text-secondary)', fontStyle: 'italic', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                      No students currently registered in Class {selectedClass}.
                    </div>
                  ) : (
                    <div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '12px', marginBottom: '24px' }}>
                        {deptStudents.map(student => {
                          const rollNum = student.roll_no || student.username || student.id;
                          const isPresent = attendanceToggles[student.id] !== false;
                          return (
                            <div
                              key={student.id}
                              onClick={() => handleToggleAttendance(student.id)}
                              title={`${student.name} (Roll ${rollNum}) - Click to mark ${isPresent ? 'Absent' : 'Present'}`}
                              style={{
                                background: isPresent ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                border: isPresent ? '2px solid #10b981' : '2px solid #ef4444',
                                borderRadius: '8px',
                                padding: '16px 8px',
                                textAlign: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                userSelect: 'none',
                                boxShadow: isPresent ? '0 0 10px rgba(16, 185, 129, 0.25)' : '0 0 8px rgba(239, 68, 68, 0.15)'
                              }}
                            >
                              <div style={{ fontSize: '20px', fontWeight: '800', color: isPresent ? '#10b981' : '#ef4444', fontFamily: 'monospace' }}>
                                {rollNum}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Submit Row */}
                      <div style={{ marginTop: '20px', borderTop: '1px solid var(--fac-cardborder)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '13px', color: 'var(--fac-text-secondary)' }}>
                          Selected Session: Class <strong style={{ color: '#ffffff' }}>{selectedClass}</strong> &middot; <span style={{ color: '#10b981', fontWeight: '600' }}>{deptStudents.filter(s => attendanceToggles[s.id] !== false).length} Present</span> / <span style={{ color: '#ef4444', fontWeight: '600' }}>{deptStudents.filter(s => attendanceToggles[s.id] === false).length} Absent</span>
                        </div>
                        <button 
                          className="fac-btn-primary" 
                          onClick={handleSaveAttendance}
                          style={{ padding: '10px 24px', fontSize: '14px', fontWeight: '600', backgroundColor: '#10b981', color: '#ffffff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                        >
                          Submit Class Log
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* STUDENT DIRECTORY TAB */}
          {/* ============================================================ */}
          {activeTab === 'students' && (
            <div className="fac-student-split animate-fade-in">
              
              {/* Left Search List */}
              <div className="fac-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
                <h3>Student Roster</h3>
                <p className="fac-card-desc">Locate profiles and write internal remarks.</p>

                <div className="fac-search-input-wrapper">
                  <SearchIcon className="fac-search-icon" />
                  <input 
                    type="text" 
                    className="fac-input"
                    placeholder="Search name or enrollment..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                  />
                </div>

                <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
                  {filteredStudents.length === 0 ? (
                    <div style={{ color: 'var(--fac-text-secondary)', padding: '20px', textAlign: 'center' }}>
                      No matches found.
                    </div>
                  ) : (
                    <div className="fac-student-list">
                      {filteredStudents.map(student => (
                        <div 
                          key={student.id} 
                          className={`fac-student-item ${selectedStudentId === student.id ? 'active' : ''}`}
                          onClick={() => setSelectedStudentId(student.id)}
                        >
                          <div className="fac-student-item-details">
                            <span className="fac-student-item-name">{student.name}</span>
                            <span className="fac-student-item-meta">Roll: {student.username || student.id} · Class {student.classAssigned || student.class || 'D1'} · {student.dept}</span>
                          </div>
                          <span className={`fac-badge ${student.attendance >= 75 ? 'fac-badge-teal' : 'fac-badge-pink'}`}>
                            {student.attendance !== null ? `${student.attendance}%` : 'N/A'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Profile Details (Distinct design from Admin dashboard) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1, minWidth: 0 }}>
                <div className="fac-student-details-card" style={{ flex: 1 }}>
                {activeDetailStudent ? (
                  <>
                    <div className="fac-student-details-header">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <h2 style={{ margin: '0 0 6px 0', fontSize: '22px', color: '#ffffff', fontFamily: 'Fraunces, serif' }}>
                            {activeDetailStudent.name}
                          </h2>
                          <p style={{ margin: 0, color: 'var(--fac-text-secondary)', fontSize: '13px' }}>
                            Roll Number: <strong style={{ color: '#ffffff' }}>{activeDetailStudent.username || activeDetailStudent.id}</strong> | Class: <strong style={{ color: '#ffffff' }}>{activeDetailStudent.classAssigned || activeDetailStudent.class || 'D1'}</strong> | Dept: <strong style={{ color: '#ffffff' }}>{activeDetailStudent.dept}</strong>
                          </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '11px', display: 'block', color: 'var(--fac-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Attendance Standing
                          </span>
                          <span style={{ 
                            fontSize: '24px', 
                            fontWeight: '700', 
                            color: activeDetailStudent.attendance >= 75 ? 'var(--fac-accent-green)' : 'var(--fac-danger)',
                            textShadow: activeDetailStudent.attendance >= 75 ? '0 0 10px rgba(16, 185, 129, 0.3)' : '0 0 10px rgba(239, 68, 68, 0.3)'
                          }}>
                            {activeDetailStudent.attendance !== null ? `${activeDetailStudent.attendance}%` : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="fac-student-details-grid">
                      {/* Guardian contacts */}
                      <div className="fac-info-panel">
                        <h4>Guardian Details</h4>
                        {activeDetailStudent.fatherName && (
                          <div className="fac-info-row">
                            <span className="fac-info-lbl">Father / Guardian</span>
                            <span className="fac-info-val">{activeDetailStudent.fatherName}</span>
                          </div>
                        )}
                        {activeDetailStudent.motherName && (
                          <div className="fac-info-row">
                            <span className="fac-info-lbl">Mother's Name</span>
                            <span className="fac-info-val">{activeDetailStudent.motherName}</span>
                          </div>
                        )}
                        {!activeDetailStudent.fatherName && activeDetailStudent.guardianName && (
                          <div className="fac-info-row">
                            <span className="fac-info-lbl">Guardian Name</span>
                            <span className="fac-info-val">{activeDetailStudent.guardianName}</span>
                          </div>
                        )}
                        <div className="fac-info-row">
                          <span className="fac-info-lbl">Emergency Contact</span>
                          <span className="fac-info-val">{activeDetailStudent.guardianContact}</span>
                        </div>
                      </div>

                      {/* Student contact details */}
                      <div className="fac-info-panel">
                        <h4>Direct Contacts</h4>
                        <div className="fac-info-row">
                          <span className="fac-info-lbl">Personal Email</span>
                          <span className="fac-info-val">{activeDetailStudent.email}</span>
                        </div>
                        <div className="fac-info-row">
                          <span className="fac-info-lbl">Phone Line</span>
                          <span className="fac-info-val">{activeDetailStudent.phone}</span>
                        </div>
                      </div>

                      {/* Performance notes area (Faculty-exclusive remark feedback) */}
                      <div className="fac-info-panel" style={{ gridColumn: 'span 2' }}>
                        <h4>Faculty Remarks on Student Performance</h4>
                        <p style={{ fontSize: '12px', color: 'var(--fac-text-secondary)', marginTop: 0, marginBottom: '12px' }}>
                          Add feedback remarks, notes, or academic guidance for this student. These comments are persistent.
                        </p>
                        <textarea 
                          className="fac-textarea"
                          rows="2"
                          style={{ width: '100%', boxSizing: 'border-box', marginBottom: '12px' }}
                          placeholder="e.g. Raj is actively participating in class discussions. Needs minor practice on SQL joins before the final database practical exam."
                          value={facultyNotesText}
                          onChange={(e) => setFacultyNotesText(e.target.value)}
                        />
                        <button className="fac-btn-primary" onClick={handleSaveNotes}>
                          Save Student Remarks
                        </button>
                      </div>

                      {/* Internal Exam Marks Entry Card (5 Subjects: Maths, PY, FSD, COA, TOC across T1..T4) */}
                      <div className="fac-info-panel" style={{ gridColumn: 'span 2', marginTop: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <div>
                            <h4 style={{ margin: 0 }}>📊 Internal Assessment Marks Entry (T1 to T4)</h4>
                            <p style={{ fontSize: '12px', color: 'var(--fac-text-secondary)', margin: '4px 0 0 0' }}>
                              Enter internal scores for 5 core subjects: Maths, PY, FSD, COA, TOC across Term 1 to Term 4.
                            </p>
                          </div>
                          <button type="button" className="fac-btn-primary" onClick={handleSaveStudentMarks} style={{ padding: '8px 16px', fontSize: '13px' }}>
                            Save Exam Marks
                          </button>
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', color: '#ffffff' }}>
                            <thead>
                              <tr style={{ borderBottom: '1px solid var(--fac-cardborder)', color: 'var(--fac-text-secondary)' }}>
                                <th style={{ padding: '8px', textAlign: 'left' }}>Subject</th>
                                <th style={{ padding: '8px', textAlign: 'center' }}>T1 (25)</th>
                                <th style={{ padding: '8px', textAlign: 'center' }}>T2 (25)</th>
                                <th style={{ padding: '8px', textAlign: 'center' }}>T3 (25)</th>
                                <th style={{ padding: '8px', textAlign: 'center' }}>T4 (50)</th>
                                <th style={{ padding: '8px', textAlign: 'center' }}>Final Score (100)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {DEFAULT_SUBJECTS.map(sub => {
                                const current = studentMarksForm[sub.key] || { t1: 0, t2: 0, t3: 0, t4: 0 };
                                const finalScore = Number(current.t1) + Number(current.t2) + Number(current.t3) + (Number(current.t4) / 2);
                                return (
                                  <tr key={sub.key} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '8px', fontWeight: '600', color: '#38bdf8' }}>{sub.name}</td>
                                    <td style={{ padding: '8px', textAlign: 'center' }}>
                                      <input
                                        type="number"
                                        min="0"
                                        max="25"
                                        value={current.t1}
                                        onChange={(e) => setStudentMarksForm({
                                          ...studentMarksForm,
                                          [sub.key]: { ...current, t1: Math.min(25, Math.max(0, parseInt(e.target.value, 10) || 0)) }
                                        })}
                                        style={{ width: '55px', padding: '6px', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid var(--fac-cardborder)', color: '#ffffff', borderRadius: '4px', fontWeight: '600' }}
                                      />
                                    </td>
                                    <td style={{ padding: '8px', textAlign: 'center' }}>
                                      <input
                                        type="number"
                                        min="0"
                                        max="25"
                                        value={current.t2}
                                        onChange={(e) => setStudentMarksForm({
                                          ...studentMarksForm,
                                          [sub.key]: { ...current, t2: Math.min(25, Math.max(0, parseInt(e.target.value, 10) || 0)) }
                                        })}
                                        style={{ width: '55px', padding: '6px', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid var(--fac-cardborder)', color: '#ffffff', borderRadius: '4px', fontWeight: '600' }}
                                      />
                                    </td>
                                    <td style={{ padding: '8px', textAlign: 'center' }}>
                                      <input
                                        type="number"
                                        min="0"
                                        max="25"
                                        value={current.t3}
                                        onChange={(e) => setStudentMarksForm({
                                          ...studentMarksForm,
                                          [sub.key]: { ...current, t3: Math.min(25, Math.max(0, parseInt(e.target.value, 10) || 0)) }
                                        })}
                                        style={{ width: '55px', padding: '6px', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid var(--fac-cardborder)', color: '#ffffff', borderRadius: '4px', fontWeight: '600' }}
                                      />
                                    </td>
                                    <td style={{ padding: '8px', textAlign: 'center' }}>
                                      <input
                                        type="number"
                                        min="0"
                                        max="50"
                                        value={current.t4}
                                        onChange={(e) => setStudentMarksForm({
                                          ...studentMarksForm,
                                          [sub.key]: { ...current, t4: Math.min(50, Math.max(0, parseInt(e.target.value, 10) || 0)) }
                                        })}
                                        style={{ width: '55px', padding: '6px', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid var(--fac-cardborder)', color: '#ffffff', borderRadius: '4px', fontWeight: '600' }}
                                      />
                                    </td>
                                    <td style={{ padding: '8px', textAlign: 'center', fontWeight: '700', color: finalScore >= 50 ? '#10b981' : '#ef4444' }}>
                                      {finalScore} / 100
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div style={{ padding: '40px', textAlign: 'center', color: 'var(--fac-text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '300px' }}>
                    Select a student from the left database roster to view profile data, parent contacts, and write remarks.
                  </div>
                )}
              </div>

              {/* Standalone Broadcast Notice card stacked below details card */}
              <div className="fac-card animate-fade-in" style={{ margin: 0, position: 'relative' }}>
                <h3 style={{ margin: 0, marginBottom: '6px', fontSize: '18px', color: '#ffffff' }}>Broadcast Student Notice</h3>
                <p className="fac-card-desc" style={{ marginBottom: '14px' }}>
                  Send an academic notice warning visible to all student portals simultaneously. Nodemailer & WhatsApp copies are copy-triggered.
                </p>
                <form onSubmit={handleSendNoticeToStudent}>
                  <textarea 
                    name="studentNoticeText"
                    className="fac-textarea"
                    rows="2"
                    style={{ width: '100%', boxSizing: 'border-box', marginBottom: '12px' }}
                    placeholder="e.g. LJ University Sem 4 final exam registration portal is now live. Please submit fee copy."
                  />
                  <div style={{ display: 'flex', gap: '16px', marginBottom: '12px', fontSize: '12px', color: '#cbd5e1' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={facultyNoticeChannels.email}
                        onChange={(e) => setFacultyNoticeChannels({ ...facultyNoticeChannels, email: e.target.checked })}
                      />
                      <span>Email (akshatthoriya1@gmail.com)</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'not-allowed', opacity: 0.6 }} onClick={(e) => { e.preventDefault(); alert('⚠️ WhatsApp Notification Service is currently under development & undergoing Meta API maintenance. Please use Email notification.'); }}>
                      <input
                        type="checkbox"
                        checked={false}
                        onChange={() => {}}
                        disabled
                      />
                      <span>WhatsApp (Under Development 🛠️)</span>
                    </label>
                  </div>
                  <button type="submit" className="fac-btn-primary">
                    Dispatch Notice Warning
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

          {/* ============================================================ */}
          {/* ASSIGNMENT MANAGER TAB */}
          {/* ============================================================ */}
          {activeTab === 'assignments' && (
            <div className="assignment-grid animate-fade-in">
              {/* Form card */}
              <div className="fac-card assignment-form-card">
                <h3>Publish Assignment</h3>
                <p className="fac-card-desc">Assign academic coursework to students in your department.</p>

                <form onSubmit={handlePublishAssignment} style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '14px' }}>
                  <div className="fac-form-group">
                    <label>Assignment Title</label>
                    <input 
                      type="text" 
                      name="assTitle" 
                      className="fac-input" 
                      required 
                      placeholder="e.g. Lab Exercise 4: SQL Subqueries" 
                    />
                  </div>

                  <div className="fac-form-group">
                    <label>Subject Course</label>
                    <select name="assSubject" className="fac-select">
                      <option value="Lecture 1: Core Database Architectures">Lecture 1: Database Architectures</option>
                      <option value="Lecture 2: Advanced Interface Engineering">Lecture 2: Interface Engineering</option>
                      <option value="Lecture 3: Algorithms & Paradigms">Lecture 3: Algorithms & Paradigms</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div className="fac-form-group" style={{ flex: 1 }}>
                      <label>Due Date</label>
                      <input 
                        type="date" 
                        name="assDueDate" 
                        className="fac-input" 
                        required 
                      />
                    </div>
                    <div className="fac-form-group" style={{ flex: 1 }}>
                      <label>Total Marks</label>
                      <input 
                        type="number" 
                        name="assMarks" 
                        className="fac-input" 
                        defaultValue={30} 
                        min={5} 
                      />
                    </div>
                  </div>

                  <div className="fac-form-group" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <label>Instructions & Description</label>
                    <textarea 
                      name="assDesc" 
                      className="fac-textarea" 
                      style={{ flex: 1, minHeight: '80px', boxSizing: 'border-box' }} 
                      required 
                      placeholder="Write instructions, grading rubrics, or file submit formats..."
                    />
                  </div>

                  <button type="submit" className="fac-btn-primary" style={{ width: '100%' }}>
                    Publish to Student Portals
                  </button>
                </form>
              </div>

              {/* Assignment list card */}
              <div className="fac-card assignment-list-card">
                <h3>Published Coursework Assignments</h3>
                <p className="fac-card-desc">Review and manage current assignments for {selectedDept}.</p>

                <div className="assignments-scrollable">
                  {assignments.filter(a => a.dept === selectedDept).length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--fac-text-secondary)', fontStyle: 'italic' }}>
                      No assignments published yet for this department. Use the form to publish.
                    </div>
                  ) : (
                    assignments.filter(a => a.dept === selectedDept).map(ass => (
                      <div key={ass.id} className="assignment-item">
                        <div className="assignment-info">
                          <div className="assignment-item-header">
                            <span className="assignment-item-title">{ass.title}</span>
                          </div>
                          <div className="assignment-item-meta">
                            Due: <strong style={{ color: '#ffffff' }}>{ass.dueDate}</strong> &middot; Marks: <strong style={{ color: '#ffffff' }}>{ass.marks} pts</strong> &middot; Subject: <strong style={{ color: '#ffffff' }}>{ass.subject.includes(':') ? ass.subject.split(':')[1].trim() : ass.subject}</strong>
                          </div>
                          <div className="assignment-item-desc">{ass.desc}</div>
                        </div>
                        <button 
                          className="action-btn-danger-icon"
                          onClick={() => handleDeleteAssignment(ass.id, ass.title)}
                          title="Retract Assignment"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* AI RISK PREDICTOR VIEW */}
          {/* ============================================================ */}
          {activeTab === 'ai-predictor' && (
            <div className="ai-predictor-view animate-fade-in" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="fac-card" style={{ margin: 0 }}>
                <h3 style={{ fontSize: '18px', color: '#ffffff', marginBottom: '8px' }}>🤖 AI Student Performance Risk Analysis</h3>
                <p className="fac-card-desc" style={{ color: 'var(--fac-text-secondary)', fontSize: '13.5px', marginBottom: '20px' }}>
                  Analyze student records using a Random Forest Classifier to classify performance and detect early academic risk.
                </p>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                  <div className="fac-form-group" style={{ margin: 0, flex: 1, minWidth: '200px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--fac-text-secondary)', display: 'block', marginBottom: '6px' }}>Select Student to Analyze</label>
                    <select
                      value={selectedPredictStudentId}
                      onChange={(e) => setSelectedPredictStudentId(e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--fac-cardborder)', backgroundColor: 'rgba(255,255,255,0.02)', color: '#ffffff' }}
                    >
                      <option value="" style={{ color: '#000' }}>-- Choose Student --</option>
                      {students.map(s => (
                        <option key={s.id} value={s.id} style={{ color: '#000' }}>{s.name} (Roll: {s.username})</option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={handleRunPrediction}
                    disabled={!selectedPredictStudentId || predicting}
                    className="fac-btn-primary"
                    style={{ padding: '11px 24px', whiteSpace: 'nowrap' }}
                  >
                    {predicting ? 'Analyzing...' : 'Run Risk Assessment'}
                  </button>
                </div>
              </div>

              {predictionResult && (
                <div className="fac-card animate-scale-up" style={{ margin: 0, border: '1.5px solid var(--fac-cardborder)' }}>
                  <h4 style={{ fontSize: '16px', color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    📊 Assessment Report: {students.find(s => s.id === String(predictionResult.student_id))?.name || predictionResult.student_roll_no}
                  </h4>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                    <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.01)' }}>
                      <span style={{ fontSize: '12px', color: 'var(--fac-text-secondary)', display: 'block', marginBottom: '4px' }}>Classification Label</span>
                      <strong style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '6px', color: 
                        predictionResult.predicted_label === 'excellent' ? 'var(--fac-accent-teal)' :
                        predictionResult.predicted_label === 'good' ? 'var(--fac-accent-teal)' :
                        predictionResult.predicted_label === 'average' ? '#eab308' : '#ef4444'
                      }}>
                        {predictionResult.emoji} {predictionResult.predicted_label.toUpperCase()}
                      </strong>
                    </div>

                    <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.01)' }}>
                      <span style={{ fontSize: '12px', color: 'var(--fac-text-secondary)', display: 'block', marginBottom: '4px' }}>Academic Risk Level</span>
                      <strong style={{ fontSize: '18px', color: 
                        predictionResult.risk_level === 'Low' ? 'var(--fac-accent-teal)' :
                        predictionResult.risk_level === 'Medium' ? '#eab308' : '#ef4444'
                      }}>
                        {predictionResult.risk_level}
                      </strong>
                    </div>

                    <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.01)' }}>
                      <span style={{ fontSize: '12px', color: 'var(--fac-text-secondary)', display: 'block', marginBottom: '4px' }}>Confidence Score</span>
                      <strong style={{ fontSize: '18px', color: '#ffffff' }}>
                        {predictionResult.confidence}%
                      </strong>
                    </div>
                  </div>

                  <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: 'rgba(20, 184, 166, 0.08)', borderLeft: '4px solid var(--fac-accent-teal)' }}>
                    <h5 style={{ margin: '0 0 6px 0', fontSize: '14px', color: '#ffffff' }}>💡 System Recommendation</h5>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--fac-text-secondary)', lineHeight: '1.6' }}>{predictionResult.recommendation}</p>
                  </div>
                </div>
              )}

              <div className="fac-card" style={{ margin: 0 }}>
                <h3 style={{ fontSize: '16px', color: '#ffffff', marginBottom: '12px' }}>📜 Prediction Execution Logs</h3>
                <div style={{ overflowX: 'auto' }}>
                  <table className="bookshelf-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--fac-cardborder)', color: 'var(--fac-text-secondary)' }}>
                        <th style={{ padding: '12px' }}>Student</th>
                        <th style={{ padding: '12px' }}>Roll No</th>
                        <th style={{ padding: '12px' }}>Prediction</th>
                        <th style={{ padding: '12px' }}>Risk Level</th>
                        <th style={{ padding: '12px' }}>Confidence</th>
                        <th style={{ padding: '12px' }}>Avg Marks</th>
                        <th style={{ padding: '12px' }}>Attendance</th>
                        <th style={{ padding: '12px' }}>Run Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {predictionHistory.length === 0 ? (
                        <tr>
                          <td colSpan="8" style={{ textAlign: 'center', color: 'var(--fac-text-secondary)', fontStyle: 'italic', padding: '20px' }}>
                            No analysis logs recorded in database yet.
                          </td>
                        </tr>
                      ) : (
                        predictionHistory.map(log => (
                          <tr key={log.id} style={{ borderBottom: '1px solid var(--fac-cardborder)' }}>
                            <td style={{ fontWeight: '500', padding: '12px' }}>{students.find(s => s.username === log.student)?.name || log.student}</td>
                            <td style={{ padding: '12px' }}>{log.roll_no}</td>
                            <td style={{ fontWeight: '600', padding: '12px', color: 
                              log.predicted_label === 'excellent' ? 'var(--fac-accent-teal)' :
                              log.predicted_label === 'good' ? 'var(--fac-accent-teal)' :
                              log.predicted_label === 'average' ? '#eab308' : '#ef4444'
                            }}>{log.predicted_label.toUpperCase()}</td>
                            <td style={{ padding: '12px' }}>{log.risk_level}</td>
                            <td style={{ padding: '12px' }}>{log.confidence}%</td>
                            <td style={{ padding: '12px' }}>{log.avg_percentage}%</td>
                            <td style={{ padding: '12px' }}>{log.attendance_pct}%</td>
                            <td style={{ padding: '12px' }}>{log.predicted_at}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TIMETABLE TAB */}
          {/* ============================================================ */}
          {activeTab === 'timetable' && (
            <div className="fac-dashboard-section animate-fade-in">
              <div className="fac-card">
                <h3>Weekly Academic Class Timetable</h3>
                {timetableImage ? (
                  <div style={{ textAlign: 'center', border: '1px solid var(--fac-cardborder)', padding: '10px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.02)', marginTop: '20px' }}>
                    <div style={{ marginBottom: '10px', textAlign: 'right' }}>
                      <a 
                        href={timetableImage} 
                        download="Weekly_Timetable" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ display: 'inline-block', padding: '8px 16px', backgroundColor: 'var(--fac-primary)', color: 'white', textDecoration: 'none', borderRadius: '4px', fontSize: '14px', fontWeight: 'bold' }}
                      >
                        ⬇ Download Timetable
                      </a>
                    </div>
                    {timetableImage.toLowerCase().endsWith('.pdf') ? (
                      <object data={timetableImage} type="application/pdf" width="100%" height="800px">
                        <p>Your browser does not support PDFs. <a href={timetableImage} target="_blank" rel="noopener noreferrer">Download the PDF</a>.</p>
                      </object>
                    ) : (
                      <img 
                        src={timetableImage} 
                        alt="Weekly Timetable" 
                        style={{ maxWidth: '100%', maxHeight: '800px', objectFit: 'contain', borderRadius: '4px' }}
                      />
                    )}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '60px', color: 'var(--fac-text-secondary)', border: '1px dashed var(--fac-cardborder)', borderRadius: '8px', marginTop: '20px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>📅</div>
                    <p style={{ margin: 0, fontSize: '16px' }}>No weekly timetable has been uploaded yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* DIGITAL LIBRARY TAB */}
          {/* ============================================================ */}
          {activeTab === 'library' && (
            <div className="bookshelf-container animate-fade-in">
              <div className="fac-card" style={{ marginBottom: 0 }}>
                <h3>Campuzz Libre Bookshelf</h3>
                <p className="fac-card-desc" style={{ margin: 0 }}>
                  Access digital engineering textbooks. Click on any book cover to review the index, read summaries, and download the full textbook PDF.
                </p>
              </div>

              {/* Wooden Bookshelf Shelf */}
              <div className="bookshelf">
                <div className="shelf-row">
                  {libraryBooks.slice(0, 3).map(book => (
                    <div key={book.id} className="book" onClick={() => setSelectedBook(book)}>
                      <div className={`book-cover ${book.theme}`}>
                        <span className="book-cover-badge">{book.cat}</span>
                        <div className="book-cover-title">{book.title}</div>
                        <div className="book-cover-author">{book.author}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="shelf-row">
                  {libraryBooks.slice(3, 6).map(book => (
                    <div key={book.id} className="book" onClick={() => setSelectedBook(book)}>
                      <div className={`book-cover ${book.theme}`}>
                        <span className="book-cover-badge">{book.cat}</span>
                        <div className="book-cover-title">{book.title}</div>
                        <div className="book-cover-author">{book.author}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* CLOUD INTEGRATION TAB */}
          {/* ============================================================ */}
          {activeTab === 'cloud' && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 140px)', overflow: 'hidden' }}>
              <div className="fac-card animate-fade-in" style={{ textAlign: 'center', padding: '40px 40px 60px 40px', maxWidth: '600px', width: '100%', position: 'relative', margin: 0 }}>
                {randomGiphyUrl && (
                  <img 
                    src={randomGiphyUrl} 
                    alt="Under Development Giphy" 
                    style={{ width: '220px', height: 'auto', borderRadius: '12px', margin: '0 auto 20px auto', display: 'block', border: '2px solid var(--fac-cardborder)' }} 
                  />
                )}
                 <h2 style={{ fontSize: '22px', marginBottom: '10px', color: '#ffffff' }}>Cloud Synchronisation Hub</h2>
                <span className="fac-badge fac-badge-pink" style={{ marginBottom: '20px', display: 'inline-block' }}>Under Development</span>
                <p style={{ color: 'var(--fac-text-secondary)', fontSize: '14.5px', lineHeight: '1.6', margin: '0 0 20px 0' }}>
                  Our development team is currently linking GitHub repositories and Google Drive OAuth2 integration scopes. This module will be fully live in the Sem 4 final release!
                </p>
                <button 
                  type="button" 
                  className="fac-btn-secondary" 
                  onClick={handleRandomizeGiphy}
                  style={{ display: 'inline-block', margin: '0 auto', padding: '10px 20px', fontSize: '13px' }}
                >
                  🔄 Surprise Me (Render New GIF)
                </button>
                <div style={{ position: 'absolute', bottom: '12px', right: '16px', fontSize: '11px', color: 'var(--fac-text-secondary)', opacity: 0.7 }}>
                  GIFs via <a href="https://giphy.com/" target="_blank" rel="noreferrer" style={{ color: 'var(--fac-accent-teal)', textDecoration: 'none', fontWeight: '600' }}>GIPHY</a>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ============================================================ */}
      {/* DIGITAL BOOK PAD VIEWING PANEL (MODAL OVERLAY) */}
      {/* ============================================================ */}
      {selectedBook && (
        <div className="bookpad-overlay" onClick={() => setSelectedBook(null)}>
          <div className="fac-card animate-fade-in" style={{ width: '420px', maxWidth: '90%', padding: '28px', textAlign: 'center', backgroundColor: 'var(--fac-cardbg)', border: '1px solid var(--fac-accent-teal)', position: 'relative', margin: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <button style={{ position: 'absolute', right: '16px', top: '12px', background: 'none', border: 'none', color: 'var(--fac-text-secondary)', fontSize: '24px', cursor: 'pointer' }} onClick={() => setSelectedBook(null)}>
              &times;
            </button>
            <div style={{ fontSize: '36px', marginBottom: '16px' }}>📚</div>
            <h3 style={{ marginBottom: '8px', color: '#ffffff' }}>Digital Library Notice</h3>
            <span className="fac-badge fac-badge-pink" style={{ marginBottom: '16px', display: 'inline-block' }}>Downtime Alert</span>
            <p style={{ color: 'var(--fac-text-secondary)', fontSize: '14.5px', lineHeight: '1.6', margin: '0 0 24px 0' }}>
              The textbook <strong>"{selectedBook.title}"</strong> is currently being uploaded by the administrator or the digital library is experiencing temporary downtime. Please check back later.
            </p>
            <button className="fac-btn-primary" style={{ margin: '0 auto', padding: '10px 24px' }} onClick={() => setSelectedBook(null)}>
              Acknowledge
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* OAUTH INTEGRATION SIMULATION MODAL */}
      {/* ============================================================ */}
      {showOAuthModal && (
        <div className="oauth-overlay" onClick={() => setShowOAuthModal(null)}>
          <div className="oauth-modal" onClick={(e) => e.stopPropagation()}>
            <div className="oauth-header-logo">
              {showOAuthModal === 'github' ? '🐙' : '🔺'}
            </div>
            
            {showOAuthModal === 'github' ? (
              <>
                <h3>Connect to GitHub</h3>
                <p>Authorize CMZ Campuzz to view your public repositories and commit academic coursework notes.</p>
                
                <div className="oauth-buttons">
                  <button 
                    className="oauth-btn oauth-btn-github"
                    onClick={() => confirmConnectOAuth('hasnainrathod01')}
                  >
                    Authorize as @hasnainrathod01
                  </button>
                  <button 
                    className="oauth-btn oauth-btn-github"
                    onClick={() => confirmConnectOAuth('aki-1o')}
                  >
                    Authorize as @aki-1o
                  </button>
                  <button 
                    className="fac-btn-secondary" 
                    onClick={() => setShowOAuthModal(null)}
                  >
                    Cancel Connection
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3>Link Google Drive Account</h3>
                <p>Connect Campuzz ERP to your Google Workspace account to upload lectures and grading files automatically.</p>
                
                <div className="oauth-buttons">
                  <button 
                    className="oauth-btn oauth-btn-google"
                    onClick={() => confirmConnectOAuth('akshatthoriya1@gmail.com')}
                  >
                    Sign in with akshatthoriya1@gmail.com
                  </button>
                  <button 
                    className="oauth-btn oauth-btn-google"
                    onClick={() => confirmConnectOAuth('hasnain.rathod@lju.edu.in')}
                  >
                    Sign in with hasnain.rathod@lju.edu.in
                  </button>
                  <button 
                    className="fac-btn-secondary" 
                    onClick={() => setShowOAuthModal(null)}
                  >
                    Cancel Connection
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {showProfileDrawer && (
        <div className="fac-profile-drawer-overlay" onClick={() => setShowProfileDrawer(false)}>
          <div className="fac-profile-drawer animate-slide-left" onClick={(e) => e.stopPropagation()}>
            <div className="fac-drawer-header">
              <h3>Faculty Profile Details</h3>
              <button className="fac-drawer-close" onClick={() => setShowProfileDrawer(false)}>&times;</button>
            </div>
            <div className="fac-drawer-body">
              <div className="fac-avatar-large">FC</div>
              <h2>{activeFacultyProfile.name}</h2>
              <span className="fac-drawer-role">{activeFacultyProfile.dept}</span>
              
              <div className="fac-drawer-details-list">
                <div className="fac-drawer-detail-item">
                  <span className="detail-lbl">Faculty ID</span>
                  <span className="detail-val">{activeFacultyProfile.id}</span>
                </div>
                <div className="fac-drawer-detail-item">
                  <span className="detail-lbl">Teaching Subject</span>
                  <span className="detail-val">{activeFacultyProfile.subject || 'FSD / Python'}</span>
                </div>
                <div className="fac-drawer-detail-item">
                  <span className="detail-lbl">Email Address</span>
                  <span className="detail-val">{activeFacultyProfile.email || 'faculty@lju.edu.in'}</span>
                </div>
                <div className="fac-drawer-detail-item">
                  <span className="detail-lbl">Contact Number</span>
                  <span className="detail-val">{activeFacultyProfile.phone || '+91 94285 12345'}</span>
                </div>
                <div className="fac-drawer-detail-item">
                  <span className="detail-lbl">Department</span>
                  <span className="detail-val">{activeFacultyProfile.dept}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
