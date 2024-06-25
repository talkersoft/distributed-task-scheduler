import axios from 'axios';

interface ApiResponse {
  phone_h: string;
  sport: string;
}

async function makeNotificationApiRequest(apiUrl: string): Promise<ApiResponse> {
  const gender = Math.random() < 0.5 ? 'male' : 'female';
  const response = await axios.get(`${apiUrl}/${gender}`);
  return response.data as ApiResponse;
}

async function makeReminderApiRequest(apiUrl: string): Promise<ApiResponse> {
  const response1 = await axios.get(`${apiUrl}/male`);
  const response2 = await axios.get(`${apiUrl}/female`);

  const chosenResponse = Math.random() < 0.5 ? response1 : response2;
  return chosenResponse.data as ApiResponse;
}

export { makeNotificationApiRequest, makeReminderApiRequest, ApiResponse };
