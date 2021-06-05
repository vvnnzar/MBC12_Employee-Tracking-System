//======== Dependencies===================//
const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");

//========Get Database Connection===================//

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "JosieMary@1",
  database: "employee_DB",
});

connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}`);
  startPrompt();
});

//========Menu Prompts===================//

async function startPrompt() {
  console.log(
    "***************************************************************\n Employee Management System! \n***************************************************************"
  );

  const { choice } = await inquirer.prompt([
    {
      type: "list",
      message: "What would you like to do?",
      name: "choice",
      choices: [
        "View All Employees",
        "View All Departments",
        "View All Roles",
        "View All Employees by Department and Manager",
        "View All Employees by Role",
        "Add Employee",
        "Add Role",
        "Add Department",
        "Update Employee",
        "Update Role",
        "Update Department",
        "Remove Employee",
        "Remove Role",
        "Remove Department",
        "Exit Application",
      ],
    },
  ]);

  switch (choice) {
    case "View All Employees": {
      viewEmployees();
      break;
    }
    case "View All Departments": {
      viewDepartments();
      break;
    }
    case "View All Roles": {
      viewRoles();
      break;
    }
    case "View All Employees by Department and Manager": {
      viewEmployeeData();
      break;
    }
    case "View All Employees by Role": {
      viewEmployeeRole();
      break;
    }
    case "Add Employee": {
      addEmployee();
      break;
    }
    case "Add Department": {
      addDepartment();
      break;
    }
    case "Add Role": {
      addRole();
      break;
    }
    case "Update Employee": {
      updateEmployee();
      break;
    }
    case "Remove Employee": {
      removeEmployee();
      break;
    }
    case "Exit Application": {
      connection.end();
    }
  }

  //==========View Functions=================//
  function viewEmployeeData() {
    view(`SELECT e.first_name, e.last_name, r.title, m.first_name as manager_firstname, m.last_name as manager_lastname,  d.name as departmentName from employee e
      INNER JOIN role r on r.id = e.role_id                
      LEFT JOIN  employee m on e.manager_id = m.id                
      INNER JOIN department d on d.id = r.department_id               
      ORDER by d.name;`);
  }

  function viewEmployeeRole() {
    view(`SELECT e.*, r.title from employee e
  INNER JOIN role r ON r.id = e.role_id;`);
  }

  function viewRoles() {
    view(`SELECT * from roles;`);
  }

  function viewDepartments() {
    view(`SELECT * from department;`);
  }

  function viewEmployees() {
    view(`SELECT * from employee;`);
  }

  //==========Add Functions=================//
  async function addEmployee() {
    const { firstName, lastName } = await inquirer.prompt([
      {
        type: "input",
        name: "firstName",
        message: "Enter Employee First Name",
      },
      {
        type: "input",
        name: "lastName",
        message: "Enter Employee Last Name",
      },
    ]);

    const allRoles = await query("select * from role");

    const { role } = await inquirer.prompt([
      {
        type: "list",
        message: "Select new Employee Role",
        name: "role",
        choices: allRoles.map((role) => role.title),
      },
    ]);

    const { id: roleId } = allRoles.find((r) => r.title === role);

    const allEmployees = await query("select * from employee");
    const { manager } = await inquirer.prompt([
      {
        type: "list",
        message: "Select new Employee Manager",
        name: "manager",
        choices: allEmployees.map(
          (employee) => employee.first_name + " " + employee.last_name
        ),
      },
    ]);

    const { id: managerId } = allEmployees.find(
      (e) => e.first_name + " " + e.last_name === manager
    );

    add(`INSERT INTO employee SET ?`, {
      first_name: firstName,
      last_name: lastName,
      role_id: roleId,
      manager_id: managerId,
    });
  }

  async function addDepartment() {
    const { deptName } = await inquirer.prompt([
      {
        type: "input",
        name: "deptName",
        message: "Enter department name",
      },
    ]);

    add(`INSERT INTO department set ?`, {
      name: deptName,
    });
  }

  async function addRole() {
    const { roleTitle, roleSalary } = await inquirer.prompt([
      {
        type: "input",
        name: "roleTitle",
        message: "Enter Role Title",
      },
      {
        type: "input",
        name: "roleSalary",
        message: "Enter Role Salary Amount",
      },
    ]);

    add(`INSERT INTO role set ?`, {
      title: roleTitle,
      salary: roleSalary,
    });
  }

  //==========Update Functions=================//
  async function updateEmployee() {
    const { employeeId, firstName, lastName, managerId, roleId } =
      await inquirer.prompt([
        {
          type: "input",
          name: "employeeId",
          message: "Enter employee ID",
        },
        {
          type: "input",
          name: "firstName",
          message: "Enter employees First Name",
          default: undefined,
        },
        {
          type: "input",
          name: "lastName",
          message: "Enter employees Last Name",
          default: undefined,
        },
        {
          type: "input",
          name: "roleId",
          message: "Enter Role ID",
          default: undefined,
        },
        {
          type: "input",
          name: "managerId",
          message: "Enter Manager ID",
          default: undefined,
        },
      ]);

    try {
      update(`UPDATE employee SET ? WHERE ?`, [
        {
          manager_id: managerId,
          role_id: roleId,
          first_name: firstName,
          last_name: lastName,
        },
        {
          id: employeeId,
        },
      ]);
    } catch (e) {
      console.log(
        "The information provided was incorrect. Returning to main menu"
      );
      startPrompt();
    }
  }

  //==========Remove Functions=================//
  async function removeEmployee() {
    const { employeeId } = await inquirer.prompt([
      {
        type: "input",
        name: "employeeId",
        message: "Enter employee ID to remove",
      },
    ]);

    try {
      remove(`DELETE FROM employee WHERE ?`, [
        {
          id: employeeId,
        },
      ]);
    } catch (e) {
      console.log(
        "The information provided was incorrect. Returning to main menu"
      );
      startPrompt();
    }
  }

  //==========Generic functions query, add, update, remove, view=================//

  function query(queryString) {
    return new Promise((resolve, reject) => {
      connection.query(queryString, (err, res) => {
        if (err) reject(err);
        resolve(res);
      });
    });
  }

  function view(queryString) {
    connection.query(queryString, (err, res) => {
      if (err) throw err;
      console.table(res);
      startPrompt();
    });
  }

  function add(queryString, args) {
    connection.query(queryString, args, (err, res) => {
      if (err) throw err;
      console.table(res);
      startPrompt();
    });
  }

  function update(queryString, args) {
    connection.query(queryString, args, (err, res) => {
      if (err) throw err;
      console.table(res);
      startPrompt();
    });
  }

  function remove(queryString, args) {
    connection.query(queryString, args, (err, res) => {
      if (err) throw err;
      console.table(res);
      startPrompt();
    });
  }
}
