import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getAllUsers, sendRequest } from '../services/api';
import '../styles/Browse.css';

function Browse() {
  const { token, user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [mySkill, setMySkill] = useState('');
  const [theirSkill, setTheirSkill] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers(token);
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openRequestModal = (selectedUser) => {
    setSelectedUser(selectedUser);
    setShowModal(true);
    setMySkill('');
    setTheirSkill('');
    setMessage('');
  };

  const handleSendRequest = async (e) => {
    e.preventDefault();
    
    try {
      await sendRequest(token, {
        toUserId: selectedUser._id,
        fromUserSkill: mySkill,
        toUserSkill: theirSkill
      });
      
      setMessage('Request sent successfully!');
      setTimeout(() => {
        setShowModal(false);
        setMessage('');
      }, 2000);
    } catch (error) {
      setMessage(error.message);
    }
  };

  if (loading) return <div className="loading">Loading users...</div>;

  return (
    <div className="browse-page">
      <h2>Browse Users</h2>
      
      <div className="users-grid">
        {users.length === 0 ? (
          <p>No other users yet. Invite your friends!</p>
        ) : (
          users.map((otherUser) => (
            <div key={otherUser._id} className="user-card">
              <h3>{otherUser.name}</h3>
              <p className="email">{otherUser.email}</p>
              
              {otherUser.skillsOffered && otherUser.skillsOffered.length > 0 && (
                <div className="skills-preview">
                  <h4>Offers:</h4>
                  <ul>
                    {otherUser.skillsOffered.slice(0, 3).map((skill, index) => (
                      <li key={index}>{skill.title}</li>
                    ))}
                  </ul>
                </div>
              )}

              {otherUser.skillsWanted && otherUser.skillsWanted.length > 0 && (
                <div className="skills-preview">
                  <h4>Wants:</h4>
                  <ul>
                    {otherUser.skillsWanted.slice(0, 3).map((skill, index) => (
                      <li key={index}>{skill.title}</li>
                    ))}
                  </ul>
                </div>
              )}

              <button 
                onClick={() => openRequestModal(otherUser)}
                className="btn btn-primary"
              >
                Send Request
              </button>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Send Exchange Request to {selectedUser.name}</h3>
            <form onSubmit={handleSendRequest}>
              <div className="form-group">
                <label>I can teach:</label>
                <input
                  type="text"
                  value={mySkill}
                  onChange={(e) => setMySkill(e.target.value)}
                  placeholder="e.g., Guitar"
                  required
                />
              </div>

              <div className="form-group">
                <label>I want to learn:</label>
                <input
                  type="text"
                  value={theirSkill}
                  onChange={(e) => setTheirSkill(e.target.value)}
                  placeholder="e.g., Cooking"
                  required
                />
              </div>

              {message && <div className={message.includes('success') ? 'success' : 'error'}>
                {message}
              </div>}

              <div className="modal-buttons">
                <button type="submit" className="btn btn-primary">Send</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Browse;