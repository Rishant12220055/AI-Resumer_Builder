const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface LoginResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  token: string;
}

export interface AuthError {
  error: string;
}

export interface GoogleAuthUrlResponse {
  url: string;
}

export interface GitHubAuthUrlResponse {
  url: string;
}

export interface AISuggestionRequest {
  context: 'resume_bullet_point' | 'education_achievement' | 'skills_suggestion' | 'project_description' | 'certification_suggestion' | 'about_me_description';
  company?: string;
  position?: string;
  duration?: string;
  institution?: string;
  degree?: string;
  industry?: string;
  projectName?: string;
  name?: string;
}

export interface AISuggestionResponse {
  suggestions: string[];
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network error' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error');
    }
  }

  // Login with email and password
  async login(email: string, password: string): Promise<LoginResponse> {
    return this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // Signup with user details
  async signup(firstName: string, lastName: string, email: string, password: string): Promise<LoginResponse> {
    return this.request<LoginResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ firstName, lastName, email, password }),
    });
  }

  // Get Google OAuth URL
  async getGoogleAuthUrl(): Promise<GoogleAuthUrlResponse> {
    return this.request<GoogleAuthUrlResponse>('/auth/google/url');
  }

  // Get GitHub OAuth URL
  async getGitHubAuthUrl(): Promise<GitHubAuthUrlResponse> {
    return this.request<GitHubAuthUrlResponse>('/auth/github/url');
  }

  // Logout
  async logout(token: string): Promise<{ message: string }> {
    return this.request<{ message: string }>('/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // AI Suggestions
  async getAISuggestions(request: AISuggestionRequest): Promise<AISuggestionResponse> {
    return this.request<AISuggestionResponse>('/ai-suggest', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

// Token management utilities - Only use these in useEffect or event handlers
export const tokenStorage = {
  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  },

  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  },

  removeToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  },

  setUser: (user: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_user', JSON.stringify(user));
    }
  },

  getUser: () => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('auth_user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  },

  removeUser: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_user');
    }
  },

  clearAuth: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
  }
}; 