
# School Database Design

## 1. Tables

### Students Table
The students table stores information about students.
It contains:
- id: Unique identification number for each student.
- name: Full name of the student.
- email: Email address of the student. Each email must be unique.

### Courses Table
The courses table stores information about courses.
It contains:
- id: Unique identification number for each course.
- title: Name of the course.
- teacher: Name of the teacher teaching the course.

### Enrolments Table
The enrolments table stores information about students registered for courses.
It contains:
- student_id: Identifies the student.
- course_id: Identifies the course.
- grade: Stores the student's grade.

The enrolments table uses a composite primary key made up of student_id and course_id. This prevents a student from enrolling in the same course more than once.

## 2. Relationships

Students and courses have a many-to-many relationship.

One student can enrol in many courses, while one course can have many students.

A join table called enrolments is used to manage this relationship.

The enrolments table creates two one-to-many relationships:
- One student can have many enrolment records.
- One course can have many enrolment records.

The join table is necessary because it connects students to courses and stores additional information such as grades.

## 3. Database Index

The database uses the following index:

CREATE INDEX idx_enrolments_course
ON enrolments(course_id);

This index improves the speed of searching for students enrolled in a particular course. It is useful when teachers need to find all students taking their courses.

## 4. SQL or NoSQL?

SQL is the best choice for this school database because the information is structured and has clear relationships.

SQL supports primary keys, foreign keys and unique constraints. These features help maintain data accuracy and prevent duplicate enrolments.

SQL also supports JOIN operations, which make it easier to retrieve information from different tables.

Therefore, a relational SQL database is suitable for managing students, courses, enrolments and grades.
