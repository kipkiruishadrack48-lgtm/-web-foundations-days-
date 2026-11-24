
-- DAY 6 ASSIGNMENT
-- Database Fundamentals and SQL
-- Student: Shadrack Kipkirui

PRAGMA foreign_keys = ON;

-- ==================================
-- 1. CREATE STUDENTS TABLE
-- ==================================

CREATE TABLE students (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);

-- ==================================
-- 2. CREATE COURSES TABLE
-- ==================================

CREATE TABLE courses (
    id INTEGER PRIMARY KEY,
    course_name TEXT NOT NULL
);

-- ==================================
-- 3. CREATE ENROLMENTS TABLE
-- ==================================

CREATE TABLE enrolments (
    id INTEGER PRIMARY KEY,
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    grade TEXT,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (course_id) REFERENCES courses(id),
    UNIQUE (student_id, course_id)
);

-- ==================================
-- 4. INSERT STUDENTS
-- ==================================

INSERT INTO students (id, name, email) VALUES
(1, 'Amina Otieno', 'amina@example.com'),
(2, 'Brian Kamau', 'brian@example.com'),
(3, 'Carol Wanjiku', 'carol@example.com');

-- ==================================
-- 5. INSERT COURSES
-- ==================================

INSERT INTO courses (id, course_name) VALUES
(1, 'Web Development'),
(2, 'Database Management'),
(3, 'Computer Networking');

-- ==================================
-- 6. INSERT ENROLMENTS
-- ==================================

INSERT INTO enrolments (id, student_id, course_id, grade) VALUES
(1, 1, 1, 'A'),
(2, 1, 2, 'B'),
(3, 1, 3, 'A'),
(4, 2, 1, 'B'),
(5, 2, 2, 'C');

-- ==================================
-- 7. QUERY 1:
-- ALL COURSES FOR ONE STUDENT
-- ==================================

SELECT students.name, courses.course_name
FROM students
JOIN enrolments ON students.id = enrolments.student_id
JOIN courses ON enrolments.course_id = courses.id
WHERE students.name = 'Amina Otieno';

-- ==================================
-- 8. QUERY 2:
-- ALL STUDENTS ON ONE COURSE
-- ==================================

SELECT students.name, courses.course_name
FROM students
JOIN enrolments ON students.id = enrolments.student_id
JOIN courses ON enrolments.course_id = courses.id
WHERE courses.course_name = 'Web Development';

-- ==================================
-- 9. QUERY 3:
-- NUMBER OF STUDENTS PER COURSE
-- ==================================

SELECT courses.course_name,
       COUNT(enrolments.student_id) AS number_of_students
FROM courses
LEFT JOIN enrolments ON courses.id = enrolments.course_id
GROUP BY courses.id, courses.course_name;

-- ==================================
-- 10. QUERY 4:
-- STUDENTS WHO HAVE NO ENROLMENTS
-- ==================================

SELECT students.name
FROM students
LEFT JOIN enrolments ON students.id = enrolments.student_id
WHERE enrolments.student_id IS NULL;

-- ==================================
-- 11. QUERY 5:
-- UPDATE ONE ENROLMENT'S GRADE
-- ==================================

UPDATE enrolments
SET grade = 'A'
WHERE id = 5;

-- ==================================
-- END OF DAY 6 ASSIGNMENT
-- ==================================

