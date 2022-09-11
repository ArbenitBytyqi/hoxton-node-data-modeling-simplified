import express, { application, response } from 'express'
import cors from 'cors'
import Database from "better-sqlite3";

const db = Database ("./db/data.db", {verbose: console.log})
const app = express()
app.use(cors())
app.use(express.json())
const port = 5000

// APLICANT queries

const getApplicantById = db.prepare(`
SELECT * FROM applicants WHERE id = @id;
`)

const getInterviewsForApplicant = db.prepare(`
SELECT * FROM interviews WHERE applicantId = @applicantId;
`)

const getInterviewersForApplicant = db.prepare(`
SELECT interviewers.* FROM interviewers
JOIN interviews ON interviewers.id = interviews.interviewerId
WHERE interviews.applicantId = @applicantId;
`)

const createApplicant = db.prepare(`
    INSERT INTO applicants (name, email) VALUES (?, ?);
`)

const getApplicants = db.prepare(`
    SELECT * FROM applicants;
`)

const deleteApplicant = db.prepare(`
DELETE FROM applicants WHERE id = ?;
`)

// INTERVIEWER queries

const getInterviewers= db.prepare(`
    SELECT * FROM interviewers;
`)

const createInterviewer = db.prepare(`
    INSERT INTO interviewers (name, email) VALUES (?, ?);
`)

const deleteInterviewer = db.prepare(`
DELETE FROM interviewers WHERE id = ?;
`)

const getInterviewsForInterviewers = db.prepare(`
SELECT * FROM interviews WHERE interviewerId = @interviewerId;
`)

const getInterviewerById = db.prepare(`
SELECT * FROM interviewers WHERE id = @id;
`)

const getApplicantsForInterviewer = db.prepare(`
SELECT applicants.* FROM applicants
JOIN interviews ON applicants.id = interviews.applicantId
WHERE interviews.interviewerId = @interviewerId;
`)


// INTERVIEW queries

const getInterviews = db.prepare(`
    SELECT * FROM interviews;
`)

const createInterview = db.prepare(`
    INSERT INTO interviews (applicantId, interviewerId, date, place) VALUES (?, ?, ?, ?);
`)

const getInterviewsById = db.prepare(`
SELECT * FROM interviews WHERE id = ?;
`)

const deleteInterview = db.prepare(`
DELETE FROM interviews WHERE id = ?;
`)

//EMPLOYEES queries

const getEmployees= db.prepare(`
    SELECT * FROM employees;
`)

const getEmployeesById = db.prepare(`
SELECT * FROM employees WHERE id = ?;
`)

const createEmployees = db.prepare(`
    INSERT INTO employees (name, email, position, companyId) VALUES (?, ?, ?, ?);
`)

const deleteEmployee = db.prepare(`
DELETE FROM employees WHERE id = ?;
`)

// COMPANY queries

const getCompanies= db.prepare(`
    SELECT * FROM companies;
`)

const getCompaniesById = db.prepare(`
SELECT * FROM companies WHERE id = ?;
`)

const createCompanies = db.prepare(`
    INSERT INTO companies (name, city) VALUES (?, ?);
`)

const getEmployeesforCompanies = db.prepare(`
    SELECT * FROM employees WHERE companyId = ?;
`)

const deleteCompany = db.prepare(`
DELETE FROM companies WHERE id = ?;
`)

// APLICANT

app.get('/applicants', (req, res) => {
    const applicants = getApplicants.all()
    res.send(applicants)
})

app.get('/applicants/:id', (req, res) =>{
    const applicant = getApplicantById.get(req.params)

    if(applicant){
        applicant.interviews = getInterviewsForApplicant.all({ applicantId: applicant.id })
        applicant.interviewers =  getInterviewersForApplicant.all({ applicantId: applicant.id })
        res.send(applicant)
    } else{
        res.status(404).send({error: 'Applicant not found'})
    }
})

app.post('/applicants', (req, res) => {
    const name = req.body.name
    const email = req.body.email

      let errors: string[] = []
      
      if (typeof name !== 'string') {
          errors.push('Name not given!')
        }
     
      if(typeof email  !=='string') {
          errors.push('Email not given')
      }
      
      if (errors.length > 0){
        res.status(400).send({ errors })
    }else{
        const info = createApplicant.run(name, email)
        const applicant = getApplicantById.get(info.lastInsertRowid)
        res.send(applicant)
    }
})

app.delete('/applicants/:id', (req, res) => {
    const id = Number(req.params.id)
    const info = deleteApplicant.run(id)

    if(info.changes){
        res.send({message: 'Applicant successfully deleted.' })
    } else {
        res.status(404).send({error: 'Applicant not found 😒.' })
    }
})

// INTERVIEWER

app.get('/interviewers', (req, res) => {
    const interviewers = getInterviewers.all()
    res.send(interviewers)
})

app.get('/interviewers/:id', (req, res) =>{
    const interviewer = getInterviewerById.get(req.params)

    if(interviewer){
        interviewer.interviews = getInterviewsForInterviewers.all({ interviewerId: interviewer.id })
        interviewer.applicants =  getApplicantsForInterviewer.all({ interviewerId: interviewer.id })
        res.send(interviewer)
    } else{
        res.status(404).send({error: 'Interviewer not found'})
    }
})

