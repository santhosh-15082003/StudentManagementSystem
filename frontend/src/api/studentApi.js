// API client for Student Management System
const API_BASE = '/api/students';

// Handle API response

async function handleResponse(response) {
  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  const body = isJson ? await response.json() : null;

  if (!response.ok) {
    const errorObj = new Error(body?.message || `Request failed with status ${response.status}`);
    errorObj.status = response.status;
    errorObj.errors = body?.errors || null;
    errorObj.data = body;
    throw errorObj;
  }

  return body ? body.data : null;
}

export const studentApi = {
  
  // Fetch all students Details
   
  async getAllStudents({ search = '', course = '' } = {}) {
    const params = new URLSearchParams();
    if (search.trim()) params.append('search', search.trim());
    if (course.trim() && course !== 'ALL') params.append('course', course.trim());

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${API_BASE}${queryString}`);
    return handleResponse(res);
  },

  
  // Fetch a single student Details
  
  async getStudentById(id) {
    const res = await fetch(`${API_BASE}/${id}`);
    return handleResponse(res);
  },

  
  // Create a new student record
   
  async createStudent(studentData) {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(studentData),
    });
    return handleResponse(res);
  },

  // Update student details

  async updateStudent(id, studentData) {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(studentData),
    });
    return handleResponse(res);
  },

  // Delete student record

  async deleteStudent(id) {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },

  
  // Get list COurses
  
  async getCourses() {
    try {
      const res = await fetch(`${API_BASE}/courses`);
      return handleResponse(res);
    } catch {
      return [];
    }
  },
};
