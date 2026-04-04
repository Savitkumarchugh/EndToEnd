// const BASE_URL = "https://a1-gym-backend.onrender.com";

const BASE_URL = "http://127.0.0.1:5000";

export const MEMBERS_API = {
  FETCH_ALL_USERS: `${BASE_URL}/users`,
  FETCH_SINGLE_USER: (name) => `${BASE_URL}/users/${name}`,
  // UPDATE_SINGLE_USER: (name) => `${BASE_URL}/users/${name}`,
    UPDATE_SINGLE_USER: (phone) =>
    `${BASE_URL}/users/${phone}`,
  FETCH_PAYMENTS: `${BASE_URL}/payments`,
  UPDATE_SINGLE_USER: (number) => `${BASE_URL}/users/${number}`,
  RENEW_SINGLE_USER: (number) => `${BASE_URL}/users/${number}/renew`,
  LOGIN: `${BASE_URL}/login`,
  SIGNUP: `${BASE_URL}/signup`, 
};

export const TRAINERS_API = {
  FETCH_CLIENTS: `${BASE_URL}/clients`,
  FETCH_CLIENT_DETAILS: (name) => `${BASE_URL}/clients/${name}`,
  ADD_CLIENT: `${BASE_URL}/clients`,
  FETCH_CLIENT_EXERCISES: (name) => `${BASE_URL}/clients/${name}/exercises`,
  HANDLE_CREATE_PLAN: (name) =>  `${BASE_URL}/clients/${name}/plan`,
  HANDLE_ADD_PLAN: (selectedClient) => `${BASE_URL}/clients/${selectedClient}/workout`
};




