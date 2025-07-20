const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export async function fetchSensors() {
  const res = await fetch(`${API_BASE_URL}/sensors`);
  if (!res.ok) throw new Error("Failed to fetch sensors");
  return res.json();
}

// Add more API functions as needed 