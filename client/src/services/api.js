const API_URL = 'http://localhost:5000/api';

export const register = async (userData) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Registration failed');
  }

  return data;
};

export const login = async (credentials) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Login failed');
  }

  return data;
};

export const getMyProfile = async (token) => {
  const response = await fetch(`${API_URL}/user/profile`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch profile');
  }

  return data;
};

export const addSkill = async (token, skillData) => {
  const response = await fetch(`${API_URL}/user/skills`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(skillData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to add skill');
  }

  return data;
};

export const deleteSkill = async (token, skillId, type) => {
  const response = await fetch(`${API_URL}/user/skills/${skillId}?type=${type}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to delete skill');
  }

  return data;
};

export const getAllUsers = async (token) => {
  const response = await fetch(`${API_URL}/exchange/users`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch users');
  }

  return data;
};

export const sendRequest = async (token, requestData) => {
  const response = await fetch(`${API_URL}/exchange/request`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(requestData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to send request');
  }

  return data;
};

export const getRequests = async (token) => {
  const response = await fetch(`${API_URL}/exchange/requests`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch requests');
  }

  return data;
};

export const updateRequestStatus = async (token, requestId, status) => {
  const response = await fetch(`${API_URL}/exchange/request/${requestId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to update request');
  }

  return data;
};