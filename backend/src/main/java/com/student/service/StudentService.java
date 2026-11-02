package com.student.service;

import com.student.dto.StudentRequestDTO;
import com.student.model.Student;

import java.util.List;

public interface StudentService {

    List<Student> getAllStudents(String search, String course);

    Student getStudentById(Long id);

    Student createStudent(StudentRequestDTO studentDTO);

    Student updateStudent(Long id, StudentRequestDTO studentDTO);

    void deleteStudent(Long id);

    List<String> getAllCourses();
}
