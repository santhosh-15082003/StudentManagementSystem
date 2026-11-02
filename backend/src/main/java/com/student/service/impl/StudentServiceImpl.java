package com.student.service.impl;

import com.student.dto.StudentRequestDTO;
import com.student.exception.DuplicateResourceException;
import com.student.exception.ResourceNotFoundException;
import com.student.model.Student;
import com.student.repository.StudentRepository;
import com.student.service.StudentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;

    public StudentServiceImpl(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Student> getAllStudents(String search, String course) {
        String trimmedSearch = (search != null && !search.trim().isEmpty()) ? search.trim() : null;
        String trimmedCourse = (course != null && !course.trim().isEmpty() && !course.equalsIgnoreCase("all")) ? course.trim() : null;

        if (trimmedSearch == null && trimmedCourse == null) {
            return studentRepository.findAll();
        }
        return studentRepository.searchAndFilterStudents(trimmedSearch, trimmedCourse);
    }

    @Override
    @Transactional(readOnly = true)
    public Student getStudentById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));
    }

    @Override
    public Student createStudent(StudentRequestDTO dto) {
        String email = dto.getEmail().trim().toLowerCase();
        if (studentRepository.existsByEmail(email)) {
            throw new DuplicateResourceException("A student with email '" + dto.getEmail() + "' already exists.");
        }

        Student student = new Student();
        mapDtoToEntity(dto, student);
        student.setEmail(email);

        return studentRepository.save(student);
    }

    @Override
    public Student updateStudent(Long id, StudentRequestDTO dto) {
        Student existing = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));

        String email = dto.getEmail().trim().toLowerCase();
        if (studentRepository.existsByEmailAndIdNot(email, id)) {
            throw new DuplicateResourceException("Another student with email '" + dto.getEmail() + "' already exists.");
        }

        mapDtoToEntity(dto, existing);
        existing.setEmail(email);

        return studentRepository.save(existing);
    }

    @Override
    public void deleteStudent(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));
        studentRepository.delete(student);
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> getAllCourses() {
        return studentRepository.findDistinctCourses();
    }

    private void mapDtoToEntity(StudentRequestDTO dto, Student student) {
        student.setFullName(dto.getFullName().trim());
        student.setPhone(dto.getPhone().trim());
        student.setGender(dto.getGender().trim());
        student.setDateOfBirth(dto.getDateOfBirth());
        student.setCourse(dto.getCourse().trim());
        student.setDepartment(dto.getDepartment().trim());
        student.setAdmissionDate(dto.getAdmissionDate());
    }
}
