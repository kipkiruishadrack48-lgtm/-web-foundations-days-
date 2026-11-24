
PRAGMA foreign_keys = ON;

-- 1. CREATE TABLES

CREATE TABLE students (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);

CREATE TABLE courses (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    teacher TEXT NOT NULL
);

CREATE TABLE enrolments (
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    grade TEXT,
    PRIMARY KEY (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES students(id)
        ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id)
        ON DELETE CASCADE
);

-- 2. INSERT SAMPLE STUDENTS

INSERT INTO students (name, email) VALUES
('Amina Otieno', 'amina@school.ac.ke'),
('Brian Kamau', 'brian@school.ac.ke'),
('Grace Wanjiru', 'grace@school.ac.ke'),
('David Mwangi', 'david@school.ac.ke');

-- 3. INSERT SAMPLE COURSES

INSERT INTO courses (title, teacher) VALUES
('Web Foundations', 'Ms Njeri'),
('Databases', 'Mr Ochieng'),
('Mathematics', 'Mrs Achieng');

-- 4. INSERT ENROLMENTS

INSERT INTO enrolments (student_id, course_id, grade) VALUES
(1, 1, 'A'),
(1, 2, NULL),
(2, 1, 'B'),
(2, 3, 'A'),
(3, 2, 'B');

-- 5. CREATE AN INDEX

CREATE INDEX idx_enrolments_course
ON enrolments(course_id);

-- 6. QUERY 1: ALL COURSES FOR ONE STUDENT

SELECT courses.title, enrolments.grade
FROM enrolments
JOIN students
    ON students.id = enrolments.student_id
JOIN courses
    ON courses.id = enrolments.course_id
WHERE students.name = 'Amina Otieno';

-- 7. QUERY 2: ALL STUDENTS ON ONE COURSE

SELECT students.name
FROM enrolments
JOIN students
    ON students.id = enrolments.student_id
JOIN courses
    ON courses.id = enrolments.course_id
WHERE courses.title = 'Web Foundations';

-- 8. QUERY 3: NUMBER OF STUDENTS PER COURSE

SELECT
    courses.title,
    COUNT(enrolments.student_id) AS student_count
FROM courses
LEFT JOIN enrolments
    ON courses.id = enrolments.course_id
GROUP BY courses.id, courses.title;

-- 9. QUERY 4: STUDENTS WITH NO ENROLMENTS

SELECT students.name
FROM students
LEFT JOIN enrolments
    ON students.id = enrolments.student_id
WHERE enrolments.student_id IS NULL;

-- 10. QUERY 5: UPDATE AMINA'S DATABASE GRADE

UPDATE enrolments
SET grade = 'A'
WHERE student_id = 1
AND course_id = 2;
