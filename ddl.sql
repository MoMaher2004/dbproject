
CREATE TABLE courses (
  id varchar(6) NOT NULL,
  name varchar(20) NOT NULL,
  credits int DEFAULT NULL,
  PRIMARY KEY (id),
  CONSTRAINT c CHECK (((credits > 0) and (credits < 5)))
);

CREATE TABLE students (
  id int NOT NULL,
  name varchar(100) NOT NULL,
  email varchar(100) DEFAULT NULL,
  department varchar(3) DEFAULT NULL,
  phone varchar(11) DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY email (email),
  CONSTRAINT c CHECK ((department in ('CSE','CAE','ECE','GEN')))
);

CREATE TABLE studies (
  studentid int NOT NULL,
  courseid varchar(6) CHARACTER NOT NULL,
  year int NOT NULL,
  semester int NOT NULL,
  mark int DEFAULT NULL,
  UNIQUE KEY studentid (studentid,courseid,year,semester),
  CONSTRAINT c CHECK ((((mark <= 100) and (mark > 0)) or (mark = -(1))))
);

CREATE TABLE teachers (
  id int NOT NULL,
  name varchar(100) NOT NULL,
  email varchar(100) DEFAULT NULL,
  department varchar(3) DEFAULT NULL,
  phone varchar(11) DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY email (email),
  CONSTRAINT c CHECK ((department in ('CSE','CAE','ECE','GEN')))
);

CREATE TABLE teaches (
  teacherid int NOT NULL,
  courseid varchar(6) NOT NULL,
  year int NOT NULL,
  semester int NOT NULL,
  UNIQUE KEY teacherid (teacherid,courseid,year,semester)
);
