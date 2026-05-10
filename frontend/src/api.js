const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

const token = () => localStorage.getItem("lappal_token");

const headers = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token()}`,
});

const buildUrl = (endpoint) => {
  if (endpoint.startsWith("http")) {
    return endpoint;
  }

  return `${BASE_URL}${endpoint}`;
};

export const api = {
  get: async (endpoint) => {
    const res = await fetch(buildUrl(endpoint), {
      headers: headers(),
    });

    if (!res.ok) throw new Error("API request failed");

    return await res.json();
  },

  post: async (endpoint, body) => {
    const res = await fetch(buildUrl(endpoint), {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error("API request failed");

    return await res.json();
  },

  put: async (endpoint, body) => {
    const res = await fetch(buildUrl(endpoint), {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error("API request failed");

    return await res.json();
  },

  delete: async (endpoint) => {
    const res = await fetch(buildUrl(endpoint), {
      method: "DELETE",
      headers: headers(),
    });

    if (!res.ok) throw new Error("API request failed");

    return await res.json();
  },
};