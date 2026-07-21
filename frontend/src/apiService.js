const BASE_URL = ''; // Relative path, Vite proxy forwards to Django server (localhost:8000)

class ApiService {
  static getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    const token = localStorage.getItem('cms_access_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  static async request(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const headers = { ...this.getHeaders(), ...options.headers };
    const config = { ...options, headers };

    try {
      const response = await fetch(url, config);
      
      // If unauthorized (401), clear tokens and reload
      if (response.status === 401) {
        localStorage.removeItem('cms_access_token');
        localStorage.removeItem('cms_refresh_token');
        localStorage.removeItem('cms_current_user');
      }

      if (response.status === 204) {
        return { success: true };
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || data.message || response.statusText || 'API error');
      }
      return data;
    } catch (error) {
      console.error(`API Error on ${endpoint}:`, error);
      throw error;
    }
  }

  // Auth endpoints
  static async login(username, password) {
    const data = await this.request('/api/token/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    if (data.access) {
      localStorage.setItem('cms_access_token', data.access);
      localStorage.setItem('cms_refresh_token', data.refresh);
    }
    return data;
  }

  static async getMe() {
    return this.request('/api/users/me/');
  }

  // Students endpoints
  static async getStudents() {
    return this.request('/api/students/');
  }

  static async createStudent(payload) {
    return this.request('/api/students/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  static async deleteStudent(id) {
    return this.request(`/api/students/${id}/`, {
      method: 'DELETE',
    });
  }

  // Faculty endpoints
  static async getFaculty() {
    return this.request('/api/faculty/');
  }

  static async createFaculty(payload) {
    return this.request('/api/faculty/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  static async deleteFaculty(id) {
    return this.request(`/api/faculty/${id}/`, {
      method: 'DELETE',
    });
  }

  // Attendance endpoints
  static async getAttendance(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/api/attendance/${query ? `?${query}` : ''}`);
  }

  static async markAttendance(payload) {
    return this.request('/api/attendance/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  static async uploadAttendanceCSV(formData) {
    const token = localStorage.getItem('cms_access_token');
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch('/api/attendance/bulk-upload/', {
      method: 'POST',
      headers,
      body: formData
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.detail || data.message || 'CSV upload failed');
    }
    return response.json();
  }

  // Timetable endpoints
  static async getTimetable(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/api/timetable/${query ? `?${query}` : ''}`);
  }

  static async createTimetableSlot(payload) {
    return this.request('/api/timetable/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Marks endpoints
  static async getMarks(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/api/marks/${query ? `?${query}` : ''}`);
  }

  static async createOrUpdateMark(payload, id = null) {
    const url = id ? `/api/marks/${id}/` : '/api/marks/';
    const method = id ? 'PUT' : 'POST';
    return this.request(url, {
      method,
      body: JSON.stringify(payload),
    });
  }

  // Notices endpoints
  static async getNotices() {
    return this.request('/api/notices/');
  }

  static async createNotice(payload) {
    return this.request('/api/notices/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  static async deleteNotice(id) {
    return this.request(`/api/notices/${id}/`, {
      method: 'DELETE',
    });
  }

  // Assignments endpoints
  static async getAssignments() {
    return this.request('/api/assignments/');
  }

  static async createAssignment(payload) {
    return this.request('/api/assignments/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  static async deleteAssignment(id) {
    return this.request(`/api/assignments/${id}/`, {
      method: 'DELETE',
    });
  }

  // AI Predictor endpoints
  static async predictPerformance(studentId) {
    return this.request('/api/predict/', {
      method: 'POST',
      body: JSON.stringify({ student_id: studentId }),
    });
  }

  static async getPredictionHistory() {
    return this.request('/api/predict/history/');
  }
}

export default ApiService;
