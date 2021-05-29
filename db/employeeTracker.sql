
/*example insert one row*/

--INSERT INTO products (flavor, price, quantity)
-- VALUES ("strawberry", 3.25, 75);

-- ### Alternative way to insert multiple rows
-- INSERT INTO products (flavor, price, quantity)
-- VALUES ("vanilla", 2.50, 100), ("chocolate", 3.10, 120), ("strawberry", 3.25, 75);


/* Seed to populate DB table data */
USE employee_DB;

/* Insert "Department" Table data */
INSERT INTO department (name)
VALUES 
    ("Sales"), 
    ("Engineering"), 
    ("Finance"), 
    ("Legal");
 
/* Insert "Role" Table data */
INSERT INTO role (title, salary, department_id)
VALUES 
    ("Sales Lead", 100000, 1), 
    ("Sales Person", 80000, 1), 
    ("Lead Engineer", 150000, 2), 
    ("Software Engineer", 120000, 2),
    ("Accountant", 125000, 3),
    ("Legal Team Lead", 250000, 4),
    ("Lawyer", 190000, 4);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
    ("John", "Doe", 1, NULL),
	("Mike", "Chan", 2, 1),
    ("Ashley", "Rodrigues", 3, NULL),
    ("Kevin", "Tupik", 4, 3),
    ("Malia", "Brown", 5, NULL),
    ("Sarah", "Lourd", 6, NULL),
    ("Tom", "Allen", 7, 6);


	


