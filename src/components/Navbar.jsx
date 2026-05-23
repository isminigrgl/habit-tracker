import { Link, useNavigate, useLocation } from 'react-router-dom'

const links = [
  { to: '/habits',     label: 'Habits',     icon: '✅' },
  { to: '/categories', label: 'Categories', icon: '🏷️' },
  { to: '/goals',      label: 'Goals',      icon: '🎯' },
  { to: '/reports',    label: 'Reports',    icon: '📊' },
]

export default function Navbar() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const user      = JSON.parse(localStorage.getItem('user') || '{}')
  const initials  = user.username
    ? user.username.slice(0, 2).toUpperCase()
    : '?'

  function handleLogout() {
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <span className="navbar-brand">Habit Tracker</span>

      <div className="navbar-links">
        {links.map(({ to, label, icon }) => (
          <Link
            key={to}
            to={to}
            className={`nav-link ${location.pathname === to ? 'active' : ''}`}
          >
            <span className="nav-icon">{icon}</span>
            {label}
          </Link>
        ))}
      </div>

      <div className="navbar-user">
        <div className="avatar">{initials}</div>
        <span className="username">{user.username}</span>
        <button className="logout-btn" onClick={handleLogout} title="Logout">
          ⬡ Logout
        </button>
      </div>
    </nav>
  )
}
