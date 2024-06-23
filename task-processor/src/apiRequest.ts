import axios from 'axios';

interface ApiResponse {
  phone_h: string;
  sport: string;
}

async function makeApiRequest(apiUrl: string): Promise<ApiResponse> {
  const gender = Math.random() < 0.5 ? 'male' : 'female';
  const response = await axios.get(`${apiUrl}/${gender}`);
  return response.data as ApiResponse;
}

export { makeApiRequest, ApiResponse };
