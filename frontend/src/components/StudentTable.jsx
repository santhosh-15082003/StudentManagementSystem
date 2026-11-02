import React, { useState } from 'react';
import {
  Eye,
  Edit2,
  Trash2,
  Mail,
  Phone,
  Calendar,
  Building,
  GraduationCap,
  ArrowUpDown,
  Download,
  AlertCircle,
} from 'lucide-react';

export default function StudentTable({
  students = [],
  loading = false,
  onView,
  onEdit,
  onDelete,
}) {
  const [sortField, setSortField] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedStudents = [...students].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const getGenderBadge = (gender) => {
    const g = (gender || '').toLowerCase();
    if (g === 'male') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
          Male
        </span>
      );
    }
    if (g === 'female') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-pink-50 text-pink-700 border border-pink-200">
          Female
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
        {gender || 'Other'}
      </span>
    );
  };

  const exportToCSV = () => {
    if (students.length === 0) return;
    const headers = [
      'ID',
      'Full Name',
      'Email',
      'Phone',
      'Gender',
      'Date of Birth',
      'Course',
      'Department',
      'Admission Date',
    ];
    const rows = sortedStudents.map((s) => [
      s.id,
      `"${s.fullName || ''}"`,
      `"${s.email || ''}"`,
      `"${s.phone || ''}"`,
      `"${s.gender || ''}"`,
      s.dateOfBirth || '',
      `"${s.course || ''}"`,
      `"${s.department || ''}"`,
      s.admissionDate || '',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `students_records_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-12 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-sky-600 border-t-transparent mb-4" />
        <p className="text-slate-600 font-medium">Loading student records...</p>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-12 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h4 className="text-lg font-bold text-slate-800 mb-1">No Students Found</h4>
        <p className="text-sm text-slate-500 max-w-sm mx-auto">
          No records match your search or filter criteria. Try resetting the filters or add a new student.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      {/* Table Top Bar */}
      <div className="px-6 py-4 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
        <div>
          <span className="text-sm font-semibold text-slate-700">
            Showing {students.length} student{students.length !== 1 ? 's' : ''}
          </span>
        </div>

        <button
          onClick={exportToCSV}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          Export CSV
        </button>
      </div>

      {/* Desktop Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100/75 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-600 select-none">
              <th
                onClick={() => handleSort('id')}
                className="py-3.5 px-4 cursor-pointer hover:text-sky-700 transition-colors"
              >
                <div className="flex items-center gap-1">
                  ID
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('fullName')}
                className="py-3.5 px-4 cursor-pointer hover:text-sky-700 transition-colors"
              >
                <div className="flex items-center gap-1">
                  Student Name
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3.5 px-4">Contact</th>
              <th className="py-3.5 px-4">Gender</th>
              <th
                onClick={() => handleSort('course')}
                className="py-3.5 px-4 cursor-pointer hover:text-sky-700 transition-colors"
              >
                <div className="flex items-center gap-1">
                  Course & Dept
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('admissionDate')}
                className="py-3.5 px-4 cursor-pointer hover:text-sky-700 transition-colors"
              >
                <div className="flex items-center gap-1">
                  Admission Date
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/70 text-sm">
            {sortedStudents.map((student) => {
              // Avatar initials
              const initials = (student.fullName || '')
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase() || 'ST';

              return (
                <tr
                  key={student.id}
                  className="hover:bg-sky-50/40 transition-colors duration-150 group"
                >
                  {/* ID */}
                  <td className="py-3.5 px-4 font-mono font-medium text-xs text-slate-500">
                    <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                      #{student.id}
                    </span>
                  </td>

                  {/* Student Name & Avatar */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0">
                        {initials}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 group-hover:text-sky-700 transition-colors">
                          {student.fullName}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          DOB: {student.dateOfBirth}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Contact Info */}
                  <td className="py-3.5 px-4">
                    <div className="text-xs space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate max-w-[170px]" title={student.email}>
                          {student.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span>{student.phone}</span>
                      </div>
                    </div>
                  </td>

                  {/* Gender */}
                  <td className="py-3.5 px-4">
                    {getGenderBadge(student.gender)}
                  </td>

                  {/* Course & Department */}
                  <td className="py-3.5 px-4">
                    <div>
                      <div className="font-medium text-slate-900 flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
                        <span className="truncate max-w-[200px]" title={student.course}>
                          {student.course}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Building className="w-3 h-3 text-slate-400 flex-shrink-0" />
                        <span className="truncate max-w-[180px]" title={student.department}>
                          {student.department}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Admission Date */}
                  <td className="py-3.5 px-4 font-mono text-xs text-slate-600">
                    {student.admissionDate}
                  </td>

                  {/* Action Buttons */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => onView(student)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(student)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                        title="Edit Student"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(student)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Student"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
