import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import GrowingPlant from './GrowingPlant';
import ApiService from './apiService';

// SVG Icons as inline functional components for cleanliness
const TaskIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
);

const FacultyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/></svg>
);

const StudentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/></svg>
);

const CampuzzLogo = ({ subtitle = "Academic Suite", collapsed = false }) => (
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

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.75, marginLeft: '3px', verticalAlign: 'middle' }}>
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.65, marginLeft: '3px', verticalAlign: 'middle' }}>
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const getFacultyPassword = (f) => {
  const rawName = (f?.name || '').replace(/^(dr|prof|mr|mrs|ms)\.?\s+/i, '').trim();
  const firstName = rawName.split(/\s+/)[0] || rawName;
  const cleanFirst = firstName.replace(/[^a-zA-Z]/g, '').toLowerCase();
  const userStr = String(f?.username || f?.id || '').trim().toLowerCase();
  return cleanFirst.substring(0, 4) + userStr;
};

const getStudentPassword = (s) => {
  const rawName = (s?.name || '').trim();
  const firstName = rawName.split(/\s+/)[0] || rawName;
  const cleanFirst = firstName.replace(/[^a-zA-Z]/g, '').toLowerCase();
  const userStr = String(s?.username || s?.id || '').trim().toLowerCase();
  return cleanFirst.substring(0, 4) + userStr;
};

