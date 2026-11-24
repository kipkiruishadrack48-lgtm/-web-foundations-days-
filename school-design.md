
# Day 6 Assignment: School Database Design

## 1. Introduction

This database is designed to manage students, courses and student enrolments in a school.

It stores student information, course details and the grades students receive.

## 2. Tables

### Students Table

The students table stores information about students.

Columns:
- id: Primary key that uniquely identifies each student.
- name: Stores the student's full name.
- email: Stores the student's email address. It must be unique.

### Courses Table

The courses table stores information about available courses.

Columns:
- id: Primary key that uniquely identifies each course.
- course_name: Stores the name of the course.

### Enrolments Table

The enrolments table records students who have enrolled in courses.

Columns:
- id: Primary key that identifies each enrolment.
- student_id: Foreign key referencing the students table.
- course_id: Foreign key referencing the courses table.
- grade: Stores the student's grade.

## 3. Relationships

### One-to-Many Relationship

One student can enrol in many courses. The enrolments table uses student_id as a foreign key to connect each enrolment to a student.

One course can also have many enrolments from different students.

### Many-to-Many Relationship

Students and courses have a many-to-many relationship because one student can enrol in many courses, and one course can have many students.

The enrolments table acts as a join table connecting students and courses.

It also stores the grade for each enrolment.

## 4. Database Index

I would create an index on student_id in the enrolments table.

This would make it faster to search for all courses belonging to a particular student.

SQL statement:

CREATE INDEX idx_enrolments_student_id
ON enrolments(student_id);

## 5. Choice Between SQL and NoSQL

I would choose SQL for this school database.

SQL is suitable because the system has structured information about students, courses and enrolments.

It supports primary keys, foreign keys and relationships between tables. It also helps maintain accurate and consistent records.

SQL databases are therefore a good choice for managing school information.

## 6. Conclusion

The database uses three tables: students, courses and enrolments.

Primary keys and foreign keys establish relationships between the tables.

The database can store student details, manage course enrolments and update student grades efficiently.
