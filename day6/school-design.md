
# Day 6 Assignment: School Database Design

## 1. Introduction

This database is designed to manage students, courses and student enrolments in a school.

## 2. Tables

### Students Table
Stores information about students.
- id: Primary key.
- name: Student's full name.
- email: Student's email address. It must be unique.

### Courses Table
Stores information about courses.
- id: Primary key.
- course_name: Name of the course.

### Enrolments Table
Stores information about student enrolments.
- id: Primary key.
- student_id: Foreign key referencing students.
- course_id: Foreign key referencing courses.
- grade: Student's grade.

## 3. Relationships

### One-to-Many

One student can enrol in many courses. One course can also have many students enrolled.

### Many-to-Many

Students and courses have a many-to-many relationship because students can take several courses, and each course can have several students.

The enrolments table acts as a join table connecting students and courses.

## 4. Index

I would create an index on student_id in the enrolments table.

This makes searching for a student's enrolments faster.

SQL statement:

CREATE INDEX idx_enrolments_student_id
ON enrolments(student_id);

## 5. SQL or NoSQL

I would choose SQL because the school database contains structured information about students, courses and enrolments.

SQL supports relationships, primary keys and foreign keys. It also helps maintain accurate and consistent records.

## 6. Conclusion

The database uses three tables to manage students, courses and enrolments. Primary keys and foreign keys connect the tables and help organise school information.