app.post('/interviewers', (req, res) => {
    const name = req.body.name
    const email = req.body.email

      let errors: string[] = []
      
      if (typeof name !== 'string') {
          errors.push('Name not given!')
        }
     
      if(typeof email  !=='string') {
          errors.push('Email not given')
      }
      
      if (errors.length > 0){
        res.status(400).send({ errors })
    }else{
        const info = createInterviewer.run(name, email)
        const interviewer = getApplicantById.get(info.lastInsertRowid)
        res.send(interviewer)
    }
})

app.delete('/interviewers/:id', (req, res) => {
    const id = Number(req.params.id)
    const info = deleteInterviewer.run(id)

    if(info.changes){
        res.send({message: 'Interviewer successfully deleted.' })
    } else {
        res.status(404).send({error: 'Interviewer not found 😒.' })
    }
})

// INTERVIEWS

app.get('/interviews', (req, res) => {
    const interviews = getInterviews.all()
    res.send(interviews)
})

app.post('/interviews', (req, res) => {
    const applicantId = req.body.applicantId
    const interviewerId = req.body.interviewerId
    const date = req.body.date
    const place = req.body.place
    const successful = req.body.successful
    
      let errors: string[] = []

      if (typeof applicantId !== 'number') {
          errors.push('Applicant Id not given')
        }
      if(typeof interviewerId  !=='number') {
          errors.push('Interviewer Id not given')
      }
      if(typeof date  !=='string') {
          errors.push('Date not given')
      }
      if(typeof place  !=='string') {
          errors.push('Place not given')
      }
      if(typeof successful  !=='string') {
        errors.push('Interview outcome not given')
      }

      if (errors.length > 0){
        res.status(400).send({ errors })
    }else{
          const interviewInfo = createInterview.run(applicantId, interviewerId, date, place)
        const newInterviews = getInterviewsById.get(interviewInfo.lastInsertRowid)
        res.send(newInterviews)
        }
})

app.delete('/interviews/:id', (req, res) => {
    const id = Number(req.params.id)
    const info = deleteInterview.run(id)

    if(info.changes){
        res.send({message: 'Interview successfully deleted.' })
    } else {
        res.status(404).send({error: 'Interviewer not found 😒.' })
    }
})

// EMPLOYEES

app.get('/employees', (req, res) => {
    const employees = getEmployees.all()
    for(let employee of employees){
        employee.companies = getCompaniesById.get(employee.companyId)
    }
    res.send(employees)
})

app.get('/employees/:id', (req, res) => {
    const id = Number(req.params.id)
    const employee = getEmployeesById.get(id)
    if (employee) {
        employee.companies = getCompaniesById.get(employee.companyId)
      res.send(employee)
    } else {
      res.status(404).send({ error: 'Employee not found' })
    }
})

app.post('/employees', (req, res) => {
    const name = req.body.name
    const email = req.body.email
    const position = req.body.position
    const companyId = req.body.companyId
      let errors: string[] = []
      
      if (typeof name !== 'string') {
          errors.push('Name not given!')
        }
      if(typeof email  !=='string') {
          errors.push('City not given')
      }
      if(typeof position  !=='string') {
          errors.push('Position not given')
      }
      if(typeof companyId  !=='number') {
          errors.push('Company Id not given')
      }

      if( errors.length === 0)  {
        const employeeInfo = createEmployees.run(name, email, position, companyId)
        const newEmployee = getEmployeesById.get(employeeInfo.lastInsertRowid)
        res.send(newEmployee)
      }
      else {
          res.status(400).send({ errors: errors })
        }
})

app.delete('/employees/:id', (req, res) => {
    const id = Number(req.params.id)
    const info = deleteEmployee.run(id)

    if(info.changes){
        res.send({message: 'Employee successfully deleted.' })
    } else {
        res.status(404).send({error: 'Employee not found 😒.' })
    }
})

// COMPANY

app.get('/companies', (req, res) => {
    const companies = getCompanies.all()
    for(let company of companies){
        company.employees = getEmployeesforCompanies.all(company.id)
    }
    res.send(companies)
})

app.get('/companies/:id', (req, res) => {
    const id = Number(req.params.id)
    const company = getCompaniesById.get(id)
    if (company) {
        company.employees = getEmployeesforCompanies.all(company.id)
      res.send(company)
    } else {
      res.status(404).send({ error: 'Company not found' })
    }
})

app.post('/companies', (req, res) => {
    const name = req.body.name
    const city = req.body.city
      let errors: string[] = []
      
      if (typeof name !== 'string') {
          errors.push('Name not given!')
        }
      if(typeof city  !=='string') {
          errors.push('City not given')
      }
     
      if( errors.length === 0)  {
        const companyInfo = createCompanies.run(name, city)
        const newCompany = getCompaniesById.get(companyInfo.lastInsertRowid)
        res.send(newCompany)
      }
      else {
          res.status(400).send({ errors: errors })
        }
})

app.delete('/companies/:id', (req, res) => {
    const id = Number(req.params.id)
    const info = deleteCompany.run(id)

    if(info.changes){
        res.send({message: 'Company successfully deleted.' })
    } else {
        res.status(404).send({error: 'Company not found 😒.' })
    }
})

// GENERAL

app.listen(port, () => {
    console.log (`App running on : http://localhost:${port} `)
})
