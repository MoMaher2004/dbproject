const fs = require('fs') 
const connection = require('./db')

exports.students = async (req, res) => {
    connection.query('SELECT * FROM students', (err, results) => {
        if (err) {
          console.error('Error executing query:', err.message)
          return
        }
        const main = fs.readFileSync(`./comps/main.html`, 'utf-8')
        const title = fs.readFileSync(`./comps/title.html`, 'utf-8')
        const form = fs.readFileSync(`./comps/addstudentform.html`, 'utf-8')
        const row = fs.readFileSync(`./comps/row.html`, 'utf-8')
        let table = `<table>`
        table += `
            <tr>
                <td>ID</td>
                <td>Name</td>
                <td>Dep.</td>
            </tr>`
        results.forEach(e => {
            table += row
            table = table.replace(/{{&ROWC0}}/g, e['id'])
            table = table.replace(/{{&ROWC1}}/g, e['name'])
            table = table.replace(/{{&ROWC2}}/g, e['department'])
            table = table.replace(/{{&ROWC3}}/g, `students`)
        });
        table += "</table>"
        let page = main.replace(/{{&CONTENT}}/g, form + title + table)
        page = page.replace(/{{&TITLE}}/g, 'Students')
        res.writeHead(200, {
            'Content-type': 'text/html'
        })
        res.end(page)
    })
}
exports.getStudent = (req, res) => {
    connection.query(`SELECT * FROM students
            LEFT JOIN (
            SELECT studies.studentid ,courses.id AS courseid, courses.name AS coursename, courses.credits AS credits FROM studies
            LEFT JOIN courses 
            on courseid = courses.id
            ) AS c
            on students.id = c.studentid
            WHERE students.id = ?`, [req.params.id], (err, results) => {
        if (err) {
          console.error('Error executing query:', err.message)
          return
        }
        const main = fs.readFileSync('./comps/main.html', 'utf-8')
        const title = fs.readFileSync('./comps/title.html', 'utf-8')
        const row = fs.readFileSync('./comps/row.html', 'utf-8')
        const card = fs.readFileSync('./comps/studentdatacard.html', 'utf-8')
        let table = "<table>"
        table += `
            <tr>
                <td>ID</td>
                <td>Name</td>
                <td>Credits</td>
            </tr>`
        results.forEach(e => {
            table += row
            table = table.replace(/{{&ROWC0}}/g, e['courseid'])
            table = table.replace(/{{&ROWC1}}/g, e['coursename'])
            table = table.replace(/{{&ROWC2}}/g, e['credits'])
            table = table.replace(/{{&ROWC3}}/g, 'courses')
        });
        table += "</table>"
        let page = main.replace(/{{&CONTENT}}/g, card + table)
        page = page.replace(/{{&STUDENTNAME}}/g, results[0]['name'])
        page = page.replace(/{{&STUDENTID}}/g, results[0]['id'])
        page = page.replace(/{{&STUDENTEMAIL}}/g, results[0]['email'])
        page = page.replace(/{{&STUDENTPHONE}}/g, results[0]['phone'])
        page = page.replace(/{{&STUDENTDEP}}/g, results[0]['department'])
        res.writeHead(200, {
            'Content-type': 'text/html'
        })
        res.end(page)
    })
}
exports.addStudent = (req, res) => {
    connection.query('INSERT INTO students (id, name, email, department, phone) VALUES (?, ?, ?, ?, ?)', [req.body.id*1, req.body.name, req.body.email, req.body.department, req.body.phone], (err, results) => {
        if (err) {
          console.error('Error executing query:', err.message)
          return
        }
        res.redirect('/students')
    })
}
exports.deleteStudent = (req, res) => {
    connection.query('DELETE FROM students WHERE id = ?', [req.params.id], (err, results) => {
        if (err) {
          console.error('Error executing query:', err.message)
          return
        }
        res.redirect('/students')
    })
}