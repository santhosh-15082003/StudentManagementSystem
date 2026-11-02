import React from 'react';
import { Users, BookOpen, Building2, CalendarPlus } from 'lucide-react';

export default function StatsCards({ students = [], courses = [] }) {
  const totalCount = students.length;

  const uniqueDepts = new Set(students.map((s) => s.department).filter(Boolean));
  const deptsCount = uniqueDepts.size;

    const coursesCount = Math.max(
    courses.length,
    new Set(students.map((s) => s.course).filter(Boolean)).size
  );

  const currentYear = new Date().getFullYear();
  const recentAdmissions = students.filter((s) => {
    if (!s.admissionDate) return false;
    const admYear = new Date(s.admissionDate).getFullYear();
    return admYear >= currentYear - 1;
  }).length;

  const cards = [
    {
      title: 'Total Students',
      value: totalCount,
      label: 'Registered Students',
      icon: Users,
      gradient: 'from-blue-600 to-sky-500',
      bgGlow: 'bg-blue-500/10',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Active Courses',
      value: coursesCount,
      label: 'Specialized Programs',
      icon: BookOpen,
      gradient: 'from-indigo-600 to-violet-500',
      bgGlow: 'bg-indigo-500/10',
      iconColor: 'text-indigo-600',
    },
    {
      title: 'Departments',
      value: deptsCount,
      label: 'Academic Divisions',
      icon: Building2,
      gradient: 'from-emerald-600 to-teal-500',
      bgGlow: 'bg-emerald-500/10',
      iconColor: 'text-emerald-600',
    },
    {
      title: 'Recent Admissions',
      value: recentAdmissions,
      label: 'Active Enrollments',
      icon: CalendarPlus,
      gradient: 'from-amber-500 to-orange-500',
      bgGlow: 'bg-amber-500/10',
      iconColor: 'text-amber-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="relative overflow-hidden bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  {card.title}
                </p>
                <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {card.value}
                </h3>
                <p className="text-xs text-slate-400 mt-1 font-medium">
                  {card.label}
                </p>
              </div>

              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.bgGlow} transition-transform group-hover:scale-110 duration-200`}
              >
                <Icon className={`w-6 h-6 ${card.iconColor}`} />
              </div>
            </div>
            
            <div
              className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${card.gradient} opacity-80`}
            />
          </div>
        );
      })}
    </div>
  );
}
