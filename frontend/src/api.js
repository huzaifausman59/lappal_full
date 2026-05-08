// const BASE_URL = "http://localhost:3000";

// export const api = {
//   get: async (endpoint) => {
//     const res = await fetch(BASE_URL + endpoint);

//     if (!res.ok) {
//       throw new Error("API request failed");
//     }

//     return await res.json();
//   },
// };

const BASE_URL = "http://localhost:3000";
const token = () => localStorage.getItem("lappal_token");

const headers = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token()}`,
});

export const api = {
  get: async (endpoint) => {
    const res = await fetch(BASE_URL + endpoint, { headers: headers() });
    if (!res.ok) throw new Error("API request failed");
    return await res.json();
  },

  post: async (endpoint, body) => {
    const res = await fetch(BASE_URL + endpoint, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error("API request failed");
    return await res.json();
  },

  put: async (endpoint, body) => {
    const res = await fetch(BASE_URL + endpoint, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error("API request failed");
    return await res.json();
  },

  delete: async (endpoint) => {
    const res = await fetch(BASE_URL + endpoint, {
      method: "DELETE",
      headers: headers(),
    });
    if (!res.ok) throw new Error("API request failed");
    return await res.json();
  },
};