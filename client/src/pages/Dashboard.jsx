import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

function Dashboard() {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <nav className="navbar">
        <h1 onClick={() => navigate('/dashboard')}>SkillSwap</h1>
        <div className="nav-links">
          <button onClick={() => navigate('/dashboard')} className="nav-btn">
            Dashboard
          </button>
          <button onClick={() => navigate('/skills')} className="nav-btn">
            My Skills
          </button>
          <button onClick={() => navigate('/browse')} className="nav-btn">
            Browse Users
          </button>
          <button onClick={() => navigate('/requests')} className="nav-btn">
            Requests
          </button>
          <span>Welcome, {user?.name}!</span>
          <button onClick={handleLogout} className="btn btn-primary">
            Logout
          </button>
        </div>
      </nav>

      <div className="container">
        <h2>Dashboard</h2>
        <div className="dashboard-cards">
          <div className="card" onClick={() => navigate('/skills')}>
            <h3>My Skills</h3>
            <p>Manage the skills you offer and want to learn</p>
          </div>
          <div className="card" onClick={() => navigate('/browse')}>
            <h3>Browse Users</h3>
            <p>Find people to exchange skills with</p>
          </div>
          <div className="card" onClick={() => navigate('/requests')}>
            <h3>Requests</h3>
            <p>View and manage skill exchange requests</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;