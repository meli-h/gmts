DROP DATABASE IF EXISTS gymdb;

CREATE DATABASE gymdb
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE gymdb;

CREATE TABLE Account(

account_id INT AUTO_INCREMENT UNIQUE PRIMARY KEY,
username VARCHAR(50) NOT NULL UNIQUE,
account_password VARCHAR(60) NOT NULL,
account_type ENUM('Trainer','GymMember','Administrator')
);

CREATE TABLE GymMember(

gymMember_id INT AUTO_INCREMENT UNIQUE PRIMARY KEY,
name VARCHAR(50) NOT NULL,
surname VARCHAR(50) NOT NULL,
contactNumber       VARCHAR(20),
DateOfBirth         DATE,
Gender              ENUM('Male','Female','Other'),
membership_type     ENUM('Monthly','Quarterly','Yearly'),
member_start_date   DATE,
member_end_date     DATE,
account_id INT NOT NULL,
FOREIGN KEY (account_id) REFERENCES Account(account_id)
	ON DELETE CASCADE
);

CREATE TABLE Trainer(

trainer_id INT AUTO_INCREMENT UNIQUE PRIMARY KEY,
name VARCHAR(50) NOT NULL,
surname VARCHAR(50) NOT NULL,
contactNumber       VARCHAR(20),
DateOfBirth         DATE,
Gender              ENUM('Male','Female','Other'),
account_id INT NOT NULL,
FOREIGN KEY (account_id) REFERENCES Account(account_id)
	ON DELETE CASCADE
);

CREATE TABLE Administrator(

administrator_id INT AUTO_INCREMENT UNIQUE PRIMARY KEY,
account_id INT NOT NULL,
FOREIGN KEY (account_id) REFERENCES Account(account_id)
	ON DELETE CASCADE
);

CREATE TABLE Class (
  class_id      INT AUTO_INCREMENT UNIQUE PRIMARY KEY,
  trainer_id    INT NOT NULL,
  title         VARCHAR(100) ,
  start_time    DATETIME NOT NULL,
  duration      INT,                 -- dakika
  capacity      INT DEFAULT 10,
  FOREIGN KEY (trainer_id) REFERENCES Trainer(trainer_id)
      ON DELETE CASCADE
);

CREATE TABLE Booking (
  booking_id    INT AUTO_INCREMENT UNIQUE PRIMARY KEY,
  class_id      INT NOT NULL,
  gymMember_id  INT NOT NULL,
  UNIQUE (class_id, gymMember_id),          -- aynı üye aynı dersi 2× alamaz
  FOREIGN KEY (class_id)     REFERENCES Class(class_id)     ON DELETE CASCADE,
  FOREIGN KEY (gymMember_id) REFERENCES GymMember(gymMember_id) ON DELETE CASCADE
);