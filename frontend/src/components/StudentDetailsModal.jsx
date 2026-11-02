import React from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  Building,
  Edit2,
  Trash2,
  Clock,
} from 'lucide-react';

export default function StudentDetailsModal({
  isOpen,
  student,
  onClose,
  onEdit,
  onDelete,
}) {
  if (!isOpen || !student) return null;

  const initials = (student.fullName || '')
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'ST';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden animate-modal-in">
        <div className="relative h-28 bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 p-6 flex justify-between items-start">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-md border border-white/25">
            Student Profile
          </span>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex items-end justify-between -mt-12 mb-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white font-extrabold text-2xl flex items-center justify-center ring-4 ring-white shadow-xl shadow-sky-600/20">
              {initials}
            </div>
            <div className="text-right">
              <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                ID: #{student.id}
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
              {student.fullName}
            </h3>
            <p className="text-sm text-slate-500 font-medium mt-0.5">
              {student.course} • {student.department}
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-slate-500 shadow-sm border border-slate-200">
                <Mail className="w-4 h-4 text-sky-600" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs text-slate-400 font-medium">Email Address</p>
                <p className="text-slate-800 font-semibold truncate" title={student.email}>
                  {student.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-slate-500 shadow-sm border border-slate-200">
                <Phone className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Phone Number</p>
                <p className="text-slate-800 font-semibold">{student.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-slate-500 shadow-sm border border-slate-200">
                <User className="w-4 h-4 text-pink-600" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Gender</p>
                <p className="text-slate-800 font-semibold">{student.gender}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-slate-500 shadow-sm border border-slate-200">
                <Calendar className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Date of Birth</p>
                <p className="text-slate-800 font-semibold">{student.dateOfBirth}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-slate-500 shadow-sm border border-slate-200">
                <GraduationCap className="w-4 h-4 text-teal-600" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Course</p>
                <p className="text-slate-800 font-semibold">{student.course}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-slate-500 shadow-sm border border-slate-200">
                <Building className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Department</p>
                <p className="text-slate-800 font-semibold">{student.department}</p>
              </div>
            </div>

            <div className="sm:col-span-2 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-slate-500 shadow-sm border border-slate-200">
                <Clock className="w-4 h-4 text-cyan-600" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Admission Date</p>
                <p className="text-slate-800 font-semibold font-mono text-xs">
                  {student.admissionDate}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => {
                onClose();
                onEdit(student);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Edit Student
            </button>
            <button
              onClick={() => {
                onClose();
                onDelete(student);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete Student
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
