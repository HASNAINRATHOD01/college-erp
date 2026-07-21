import { useState } from 'react';
import './Landing.css';
import ApiService from './apiService';

const ROLES = [
  { key: 'faculty', label: 'Faculty', hint: 'Faculty ID' },
  { key: 'student', label: 'Student', hint: 'Roll Number' },
];

export default function Landing({ onLogin }) {
  const [activeRole, setActiveRole] = useState('faculty');
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleRoleChange = (roleKey) => {
    setActiveRole(roleKey);
    setFormData({ username: '', password: '' });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const usernameInput = formData.username.trim();
    const passwordInput = formData.password.trim();

    if (!usernameInput || !passwordInput) {
      setError('Please fill in both fields.');
      return;
    }

    setError('');
    setSuccess('');

    try {
      // 1. Perform backend JWT login
      await ApiService.login(usernameInput, passwordInput);
      
      // 2. Fetch logged-in user profile details
      const me = await ApiService.getMe();
      
      const sessionUser = {
        role: me.role, // 'admin', 'faculty', 'student'
        username: me.username,
        email: me.email,
        id: me.id,
        name: me.first_name ? `${me.first_name} ${me.last_name || ''}`.trim() : me.username,
        dept: me.department || '',
        loggedInAt: new Date().toISOString()
      };

      localStorage.setItem('cms_current_user', JSON.stringify(sessionUser));
      setSuccess(`Logged in as ${me.role}. Loading portal dashboard...`);

      if (onLogin) {
        setTimeout(() => {
          onLogin(sessionUser);
        }, 400);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  const activeRoleData = ROLES.find((r) => r.key === activeRole);

  return (
    <div className={`home theme-${activeRole}`}>
      <nav className="navbar">
        <div className="navbar-brand">
          <span className="brand-mark">CMZ</span>
          <span className="brand-name">Campuzz</span>
        </div>
      </nav>

      <main className="hero">
        <section className="hero-info">

          <div>
            <p className="eyebrow">LJ University · Engineering Department</p>
            <h1>
              University<br />with a<br /><span className="accent">Difference.</span>
            </h1>
            <p className="hero-copy">
              Empowering the Engineering Department with seamless administration, grading, and academic tracking.
            </p>

            <ul className="feature-list">
              <li>
                <span className="feature-dot teal" />
                <div>
                  <strong>Faculty</strong>
                  <p>Manages attendance, grades, and course materials.</p>
                </div>
              </li>
              <li>
                <span className="feature-dot teal" />
                <div>
                  <strong>Student</strong>
                  <p>Views timetable, attendance, grades, and announcements.</p>
                </div>
              </li>
            </ul>
          </div>
          
          <footer className="hero-footer">
            <div className="footer-top">
              <span>© 2026 Student Management System · LJ Engineering</span>
              <span>·</span>
              <span>Developed by Group D7_7</span>
            </div>
            <div className="footer-links">
              <span>
                Akshat ~ <a href="https://github.com/aki-1o" target="_blank" rel="noreferrer">GitHub</a> | <a href="https://www.linkedin.com/in/akshat-thoriya-9536aa328/" target="_blank" rel="noreferrer">LinkedIn</a>
              </span>
              <span>
                Hasnain ~ <a href="https://github.com/HASNAINRATHOD01" target="_blank" rel="noreferrer">GitHub</a> | <a href="https://www.linkedin.com/in/hasnain-rathod-13172333b/" target="_blank" rel="noreferrer">LinkedIn</a>
              </span>
            </div>
          </footer>
        </section>

        <section className="login-card">
          <div className={`card-strip ${activeRole}`} />
          <div className="card-body">
            <div className="role-tabs">
              {ROLES.map((role) => (
                <button
                  key={role.key}
                  type="button"
                  className={`role-tab ${activeRole === role.key ? 'active' : ''}`}
                  onClick={() => handleRoleChange(role.key)}
                >
                  {role.label}
                </button>
              ))}
            </div>

            <h2>Sign in as {activeRoleData.label}</h2>
            <p className="card-subtext">
              Only admins can create faculty & student accounts.
            </p>

            <form onSubmit={handleSubmit} className="login-form">
              <label>
                {activeRoleData.hint}
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder={`Enter your ${activeRoleData.hint.toLowerCase()}`}
                  autoComplete="username"
                />
              </label>

              <label>
                Password
                <div className="password-input-container">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                    )}
                  </button>
                </div>
              </label>

              {error && <p className="form-error">{error}</p>}
              {success && <p className="form-success">{success}</p>}

              <button type="submit" className="submit-btn">
                Login
              </button>
            </form>

            <p className="card-footnote">
              Default password format: <code>name + roll no.</code>
              <br />
              Admin? Use the Faculty tab with your admin credentials.
            </p>
          </div>
        </section>

        
      </main>
    </div>
  );
}