import { jwtDecode } from 'jwt-decode'

export function isTokenValid(token) {
  try {
    const decode = jwtDecode(token)
    const now = Math.floor(Date.now() / 1000);
    return decode.exp && decode.exp > now;
  } catch (error) {
    console.error('Invalid token format:', error);
    return false;
  }
}