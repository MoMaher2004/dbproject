const fs = require('fs') 
const connection = require('./db')

exports.teachers = async (req, res) => {
    connection.query('SELECT * FROM teachers', (err, results) => {
        if (err) {
          console.error('Error executing query:', err.message)
          return
        }
        const main = fs.readFileSync(`./comps/main.html`, 'utf-8')
        const title = fs.readFileSync(`./comps/title.html`, 'utf-8')
        const form = fs.readFileSync(`./comps/addteacherform.html`, 'utf-8')
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
            table = table.replace(/{{&ROWC3}}/g, `teachers`)
        });
        table += "</table>"
        let page = main.replace(/{{&CONTENT}}/g, form + title + table)
        page = page.replace(/{{&TITLE}}/g, 'Teachers')
        res.writeHead(200, {
            'Content-type': 'text/html'
        })
        res.end(page)
    })
}
exports.getTeacher = (req, res) => {
    connection.query(`SELECT * FROM teachers
            LEFT JOIN (
            SELECT teaches.teacherid ,courses.id AS courseid, courses.name AS coursename, courses.credits AS credits FROM teaches
            LEFT JOIN courses 
            on courseid = courses.id
            ) AS c
            on teachers.id = c.teacherid
            WHERE teachers.id = ?`, [req.params.id], (err, results) => {
        if (err) {
          console.error('Error executing query:', err.message)
          return
        }
        const main = fs.readFileSync('./comps/main.html', 'utf-8')
        const title = fs.readFileSync('./comps/title.html', 'utf-8')
        const row = fs.readFileSync('./comps/row.html', 'utf-8')
        const card = fs.readFileSync('./comps/teacherdatacard.html', 'utf-8')
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
        page = page.replace(/{{&TEACHERNAME}}/g, results[0]['name'])
        page = page.replace(/{{&TEACHERID}}/g, results[0]['id'])
        page = page.replace(/{{&TEACHEREMAIL}}/g, results[0]['email'])
        page = page.replace(/{{&TEACHERPHONE}}/g, results[0]['phone'])
        page = page.replace(/{{&TEACHERDEP}}/g, results[0]['department'])
        res.writeHead(200, {
            'Content-type': 'text/html'
        })
        res.end(page)
    })
}
exports.addTeacher = (req, res) => {
    connection.query('INSERT INTO teachers (id, name, email, department, phone) VALUES (?, ?, ?, ?, ?)', [req.body.id*1, req.body.name, req.body.email, req.body.department, req.body.phone], (err, results) => {
        if (err) {
          console.error('Error executing query:', err.message)
          return
        }
        res.redirect('/teachers')
    })
}
exports.deleteTeacher = (req, res) => {
    connection.query('DELETE FROM teachers WHERE id = ?', [req.params.id], (err, results) => {
        if (err) {
          console.error('Error executing query:', err.message)
          return
        }
        res.redirect('/teachers')
    })
}