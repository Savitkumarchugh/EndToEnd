const BASE_URL = "https://gym-2e9s.onrender.com";

export const API = {
  FETCH_ALL_USERS: `${BASE_URL}/users`,
  CREATE_CLIENT: `${BASE_URL}/clients`,
  GET_CLIENT: (name) => `${BASE_URL}/clients/${name}`,
  ADD_WORKOUT: (name) => `${BASE_URL}/clients/${name}/workout`,
  GET_EXERCISES: (name) => `${BASE_URL}/clients/${name}/exercises`,
};