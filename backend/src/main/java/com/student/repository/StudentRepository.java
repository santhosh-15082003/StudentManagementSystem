package com.student.repository;

import com.student.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByEmailAndIdNot(String email, Long id);

    @Query("SELECT s FROM Student s WHERE " +
           "(:course IS NULL OR :course = '' OR LOWER(s.course) = LOWER(:course)) AND " +
           "(:search IS NULL OR :search = '' OR " +
           "LOWER(s.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(s.email) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Student> searchAndFilterStudents(@Param("search") String search, @Param("course") String course);

    @Query("SELECT DISTINCT s.course FROM Student s ORDER BY s.course ASC")
    List<String> findDistinctCourses();
}
