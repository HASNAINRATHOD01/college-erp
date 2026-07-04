import { useState } from 'react';
import './Home.css';

const ROLES = [
  { key: 'faculty', label: 'Faculty', hint: 'Faculty ID' },
  { key: 'student', label: 'Student', hint: 'Roll Number' },
];

export default function Home() {
  const [activeRole, setActiveRole] = useState('faculty');
  const [formData, setFormData] = useState({ username: '', password: '' });
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.username.trim() || !formData.password.trim()) {
      setError('Please fill in both fields.');
      return;
    }

    // TEMPORARY: admin has no separate tab — it's detected via credentials
    // entered on the Faculty tab. Replace this check once Django auth exists.
    const isAdminLogin =
      activeRole === 'faculty' &&
      formData.username.trim().toLowerCase() === 'admin123' &&
      formData.password === 'admin123';

    const resolvedRole = isAdminLogin ? 'admin' : activeRole;

    const sessionUser = {
      role: resolvedRole,
      username: formData.username.trim(),
      password: formData.password, // plaintext for now — replace once real auth exists
      loggedInAt: new Date().toISOString(),
    };

    localStorage.setItem('cms_current_user', JSON.stringify(sessionUser));

    setError('');
    setSuccess(`Logged in as ${resolvedRole}. (Temporary session saved locally.)`);

    console.log('Temporary session saved:', sessionUser);
  };

  const activeRoleData = ROLES.find((r) => r.key === activeRole);

  return (
    <div className="home">
      <nav className="navbar">
        <div className="navbar-brand">
          <span className="brand-mark">CMS</span>
          <span className="brand-name">College Management System</span>
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
                <span className="feature-dot skyblue" />
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
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
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