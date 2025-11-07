import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getMyProfile, addSkill, deleteSkill } from '../services/api';
import '../styles/Skills.css';

function Skills() {
  const { token } = useContext(AuthContext);
  const [skillsOffered, setSkillsOffered] = useState([]);
  const [skillsWanted, setSkillsWanted] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [skillType, setSkillType] = useState('offered');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const data = await getMyProfile(token);
      setSkillsOffered(data.skillsOffered || []);
      setSkillsWanted(data.skillsWanted || []);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await addSkill(token, { ...formData, type: skillType });
      setFormData({ title: '', description: '', category: '' });
      setShowModal(false);
      fetchSkills();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (skillId, type) => {
    try {
      await deleteSkill(token, skillId, type);
      fetchSkills();
    } catch (err) {
      setError(err.message);
    }
  };

  const openModal = (type) => {
    setSkillType(type);
    setShowModal(true);
  };

  return (
    <div className="skills-page">
      <h2>My Skills</h2>

      <div className="skills-section">
        <div className="section-header">
          <h3>Skills I Offer</h3>
          <button onClick={() => openModal('offered')} className="btn btn-primary">
            Add Skill
          </button>
        </div>

        <div className="skills-grid">
          {skillsOffered.length === 0 ? (
            <p>No skills offered yet. Add your first skill!</p>
          ) : (
            skillsOffered.map((skill) => (
              <div key={skill._id} className="skill-card">
                <h4>{skill.title}</h4>
                <p className="category">{skill.category}</p>
                <p>{skill.description}</p>
                <button 
                  onClick={() => handleDelete(skill._id, 'offered')}
                  className="btn-delete"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="skills-section">
        <div className="section-header">
          <h3>Skills I Want to Learn</h3>
          <button onClick={() => openModal('wanted')} className="btn btn-primary">
            Add Skill
          </button>
        </div>

        <div className="skills-grid">
          {skillsWanted.length === 0 ? (
            <p>No skills wanted yet. Add what you want to learn!</p>
          ) : (
            skillsWanted.map((skill) => (
              <div key={skill._id} className="skill-card">
                <h4>{skill.title}</h4>
                <p className="category">{skill.category}</p>
                <p>{skill.description}</p>
                <button 
                  onClick={() => handleDelete(skill._id, 'wanted')}
                  className="btn-delete"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Add {skillType === 'offered' ? 'Skill I Offer' : 'Skill I Want'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  placeholder="e.g., Music, Cooking, Programming"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                />
              </div>

              {error && <div className="error">{error}</div>}

              <div className="modal-buttons">
                <button type="submit" className="btn btn-primary">Add</button>
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

export default Skills;