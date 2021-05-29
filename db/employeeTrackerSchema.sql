-- Drops the database if it exists -- 
DROP DATABASE IF EXISTS employee_DB;

-- Creates the "employee_DB" database --
CREATE DATABASE employee_DB;

-- USE to only affect employee_db --
USE employee_DB;

-- Create table to store department information --
CREATE TABLE department(
	id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30),
    PRIMARY KEY(id)
);

-- Create table to store employee role information --
CREATE TABLE role(
	id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL, 
    salary DECIMAL,
    department_id INT,
    CONSTRAINT fk_department FOREIGN KEY (department_id) 
    REFERENCES department(id)
		ON UPDATE CASCADE
        ON DELETE CASCADE,
    PRIMARY KEY(id)
);


-- Create table to store employee information --
CREATE TABLE employee(
	id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    manager_id INT,
	CONSTRAINT fk_role FOREIGN KEY (role_id) 
    REFERENCES role(id) 
		ON UPDATE CASCADE 
        ON DELETE CASCADE,
    CONSTRAINT fk_employee FOREIGN KEY (manager_id) 
    REFERENCES employee(id) 
		ON UPDATE CASCADE 
        ON DELETE CASCADE,
    PRIMARY KEY (id)
);


