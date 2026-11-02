import React, { useState, useEffect } from 'react';
import { X, UserPlus, Check, AlertCircle, Loader2 } from 'lucide-react';

const INITIAL_FORM_DATA = {
  fullName: '',
  email: '',
  phone: '',
  gender: 'Male',
  dateOfBirth: '',
  course: '',
  department: '',
  admissionDate: new Date().toISOString().split('T')[0],
};

const COMMON_COURSES = [
  'Computer Science',
  'Information Technology',
  'Data Science',
  'Mechanical Engineering',
  'Electrical Engineering',
  'Civil Engineering',
  'Business Administration',
  'Finance & Accounting',
  'Cybersecurity',
  'Artificial Intelligence',
];

const COMMON_DEPARTMENTS = [
  'Computer Engineering',
  'Mechanical',
  'Electrical & Electronics',
  'Civil & Environmental',
  'Management Studies',
  'Science & Humanities',
];

export default function StudentModal({
  isOpen,
  mode = 'add', // 'add' | 'edit'
  student = null,
  onClose,
  onSubmit,
}) {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const isEdit = mode === 'edit';

  useEffect(() => {
    if (isOpen) {
      if (isEdit && student) {
        setFormData({
          fullName: student.fullName || '',
          email: student.email || '',
          phone: student.phone || '',
          gender: student.gender || 'Male',
          dateOfBirth: student.dateOfBirth || '',
          course: student.course || '',
          department: student.department || '',
          admissionDate: student.admissionDate || '',
        });
      } else {
        setFormData(INITIAL_FORM_DATA);
      }
      setErrors({});
      setGeneralError('');
    }
  }, [isOpen, isEdit, student]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) {
      errs.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      errs.fullName = 'Full name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required';
    } else if (!/^[0-9+() -]{7,15}$/.test(formData.phone.trim())) {
      errs.phone = 'Please enter a valid phone number (7-15 digits)';
    }

    if (!formData.gender) {
      errs.gender = 'Gender is required';
    }

    if (!formData.dateOfBirth) {
      errs.dateOfBirth = 'Date of birth is required';
    } else {
      const dob = new Date(formData.dateOfBirth);
      const today = new Date();
      if (dob >= today) {
        errs.dateOfBirth = 'Date of birth must be a past date';
      }
    }

    if (!formData.course.trim()) {
      errs.course = 'Course is required';
    }

    if (!formData.department.trim()) {
      errs.department = 'Department is required';
    }

    if (!formData.admissionDate) {
      errs.admissionDate = 'Admission date is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    if (!validate()) return;

    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      onClose();
    } catch (err) {
      if (err.status === 409) {
        setErrors((prev) => ({
          ...prev,
          email: err.message || 'This email address is already registered to another student.',
        }));
      } else if (err.errors && typeof err.errors === 'object') {
        setErrors(err.errors);
      } else {
        setGeneralError(err.message || 'Failed to save student details. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden animate-modal-in">
        {/* Modal Header */}
        <div className="px-6 sm:px-8 pt-6 pb-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-sky-50/50 to-indigo-50/30">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-sky-100 text-sky-700">
                <UserPlus className="w-5 h-5" />
              </span>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                {isEdit ? 'Edit Student Information' : 'Add New Student'}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1 pl-10">
              {isEdit
                ? `Updating record for Student ID #${student?.id}`
                : 'Fill in the information below to enroll a new student.'}
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
          {generalError && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{generalError}</span>
            </div>
          )}

          {isEdit && (
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
              <span className="font-medium">Student ID (Auto-generated):</span>
              <span className="font-mono font-bold text-slate-800 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                #{student?.id}
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. Santhosh Kumar"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all outline-none focus:ring-2 ${
                  errors.fullName
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/20'
                    : 'border-slate-300 focus:border-sky-500 focus:ring-sky-100'
                }`}
              />
              {errors.fullName && (
                <p className="text-xs text-rose-600 mt-1 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="santhosh@example.com"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all outline-none focus:ring-2 ${
                  errors.email
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/20'
                    : 'border-slate-300 focus:border-sky-500 focus:ring-sky-100'
                }`}
              />
              {errors.email && (
                <p className="text-xs text-rose-600 mt-1 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="9876543210"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all outline-none focus:ring-2 ${
                  errors.phone
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/20'
                    : 'border-slate-300 focus:border-sky-500 focus:ring-sky-100'
                }`}
              />
              {errors.phone && (
                <p className="text-xs text-rose-600 mt-1 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Gender <span className="text-rose-500">*</span>
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-white transition-all outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Date of Birth <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all outline-none focus:ring-2 ${
                  errors.dateOfBirth
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/20'
                    : 'border-slate-300 focus:border-sky-500 focus:ring-sky-100'
                }`}
              />
              {errors.dateOfBirth && (
                <p className="text-xs text-rose-600 mt-1 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.dateOfBirth}
                </p>
              )}
            </div>

            {/* Course */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Course <span className="text-rose-500">*</span>
              </label>
              <input
                list="courses-list"
                name="course"
                value={formData.course}
                onChange={handleChange}
                placeholder="e.g. Computer Science"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all outline-none focus:ring-2 ${
                  errors.course
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/20'
                    : 'border-slate-300 focus:border-sky-500 focus:ring-sky-100'
                }`}
              />
              <datalist id="courses-list">
                {COMMON_COURSES.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
              {errors.course && (
                <p className="text-xs text-rose-600 mt-1 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.course}
                </p>
              )}
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Department <span className="text-rose-500">*</span>
              </label>
              <input
                list="departments-list"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="e.g. Computer Engineering"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all outline-none focus:ring-2 ${
                  errors.department
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/20'
                    : 'border-slate-300 focus:border-sky-500 focus:ring-sky-100'
                }`}
              />
              <datalist id="departments-list">
                {COMMON_DEPARTMENTS.map((d) => (
                  <option key={d} value={d} />
                ))}
              </datalist>
              {errors.department && (
                <p className="text-xs text-rose-600 mt-1 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.department}
                </p>
              )}
            </div>

            {/* Admission Date */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Admission Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                name="admissionDate"
                value={formData.admissionDate}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all outline-none focus:ring-2 ${
                  errors.admissionDate
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/20'
                    : 'border-slate-300 focus:border-sky-500 focus:ring-sky-100'
                }`}
              />
              {errors.admissionDate && (
                <p className="text-xs text-rose-600 mt-1 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.admissionDate}
                </p>
              )}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 rounded-xl shadow-lg shadow-sky-500/25 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  {isEdit ? 'Save Changes' : 'Enroll Student'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
