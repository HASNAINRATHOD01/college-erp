import { useState, useEffect } from 'react'
import './App.css'
import Landing from './Landing'
import AdminDashboard from './AdminDashboard'
import FacultyDashboard from './FacultyDashboard'
import StudentDashboard from './StudentDashboard'

function App() {
  const [user, setUser] = useState(null)
  const [studentNotices, setStudentNotices] = useState([])

  useEffect(() => {
    const session = localStorage.getItem('cms_current_user')
    if (session) {
      try {
        setUser(JSON.parse(session))
      } catch (e) {
        console.error('Error parsing session:', e)
      }
    }
  }, [])

  useEffect(() => {
    if (user && user.role === 'student') {
      const localNotices = localStorage.getItem('cms_student_notices');
      const allNotices = localNotices ? JSON.parse(localNotices) : [];
      const filtered = allNotices.filter(
        n => n.studentId === 'all' || (user.username && String(n.studentId) === String(user.username))
      );
      setStudentNotices(filtered.reverse());
    }
  }, [user]);

  const handleLogin = (sessionUser) => {
    setUser(sessionUser)
  }

  const handleLogout = () => {
    localStorage.removeItem('cms_current_user')
    setUser(null)
  }

  return (
    <>
      {user && user.role === 'admin' ? (
        <AdminDashboard user={user} onLogout={handleLogout} />
      ) : user && user.role === 'faculty' ? (
        <FacultyDashboard user={user} onLogout={handleLogout} />
      ) : user ? (
        <StudentDashboard user={user} onLogout={handleLogout} />
      ) : (
        <Landing onLogin={handleLogin} />
      )}
    </>
  )
}

export default App

