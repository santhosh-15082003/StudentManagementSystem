package com.student.controller;

import com.student.dto.ApiResponse;
import com.student.dto.StudentRequestDTO;
import com.student.model.Student;
import com.student.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "*")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Student>>> getAllStudents(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String course) {
        List<Student> students = studentService.getAllStudents(search, course);
        return ResponseEntity.ok(ApiResponse.success("Students retrieved successfully", students));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Student>> getStudentById(@PathVariable Long id) {
        Student student = studentService.getStudentById(id);
        return ResponseEntity.ok(ApiResponse.success("Student retrieved successfully", student));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Student>> createStudent(@Valid @RequestBody StudentRequestDTO requestDTO) {
        Student createdStudent = studentService.createStudent(requestDTO);
        return new ResponseEntity<>(
                ApiResponse.success("Student registered successfully", createdStudent),
                HttpStatus.CREATED
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Student>> updateStudent(
            @PathVariable Long id,
            @Valid @RequestBody StudentRequestDTO requestDTO) {
        Student updatedStudent = studentService.updateStudent(id, requestDTO);
        return ResponseEntity.ok(ApiResponse.success("Student updated successfully", updatedStudent));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.ok(ApiResponse.success("Student deleted successfully with ID: " + id));
    }

    @GetMapping("/courses")
    public ResponseEntity<ApiResponse<List<String>>> getAllCourses() {
        List<String> courses = studentService.getAllCourses();
        return ResponseEntity.ok(ApiResponse.success("Courses retrieved successfully", courses));
    }
}
