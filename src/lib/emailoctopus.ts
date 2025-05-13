const EMAIL_OCTOPUS_API_URL = 'https://emailoctopus.com/api/1.6';

interface EmailOctopusErrorDetail {
  code: string;
  message: string;
}

interface EmailOctopusErrorResponse {
  error: EmailOctopusErrorDetail;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const apiKey = process.env.NEXT_PUBLIC_EMAIL_OCTOPUS_API_KEY;
  if (!apiKey) {
    console.log("apiKey", apiKey)
    throw new Error('EmailOctopus API key is not configured.');
  }

  const url = `${EMAIL_OCTOPUS_API_URL}${endpoint}`;
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: options.body ? JSON.stringify({
      ...JSON.parse(options.body as string),
      api_key: apiKey,
    }) : JSON.stringify({ api_key: apiKey }),
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorData: EmailOctopusErrorResponse = await response.json();
    console.error('EmailOctopus API Error:', errorData);
    throw new Error(errorData.error.message || 'EmailOctopus API request failed');
  }

  // For POST/PUT/PATCH requests that might return no content on success (204)
  if (response.status === 204 && (options.method === 'POST' || options.method === 'PUT' || options.method === 'PATCH')) {
    return {} as T; // Or an appropriate success indicator if needed
  }
  
  // For GET requests or others that return content
  if (response.headers.get('content-length') === '0') {
    return {} as T;
  }

  return response.json() as Promise<T>;
}

interface AddContactPayload {
  email_address: string;
  fields?: {
    FirstName?: string;
    LastName?: string;
    [key: string]: string | undefined;
  };
  tags?: string[];
  status?: 'SUBSCRIBED' | 'UNSUBSCRIBED' | 'PENDING';
}

// Define a more specific type for the response if known, otherwise use unknown or a generic
interface AddContactResponse {
  // Example: id: string; email_address: string; status: string;
  [key: string]: unknown; // Placeholder for actual response structure
}

export const emailOctopus = {
  addContactToList: (listId: string, payload: AddContactPayload) => {
    if (!listId) {
      throw new Error('EmailOctopus List ID is required to add a contact.');
    }
    const endpoint = `/lists/${listId}/contacts`;
    return request<AddContactResponse>(endpoint, { 
      method: 'POST', 
      body: JSON.stringify(payload) 
    });
  },
  // Preserve the generic post method if it's still needed, or remove if specialized methods cover all use cases
  post: <T = unknown>(endpoint: string, body: Record<string, unknown>) => 
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  // Add other methods like get, put, delete if needed later
}; 