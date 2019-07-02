

// declaration of global array
var employees;
var departments;

// reads contents of employees data file
module.exports.initialize = () => {

    return new Promise(function (resolve, reject) {

        // adds fs module to read files
        var fs = require("fs");

        // reads data in employees.json file
        fs.readFile('./data/employees.json', (err1, data1) => {
            // if err1, reject
            if (err1) {
                reject("Unable to read employees file.");
            } else {
                // reads data in departments.json file
                fs.readFile('./data/departments.json', (err2, data2) => {
                    // if err2, reject
                    if (err2) {
                        reject("Unable to read departments file.");
                    } else {
                        // converts data to an array of contents
                        // assigns to employees and departments
                        employees = JSON.parse(data1);
                        departments = JSON.parse(data2);
                        resolve("File read successfully.");
                    }
                });
            }
        });
    });
}

// provides an array of employee objects
module.exports.getAllEmployees = () => {
    return new Promise(function (resolve, reject) {

        // checks if there is employee data
        if (employees.length == 0) {
            reject("No results returned.")
        } else {
            resolve(employees);
        }
    });
}

// provides an array of "employee" objects whose isManager property is true
module.exports.getManagers = () => {
    return new Promise(function (resolve, reject) {
        var managers = [];

        // loops through the employee array and copies values into managers array if isManager is true
        for (var i = 0; i < employees.length; i++) {
            if (employees[i].isManager) {
                managers.push(employees[i]);
            }
        }
        // checks if there is managers data
        if (managers.length == 0) {
            reject("No results returned.");
        } else {
            resolve(managers);
        }
    });
}

// provides an array of department objects
module.exports.getDepartments = () => {
    return new Promise(function (resolve, reject) {

        // checks if there is departments data
        if (departments.length == 0) {
            reject("No results returned.");
        } else {
            resolve(departments);
        }
    });
}

// exports module that adds employeeData to employees
module.exports.addEmployee = (employeeData) => {
    return new Promise(function (resolve, reject) {

        // checks if employeeData.isManager is undefined
        if (employeeData.isManager == undefined) {
            isManager = false;
        } else {
            isManager = true;
        }

        // sets the employeeNum property of employeeData to be the length of the employees array 
        employeeData.employeeNum = employees.length + 1;

        // adds employeeData to employees
        employees.push(employeeData);

        resolve();
    });
}

// provides an array of employee objects whose status property matches the status parameter 
module.exports.getEmployeesByStatus = (status) => {

    var arrayStatus = [];

    return new Promise((resolve, reject) => {

        // loops through employees
        for (let i = 0; i < employees.length; i++) {

            // checks if status property matches the status parameter 
            if (employees[i].status == status) {

                // adds employees at i to arrayStatus
                arrayStatus.push(employees[i]);
            }
        }

        // checks if no results are returned
        if (arrayStatus.length == 0) {
            reject("No results returned.");
        }
        resolve(arrayStatus);
    });
}

// provides an array of employee objects where department property matches the department parameter
module.exports.getEmployeesByDepartment = (department) => {

    var arrayDepartment = [];

    return new Promise((resolve, reject) => {

        // loops through employees
        for (let i = 0; i < employees.length; i++) {

            // checks if department property matches the department parameter 
            if (employees[i].department == department) {

                // adds employees at i to arrayDepartment
                arrayDepartment.push(employees[i]);
            }
        }

        // checks if no results are returned
        if (arrayDepartment.length == 0) {
            reject("No results returned.");
        }       
        resolve(arrayDepartment);
    });
}

// provides an array of employee objects where the employeeManagerNum property matches the department parameter
module.exports.getEmployeesByManager = (manager) => {

    var arrayEmployees = [];

    return new Promise((resolve, reject) => {

        // loops through employees
        for (let i = 0; i < employees.length; i++) {

            // checks if employeeManagerNum property matches the manager parameter 
            if (employees[i].employeeManagerNum == manager) {

                // adds employees at i to arrayEmployees
                arrayEmployees.push(employees[i]);
            }
        }
        // checks if no results are returned
        if (arrayEmployees.length == 0) {
            reject("No results returned.");
        }
        resolve(arrayEmployees);
    });
}

// provides a single employee object where the employeeNum property matches the num parameter
module.exports.getEmployeeByNum = (num) => {

    return new Promise((resolve, reject) => {

        // loops through employees
        for (let i = 0; i < employees.length; i++) {

            // checks if employeeNum property matches the num parameter
            if (employees[i].employeeNum == num) {

                // returns one employee
                resolve(employees[i]);
            }
        }
        // rejects if no results are returned
        reject("No results returned.");
    });
}

// searches through employees array for an employee with an employeeNum that matches employeeData
// if there is a match, overwrite it with the new employee passed in to the function parameter (employeeData)
module.exports.updateEmployee = (employeeData) => {

    return new Promise((resolve, reject) => {

        // loops through employees
        for (let i = 0; i < employees.length; i++) {

            // checks if employeeNum property matches the employeeData parameter 
            if (employees[i].employeeNum == employeeData.employeeNum) {

                // if matching employee is found, overwrites it with the new employee passed into the function parameter (employeeData)
                employees[i] = employeeData;
                resolve();
            } 
        }
        reject("No results returned.");
    });
}




