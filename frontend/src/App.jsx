import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import StatsCards from './components/StatsCards';
import StudentTable from './components/StudentTable';
import StudentModal from './components/StudentModal';
import StudentDetailsModal from './components/StudentDetailsModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import Toast from './components/Toast';
import { studentApi } from './api/studentApi';
import {
  Search,
  Filter,
  UserPlus,
  RefreshCw,
  X,
  Sparkles,
} from 'lucide-react';

export default function App() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('ALL');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit'
  const [selectedStudent, setSelectedStudent] = useState(null);

  // View modal state
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Delete confirm state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  // Toast state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  /**
   * Load students from backend REST API
   */
  const loadStudents = useCallback(async () => {
    try {
      setLoading(true);
      const data = await studentApi.getAllStudents({
        search: searchTerm,
        course: selectedCourse,
      });
      setStudents(data || []);
      setIsOnline(true);
    } catch (err) {
      console.error('Error fetching students:', err);
      setIsOnline(false);
      showToast(err.message || 'Failed to fetch student records from server.', 'error');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCourse]);

  /**
   * Load distinct course list for filter dropdown
   */
  const loadCourses = async () => {
    try {
      const data = await studentApi.getCourses();
      if (Array.isArray(data)) {
        setCourses(data);
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadStudents();
    }, 250); // slight debounce for search
    return () => clearTimeout(timeout);
  }, [loadStudents]);

  // Handlers for Modals
  const handleOpenAddModal = () => {
    setModalMode('add');
    setSelectedStudent(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (student) => {
    setModalMode('edit');
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleOpenViewModal = (student) => {
    setSelectedStudent(student);
    setIsViewModalOpen(true);
  };

  const handleOpenDeleteModal = (student) => {
    setStudentToDelete(student);
    setIsDeleteModalOpen(true);
  };

  // Submit Handler for Add or Edit
  const handleSaveStudent = async (formData) => {
    if (modalMode === 'add') {
      const created = await studentApi.createStudent(formData);
      showToast(`Student "${created.fullName}" successfully enrolled!`, 'success');
    } else {
      const updated = await studentApi.updateStudent(selectedStudent.id, formData);
      showToast(`Student #${updated.id} "${updated.fullName}" updated successfully!`, 'success');
    }
    // Refresh student list and course list
    await loadStudents();
    await loadCourses();
  };

  // Confirm Delete Handler
  const handleConfirmDelete = async (id) => {
    try {
      await studentApi.deleteStudent(id);
      showToast(`Student record #${id} was deleted successfully.`, 'success');
      await loadStudents();
      await loadCourses();
    } catch (err) {
      showToast(err.message || 'Failed to delete student.', 'error');
      throw err;
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCourse('ALL');
  };

  const isFiltered = searchTerm.trim() !== '' || selectedCourse !== 'ALL';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-sky-500 selection:text-white">
      {/* Toast Notification Container */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Navigation Header */}
      <Navbar totalStudents={students.length} isOnline={isOnline} />

      {/* Main Content Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome & Action Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              <span>Student Management Dashboard</span>
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage student enrollments, academic records, courses, and department allocations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                loadStudents();
                loadCourses();
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-xl transition-all shadow-sm active:scale-95"
              title="Refresh Records"
            >
              <RefreshCw className={`w-4 h-4 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-sky-600 via-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 rounded-xl shadow-lg shadow-sky-500/25 transition-all active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add New Student</span>
            </button>
          </div>
        </div>

        {/* Metric Cards (Total count, courses, depts, admissions) */}
        <StatsCards students={students} courses={courses} />

        {/* Search & Filter Toolbar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm mb-6 transition-all">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search students by name or email..."
                className="w-full pl-10 pr-9 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter by Course */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1 sm:w-64">
                <Filter className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full pl-10 pr-8 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition-all appearance-none cursor-pointer text-slate-700 font-medium"
                >
                  <option value="ALL">All Courses ({courses.length})</option>
                  {courses.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                  ▼
                </div>
              </div>

              {/* Clear filters badge if filtered */}
              {isFiltered && (
                <button
                  onClick={clearFilters}
                  className="text-xs font-semibold text-sky-600 hover:text-sky-800 bg-sky-50 hover:bg-sky-100 px-3 py-2.5 rounded-xl border border-sky-200 transition-colors whitespace-nowrap"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Student Records Table */}
        <StudentTable
          students={students}
          loading={loading}
          onView={handleOpenViewModal}
          onEdit={handleOpenEditModal}
          onDelete={handleOpenDeleteModal}
        />
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white/60 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} Student Management System. Built with Java Spring Boot, MySQL & React Tailwind CSS.</p>
          <p className="flex items-center gap-1.5 font-medium text-slate-600">
            <Sparkles className="w-4 h-4 text-sky-600" />
            Full Stack Technical Assessment
          </p>
        </div>
      </footer>

      {/* Add / Edit Student Modal */}
      <StudentModal
        isOpen={isModalOpen}
        mode={modalMode}
        student={selectedStudent}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveStudent}
      />

      {/* View Student Details Modal */}
      <StudentDetailsModal
        isOpen={isViewModalOpen}
        student={selectedStudent}
        onClose={() => setIsViewModalOpen(false)}
        onEdit={(student) => {
          handleOpenEditModal(student);
        }}
        onDelete={(student) => {
          handleOpenDeleteModal(student);
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        student={studentToDelete}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
