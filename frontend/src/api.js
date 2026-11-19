const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.token
        ? { Authorization: `Bearer ${options.token}` }
        : {}),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.error || data.message || "Something went wrong. Please try again."
    );
  }

  return data;
}

export function registerUser(userData) {
  return apiRequest("/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export function loginUser(userData) {
  return apiRequest("/login", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export function getCurrentUser(token) {
  return apiRequest("/me", {
    method: "GET",
    token,
  });
}

export function updateCurrentUser(token, profileData) {
  return apiRequest("/me", {
    method: "PUT",
    token,
    body: JSON.stringify(profileData),
  });
}
export function getRewards(token) {
  return apiRequest("/rewards", {
    method: "GET",
    token,
  });
}

export function getRewardActivity(token) {
  return apiRequest("/reward-activity", {
    method: "GET",
    token,
  });
}

export function getAchievements(token) {
  return apiRequest("/achievements", {
    method: "GET",
    token,
  });
}

