import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getRequests, updateRequestStatus } from '../services/api';
import '../styles/Requests.css';

function Requests() {
  const { token } = useContext(AuthContext);
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const data = await getRequests(token);
      setSentRequests(data.sent);
      setReceivedRequests(data.received);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId, status) => {
    try {
      await updateRequestStatus(token, requestId, status);
      fetchRequests();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="loading">Loading requests...</div>;

  return (
    <div className="requests-page">
      <h2>My Requests</h2>

      <div className="requests-section">
        <h3>Received Requests</h3>
        {receivedRequests.length === 0 ? (
          <p>No requests received yet.</p>
        ) : (
          <div className="requests-list">
            {receivedRequests.map((request) => (
              <div key={request._id} className="request-card">
                <div className="request-header">
                  <h4>{request.fromUser.name}</h4>
                  <span className={`status ${request.status}`}>{request.status}</span>
                </div>
                <p className="email">{request.fromUser.email}</p>
                <div className="exchange-info">
                  <p><strong>They offer:</strong> {request.fromUserSkill}</p>
                  <p><strong>They want:</strong> {request.toUserSkill}</p>
                </div>
                {request.status === 'pending' && (
                  <div className="request-actions">
                    <button 
                      onClick={() => handleStatusUpdate(request._id, 'accepted')}
                      className="btn btn-success"
                    >
                      Accept
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(request._id, 'rejected')}
                      className="btn btn-danger"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="requests-section">
        <h3>Sent Requests</h3>
        {sentRequests.length === 0 ? (
          <p>No requests sent yet.</p>
        ) : (
          <div className="requests-list">
            {sentRequests.map((request) => (
              <div key={request._id} className="request-card">
                <div className="request-header">
                  <h4>{request.toUser.name}</h4>
                  <span className={`status ${request.status}`}>{request.status}</span>
                </div>
                <p className="email">{request.toUser.email}</p>
                <div className="exchange-info">
                  <p><strong>You offered:</strong> {request.fromUserSkill}</p>
                  <p><strong>You want:</strong> {request.toUserSkill}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Requests;