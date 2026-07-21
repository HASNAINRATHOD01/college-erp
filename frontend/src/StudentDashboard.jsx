import React, { useState, useEffect } from 'react';
import './StudentDashboard.css';
import GrowingPlant from './GrowingPlant';
import ApiService from './apiService';

// SVG Icons for clean, zero-dependency deployment
const ProfileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

const MarksIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
);

const AssignmentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
);

const LibraryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/></svg>
);

const FacultyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
);

const CollapseIcon = ({ collapsed }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}><polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/></svg>
);

const DriveIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
);

const GithubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
);

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TIME_SLOTS = [
  '08:00-09:00',
  '09:00-10:00',
  '10:00-11:00',
  '11:00-12:00',
  '12:00-13:00',
  '13:00-14:00',
  '14:00-15:00',
  '15:00-16:00',
  '16:00-17:00'
];

export default function StudentDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [collapsed, setCollapsed] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  
  // Dynamic loaders for database records
  const [students, setStudents] = useState([]);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [marks, setMarks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [timetableSlots, setTimetableSlots] = useState([]);

  // Sync / load helper
  const loadDatabase = async () => {
    try {
      const apiStudents = await ApiService.getStudents();
      const active = apiStudents.find(s => String(s.username) === String(user?.username)) || apiStudents[0];
      
      if (active) {
        // Fetch actual attendance from backend to calculate percentage
        const studentAttendance = await ApiService.getAttendance({ student_id: active.id });
        let attendancePct = 84; // Default/Fallback
        if (studentAttendance && studentAttendance.length > 0) {
          const present = studentAttendance.filter(r => r.status === 'present').length;
          attendancePct = Math.round((present / studentAttendance.length) * 100);
        }

        // Fetch marks to look for comments/notes
        const apiMarks = await ApiService.getMarks({ student_id: active.id });
        const comments = apiMarks.filter(m => m.remarks).map(m => m.remarks).join('; ');

        setCurrentStudent({
          id: String(active.id),
          name: active.first_name ? `${active.first_name} ${active.last_name || ''}`.trim() : active.username,
          email: active.email,
          dept: active.department || 'Computer Engineering',
          phone: '9876543210',
          fatherName: 'Suresh Patel',
          motherName: 'N/A',
          guardianContact: '9876543210',
          attendance: attendancePct,
          username: active.username,
          facultyNotes: comments || '',
          classAssigned: 'D1'
        });

        // Map marks to T1..T4
        const subjectsMap = {};
        apiMarks.forEach(m => {
          const subName = m.subject;
          if (!subjectsMap[subName]) {
            subjectsMap[subName] = { subject: subName, t1: 0, t2: 0, t3: 0, t4: 0 };
          }
          if (m.exam_type === 'internal') {
            subjectsMap[subName].t1 = m.marks_obtained;
          } else if (m.exam_type === 'midterm') {
            subjectsMap[subName].t2 = m.marks_obtained;
          } else if (m.exam_type === 'practical') {
            subjectsMap[subName].t3 = m.marks_obtained;
          } else if (m.exam_type === 'final') {
            subjectsMap[subName].t4 = m.marks_obtained;
          }
        });
        setMarks(Object.values(subjectsMap));

        // Fetch timetable slots for this student
        const apiTimetable = await ApiService.getTimetable({
          department: active.department || 'Computer Engineering',
          semester: active.semester || 4
        });
        setTimetableSlots(apiTimetable);
      }

      // Load assignments
      const apiAss = await ApiService.getAssignments();
      const sortedAss = [...apiAss].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      setAssignments(sortedAss);

      // Load faculty members
      const apiFac = await ApiService.getFaculty();
      setFacultyList(apiFac.map(f => ({
        id: String(f.id),
        name: f.first_name ? `${f.first_name} ${f.last_name || ''}`.trim() : f.username,
        email: f.email,
        dept: f.department || 'Computer Engineering',
        phone: '+91 94285 12345',
        username: f.username,
        subject: f.subjects || 'FSD'
      })));

    } catch (err) {
      console.error('Failed to load student database records:', err);
    }
  };

  useEffect(() => {
    loadDatabase();
  }, [user]);

  // Toast utility
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Remaining days utility
  const getDaysRemainingText = (dateStr) => {
    const diff = new Date(dateStr) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days < 0) return { text: 'Overdue', critical: true };
    if (days === 0) return { text: 'Due Today ⚠️', critical: true };
    if (days === 1) return { text: 'Due Tomorrow ⏰', critical: true };
    return { text: `${days} days left`, critical: days <= 3 };
  };

  // Standard engineering textbooks database
  const libraryBooks = [
    { id: 1, title: "Introduction to Algorithms", author: "Cormen, Leiserson, Rivest", cat: "Computer Science", theme: "book-blue", year: "2009", desc: "An extensive reference for algorithms of all kinds." },
    { id: 2, title: "Clean Code: Agile Craftsmanship", author: "Robert C. Martin", cat: "Software Engineering", theme: "book-green", year: "2008", desc: "A handbook of agile software craftsmanship." },
    { id: 3, title: "Database System Concepts", author: "Silberschatz, Korth, Sudarshan", cat: "Database", theme: "book-purple", year: "2019", desc: "Presents the fundamental concepts of database management." },
    { id: 4, title: "Artificial Intelligence A Modern Approach", author: "Stuart Russell, Peter Norvig", cat: "AIML", theme: "book-orange", year: "2020", desc: "The long-standing leading textbook in Artificial Intelligence." },
    { id: 5, title: "Computer Networking", author: "James Kurose, Keith Ross", cat: "Networks", theme: "book-red", year: "2017", desc: "Focuses on the internet and the modern key issues of networking." },
    { id: 6, title: "The C Programming Language", author: "Kernighan & Ritchie", cat: "Programming", theme: "book-teal", year: "1988", desc: "The definitive reference manual for the C programming language." }
  ];

  const handleUnderDevClick = (elementName) => {
    showToast(`"${elementName}" utility is currently under development.`);
  };

  // Get initials for profile picture
  const getInitials = (name) => {
    if (!name) return 'ST';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="student-container">
      {/* Toast Alert popup */}
      {toastMessage && (
        <div className="std-toast">
          <div className="std-toast-content">
            <span className="std-toast-dot" />
            <p>{toastMessage}</p>
          </div>
        </div>
      )}

      {/* Sidebar navigation */}
      <aside className={`student-sidebar ${collapsed ? 'collapsed' : ''}`}>
        <button 
          className="std-sidebar-collapse-toggle" 
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand Menu" : "Collapse Menu"}
        >
          <CollapseIcon collapsed={collapsed} />
        </button>

        <div className="std-sidebar-brand">
          <span className="std-brand-mark">CMZ</span>
          {!collapsed && <span className="std-brand-name">Campuzz Student</span>}
        </div>

        {/* Profile Snapshot inside Sidebar */}
        {currentStudent && (
          <div className="std-profile-badge" onClick={() => setActiveTab('profile')}>
            <div className="std-avatar-circle">{getInitials(currentStudent.name)}</div>
            {!collapsed && (
              <div className="std-profile-details">
                <span className="std-profile-name">{currentStudent.name}</span>
                <span className="std-profile-role">Roll No: {currentStudent.id}</span>
              </div>
            )}
          </div>
        )}

        <nav className="std-sidebar-nav">
          <button 
            type="button" 
            className={`std-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
            title="My Profile & Remarks"
          >
            <ProfileIcon />
            {!collapsed && <span className="std-nav-label">Profile & Remarks</span>}
          </button>

          <button 
            type="button" 
            className={`std-nav-item ${activeTab === 'marks' ? 'active' : ''}`}
            onClick={() => setActiveTab('marks')}
            title="Academic Performance"
          >
            <MarksIcon />
            {!collapsed && <span className="std-nav-label">Past Exam Marks</span>}
          </button>

          <button 
            type="button" 
            className={`std-nav-item ${activeTab === 'calendar' ? 'active' : ''}`}
            onClick={() => setActiveTab('calendar')}
            title="Class Calendar"
          >
            <CalendarIcon />
            {!collapsed && <span className="std-nav-label">Academic Calendar</span>}
          </button>

          <button 
            type="button" 
            className={`std-nav-item ${activeTab === 'timetable' ? 'active' : ''}`}
            onClick={() => setActiveTab('timetable')}
            title="Class Timetable"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            {!collapsed && <span className="std-nav-label">Weekly Timetable</span>}
          </button>

          <button 
            type="button" 
            className={`std-nav-item ${activeTab === 'assignments' ? 'active' : ''}`}
            onClick={() => setActiveTab('assignments')}
            title="Coursework Assignments"
          >
            <AssignmentIcon />
            {!collapsed && <span className="std-nav-label">Assignments Roster</span>}
          </button>

          <button 
            type="button" 
            className={`std-nav-item ${activeTab === 'library' ? 'active' : ''}`}
            onClick={() => setActiveTab('library')}
            title="Libre Shelf"
          >
            <LibraryIcon />
            {!collapsed && <span className="std-nav-label">Digital Library</span>}
          </button>

          <button 
            type="button" 
            className={`std-nav-item ${activeTab === 'faculty' ? 'active' : ''}`}
            onClick={() => setActiveTab('faculty')}
            title="Faculty Directory"
          >
            <FacultyIcon />
            {!collapsed && <span className="std-nav-label">Faculty Details</span>}
          </button>
        </nav>

        {/* Customized growing plant with red and orange petals */}
        <GrowingPlant role="student" collapsed={collapsed} />

        <button type="button" className="std-sidebar-logout" onClick={onLogout} title="Logout Session">
          <LogoutIcon />
          {!collapsed && <span>Logout Session</span>}
        </button>
      </aside>

      {/* Main Panel Content container */}
      <main className="student-main">
        <header className="std-header">
          <div className="std-header-info">
            <p className="std-breadcrumb">LJ Engineering · Sem 4 Student Dashboard</p>
            <h1>
              {activeTab === 'profile' && 'My Profile snapshot & Faculty Remarks'}
              {activeTab === 'marks' && 'Internal Assessment Gradebook'}
              {activeTab === 'calendar' && 'Google Calendar Live Schedule'}
              {activeTab === 'timetable' && 'Weekly Class Timetable Schedule'}
              {activeTab === 'assignments' && 'Pending Coursework & Deadlines'}
              {activeTab === 'library' && 'Campuzz Libre Textbook Shelf'}
              {activeTab === 'faculty' && 'Course Faculty & Syllabus Repositories'}
            </h1>
          </div>
          <div className="std-header-date">
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </header>

        {/* Tab frames rendering */}
        <div style={{ flex: 1, minHeight: 0 }}>
          
          {/* ============================================================ */}
          {/* PROFILE & REMARKS TAB */}
          {/* ============================================================ */}
          {activeTab === 'profile' && currentStudent && (
            <div className="std-dashboard-grid animate-fade-in">
              <div className="std-card">
                <h3>Student Profile Snapshot</h3>
                <p className="std-card-desc">Your verified registration details in the college ERP database.</p>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                  <div className="std-avatar-circle" style={{ width: '60px', height: '60px', fontSize: '20px' }}>
                    {getInitials(currentStudent.name)}
                  </div>
                  <div>
                    <h2 style={{ fontSize: '20px', margin: 0, fontWeight: '600' }}>{currentStudent.name}</h2>
                    <span className="std-badge std-badge-orange" style={{ marginTop: '4px' }}>
                      {currentStudent.dept}
                    </span>
                  </div>
                </div>

                <div className="std-detail-row">
                  <span className="std-detail-label">Roll Number (Username)</span>
                  <span className="std-detail-value">{currentStudent.id}</span>
                </div>
                <div className="std-detail-row">
                  <span className="std-detail-label">Division Class</span>
                  <span className="std-detail-value">{currentStudent.classAssigned || 'D1'}</span>
                </div>
                <div className="std-detail-row">
                  <span className="std-detail-label">University Email ID</span>
                  <span className="std-detail-value">{currentStudent.email}</span>
                </div>
                <div className="std-detail-row">
                  <span className="std-detail-label">Primary Mobile Line</span>
                  <span className="std-detail-value">{currentStudent.phone}</span>
                </div>
                <div className="std-detail-row">
                  <span className="std-detail-label">Guardian Contact Number</span>
                  <span className="std-detail-value">{currentStudent.guardianContact}</span>
                </div>
                <div className="std-detail-row">
                  <span className="std-detail-label">Current Academic Period</span>
                  <span className="std-detail-value">Semester 4 (CE/IT)</span>
                </div>
                <div className="std-detail-row">
                  <span className="std-detail-label">Current CGPA Score</span>
                  <span className="std-detail-value" style={{ color: 'var(--std-primary)' }}>8.92 / 10.0</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Attendance Analytics card */}
                <div className="std-card">
                  <h3>Daily Class Attendance</h3>
                  <p className="std-card-desc">Calculated register attendance from class rolls.</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div style={{ position: 'relative', width: '80px', height: '80px', flexShrink: 0 }}>
                      <svg width="80" height="80" viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#1f2937" strokeWidth="3" />
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--std-primary)" strokeWidth="3" strokeDasharray={`${currentStudent.attendance}, 100`} />
                      </svg>
                      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: '700', color: 'var(--std-text-primary)' }}>
                        {currentStudent.attendance}%
                      </div>
                    </div>
                    <div>
                      <span className={`std-badge ${currentStudent.attendance >= 75 ? 'std-badge-green' : 'std-badge-gold'}`} style={{ marginBottom: '8px' }}>
                        {currentStudent.attendance >= 75 ? 'Attendance Status: Safe' : 'Attendance Status: Critical Warning'}
                      </span>
                      <p style={{ margin: 0, fontSize: '13px', color: 'var(--std-text-secondary)', lineHeight: '1.4' }}>
                        {currentStudent.attendance >= 75 
                          ? 'Excellent job! You satisfy the university requirement of minimum 75% attendance for writing final exams.'
                          : 'Warning: Your attendance is below the 75% threshold. Please attend regular lectures to avoid session detention.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Faculty Remarks Card */}
                <div className="std-card" style={{ flex: 1, marginBottom: 0 }}>
                  <h3>Faculty Remarks & Feedback Logs</h3>
                  <p className="std-card-desc">Academic guidance and comments posted by your subject faculties.</p>
                  
                  {currentStudent.facultyNotes ? (
                    <div style={{ backgroundColor: 'rgba(234, 88, 12, 0.08)', borderLeft: '4px solid var(--std-primary)', padding: '16px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                      <p style={{ margin: 0, fontSize: '13.5px', fontStyle: 'italic', color: '#ffedd5', lineHeight: '1.6' }}>
                        "{currentStudent.facultyNotes}"
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px', fontSize: '11px', color: 'var(--std-text-muted)', fontWeight: '500' }}>
                        — Submitted by Course Professor
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px 20px', textAlign: 'center', border: '1.5px dashed var(--std-border)', borderRadius: '8px' }}>
                      <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--std-text-secondary)', fontStyle: 'italic' }}>
                        No academic remarks or warnings have been posted on your profile yet.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* EXAM MARKS TAB */}
          {/* ============================================================ */}
          {activeTab === 'marks' && (
            <div className="std-card animate-fade-in" style={{ marginBottom: 0 }}>
              <h3>Internal Assessments Gradebook</h3>
              <p className="std-card-desc">
                Review your current semester term marks. In this university, internal marks are formulated as:
              </p>
              
              <div style={{ backgroundColor: 'rgba(234, 88, 12, 0.08)', border: '1px solid var(--std-border)', padding: '16px', borderRadius: '8px', marginBottom: '24px', fontSize: '13px', lineHeight: '1.6' }}>
                💡 <strong>Internal Scoring Formula:</strong> 
                <div style={{ fontFamily: 'monospace', fontSize: '13.5px', marginTop: '6px', color: 'var(--std-primary-hover)', fontWeight: '700' }}>
                  Final Score (100) = Term 1 (25) + Term 2 (25) + Term 3 (25) + (Term 4 (50) / 2)
                </div>
                <div style={{ marginTop: '8px', color: 'var(--std-text-secondary)', fontSize: '12px' }}>
                  The first three mid-sem exams are evaluated out of 25. The final term exam (T4) is evaluated out of 50 and is halved before compilation.
                </div>
              </div>

              <div className="marks-table-wrapper">
                <table className="marks-table">
                  <thead>
                    <tr>
                      <th>Subject Course Title</th>
                      <th style={{ textAlign: 'center' }}>T1 (25)</th>
                      <th style={{ textAlign: 'center' }}>T2 (25)</th>
                      <th style={{ textAlign: 'center' }}>T3 (25)</th>
                      <th style={{ textAlign: 'center' }}>T4 (50)</th>
                      <th style={{ textAlign: 'center' }}>Final Score (100)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marks.map((row, idx) => {
                      const finalScore = row.t1 + row.t2 + row.t3 + (row.t4 / 2);
                      return (
                        <tr key={idx}>
                          <td style={{ fontWeight: '500' }}>{row.subject}</td>
                          <td style={{ textAlign: 'center' }}>{row.t1}</td>
                          <td style={{ textAlign: 'center' }}>{row.t2}</td>
                          <td style={{ textAlign: 'center' }}>{row.t3}</td>
                          <td style={{ textAlign: 'center' }}>{row.t4}</td>
                          <td style={{ textAlign: 'center', fontWeight: '700', color: finalScore >= 50 ? 'var(--std-success)' : 'var(--std-danger)' }}>
                            {finalScore}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* ACADEMIC CALENDAR TAB */}
          {/* ============================================================ */}
          {activeTab === 'calendar' && (
            <div className="calendar-container animate-fade-in">
              <div className="std-card" style={{ marginBottom: 0 }}>
                <h3>Google Calendar Integration</h3>
                <p className="std-card-desc">Live schedules and events calendar feed linked directly with your calendar account.</p>
                
                <div className="calendar-iframe-wrapper">
                  <iframe 
                    src="https://calendar.google.com/calendar/embed?src=akshatthoriya1%40gmail.com&ctz=Asia%2FKolkata" 
                    style={{ border: 0, width: '100%', height: '550px', display: 'block' }} 
                    frameBorder="0" 
                    scrolling="no"
                    title="Google Calendar Frame"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* WEEKLY TIMETABLE TAB */}
          {/* ============================================================ */}
          {activeTab === 'timetable' && (
            <div className="timetable-container animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="std-card" style={{ margin: 0, padding: '24px' }}>
                <h3>Weekly Academic Class Timetable</h3>
                <p className="std-card-desc" style={{ marginBottom: '20px' }}>Your class scheduling directory for the current semester semester.</p>
                
                <div style={{ overflowX: 'auto' }}>
                  <table className="marks-table" style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                    <thead>
                      <tr>
                        <th>Time / Day</th>
                        {DAYS_OF_WEEK.map(day => (
                          <th key={day} style={{ textAlign: 'center', minWidth: '120px' }}>{day}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {TIME_SLOTS.map(slot => (
                        <tr key={slot}>
                          <td style={{ fontWeight: '600', whiteSpace: 'nowrap', padding: '12px' }}>{slot}</td>
                          {DAYS_OF_WEEK.map(day => {
                            const matchedSlot = timetableSlots.find(
                              s => s.day === day && s.time_slot === slot
                            );
                            return (
                              <td key={day} style={{ textAlign: 'center', padding: '10px', height: '80px', verticalAlign: 'middle', border: '1px solid var(--std-border)', backgroundColor: matchedSlot ? 'rgba(234, 88, 12, 0.06)' : 'transparent' }}>
                                {matchedSlot ? (
                                  <div>
                                    <div style={{ fontWeight: '700', fontSize: '13px', color: 'var(--std-primary)' }}>{matchedSlot.subject}</div>
                                    <div style={{ fontSize: '11px', color: 'var(--std-text-secondary)', marginTop: '4px' }}>{matchedSlot.faculty_name || 'Prof.'}</div>
                                    {matchedSlot.room && (
                                      <span className="std-badge std-badge-orange" style={{ fontSize: '9px', marginTop: '6px', padding: '2px 6px', display: 'inline-block' }}>
                                        {matchedSlot.room}
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <span style={{ fontSize: '12px', color: 'var(--std-text-muted)', fontStyle: 'italic' }}>—</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* ASSIGNMENTS TAB */}
          {/* ============================================================ */}
          {activeTab === 'assignments' && (
            <div className="std-card animate-fade-in" style={{ marginBottom: 0 }}>
              <h3>Coursework Assignments Feed</h3>
              <p className="std-card-desc">All pending and submitted coursework assignments sorted by deadline urgency (closest deadline first).</p>

              {assignments.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 20px', textAlign: 'center', border: '1.5px dashed var(--std-border)', borderRadius: '12px' }}>
                  <span style={{ fontSize: '40px', marginBottom: '12px' }}>📂</span>
                  <h3 style={{ fontSize: '16px', color: 'var(--std-text-primary)', margin: '0 0 6px 0' }}>No Published Assignments</h3>
                  <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--std-text-secondary)', fontStyle: 'italic' }}>
                    Congratulations! You have completed all assignments assigned by your course professors.
                  </p>
                </div>
              ) : (
                <div className="assignments-list">
                  {assignments.map(ass => {
                    const diffText = getDaysRemainingText(ass.dueDate);
                    return (
                      <div key={ass.id} className="assignment-item-card">
                        <div className="assignment-header">
                          <div>
                            <h4>{ass.title}</h4>
                            <div className="assignment-subject">{ass.subject}</div>
                          </div>
                          <span className={`std-badge ${diffText.critical ? 'std-badge-gold' : 'std-badge-orange'}`}>
                            {ass.marks} Points
                          </span>
                        </div>
                        <p className="assignment-desc">{ass.desc}</p>
                        
                        <div className="assignment-footer-meta">
                          <span>Assigned Class Scope: <strong>{ass.dept}</strong></span>
                          <span className={`assignment-deadline ${diffText.critical ? 'critical' : ''}`}>
                            📅 Due Date: {ass.dueDate} ({diffText.text})
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* DIGITAL LIBRARY TAB */}
          {/* ============================================================ */}
          {activeTab === 'library' && (
            <div className="bookshelf-container animate-fade-in">
              <div className="std-card" style={{ marginBottom: 0 }}>
                <h3>Campuzz Libre Engineering Shelf</h3>
                <p className="std-card-desc" style={{ margin: 0 }}>
                  Access digital engineering textbooks. Click on any book cover to review the index, read summaries, and download the full textbook PDF copy.
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
          {/* FACULTY DETAILS TAB */}
          {/* ============================================================ */}
          {activeTab === 'faculty' && (
            <div className="std-card animate-fade-in" style={{ marginBottom: 0 }}>
              <h3>Course Faculty Directory</h3>
              <p className="std-card-desc">Contact information and course sync repositories of professors conducting classes this semester.</p>

              <div className="faculty-cards-grid">
                {facultyList.map(fac => (
                  <div key={fac.id} className="fac-contact-card">
                    <h4 className="fac-contact-name">{fac.name}</h4>
                    <div className="fac-contact-dept">{fac.dept}</div>
                    
                    <div className="std-detail-row">
                      <span className="std-detail-label">Email Address</span>
                      <span className="std-detail-value">{fac.email}</span>
                    </div>
                    <div className="std-detail-row">
                      <span className="std-detail-label">Office Phone Line</span>
                      <span className="std-detail-value">{fac.phone}</span>
                    </div>

                    <div className="fac-links-row">
                      <button 
                        type="button" 
                        className="fac-link-button fac-link-drive"
                        onClick={() => handleUnderDevClick(`${fac.name}'s Google Drive Sync`)}
                      >
                        <DriveIcon /> Google Drive
                      </button>
                      <button 
                        type="button" 
                        className="fac-link-button fac-link-github"
                        onClick={() => handleUnderDevClick(`${fac.name}'s Course Syllabus Repo`)}
                      >
                        <GithubIcon /> GitHub Repo
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ============================================================ */}
      {/* DIGITAL BOOK PAD VIEWING PANEL (DOWNTIME ALERT MODAL) */}
      {/* ============================================================ */}
      {selectedBook && (
        <div className="bookpad-overlay" onClick={() => setSelectedBook(null)}>
          <div className="std-card animate-fade-in" style={{ width: '420px', maxWidth: '90%', padding: '28px', textAlign: 'center', backgroundColor: 'var(--std-cardbg)', border: '1.5px solid var(--std-primary)', position: 'relative', margin: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <button style={{ position: 'absolute', right: '16px', top: '12px', background: 'none', border: 'none', color: 'var(--std-text-muted)', fontSize: '24px', cursor: 'pointer', lineHeight: 1 }} onClick={() => setSelectedBook(null)}>
              &times;
            </button>
            <div style={{ fontSize: '36px', marginBottom: '16px' }}>📚</div>
            <h3 style={{ marginBottom: '8px', color: 'var(--std-text-primary)' }}>Digital Library Notice</h3>
            <span className="std-badge std-badge-gold" style={{ marginBottom: '16px', display: 'inline-block' }}>Downtime Alert</span>
            <p style={{ color: 'var(--std-text-secondary)', fontSize: '14.5px', lineHeight: '1.6', margin: '0 0 24px 0' }}>
              The textbook <strong>"{selectedBook.title}"</strong> is currently being uploaded by the administrator or the digital library is experiencing temporary downtime. Please check back later.
            </p>
            <button className="submit-btn" style={{ margin: '0 auto', padding: '10px 24px', width: 'auto' }} onClick={() => setSelectedBook(null)}>
              Acknowledge
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
