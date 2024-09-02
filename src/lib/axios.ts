import axios from 'axios';

// by default axios already has acces to localhost:300
// so we dont need to put full url here
export const api = axios.create({
  baseURL: '/api',
});
