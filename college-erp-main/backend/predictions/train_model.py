"""
train_model.py
==============
Run this script ONCE to train the Random Forest model and save it to disk.

Usage (from the backend/ directory, with venv activated):
    python predictions/train_model.py

What it does:
    1. Pulls all student marks + attendance data from the database
    2. Engineers useful features (avg marks, attendance %, pass/fail counts)
    3. Trains a Random Forest Classifier to predict performance level:
           'excellent' / 'good' / 'average' / 'at_risk'
    4. Saves the trained model to:  predictions/ml_model/rf_model.pkl
    5. Saves the feature list to:   predictions/ml_model/features.pkl
       (needed so the /api/predict/ endpoint uses the EXACT same features)

Re-run this script whenever you want to retrain the model with fresh data.
"""

import os
import sys
import django
import numpy as np
import pandas as pd
import joblib
from pathlib import Path

# ---------------------------------------------------------------------------
# Step 0: Bootstrap Django so we can use ORM models in a standalone script
# ---------------------------------------------------------------------------
# Add the backend/ directory to Python path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'erp_backend.settings')
django.setup()

# Now we can import Django models
from students.models import Student
from marks.models import Mark
from attendance.models import Attendance

# ---------------------------------------------------------------------------
# Step 1: Build the dataset from the database
# ---------------------------------------------------------------------------

print("[INFO] Collecting data from database...")

records = []

for student in Student.objects.all().select_related('user'):
    student_marks      = Mark.objects.filter(student=student)
    student_attendance = Attendance.objects.filter(student=student)

    # Skip students who have no marks at all (can't make a prediction)
    if not student_marks.exists():
        continue

    # --- Feature 1: Average marks percentage across all subjects/exams ---
    marks_list = list(student_marks.values_list('marks_obtained', 'max_marks'))
    avg_percentage = np.mean([
        (obtained / max_m * 100) if max_m > 0 else 0
        for obtained, max_m in marks_list
    ])

    # --- Feature 2: Attendance percentage ---
    total_classes  = student_attendance.count()
    present_count  = student_attendance.filter(status='present').count()
    attendance_pct = (present_count / total_classes * 100) if total_classes > 0 else 0

    # --- Feature 3: Number of subjects where student scored < 40% (at risk) ---
    fail_count = sum(
        1 for obtained, max_m in marks_list
        if max_m > 0 and (obtained / max_m * 100) < 40
    )

    # --- Feature 4: Number of subjects with grade O or A+ (excellent) ---
    top_grades = student_marks.filter(grade__in=['O', 'A+']).count()

    # --- Feature 5: Total exams appeared ---
    total_exams = student_marks.count()

    # --- Label: Performance level (what we want to PREDICT) ---
    # We derive the label from avg_percentage so the model learns the pattern
    if avg_percentage >= 75:
        label = 'excellent'
    elif avg_percentage >= 55:
        label = 'good'
    elif avg_percentage >= 40:
        label = 'average'
    else:
        label = 'at_risk'

    records.append({
        'avg_percentage':  round(avg_percentage, 2),
        'attendance_pct':  round(attendance_pct, 2),
        'fail_count':      fail_count,
        'top_grade_count': top_grades,
        'total_exams':     total_exams,
        'label':           label,
    })

print(f"   [OK] Found {len(records)} students with mark data.")

# ---------------------------------------------------------------------------
# Step 2: Handle the case where there is not enough real data
#         → Generate synthetic data so the model can still be trained
#         → In production, remove this block once you have 50+ real students
# ---------------------------------------------------------------------------

if len(records) < 20:
    print("[WARN] Not enough real data -- adding synthetic samples for training...")
    import random
    random.seed(42)
    np.random.seed(42)

    synthetic = []
    for _ in range(200):
        avg_pct  = round(random.uniform(20, 100), 2)
        att_pct  = round(random.uniform(30, 100), 2)
        fails    = random.randint(0, 5)
        top      = random.randint(0, 5)
        exams    = random.randint(3, 15)

        if avg_pct >= 75:
            lbl = 'excellent'
        elif avg_pct >= 55:
            lbl = 'good'
        elif avg_pct >= 40:
            lbl = 'average'
        else:
            lbl = 'at_risk'

        synthetic.append({
            'avg_percentage':  avg_pct,
            'attendance_pct':  att_pct,
            'fail_count':      fails,
            'top_grade_count': top,
            'total_exams':     exams,
            'label':           lbl,
        })

    records = records + synthetic
    print(f"   [OK] Training with {len(records)} total samples (real + synthetic).")

# ---------------------------------------------------------------------------
# Step 3: Prepare features (X) and labels (y)
# ---------------------------------------------------------------------------

df = pd.DataFrame(records)
FEATURE_COLS = ['avg_percentage', 'attendance_pct', 'fail_count', 'top_grade_count', 'total_exams']

X = df[FEATURE_COLS].values
y = df['label'].values

print(f"\n[INFO] Label distribution:\n{df['label'].value_counts().to_string()}")

# ---------------------------------------------------------------------------
# Step 4: Train the Random Forest Classifier
# ---------------------------------------------------------------------------

from sklearn.ensemble         import RandomForestClassifier
from sklearn.model_selection  import train_test_split
from sklearn.metrics          import classification_report

print("\n[INFO] Training Random Forest Classifier...")

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

model = RandomForestClassifier(
    n_estimators=100,   # 100 decision trees in the forest
    max_depth=6,        # prevent overfitting
    random_state=42,
    class_weight='balanced'  # handle imbalanced classes
)
model.fit(X_train, y_train)

# Evaluate on test set
y_pred = model.predict(X_test)
print("\n[INFO] Model Evaluation on Test Set:")
print(classification_report(y_test, y_pred))

# ---------------------------------------------------------------------------
# Step 5: Save model + feature list to disk
# ---------------------------------------------------------------------------

MODEL_DIR = BASE_DIR / 'predictions' / 'ml_model'
MODEL_DIR.mkdir(parents=True, exist_ok=True)

MODEL_PATH   = MODEL_DIR / 'rf_model.pkl'
FEATURES_PATH = MODEL_DIR / 'features.pkl'

joblib.dump(model,        MODEL_PATH)
joblib.dump(FEATURE_COLS, FEATURES_PATH)
print(f"\n[OK] Model saved   -> {MODEL_PATH}")
print(f"[OK] Features saved -> {FEATURES_PATH}")
print("\n[DONE] Training complete! You can now use POST /api/predict/")