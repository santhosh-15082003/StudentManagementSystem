CREATE DATABASE IF NOT EXISTS student_management
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE student_management;

DROP TABLE IF EXISTS students;

CREATE TABLE students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(15) NOT NULL,
    gender VARCHAR(20) NOT NULL,
    date_of_birth DATE NOT NULL,
    course VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    admission_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_students_email ON students(email);
CREATE INDEX idx_students_full_name ON students(full_name);
CREATE INDEX idx_students_course ON students(course);
CREATE INDEX idx_students_department ON students(department);

INSERT INTO students (full_name, email, phone, gender, date_of_birth, course, department, admission_date) VALUES
('Aarav Sharma', 'aarav.sharma@example.com', '9876543210', 'Male', '2003-05-14', 'Computer Science', 'Computer Engineering', '2022-08-01');

