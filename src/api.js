// API Client for SkillStack Tutor Management Platform

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

class ApiClient {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  getToken() {
    return localStorage.getItem('kalari_access_token');
  }

  setTokens(access, refresh) {
    if (access) localStorage.setItem('kalari_access_token', access);
    if (refresh) localStorage.setItem('kalari_refresh_token', refresh);
  }

  clearTokens() {
    localStorage.removeItem('kalari_access_token');
    localStorage.removeItem('kalari_refresh_token');
    localStorage.removeItem('kalari_user');
  }

  getUser() {
    const u = localStorage.getItem('kalari_user');
    return u ? JSON.parse(u) : null;
  }

  setUser(user) {
    if (user) {
      localStorage.setItem('kalari_user', JSON.stringify(user));
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (response.status === 401 && !options._retry && localStorage.getItem('kalari_refresh_token')) {
        // Try refreshing token
        const refreshed = await this.refreshToken();
        if (refreshed) {
          options._retry = true;
          return this.request(endpoint, options);
        } else {
          this.clearTokens();
          window.dispatchEvent(new CustomEvent('auth:logout'));
        }
      }

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const error = new Error(data.detail || data.error || 'Request failed');
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (err) {
      throw err;
    }
  }

  async refreshToken() {
    const refresh = localStorage.getItem('kalari_refresh_token');
    if (!refresh) return false;

    try {
      const res = await fetch(`${this.baseUrl}/auth/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh }),
      });
      if (res.ok) {
        const data = await res.json();
        this.setTokens(data.access, refresh);
        return true;
      }
    } catch (e) {
      console.error('Refresh token error', e);
    }
    return false;
  }

  // Auth Methods
  async login(username, password) {
    const data = await this.request('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    this.setTokens(data.access, data.refresh);
    const user = data.user || await this.getMe();
    this.setUser(user);
    return user;
  }

  async studentLogin(identifier, pin) {
    const data = await this.request('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ identifier, secret: pin }),
    });
    this.setTokens(data.access, data.refresh);
    const user = data.user || await this.getMe();
    this.setUser(user);
    return user;
  }

  async studentRegister(studentData) {
    return this.request('/auth/student-register/', {
      method: 'POST',
      body: JSON.stringify(studentData),
    });
  }

  async register(userData) {
    return this.request('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getMe() {
    return this.request('/auth/me/');
  }

  async checkHealth() {
    try {
      return await this.request('/health/');
    } catch (e) {
      return { status: 'offline', error: e.message };
    }
  }

  // Subjects (Courses)
  async getSubjects() {
    return this.request('/subjects/');
  }

  async getSubject(slug) {
    return this.request(`/subjects/${slug}/`);
  }

  // Curriculum
  async getCurriculum(subjectSlug = '') {
    return this.request(`/curriculum/${subjectSlug ? '?subject=' + subjectSlug : ''}`);
  }

  async getTopic(topicId) {
    return this.request(`/curriculum/topics/${topicId}/`);
  }

  async getProblem(problemId) {
    return this.request(`/curriculum/problems/${problemId}/`);
  }

  // Submissions (Student)
  async submitSolution(problemId, code, language = 'python', batchId = null, notes = '') {
    return this.request(`/problems/${problemId}/submit/`, {
      method: 'POST',
      body: JSON.stringify({
        code,
        language,
        batch_id: batchId,
        notes,
      }),
    });
  }

  async testRunCode(problemId, code, language = 'python', expectedOutput = '') {
    return this.request(`/problems/${problemId}/test-run/`, {
      method: 'POST',
      body: JSON.stringify({
        code,
        language,
        expected_output: expectedOutput,
      }),
    });
  }

  async getMySubmissions() {
    return this.request('/my-submissions/');
  }

  // Staff Controls
  async updateProblemAccess(problemId, isUnlocked, deadline, allowLate = false) {
    return this.request(`/staff/problems/${problemId}/access/`, {
      method: 'POST',
      body: JSON.stringify({
        is_unlocked: isUnlocked,
        deadline: deadline || null,
        allow_late_submission: allowLate,
      }),
    });
  }

  async bulkUnlockModule(moduleId, isUnlocked, deadline) {
    return this.request('/staff/modules/unlock/', {
      method: 'POST',
      body: JSON.stringify({
        module_id: moduleId,
        is_unlocked: isUnlocked,
        deadline: deadline || null,
      }),
    });
  }

  async getStaffSubmissions(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/staff/submissions/${query ? '?' + query : ''}`);
  }

  async reviewSubmission(submissionId, status, score, staffFeedback) {
    return this.request(`/staff/submissions/${submissionId}/review/`, {
      method: 'POST',
      body: JSON.stringify({
        status,
        score,
        staff_feedback: staffFeedback,
      }),
    });
  }

  async getStaffAnalytics() {
    return this.request('/staff/analytics/');
  }

  async getStudents() {
    return this.request('/staff/students/');
  }

  // Staff CRUD Operations
  async createModule(data) {
    return this.request('/staff/modules/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateModule(id, data) {
    return this.request(`/staff/modules/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteModule(id) {
    return this.request(`/staff/modules/${id}/`, {
      method: 'DELETE',
    });
  }

  async createTopic(data) {
    return this.request('/staff/topics/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTopic(id, data) {
    return this.request(`/staff/topics/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTopic(id) {
    return this.request(`/staff/topics/${id}/`, {
      method: 'DELETE',
    });
  }

  async createProblem(data) {
    return this.request('/staff/problems/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProblem(id, data) {
    return this.request(`/staff/problems/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProblem(id) {
    return this.request(`/staff/problems/${id}/`, {
      method: 'DELETE',
    });
  }

  async createStudent(data) {
    return this.request('/staff/students/create/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteStudent(id) {
    return this.request(`/staff/students/${id}/`, {
      method: 'DELETE',
    });
  }

  // Staff Faculty Team (Admin)
  async getStaffFaculty() {
    return this.request('/staff/faculty/');
  }

  async createStaffFaculty(data) {
    return this.request('/staff/faculty/create/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteStaffFaculty(id) {
    return this.request(`/staff/faculty/${id}/`, {
      method: 'DELETE',
    });
  }

  // Subject Management (Staff / Admin)
  async createSubject(data) {
    return this.request('/staff/subjects/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSubject(id, data) {
    return this.request(`/staff/subjects/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteSubject(id) {
    return this.request(`/staff/subjects/${id}/`, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiClient();
