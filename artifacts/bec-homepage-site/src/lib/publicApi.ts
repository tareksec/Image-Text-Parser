export interface CommunityStats {
  id: number;
  key: string;
  label: string;
  value: string;
  icon: string | null;
  displayOrder: number;
}

export interface Member {
  id: number;
  fullName: string;
  designation: string | null;
  company: string | null;
  tier: 'basic' | 'professional' | 'corporate';
}

export interface Review {
  id: number;
  name: string;
  designation: string | null;
  company: string | null;
  rating: number;
  message: string;
  createdAt: string;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  category: string;
  content: string;
  coverImageUrl: string | null;
  tags: string;
  createdAt: string;
}

export interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  venue: string;
  seats: number | null;
  registrationLink: string | null;
  description: string;
}

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`/api${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

export const publicApi = {
  community: {
    getStats: () => fetchApi<{ stats: CommunityStats[] }>('/public/community/stats'),
    getMembers: () => fetchApi<{ members: Member[] }>('/public/community/members'),
  },
  reviews: {
    getApproved: () => fetchApi<{ reviews: Review[] }>('/public/reviews'),
    submit: (review: { name: string; designation?: string; company?: string; rating: number; message: string }) => 
      fetchApi<{ review: Review }>('/public/reviews', {
        method: 'POST',
        body: JSON.stringify(review),
      }),
  },
  events: {
    getAll: () => fetchApi<{ events: Event[] }>('/public/events'),
    register: (eventId: number, registration: { name: string; email: string; phone?: string }) => 
      fetchApi<{ registration: any }>(`/public/events/${eventId}/register`, {
        method: 'POST',
        body: JSON.stringify(registration),
      }),
  },
  posts: {
    getAll: () => fetchApi<{ posts: Post[] }>('/public/posts'),
  },
  newsletter: {
    subscribe: (email: string) => 
      fetchApi<{ message: string }>('/public/newsletter', {
        method: 'POST',
        body: JSON.stringify({ email }),
      }),
  },
  contact: {
    submit: (message: { name: string; email: string; phone?: string; subject: string; message: string }) => 
      fetchApi<{ message: string }>('/public/contact', {
        method: 'POST',
        body: JSON.stringify(message),
      }),
  },
  members: {
    join: (member: { fullName: string; email: string; phone?: string; company?: string; designation?: string; tier: 'basic' | 'professional' | 'corporate'; message?: string }) => 
      fetchApi<{ message: string }>('/public/members', {
        method: 'POST',
        body: JSON.stringify(member),
      }),
  },
};
