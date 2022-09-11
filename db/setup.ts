import Database from "better-sqlite3";

const db = Database ('./db/data.db', { verbose: console.log })

function Applicants() { 
    const applicants = [
        {
          name: 'Applicant 1',
          email: 'applicant1@gmail.com'
        },
        {
          name: 'Applicant 2',
          email: 'applicant2@gmail.com'
        },
        {
          name: 'Applicant 3',
          email: 'applicant3@gmail.com'
        },
        {
          name: 'Applicant 4',
          email: 'applicant4@gmail.com'
        },
        {
          name: 'Applicant 5',
          email: 'applicant5@gmail.com'
        }
      ]

    const dropApplicantsTable = db.prepare(`
    DROP TABLE IF EXISTS applicants;
    `)
    dropApplicantsTable.run()

    const createApplicantsTable = db.prepare(`
    CREATE TABLE IF NOT EXISTS applicants(
        id INTEGER,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        PRIMARY KEY (id)
    );
    `)

    createApplicantsTable.run()


    const createApplicant = db.prepare(`
    INSERT INTO applicants (name, email) VALUES (@name, @email);
    `)

    for (let applicant of applicants) createApplicant.run(applicant)
}

function Interviewers() {
    const interviewers = [
        {
          name: 'Interviewer 1',
          email: 'interviewer1@gmail.com',
          companyId: 1
        },
        {
          name: 'Interviewer 2',
          email: 'interviewer2@gmail.com',
          companyId: 1
        },
        {
          name: 'Interviewer 3',
          email: 'interviewer3@gmail.com',
          companyId: 1
        },
        {
          name: 'Interviewer 4',
          email: 'interviewer4@gmail.com',
          companyId: 1
        },
        {
          name: 'Interviewer 5',
          email: 'interviewer5@gmail.com',
          companyId: 1
        }
      ]

    const dropInterviewersTable = db.prepare(`
    DROP TABLE IF EXISTS interviewers;
    `)
    dropInterviewersTable.run()

    const createInterviewersTable= db.prepare(`
    CREATE TABLE IF NOT EXISTS interviewers (
        id INTEGER,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        companyId INTEGER,
        PRIMARY KEY (id)
    );
    `)
    createInterviewersTable.run()

    const createInterviewer = db.prepare(`
    INSERT INTO interviewers (name, email, companyId) VALUES (@name, @email, @companyId);
    `)
    for (let interviewer of interviewers) createInterviewer.run(interviewer)
}
  
function Interview(){
    const interviews = [
        {
          applicantId: 1,   
          interviewerId: 1,
          date: '27/09/2022',
          place: 'Prishtinë',
          successful: 'Yes'
        },
        {
          applicantId: 2,
          interviewerId: 1,
          date: '27/09/2022',
          place: 'Prishtinë',
          successful: 'Yes'
        },
        {
          applicantId: 3,
          interviewerId: 2,
          date: '27/09/2022',
          place: 'Prishtinë',
          successful: 'No'
        },
        {
          applicantId: 3,
          interviewerId: 5,
          date: '27/09/2022',
          place: 'Prishtinë',
          successful: 'No'
        },
        {
          applicantId: 4,
          interviewerId: 3,
          date: '27/09/2022',
          place: 'Prishtinë',
          successful: 'No'
        },
        {
          applicantId: 5,
          interviewerId: 4,
          date: '27/09/2022',
          place: 'Prishtinë',
          successful: 'No'
        },
      ]

    const dropInterviewsTable = db.prepare(`
    DROP TABLE IF EXISTS interviews;
    `)

    dropInterviewsTable.run()

    const createInterviewsTable  = db.prepare(`
    CREATE TABLE IF NOT EXISTS interviews (
    id INTEGER,
    applicantId INTEGER,
    interviewerId INTEGER,
    date TEXT NOT NULL,
    place TEXT NOT NULL,
    successful TEXT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (applicantId) REFERENCES applicants(id) ON DELETE CASCADE,
    FOREIGN KEY (interviewerId) REFERENCES interviewers(id) ON DELETE CASCADE
    );
    `)

    createInterviewsTable.run()

    const createInterview = db.prepare(`
    INSERT INTO interviews (applicantId, interviewerId, date, place, successful) VALUES (@applicantId, @interviewerId, @date, @place, @successful);
    `)

    for (let interview of interviews) createInterview.run(interview)
}

function Company(){
    const companies = [
        {
          name: "HardSoft",
          city: "Prishtinë" 
        }
      ]

    const dropCompaniesTable = db.prepare(`
    DROP TABLE IF EXISTS companies;
    `)
    dropCompaniesTable.run()

    const createCompaniesTable = db.prepare(`
    CREATE TABLE IF NOT EXISTS companies(
        id INTEGER,
        name TEXT NOT NULL,
        city TEXT NOT NULL,
        PRIMARY KEY (id)
    );
    `)  

    createCompaniesTable.run()

    const createCompany = db.prepare(`
    INSERT INTO companies (name, city) VALUES (@name, @city);
    `)

    for (let company of companies) createCompany.run(company)
}   

function Employee(){
    const employees = [
        {
          name: "Employee 1",
          email: "employee1@gmail.com",
          position: "Developer",
          companyId: 1
        },
        {
          name: "Employee 2",
          email: "employee2@gmail.com",
          position: "Team Leader",
          companyId: 1
          
        },
        {
          name: "Employee 3",
          email: "employee3@gmail.com",
          position: "CEO",
          companyId: 2
        },
      ]

    const dropEmployeesTable = db.prepare(`
        DROP TABLE IF EXISTS employees;
    `)
    dropEmployeesTable.run()

    const createEmployeesTable = db.prepare(`
    CREATE TABLE IF NOT EXISTS employees(
        id INTEGER,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        position TEXT NOT NULL,
        companyId INTEGER,  
        PRIMARY KEY (id)
    );
    `)

    createEmployeesTable.run()

    const createEmployee = db.prepare(`
    INSERT INTO employees (name, email, position, companyId) VALUES (@name, @email, @position, @companyId);
    `)

    for (let employee of employees) createEmployee.run(employee)
}
  
Applicants()
Interviewers()
Interview() 
Company()
Employee()

  