export default function AdminDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('tasks');
  const [collapsed, setCollapsed] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // --- Initial Data Setup / LocalStorage Loading ---
  const [tasks, setTasks] = useState(() => {
    const local = localStorage.getItem('cms_tasks');
    return local ? JSON.parse(local) : [
      { id: 1, text: 'Verify engineering department course syllabus updates', completed: false },
      { id: 2, text: 'Publish final exam schedule for Sem 4 students', completed: true },
      { id: 3, text: 'Draft email notification for new faculty joiners', completed: false }
    ];
  });

  const [faculty, setFaculty] = useState([]);
  const [students, setStudents] = useState([]);

  // AI Predictor State
  const [selectedPredictStudentId, setSelectedPredictStudentId] = useState('');
  const [predicting, setPredicting] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  
  // Student Details AI Prediction State
  const [studentAiPredictions, setStudentAiPredictions] = useState({});
  const [studentAiLoading, setStudentAiLoading] = useState({});

  const handleRunStudentAiPrediction = async (studentId) => {
    if (!studentId) return;
    setStudentAiLoading(prev => ({ ...prev, [studentId]: true }));
    try {
      const numericId = parseInt(studentId, 10);
      const res = await ApiService.predictPerformance(isNaN(numericId) ? 1 : numericId);
      setStudentAiPredictions(prev => ({ ...prev, [studentId]: res }));
      showToast('AI Risk Assessment updated!');
    } catch (err) {
      showToast(`AI Predictor Error: ${err.message}`);
    } finally {
      setStudentAiLoading(prev => ({ ...prev, [studentId]: false }));
    }
  };
  
  // --- Timetable State ---
  const [timetableImage, setTimetableImage] = useState(null);
  const [timetableLoading, setTimetableLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [predictionHistory, setPredictionHistory] = useState([]);

  // Security Re-authentication State
  const [unlockedKeys, setUnlockedKeys] = useState({});
  const [showPasswordAuthModal, setShowPasswordAuthModal] = useState(false);
  const [adminAuthPassword, setAdminAuthPassword] = useState('');
  const [adminAuthError, setAdminAuthError] = useState('');
  const [adminAuthLoading, setAdminAuthLoading] = useState(false);
  const [targetKeyToUnlock, setTargetKeyToUnlock] = useState(null);

  const handlePasswordClick = (key) => {
    if (!key) return;
    if (unlockedKeys[key]) {
      setUnlockedKeys(prev => ({ ...prev, [key]: false }));
      showToast('Password masked.');
      return;
    }
    setTargetKeyToUnlock(key);
    setAdminAuthPassword('');
    setAdminAuthError('');
    setShowPasswordAuthModal(true);
  };

  const handleVerifyAdminPassword = async (e) => {
    e.preventDefault();
    if (!adminAuthPassword.trim()) {
      setAdminAuthError('Please enter your admin password.');
      return;
    }

    setAdminAuthLoading(true);
    setAdminAuthError('');

    try {
      const currentAdminUsername = user?.username || 'admin123';
      await ApiService.login(currentAdminUsername, adminAuthPassword.trim());
      
      if (targetKeyToUnlock) {
        setUnlockedKeys(prev => ({ ...prev, [targetKeyToUnlock]: true }));
      }
      setShowPasswordAuthModal(false);
      setAdminAuthPassword('');
      setTargetKeyToUnlock(null);
      showToast('Security verified! Password revealed.');
    } catch (err) {
      console.error(err);
      setAdminAuthError('Incorrect admin password. Verification failed.');
    } finally {
      setAdminAuthLoading(false);
    }
  };

  const loadData = async () => {
    try {
      const apiStudents = await ApiService.getStudents();
      const apiFaculty = await ApiService.getFaculty();

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

      setFaculty(apiFaculty.map(f => ({
        id: String(f.id),
        name: f.first_name ? `${f.first_name} ${f.last_name || ''}`.trim() : f.username,
        email: f.email,
        dept: f.department || 'Computer Engineering',
        phone: '+91 94285 12345',
        username: f.username,
        subject: f.subjects || 'FSD'
      })));
    } catch (err) {
      console.error('Failed to load students/faculty from backend:', err);
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
    fetchTimetableImage();
  }, []);

  const fetchTimetableImage = async () => {
    try {
      const data = await ApiService.getLatestTimetableImage();
      if (data && data.image) {
        setTimetableImage(data.image);
      }
    } catch (err) {
      console.log('No timetable image found or error fetching:', err);
    }
  };

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('cms_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Toast helper
  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // --- Task Manager Logic ---
  const [newTaskText, setNewTaskText] = useState('');
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    const newTask = {
      id: Date.now(),
      text: newTaskText.trim(),
      completed: false
    };
    setTasks([...tasks, newTask]);
    setNewTaskText('');
    showToast('Task added successfully!');
  };

  const handleToggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
    showToast('Task removed.');
  };

  // --- Manage Faculty Logic ---
  const [showFacultyModal, setShowFacultyModal] = useState(false);
  const [facultyForm, setFacultyForm] = useState({ id: '', name: '', email: '', dept: 'Computer Engineering', phone: '', password: '', subject: 'FSD' });
  const [facultyAnnouncement, setFacultyAnnouncement] = useState('');
  const [facultyNoticeChannels, setFacultyNoticeChannels] = useState({ email: true, whatsapp: false, noticeboard: true });
  const [selectedFacultyNoticeTarget, setSelectedFacultyNoticeTarget] = useState('all');

  const handleAddFaculty = async (e) => {
    e.preventDefault();
    const { id, name, email, dept, password, subject } = facultyForm;
    if (!name.trim() || !email.trim()) {
      showToast('Please fill in Name and Email.');
      return;
    }

    let resolvedId = id.trim();
    if (!resolvedId) {
      const numericIds = faculty
        .map(f => {
          const match = f?.username ? String(f.username).match(/^F(\d+)$/i) : null;
          return match ? parseInt(match[1], 10) : null;
        })
        .filter(n => n !== null);
      const nextNum = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 101;
      resolvedId = `F${nextNum}`;
    }

    const rawName = name.replace(/^(dr|prof|mr|mrs|ms)\.?\s+/i, '').trim();
    const nameParts = rawName.split(/\s+/);
    const firstName = nameParts[0] || rawName;
    const lastName = nameParts.slice(1).join(' ') || '';

    const cleanFirstName = firstName.replace(/[^a-zA-Z]/g, '').toLowerCase();
    const defaultPass = cleanFirstName.substring(0, 4) + resolvedId.trim().toLowerCase();
    const finalPassword = password.trim() || defaultPass;

    const payload = {
      username: resolvedId.toUpperCase(),
      email: email.trim(),
      password: finalPassword,
      first_name: firstName,
      last_name: lastName,
      employee_id: resolvedId.toUpperCase(),
      department: dept,
      designation: 'Assistant Professor',
      subjects: subject.trim() || 'FSD',
      joining_date: new Date().toISOString().split('T')[0]
    };

    try {
      await ApiService.createFaculty(payload);
      await loadData();
      setFacultyForm({ id: '', name: '', email: '', dept: 'Computer Engineering', phone: '', password: '', subject: 'FSD' });
      setShowFacultyModal(false);
      showToast(`Faculty Dr./Prof. ${name} registered! ID: ${resolvedId.toUpperCase()} (Password: ${finalPassword})`);
    } catch (err) {
      showToast(`Error: ${err.message}`);
    }
  };

  const handleDeleteFaculty = async (id, name) => {
    try {
      await ApiService.deleteFaculty(id);
      await loadData();
      alert('Prediction logs cleared successfully');
    } catch (err) {
      alert(err.message || 'Error clearing logs');
    }
  };

  const handleUploadTimetable = async (e) => {
    e.preventDefault();
    const file = e.target.timetableFile.files[0];
    if (!file) {
      alert('Please select a file first.');
      return;
    }
    
    const formData = new FormData();
    formData.append('image', file);
    
    setTimetableLoading(true);
    try {
      const response = await ApiService.uploadTimetableImage(formData);
      setTimetableImage(response.image);
      alert('Timetable uploaded successfully!');
      e.target.reset();
    } catch (err) {
      alert(err.message || 'Error uploading timetable');
    } finally {
      setTimetableLoading(false);
    }
  };

  const handleSendFacultyAnnouncement = async (e) => {
    e.preventDefault();
    if (!facultyAnnouncement.trim()) {
      showToast('Please write some content for the announcement.');
      return;
    }

    const prefix = selectedFacultyNoticeTarget === 'all' 
      ? 'Broadcast Notice to Faculty' 
      : `Private Notice to Faculty`;

    const textToSend = `${prefix}: ${facultyAnnouncement.trim()}`;
    const subject = 'Campuzz Faculty Broadcast Notice';

    // Send under-the-hood HTTP requests without popups
    if (facultyNoticeChannels.whatsapp) {
      fetch('/api/send-whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: '7990056685', text: textToSend, recipientType: 'faculty' })
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
        title: 'Faculty Broadcast Notice',
        content: facultyAnnouncement.trim(),
        target_audience: 'faculty'
      };
      await ApiService.createNotice(payload);
      showToast(selectedFacultyNoticeTarget === 'all' ? `Announcement sent to all faculty!` : `Notification sent to faculty.`);
      setFacultyAnnouncement('');
    } catch (err) {
      showToast(`Error: ${err.message}`);
    }
  };

  // --- Manage Students Logic ---
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [studentSearch, setStudentSearch] = useState('');
  const [studentForm, setStudentForm] = useState({ id: '', name: '', email: '', dept: 'Computer Engineering', phone: '', fatherName: '', motherName: '', guardianContact: '', password: '', classAssigned: 'D1' });
  const [studentNotice, setStudentNotice] = useState('');
  const [studentNoticeChannels, setStudentNoticeChannels] = useState({ email: true, whatsapp: false, noticeboard: true });

  const selectedStudent = students.find(s => s.id === selectedStudentId);

  const handleAddStudent = async (e) => {
    e.preventDefault();
    const { id, name, email, dept, password } = studentForm;
    if (!name.trim() || !email.trim()) {
      showToast('Please fill in Name and Email.');
      return;
    }

    let resolvedId = id.trim();
    if (!resolvedId) {
      const numericIds = students
        .map(s => {
          const match = s?.username ? String(s.username).match(/^(\d+)$/) : null;
          return match ? parseInt(match[1], 10) : null;
        })
        .filter(n => n !== null);
      const nextNum = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 204;
      resolvedId = String(nextNum);
    }

    const rawName = name.trim();
    const nameParts = rawName.split(/\s+/);
    const firstName = nameParts[0] || rawName;
    const lastName = nameParts.slice(1).join(' ') || '';

    const cleanFirstName = firstName.replace(/[^a-zA-Z]/g, '').toLowerCase();
    const defaultPass = cleanFirstName.substring(0, 4) + resolvedId.toLowerCase();
    const finalPassword = password.trim() || defaultPass;

    const payload = {
      username: resolvedId,
      email: email.trim(),
      password: finalPassword,
      first_name: firstName,
      last_name: lastName,
      roll_no: resolvedId,
      course: studentForm.classAssigned || 'D1',
      semester: 4,
      department: dept,
      class: studentForm.classAssigned || 'D1',
      class_assigned: studentForm.classAssigned || 'D1',
      admission_year: new Date().getFullYear()
    };

    try {
      const res = await ApiService.createStudent(payload);
      const contactObj = {
        phone: phone.trim() || '+91 79900 56685',
        fatherName: fatherName.trim() || 'Not Provided',
        motherName: motherName.trim() || 'Not Provided',
        guardianContact: guardianContact.trim() || '+91 94285 12345'
      };
      localStorage.setItem(`cms_student_contacts_${resolvedId}`, JSON.stringify(contactObj));
      if (res.id) {
        localStorage.setItem(`cms_student_contacts_${res.id}`, JSON.stringify(contactObj));
      }
      await loadData();
      setSelectedStudentId(String(res.id));
      setStudentForm({ id: '', name: '', email: '', dept: 'Computer Engineering', phone: '', fatherName: '', motherName: '', guardianContact: '', password: '', classAssigned: 'D1' });
      setShowStudentModal(false);
      showToast(`Student ${name} registered successfully! Roll: ${resolvedId} (Password: ${finalPassword})`);
    } catch (err) {
      showToast(`Error: ${err.message}`);
    }
  };

  const handleDeleteStudent = async (id, name) => {
    try {
      await ApiService.deleteStudent(id);
      await loadData();
      showToast(`Student ${name} removed successfully.`);
      if (selectedStudentId === id) {
        setSelectedStudentId('');
      }
    } catch (err) {
      showToast(`Error: ${err.message}`);
    }
  };

  const handleSendStudentNotice = async (e) => {
    e.preventDefault();
    if (!studentNotice.trim()) {
      showToast('Please write some content for the notice.');
      return;
    }
    if (!selectedStudent) {
      showToast('Please select a student to target.');
      return;
    }

    const textToSend = `Notice Alert to Student ${selectedStudent.name} (Roll ${selectedStudent.username || selectedStudent.id}): ${studentNotice.trim()}`;
    const subject = 'Campuzz Student Notice Warning';

    // Send under-the-hood HTTP requests without popups
    if (studentNoticeChannels.whatsapp) {
      fetch('/api/send-whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: '7990056685', text: textToSend, recipientType: 'student' })
      }).catch(err => console.error(err));
    }
    if (studentNoticeChannels.email) {
      fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: 'akshatthoriya1@gmail.com', subject, text: textToSend })
      }).catch(err => console.error(err));
    }

    try {
      const payload = {
        title: 'Student Broadcast Notice',
        content: studentNotice.trim(),
        target_audience: 'students'
      };
      await ApiService.createNotice(payload);
      showToast(`Notice warning sent successfully!`);
      setStudentNotice('');
    } catch (err) {
      showToast(`Error: ${err.message}`);
    }
  };

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.id.toLowerCase().includes(studentSearch.toLowerCase())
  );

  return (
    <div className="admin-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast">
          <div className="toast-content">
            <span className="toast-dot" />
            <p>{toastMessage}</p>
          </div>
        </div>
      )}

      {/* Left Sidebar */}
      <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
        <button 
          type="button"
          className="sidebar-collapse-toggle" 
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand Menu" : "Collapse Menu"}
          style={{
            background: 'none',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'var(--white)',
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            alignSelf: collapsed ? 'center' : 'flex-end',
            marginBottom: '16px',
            transition: 'all 0.2s ease',
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}><polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/></svg>
        </button>

        <div className="sidebar-brand" style={{ padding: '0 8px 16px 8px' }}>
          <CampuzzLogo subtitle="Admin Console" collapsed={collapsed} />
        </div>

        <div className="admin-profile-badge" style={{ justifyContent: collapsed ? 'center' : 'flex-start', padding: collapsed ? '8px' : '14px 16px' }}>
          <div className="avatar-circle">AD</div>
          {!collapsed && (
            <div className="profile-details">
              <span className="profile-name">Administrator</span>
              <span className="profile-role">Super Admin Mode</span>
            </div>
          )}
        </div>

        <nav className="sidebar-nav" style={{ alignItems: collapsed ? 'center' : 'stretch' }}>
          <button
            type="button"
            className={`nav-item ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tasks')}
            style={{ justifyContent: collapsed ? 'center' : 'flex-start', padding: collapsed ? '12px 0' : '13px 16px', gap: collapsed ? '0' : '14px' }}
            title="Task Manager"
          >
            <TaskIcon />
            {!collapsed && <span>Task Manager</span>}
            {!collapsed && tasks.filter(t => !t.completed).length > 0 && (
              <span className="badge-count">{tasks.filter(t => !t.completed).length}</span>
            )}
          </button>

          <button
            type="button"
            className={`nav-item ${activeTab === 'faculty' ? 'active' : ''}`}
            onClick={() => setActiveTab('faculty')}
            style={{ justifyContent: collapsed ? 'center' : 'flex-start', padding: collapsed ? '12px 0' : '13px 16px', gap: collapsed ? '0' : '14px' }}
            title="Manage Faculty"
          >
            <FacultyIcon />
            {!collapsed && <span>Manage Faculty</span>}
          </button>

          <button
            type="button"
            className={`nav-item ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => setActiveTab('students')}
            style={{ justifyContent: collapsed ? 'center' : 'flex-start', padding: collapsed ? '12px 0' : '13px 16px', gap: collapsed ? '0' : '14px' }}
            title="Manage Students"
          >
            <StudentIcon />
            {!collapsed && <span>Manage Students</span>}
          </button>

          <button
            type="button"
            className={`nav-item ${activeTab === 'ai-predictor' ? 'active' : ''}`}
            onClick={() => setActiveTab('ai-predictor')}
            style={{ justifyContent: collapsed ? 'center' : 'flex-start', padding: collapsed ? '12px 0' : '13px 16px', gap: collapsed ? '0' : '14px' }}
            title="AI Risk Predictor"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            <span className="nav-label">AI Predictor</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'timetable' ? 'active' : ''}`}
            onClick={() => setActiveTab('timetable')}
            title="Weekly Timetable"
          >
            <div className="nav-icon" style={{ backgroundColor: activeTab === 'timetable' ? 'var(--std-primary)' : 'rgba(255,255,255,0.1)' }}>
              📅
            </div>
            <span className="nav-label">Timetable</span>
          </button>
        </nav>

        {/* Growing plant at bottom of admin sidebar */}
        <div className="growing-plant-wrapper">
          <GrowingPlant role="admin" collapsed={collapsed} />
        </div>

        <button 
          type="button" 
          className="sidebar-logout" 
          onClick={onLogout}
          style={{ justifyContent: collapsed ? 'center' : 'flex-start', padding: collapsed ? '12px 0' : '13px 16px', gap: collapsed ? '0' : '14px' }}
          title="Logout"
        >
          <LogoutIcon />
          {!collapsed && <span>Logout Session</span>}
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        <header className="main-header">
          <div className="header-info">
            <p className="breadcrumb">LJ University · Admin Control Console</p>
            <h1>
              {activeTab === 'tasks' && 'Task Manager'}
              {activeTab === 'faculty' && 'Faculty Member Records'}
              {activeTab === 'students' && 'Student Performance & Profiles'}
              {activeTab === 'ai-predictor' && 'AI Performance Risk Analysis'}
              {activeTab === 'timetable' && 'Weekly Timetable Management'}
            </h1>
          </div>
          <div className="header-date">
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </header>

        <div className="tab-viewport">
          {/* ============================================================ */}
          {/* TASK MANAGER VIEW */}
          {/* ============================================================ */}
          {activeTab === 'tasks' && (
            <div className="tasks-view-grid animate-fade-in">
              <div className="tasks-dashboard-card">
                <h3>Task Manager</h3>
                <p className="card-desc">Coordinate, assign, and track current campus administration tasks.</p>

                <form onSubmit={handleAddTask} className="add-task-form">
                  <input
                    type="text"
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    placeholder="Enter a new administrative task..."
                  />
                  <button type="submit" className="action-btn-primary">
                    <PlusIcon /> Add Task
                  </button>
                </form>

                <div className="tasks-stats-row">
                  <div className="stat-box">
                    <span className="stat-num">{tasks.length}</span>
                    <span className="stat-lbl">Total Tasks</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-num text-teal">{tasks.filter(t => t.completed).length}</span>
                    <span className="stat-lbl">Completed</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-num text-navy">{tasks.filter(t => !t.completed).length}</span>
                    <span className="stat-lbl">Remaining</span>
                  </div>
                </div>

                <div className="tasks-list-container">
                  {tasks.length === 0 ? (
                    <div className="empty-state">
                      <p>No tasks configured. Enjoy your clear schedule!</p>
                    </div>
                  ) : (
                    <ul className="tasks-list">
                      {tasks.map(task => (
                        <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                          <label className="checkbox-container">
                            <input
                              type="checkbox"
                              checked={task.completed}
                              onChange={() => handleToggleTask(task.id)}
                            />
                            <span className="custom-checkbox" />
                            <span className="task-text">{task.text}</span>
                          </label>
                          <button
                            type="button"
                            className="delete-task-btn"
                            onClick={() => handleDeleteTask(task.id)}
                            title="Delete Task"
                          >
                            <TrashIcon />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* MANAGE FACULTY VIEW */}
          {/* ============================================================ */}
          {activeTab === 'faculty' && (
            <div className="faculty-view-grid animate-fade-in">
              <div className="faculty-split-layout">
                {/* Faculty List & Registration */}
                <div className="faculty-main-card">
                  <div className="card-header-actions">
                    <div>
                      <h3>Faculty Roster</h3>
                      <p className="card-desc">Review and register lecturing personnel of the department.</p>
                    </div>
                    <button
                      type="button"
                      className="action-btn-primary"
                      onClick={() => setShowFacultyModal(true)}
                    >
                      <PlusIcon /> Register Faculty
                    </button>
                  </div>

                  <div className="table-responsive">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Faculty ID</th>
                          <th>Full Name</th>
                          <th>Department</th>
                          <th>Teaching Subject</th>
                          <th>Email Address</th>
                          <th>Username</th>
                          <th>Password</th>
                          <th style={{ textAlign: 'center' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {faculty.map(f => (
                          <tr key={f.id}>
                            <td><strong>{f.id}</strong></td>
                            <td>{f.name}</td>
                            <td><span className="badge-dept">{f.dept}</span></td>
                            <td><span className="badge-dept" style={{ backgroundColor: 'rgba(230,242,255,0.8)', color: '#0052cc' }}>{f.subject || 'FSD'}</span></td>
                            <td>{f.email}</td>
                            <td><code>{f.username || f.id}</code></td>
                            <td>
                              <div
                                onClick={() => handlePasswordClick(`faculty_${f.id}`)}
                                style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                title={unlockedKeys[`faculty_${f.id}`] ? 'Click to hide password' : 'Click to verify admin password and reveal'}
                              >
                                <code>
                                  {unlockedKeys[`faculty_${f.id}`] ? getFacultyPassword(f) : '••••••••'}
                                </code>
                                {unlockedKeys[`faculty_${f.id}`] ? <EyeIcon /> : <LockIcon />}
                              </div>
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <button
                                type="button"
                                className="action-btn-danger-icon"
                                onClick={() => handleDeleteFaculty(f.id, f.name)}
                                title="Remove Faculty"
                              >
                                <TrashIcon />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Faculty Announcement Card */}
                <div className="faculty-announcement-card">
                  <h3>Send Mail/Message</h3>
                  <p className="card-desc">Send email and WhatsApp notifications directly to the lecturing personnel.</p>

                  <form onSubmit={handleSendFacultyAnnouncement} className="announcement-form">
                    <div className="form-group">
                      <label>Target Faculty Recipient</label>
                      <select
                        value={selectedFacultyNoticeTarget}
                        onChange={(e) => setSelectedFacultyNoticeTarget(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '6px',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          color: '#ffffff',
                          fontSize: '14px',
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="all" style={{ color: '#ffffff', backgroundColor: '#2f4156' }}>All Faculty Roster (Broadcast)</option>
                        {faculty.map(f => (
                          <option key={f.id} value={f.id} style={{ color: '#ffffff', backgroundColor: '#2f4156' }}>
                            {f.name} (ID: {f.id} &middot; {f.subject || 'FSD'})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Message Content</label>
                      <textarea
                        value={facultyAnnouncement}
                        onChange={(e) => setFacultyAnnouncement(e.target.value)}
                        placeholder="Write announcement or notification details here..."
                        rows="4"
                      />
                    </div>

                    <div className="form-group">
                      <label>Delivery Channels</label>
                      <div className="channels-grid">
                        <label className="checkbox-container">
                          <input
                            type="checkbox"
                            checked={facultyNoticeChannels.email}
                            onChange={(e) => setFacultyNoticeChannels({ ...facultyNoticeChannels, email: e.target.checked })}
                          />
                          <span className="custom-checkbox" />
                          <span>NodeMailer (Email)</span>
                        </label>

                        <label className="checkbox-container" style={{ opacity: 0.5, cursor: 'not-allowed' }} onClick={(e) => { e.preventDefault(); alert('🚫 WhatsApp Notification Service is temporarily blocked due to API maintenance. Please use Email notification for live message delivery.'); }}>
                          <input
                            type="checkbox"
                            checked={false}
                            onChange={() => {}}
                            disabled
                          />
                          <span className="custom-checkbox" />
                          <span>WhatsApp (Temporarily Blocked 🚫)</span>
                        </label>
                      </div>
                    </div>

                    <button type="submit" className="action-btn-secondary">
                      Send Mail/Message
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* MANAGE STUDENTS VIEW */}
          {/* ============================================================ */}
          {activeTab === 'students' && (
            <div className="students-view-grid animate-fade-in">
              <div className="students-split-container">
                {/* Left Students Sidebar List */}
                <div className="students-list-panel">
                  <div className="panel-header">
                    <div>
                      <h3>Student Database</h3>
                      <p className="card-desc">{students.length} students enrolled</p>
                    </div>
                    <button
                      type="button"
                      className="action-btn-primary icon-only"
                      onClick={() => setShowStudentModal(true)}
                      title="Add Student"
                    >
                      <PlusIcon />
                    </button>
                  </div>

                  <div className="search-bar">
                    <SearchIcon />
                    <input
                      type="text"
                      placeholder="Search by name or roll no..."
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                    />
                  </div>

                  <div className="students-scrollable-list">
                    {filteredStudents.length === 0 ? (
                      <p className="no-results">No students found matching query.</p>
                    ) : (
                      filteredStudents.map(student => (
                        <div
                          key={student.id}
                          className={`student-list-item ${selectedStudentId === student.id ? 'active' : ''}`}
                          onClick={() => setSelectedStudentId(student.id)}
                        >
                          <div className="student-list-info">
                            <span className="student-name">{student.name}</span>
                            <span className="student-id">
                              Roll: {student.username || student.id} &middot; Pass: <code
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePasswordClick(`student_${student.id}`);
                                }}
                                style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                                title={unlockedKeys[`student_${student.id}`] ? 'Click to hide password' : 'Click to verify admin password and reveal'}
                              >
                                {unlockedKeys[`student_${student.id}`] ? getStudentPassword(student) : '••••••••'} {unlockedKeys[`student_${student.id}`] ? <EyeIcon /> : <LockIcon />}
                              </code> &middot; {student.dept}
                            </span>
                          </div>
                          <button
                            type="button"
                            className="delete-list-item-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteStudent(student.id, student.name);
                            }}
                            title="Remove Student"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Right Details Panel */}
                <div className="student-details-panel">
                  {selectedStudent ? (
                    <div className="student-details-card">
                      <div className="details-header">
                        <div>
                          <h2>{selectedStudent.name}</h2>
                          <p className="student-meta-subtitle">
                            Roll Number: <strong>{selectedStudent.username || selectedStudent.id}</strong> | Password: <code
                              onClick={() => handlePasswordClick(`student_${selectedStudent.id}`)}
                              style={{ backgroundColor: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                              title={unlockedKeys[`student_${selectedStudent.id}`] ? 'Click to hide password' : 'Click to verify admin password and reveal'}
                            >
                              {unlockedKeys[`student_${selectedStudent.id}`] ? getStudentPassword(selectedStudent) : '••••••••'} {unlockedKeys[`student_${selectedStudent.id}`] ? <EyeIcon /> : <LockIcon />}
                            </code> | Department: <strong>{selectedStudent.dept}</strong> | Class: <strong>{selectedStudent.class || selectedStudent.classAssigned || 'D1'}</strong>
                          </p>
                        </div>
                      </div>

                      <div className="details-grid">
                        {/* Academic Status & AI Prediction */}
                        <div className="details-block attendance-block">
                          <h4>Academic Status</h4>
                          {selectedStudent.attendance !== null && selectedStudent.attendance !== undefined ? (
                            <div className="attendance-gauge-container">
                              <div className="gauge-outer">
                                <div
                                  className={`gauge-bar ${selectedStudent.attendance >= 75 ? 'good' : 'warning'}`}
                                  style={{ width: `${Math.min(100, Math.max(2, selectedStudent.attendance))}%` }}
                                />
                              </div>
                              <div className="gauge-stats" style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <span className="gauge-percentage" style={{ fontSize: '20px', fontWeight: '800', color: selectedStudent.attendance >= 75 ? '#10b981' : '#f59e0b' }}>
                                    {selectedStudent.attendance}%
                                  </span>
                                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#38bdf8' }}>
                                    {Math.round(selectedStudent.attendance)} / 100 Lectures Marked Present
                                  </span>
                                </div>
                                <span className="gauge-label" style={{ fontSize: '12px', color: '#94a3b8' }}>
                                  {selectedStudent.attendance >= 75 ? 'Satisfactory Attendance Standing' : 'Daily Date-Wise Logs Marked by Faculty (+1% per day marked present)'}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="attendance-gauge-container">
                              <div className="gauge-outer">
                                <div className="gauge-bar warning" style={{ width: '2%' }} />
                              </div>
                              <div className="gauge-stats" style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <span className="gauge-percentage" style={{ fontSize: '20px', fontWeight: '800', color: '#f59e0b' }}>
                                    0%
                                  </span>
                                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#38bdf8' }}>
                                    0 / 100 Lectures Marked Present
                                  </span>
                                </div>
                                <span className="gauge-label" style={{ fontSize: '12px', color: '#94a3b8' }}>
                                  Daily Date-Wise Logs Marked by Faculty (+1% per day marked present)
                                </span>
                              </div>
                            </div>
                          )}

                          {/* AI Risk Prediction Display */}
                          <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                              <span style={{ fontSize: '13px', fontWeight: '700', color: '#94a3b8' }}>🤖 AI Performance Risk Assessment</span>
                              <button
                                type="button"
                                onClick={() => handleRunStudentAiPrediction(selectedStudent.id)}
                                style={{ padding: '4px 10px', borderRadius: '4px', border: '1px solid rgba(0,210,255,0.3)', backgroundColor: 'rgba(0,210,255,0.1)', color: '#00d2ff', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}
                              >
                                {studentAiLoading[selectedStudent.id] ? 'Analyzing...' : 'Run Analysis'}
                              </button>
                            </div>
                            {studentAiPredictions[selectedStudent.id] ? (
                              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.06)' }}>
                                <div style={{ fontSize: '13px', fontWeight: '700', color: studentAiPredictions[selectedStudent.id].risk_level === 'High' ? '#ef4444' : studentAiPredictions[selectedStudent.id].risk_level === 'Moderate' ? '#f59e0b' : '#10b981' }}>
                                  Risk Level: {studentAiPredictions[selectedStudent.id].risk_level || 'Low'} Risk
                                </div>
                                <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '4px' }}>
                                  Pass Probability: <strong>{studentAiPredictions[selectedStudent.id].pass_probability ?? '92'}%</strong> &middot; CGPA: <strong>7.2</strong>
                                </div>
                              </div>
                            ) : (
                              <div style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic' }}>
                                {selectedStudent.attendance >= 75 ? 'Low Risk — Expected Pass Probability > 90%' : 'Attention Needed — Low Attendance Warning'}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Guardian Contacts */}
                        <div className="details-block contact-block">
                          <h4>Parents / Guardian Profile</h4>
                          <div className="guardian-card">
                            {selectedStudent.fatherName && (
                              <div className="info-row">
                                <span className="info-lbl">Father / Guardian</span>
                                <span className="info-val">{selectedStudent.fatherName}</span>
                              </div>
                            )}
                            {selectedStudent.motherName && (
                              <div className="info-row">
                                <span className="info-lbl">Mother's Name</span>
                                <span className="info-val">{selectedStudent.motherName}</span>
                              </div>
                            )}
                            {!selectedStudent.fatherName && selectedStudent.guardianName && (
                              <div className="info-row">
                                <span className="info-lbl">Guardian Name</span>
                                <span className="info-val">{selectedStudent.guardianName}</span>
                              </div>
                            )}
                            <div className="info-row">
                              <span className="info-lbl">Contact Number</span>
                              <span className="info-val">{selectedStudent.guardianContact}</span>
                            </div>
                          </div>

                          <h4 style={{ marginTop: '16px' }}>Student Contact Details</h4>
                          <div className="guardian-card" style={{ marginBottom: '16px' }}>
                            <div className="info-row">
                              <span className="info-lbl">Email Address</span>
                              <span className="info-val">{selectedStudent.email}</span>
                            </div>
                            <div className="info-row">
                              <span className="info-lbl">Phone Number</span>
                              <span className="info-val">{selectedStudent.phone}</span>
                            </div>
                          </div>

                          <h4>Student Login Credentials</h4>
                          <div className="guardian-card">
                            <div className="info-row">
                              <span className="info-lbl">Login Username</span>
                              <span className="info-val"><code>{selectedStudent.username || selectedStudent.id}</code></span>
                            </div>
                            <div className="info-row">
                              <span className="info-lbl">Password</span>
                              <span className="info-val">
                                <code
                                  onClick={() => handlePasswordClick(`student_${selectedStudent.id}`)}
                                  style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                  title={unlockedKeys[`student_${selectedStudent.id}`] ? 'Click to hide password' : 'Click to verify admin password and reveal'}
                                >
                                  {unlockedKeys[`student_${selectedStudent.id}`] ? getStudentPassword(selectedStudent) : '••••••••'} {unlockedKeys[`student_${selectedStudent.id}`] ? <EyeIcon /> : <LockIcon />}
                                </code>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Send Notice Section */}
                      <div className="student-notice-box">
                        <h4>Send Notification / Notice</h4>
                        <p className="card-desc">Write an alert notice to be displayed on student's home page and contact channels.</p>

                        <form onSubmit={handleSendStudentNotice} className="announcement-form">
                          <textarea
                            value={studentNotice}
                            onChange={(e) => setStudentNotice(e.target.value)}
                            placeholder={`Write custom notice body for ${selectedStudent.name}...`}
                            rows="3"
                          />

                          <div className="notice-footer-controls">
                            <div className="channels-grid mini" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                              <label className="checkbox-container">
                                <input
                                  type="checkbox"
                                  checked={studentNoticeChannels.email}
                                  onChange={(e) => setStudentNoticeChannels({ ...studentNoticeChannels, email: e.target.checked })}
                                />
                                <span className="custom-checkbox" />
                                <span>Email (akshatthoriya1@gmail.com)</span>
                              </label>

                              <label className="checkbox-container" style={{ opacity: 0.5, cursor: 'not-allowed' }} onClick={(e) => { e.preventDefault(); alert('🚫 WhatsApp Notification Service is temporarily blocked due to API maintenance. Please use Email notification for live message delivery.'); }}>
                                <input
                                  type="checkbox"
                                  checked={false}
                                  onChange={() => {}}
                                  disabled
                                />
                                <span className="custom-checkbox" />
                                <span>WhatsApp (Temporarily Blocked 🚫)</span>
                              </label>
                            </div>

                            <button type="submit" className="action-btn-secondary">
                              Send Direct Notice
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  ) : (
                    <div className="empty-details">
                      <p>Select a student from the database list to inspect attendance records and dispatch notice reports.</p>
                    </div>
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
              <div className="std-card" style={{ margin: 0 }}>
                <h3 style={{ fontSize: '18px', color: 'var(--std-text-primary)', marginBottom: '8px' }}>🤖 AI Student Performance Risk Analysis</h3>
                <p className="card-desc" style={{ color: 'var(--std-text-secondary)', fontSize: '13.5px', marginBottom: '20px' }}>
                  Analyze student records using a Random Forest Classifier to classify performance and detect early academic risk.
                </p>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                  <div className="form-group" style={{ margin: 0, flex: 1, minWidth: '200px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--std-text-secondary)', display: 'block', marginBottom: '6px' }}>Select Student to Analyze</label>
                    <select
                      value={selectedPredictStudentId}
                      onChange={(e) => setSelectedPredictStudentId(e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--std-border)', backgroundColor: 'var(--std-cardbg)', color: 'var(--std-text-primary)' }}
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
                    className="action-btn-primary"
                    style={{ padding: '11px 24px', whiteSpace: 'nowrap' }}
                  >
                    {predicting ? 'Analyzing...' : 'Run Risk Assessment'}
                  </button>
                </div>
              </div>

              {predictionResult && (
                <div className="std-card animate-scale-up" style={{ margin: 0, border: '1.5px solid var(--std-border)' }}>
                  <h4 style={{ fontSize: '16px', color: 'var(--std-text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    📊 Assessment Report: {students.find(s => s.id === String(predictionResult.student_id))?.name || predictionResult.student_roll_no}
                  </h4>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                    <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: 'var(--std-border)' }}>
                      <span style={{ fontSize: '12px', color: 'var(--std-text-secondary)', display: 'block', marginBottom: '4px' }}>Classification Label</span>
                      <strong style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '6px', color: 
                        predictionResult.predicted_label === 'excellent' ? 'var(--std-success)' :
                        predictionResult.predicted_label === 'good' ? 'var(--std-success)' :
                        predictionResult.predicted_label === 'average' ? 'var(--std-gold)' : 'var(--std-danger)'
                      }}>
                        {predictionResult.emoji} {predictionResult.predicted_label.toUpperCase()}
                      </strong>
                    </div>

                    <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: 'var(--std-border)' }}>
                      <span style={{ fontSize: '12px', color: 'var(--std-text-secondary)', display: 'block', marginBottom: '4px' }}>Academic Risk Level</span>
                      <strong style={{ fontSize: '18px', color: 
                        predictionResult.risk_level === 'Low' ? 'var(--std-success)' :
                        predictionResult.risk_level === 'Medium' ? 'var(--std-gold)' : 'var(--std-danger)'
                      }}>
                        {predictionResult.risk_level}
                      </strong>
                    </div>

                    <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: 'var(--std-border)' }}>
                      <span style={{ fontSize: '12px', color: 'var(--std-text-secondary)', display: 'block', marginBottom: '4px' }}>Confidence Score</span>
                      <strong style={{ fontSize: '18px', color: 'var(--std-text-primary)' }}>
                        {predictionResult.confidence}%
                      </strong>
                    </div>
                  </div>

                  <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: 'rgba(234, 88, 12, 0.08)', borderLeft: '4px solid var(--std-primary)' }}>
                    <h5 style={{ margin: '0 0 6px 0', fontSize: '14px', color: 'var(--std-text-primary)' }}>💡 System Recommendation</h5>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--std-text-secondary)', lineHeight: '1.6' }}>{predictionResult.recommendation}</p>
                  </div>
                </div>
              )}

              <div className="std-card" style={{ margin: 0 }}>
                <h3 style={{ fontSize: '16px', color: 'var(--std-text-primary)', marginBottom: '12px' }}>📜 Prediction Execution Logs</h3>
                <div style={{ overflowX: 'auto' }}>
                  <table className="marks-table" style={{ width: '100%' }}>
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>Roll No</th>
                        <th>Prediction</th>
                        <th>Risk Level</th>
                        <th>Confidence</th>
                        <th>Avg Marks</th>
                        <th>Attendance</th>
                        <th>Run Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {predictionHistory.length === 0 ? (
                        <tr>
                          <td colSpan="8" style={{ textAlign: 'center', color: 'var(--std-text-secondary)', fontStyle: 'italic', padding: '20px' }}>
                            No analysis logs recorded in database yet.
                          </td>
                        </tr>
                      ) : (
                        predictionHistory.map(log => (
                          <tr key={log.id}>
                            <td style={{ fontWeight: '500' }}>{students.find(s => String(s.username) === String(log.student) || String(s.roll_no) === String(log.student) || String(s.id) === String(log.student))?.name || log.student}</td>
                            <td>{log.roll_no}</td>
                            <td style={{ fontWeight: '600', color: 
                              log.predicted_label === 'excellent' ? 'var(--std-success)' :
                              log.predicted_label === 'good' ? 'var(--std-success)' :
                              log.predicted_label === 'average' ? 'var(--std-gold)' : 'var(--std-danger)'
                            }}>{log.predicted_label.toUpperCase()}</td>
                            <td>{log.risk_level}</td>
                            <td>{log.confidence}%</td>
                            <td>{log.avg_percentage}%</td>
                            <td>{log.attendance_pct}%</td>
                            <td>{log.predicted_at}</td>
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
            <div className="std-dashboard-section animate-fade-in">
              <div className="std-card" style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '18px', color: 'var(--std-text-primary)', marginBottom: '16px' }}>Upload Weekly Timetable</h3>
                <p style={{ color: 'var(--std-text-secondary)', marginBottom: '20px', fontSize: '14px' }}>
                  Upload a photo or PDF of the latest weekly timetable. This will be visible to all students and faculty on their dashboards.
                </p>
                <form onSubmit={handleUploadTimetable} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <input 
                    type="file" 
                    name="timetableFile" 
                    accept="image/*,.pdf" 
                    required 
                    style={{ 
                      padding: '10px', 
                      border: '1px solid var(--std-border)', 
                      borderRadius: '8px',
                      flex: 1
                    }}
                  />
                  <button 
                    type="submit" 
                    className="action-btn-primary" 
                    disabled={timetableLoading}
                  >
                    {timetableLoading ? 'Uploading...' : 'Upload Timetable'}
                  </button>
                </form>
              </div>

              <div className="std-card">
                <h3 style={{ fontSize: '18px', color: 'var(--std-text-primary)', marginBottom: '16px' }}>Current Timetable</h3>
                {timetableImage ? (
                  <div style={{ textAlign: 'center', border: '1px solid var(--std-border)', padding: '10px', borderRadius: '8px', backgroundColor: '#f9fafb' }}>
                    <div style={{ marginBottom: '10px', textAlign: 'right' }}>
                      <a 
                        href={timetableImage} 
                        download="Weekly_Timetable" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ display: 'inline-block', padding: '8px 16px', backgroundColor: 'var(--std-primary)', color: 'white', textDecoration: 'none', borderRadius: '4px', fontSize: '14px', fontWeight: 'bold' }}
                      >
                        ⬇ Download Timetable
                      </a>
                    </div>
                    {timetableImage.toLowerCase().endsWith('.pdf') ? (
                      <object data={timetableImage} type="application/pdf" width="100%" height="700px">
                        <p>Your browser does not support PDFs. <a href={timetableImage} target="_blank" rel="noopener noreferrer">Download the PDF</a>.</p>
                      </object>
                    ) : (
                      <img 
                        src={timetableImage} 
                        alt="Weekly Timetable" 
                        style={{ maxWidth: '100%', maxHeight: '700px', objectFit: 'contain', borderRadius: '4px' }}
                      />
                    )}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px', color: 'var(--std-text-secondary)', border: '1px dashed var(--std-border)', borderRadius: '8px' }}>
                    <p style={{ margin: 0, fontSize: '15px' }}>No timetable uploaded yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ============================================================ */}
      {/* FACULTY REGISTRATION MODAL */}
      {/* ============================================================ */}
      {showFacultyModal && (
        <div className="modal-backdrop">
          <div className="modal-card animate-scale-up">
            <div className="modal-header">
              <h3>Faculty Member Registration</h3>
              <button
                type="button"
                className="close-modal-btn"
                onClick={() => setShowFacultyModal(false)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleAddFaculty}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Faculty ID (Leave blank to auto-generate)</label>
                  <input
                    type="text"
                    placeholder="e.g. F103"
                    value={facultyForm.id}
                    onChange={(e) => setFacultyForm({ ...facultyForm, id: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Full Name <span className="required">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Prof. Nilesh Patel"
                    value={facultyForm.name}
                    onChange={(e) => setFacultyForm({ ...facultyForm, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Email Address <span className="required">*</span></label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. nilesh.patel@lju.edu.in"
                    value={facultyForm.email}
                    onChange={(e) => setFacultyForm({ ...facultyForm, email: e.target.value })}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group flex-1">
                    <label>Department</label>
                    <select
                      value={facultyForm.dept}
                      onChange={(e) => setFacultyForm({ ...facultyForm, dept: e.target.value })}
                    >
                      <option value="Computer Engineering">Computer Engineering</option>
                      <option value="Computer Science & Technology">Computer Science & Technology</option>
                      <option value="Artificial Intelligence & Machine Learning (AIML)">Artificial Intelligence & Machine Learning (AIML)</option>
                      <option value="Artificial Intelligence (AI)">Artificial Intelligence (AI)</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Civil Engineering">Civil Engineering</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                    </select>
                  </div>
                  <div className="form-group flex-1">
                    <label>Phone Number</label>
                    <input
                      type="text"
                      placeholder="e.g. +91 99999 88888"
                      value={facultyForm.phone}
                      onChange={(e) => setFacultyForm({ ...facultyForm, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-group" style={{ marginTop: '10px' }}>
                  <label>Teaching Subject <span className="required">*</span></label>
                  <select
                    value={facultyForm.subject}
                    onChange={(e) => setFacultyForm({ ...facultyForm, subject: e.target.value })}
                  >
                    <option value="FSD">Full Stack Development (FSD)</option>
                    <option value="Python">Python Programming</option>
                    <option value="DBMS">Database Management Systems (DBMS)</option>
                    <option value="DSA">Data Structures & Algorithms (DSA)</option>
                    <option value="ML">Machine Learning (ML)</option>
                    <option value="CN">Computer Networks (CN)</option>
                    <option value="SE">Software Engineering (SE)</option>
                  </select>
                </div>
                <div className="form-group" style={{ marginTop: '14px' }}>
                  <label>Login Password</label>
                  <input
                    type="text"
                    placeholder="Leave blank to auto-generate"
                    value={facultyForm.password}
                    onChange={(e) => setFacultyForm({ ...facultyForm, password: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="modal-btn-cancel"
                  onClick={() => setShowFacultyModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="modal-btn-confirm">
                  Confirm Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* STUDENT REGISTRATION MODAL (WITHOUT ATTENDANCE INPUT) */}
      {/* ============================================================ */}
      {showStudentModal && (
        <div className="modal-backdrop">
          <div className="modal-card animate-scale-up">
            <div className="modal-header">
              <h3>Student Registration</h3>
              <button
                type="button"
                className="close-modal-btn"
                onClick={() => setShowStudentModal(false)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleAddStudent}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Roll Number / Enrollment (Leave blank to auto-generate)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="e.g. 204"
                    value={studentForm.id}
                    onChange={(e) => setStudentForm({ ...studentForm, id: e.target.value.replace(/\D/g, '') })}
                  />
                </div>
                <div className="form-group">
                  <label>Student Full Name <span className="required">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jayesh Shah"
                    value={studentForm.name}
                    onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Email Address <span className="required">*</span></label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. jayesh.shah@lju.edu.in"
                    value={studentForm.email}
                    onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group flex-1">
                    <label>Department</label>
                    <select
                      value={studentForm.dept}
                      onChange={(e) => setStudentForm({ ...studentForm, dept: e.target.value })}
                    >
                      <option value="Computer Engineering">Computer Engineering</option>
                      <option value="Computer Science & Technology">Computer Science & Technology</option>
                      <option value="Artificial Intelligence & Machine Learning (AIML)">Artificial Intelligence & Machine Learning (AIML)</option>
                      <option value="Artificial Intelligence (AI)">Artificial Intelligence (AI)</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Civil Engineering">Civil Engineering</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                    </select>
                  </div>
                  <div className="form-group flex-1">
                    <label>Student Contact Phone (digits only)</label>
                    <input
                      type="text"
                      inputMode="tel"
                      placeholder="e.g. 9876543210"
                      value={studentForm.phone}
                      onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value.replace(/\D/g, '') })}
                    />
                  </div>
                </div>
                <div className="form-group" style={{ marginTop: '10px' }}>
                  <label>Class Assignment <span className="required">*</span></label>
                  <select
                    value={studentForm.classAssigned}
                    onChange={(e) => setStudentForm({ ...studentForm, classAssigned: e.target.value })}
                  >
                    <option value="D1">Class D1</option>
                    <option value="D2">Class D2</option>
                    <option value="D3">Class D3</option>
                    <option value="D4">Class D4</option>
                    <option value="D5">Class D5</option>
                    <option value="D6">Class D6</option>
                    <option value="D7">Class D7</option>
                  </select>
                </div>
                <div className="form-group" style={{ marginTop: '14px' }}>
                  <label>Login Password</label>
                  <input
                    type="text"
                    placeholder="Leave blank to auto-generate"
                    value={studentForm.password}
                    onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
                  />
                </div>

                <hr className="modal-divider" />
                <h4 className="modal-section-title">Guardian Information</h4>

                <div style={{ display: 'flex', gap: '12px', marginBottom: '14px' }}>
                  <div className="form-group" style={{ flex: 1, margin: 0 }}>
                    <label>Father's Name / Guardian</label>
                    <input
                      type="text"
                      placeholder="e.g. Harish Shah"
                      value={studentForm.fatherName}
                      onChange={(e) => setStudentForm({ ...studentForm, fatherName: e.target.value })}
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1, margin: 0 }}>
                    <label>Mother's Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Shardaben Shah"
                      value={studentForm.motherName}
                      onChange={(e) => setStudentForm({ ...studentForm, motherName: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-group" style={{ marginTop: '10px' }}>
                  <label>Guardian Contact Number (digits only)</label>
                  <input
                    type="text"
                    inputMode="tel"
                    placeholder="e.g. 9876543210"
                    value={studentForm.guardianContact}
                    onChange={(e) => setStudentForm({ ...studentForm, guardianContact: e.target.value.replace(/\D/g, '') })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="modal-btn-cancel"
                  onClick={() => setShowStudentModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="modal-btn-confirm">
                  Register Enrollment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECURITY RE-AUTHENTICATION MODAL */}
      {/* ============================================================ */}
      {showPasswordAuthModal && (
        <div className="modal-backdrop" style={{ zIndex: 9999 }}>
          <div className="modal-card animate-scale-up" style={{ maxWidth: '420px', backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff' }}>
            <div className="modal-header">
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#ffffff' }}>
                🔒 Security Verification
              </h3>
              <button
                type="button"
                className="close-modal-btn"
                onClick={() => setShowPasswordAuthModal(false)}
                style={{ color: '#ffffff' }}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleVerifyAdminPassword}>
              <div className="modal-body" style={{ padding: '20px' }}>
                <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '16px', lineHeight: '1.5' }}>
                  Please re-enter your <strong>Admin Password</strong> to verify your authorization before viewing stored user credentials.
                </p>
                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#e2e8f0' }}>
                    Admin Password <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="password"
                    required
                    autoFocus
                    placeholder="Enter your admin password"
                    value={adminAuthPassword}
                    onChange={(e) => {
                      setAdminAuthPassword(e.target.value);
                      setAdminAuthError('');
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      backgroundColor: 'rgba(255, 255, 255, 0.06)',
                      color: '#ffffff',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
                {adminAuthError && (
                  <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '8px', fontWeight: '600' }}>
                    {adminAuthError}
                  </p>
                )}
              </div>
              <div className="modal-footer" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <button
                  type="button"
                  className="modal-btn-cancel"
                  onClick={() => setShowPasswordAuthModal(false)}
                  style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'transparent', color: '#e2e8f0', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="modal-btn-confirm"
                  disabled={adminAuthLoading}
                  style={{ padding: '8px 18px', borderRadius: '6px', border: 'none', backgroundColor: '#0284c7', color: '#ffffff', fontWeight: '600', cursor: 'pointer' }}
                >
                  {adminAuthLoading ? 'Verifying...' : 'Verify & Reveal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
