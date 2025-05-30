export const API_URL = process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_API_URL : 'http://localhost:8000/api/v1';
export const API_URL_V2 = process.env.NODE_ENV === 'production' ? 'https://api.lawstack.me/api/v2' : 'http://localhost:8000/api/v2';
