import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Habits from './pages/Habits'
import Categories from './pages/Categories'
import Goals from './pages/Goals'
import Reports from './pages/Reports'

function PrivateRoute({ children }) {
  const user = localStorage.getItem('user')
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/*" element={
          <PrivateRoute>
            <>
              <Navbar />
              <Routes>
                <Route path="/habits"     element={<Habits />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/goals"      element={<Goals />} />
                <Route path="/reports"    element={<Reports />} />
                <Route path="*"           element={<Navigate to="/habits" replace />} />
              </Routes>
            </>
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}
