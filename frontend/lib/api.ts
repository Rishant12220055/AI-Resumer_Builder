const API_BASE_URL = 'https://ai-resumer-builder-backend.vercel.app/api';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Resume {
  _id: string;
  user_id: string;
  title: string;
  template: string;
  personalInfo?: PersonalInfo;
  experiences?: Experience[];
  educations?: Education[];
  skills?: Skill[];
  projects?: Project[];
  certifications?: Certification[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PersonalInfo {
  _id?: string;
  resume_id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  linkedin?: string;
  github?: string;
  website?: string;
  summary?: string;
}

export interface Experience {
  _id?: string;
  resume_id?: string;
  company: string;
  position: string;
  duration: string;
  bullets: string[];
}

export interface Education {
  _id?: string;
  resume_id?: string;
  institution: string;
  degree: string;
  duration: string;
  achievements: string[];
}

export interface Skill {
  _id?: string;
  resume_id?: string;
  name: string;
  level: string;
}

export interface Project {
  _id?: string;
  resume_id?: string;
  name: string;
  description: string;
  technologies: string;
  link: string;
}

export interface Certification {
  _id?: string;
  resume_id?: string;
  name: string;
  issuer: string;
  date: string;
  link: string;
}

export interface AISuggestion {
  suggestion: string;
  type: 'experience' | 'education' | 'skill' | 'project' | 'summary';
}

// API Client Class
class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    // Initialize token from localStorage
    this.initializeToken();
  }

  private initializeToken() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    // Get the current token (in case it was updated elsewhere)
    const currentToken = this.getToken();
    if (currentToken) {
      headers.Authorization = `Bearer ${currentToken}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  getToken(): string | null {
    // Always get the latest token from localStorage
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('auth_token');
      // Update the instance token if it's different
      if (storedToken !== this.token) {
        this.token = storedToken;
      }
      return storedToken;
    }
    return this.token;
  }

  async signup(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.setToken(response.token);
    return response;
  }

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.setToken(response.token);
    return response;
  }

  async logout(): Promise<void> {
    this.clearToken();
  }

  async getGoogleAuthUrl(): Promise<{ url: string }> {
    return this.request<{ url: string }>('/auth/google/url');
  }

  async getGithubAuthUrl(): Promise<{ url: string }> {
    return this.request<{ url: string }>('/auth/github/url');
  }

  // Resume methods
  async getResumes(): Promise<Resume[]> {
    return this.request<Resume[]>('/resumes');
  }

  async getResume(id: string): Promise<Resume> {
    return this.request<Resume>(`/resumes/${id}`);
  }

  async createResume(data: { title?: string; template?: string }): Promise<Resume> {
    return this.request<Resume>('/resumes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateResume(id: string, data: Partial<Resume>): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/resumes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteResume(id: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/resumes/${id}`, {
      method: 'DELETE',
    });
  }

  // AI Suggestions
  async getAISuggestions(data: {
    context: string;
    company?: string;
    position?: string;
    duration?: string;
    institution?: string;
    degree?: string;
    industry?: string;
    projectName?: string;
    name?: string;
  }): Promise<{ suggestions: string[] }> {
    return this.request<{ suggestions: string[] }>('/ai-suggest', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Health checks
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request<{ status: string; timestamp: string }>('/health');
  }

  async mongoHealthCheck(): Promise<{ status: string; database: string; timestamp: string }> {
    return this.request<{ status: string; database: string; timestamp: string }>('/mongo-health');
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient();

// Export the class for testing or custom instances
export { ApiClient };

// Convenience functions for common operations
export const api = {
  // Auth
  signup: (data: Parameters<typeof apiClient.signup>[0]) => apiClient.signup(data),
  login: (data: Parameters<typeof apiClient.login>[0]) => apiClient.login(data),
  logout: () => apiClient.logout(),
  getGoogleAuthUrl: () => apiClient.getGoogleAuthUrl(),
  getGithubAuthUrl: () => apiClient.getGithubAuthUrl(),
  
  // Resumes
  getResumes: () => apiClient.getResumes(),
  getResume: (id: string) => apiClient.getResume(id),
  createResume: (data: Parameters<typeof apiClient.createResume>[0]) => apiClient.createResume(data),
  updateResume: (id: string, data: Parameters<typeof apiClient.updateResume>[1]) => apiClient.updateResume(id, data),
  deleteResume: (id: string) => apiClient.deleteResume(id),
  
  // AI
  getAISuggestions: (data: Parameters<typeof apiClient.getAISuggestions>[0]) => apiClient.getAISuggestions(data),
  
  // Health
  healthCheck: () => apiClient.healthCheck(),
  mongoHealthCheck: () => apiClient.mongoHealthCheck(),
  
  // Token management
  setToken: (token: string) => apiClient.setToken(token),
  getToken: () => apiClient.getToken(),
  clearToken: () => apiClient.clearToken(),
}; 