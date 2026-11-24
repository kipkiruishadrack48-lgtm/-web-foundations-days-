
# School Database Design

## 1. Introduction

This school database is designed to manage students, courses, enrolments and student grades. It uses three related tables: students, courses and enrolments.

## 2. Tables

### Students Table

The students table stores information about students.

It contains the following fields:

- id: A unique identification number for each student. It is the primary key.
- name: The full name of the student. It cannot be empty.
- email: The student's email address. It must be unique and cannot be empty.

### Courses Table

The courses table stores information about courses offered by the school.

It contains the following fields:

- id: A unique identification number for each course. It is the primary key.
- title: The name of the course. It cannot be empty.
- teacher: The name of the teacher responsible for the course. It cannot be empty.

### Enrolments Table

The enrolments table records the courses taken by students.

It contains the following fields:

- student_id: Identifies the student and acts as a foreign key.
- course_id: Identifies the course and acts as a foreign key.
- grade: Stores the student's grade in a particular course.

The enrolments table uses a composite primary key made up of student_id and course_id. This prevents a student from enrolling in the same course more than once.

## 3. Relationships

Students and courses have a many-to-many relationship.

This means that one student can enrol in many courses, while one course can have many students.

A join table called enrolments is used to manage this many-to-many relationship.

The enrolments table creates two one-to-many relationships:

- One student can have many enrolment records.
- One course can have many enrolment records.

The join table is necessary because it connects students to courses and stores additional information, such as student grades.

## 4. Database Index

The database uses the following index:

CREATE INDEX idx_enrolments_course
ON enrolments(course_id);

This index improves the speed of searching for students enrolled in a particular course.

It is useful when teachers or school administrators need to find all students taking a specific course.

## 5. SQL or NoSQL?

SQL is the best choice for this school database because the information is structured and has clear relationships.

SQL supports primary keys, foreign keys and unique constraints. These features help maintain data accuracy and prevent duplicate enrolments.

SQL also supports JOIN operations, which make it easier to retrieve information from different tables.

Therefore, a relational SQL database is suitable for managing students, courses, enrolments and grades.

## 6. Conclusion

The school database provides an organised way of managing student information, courses and enrolments.

Using SQL helps maintain accurate records, enforce relationships between tables and retrieve information efficiently.
