const BASE_URL = "http://localhost:3000";

export const api = {
  get: async (endpoint) => {
    const res = await fetch(BASE_URL + endpoint);

    if (!res.ok) {
      throw new Error("API request failed");
    }

    return await res.json();
  },
};