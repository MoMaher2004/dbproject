const fs = require('fs') 
const connection = require('./db')

exports.courses = async (req, res) => {
    connection.query('SELECT * FROM courses', (err, results) => {
        if (err) {
          console.error('Error executing query:', err.message)
          return
        }
        const main = fs.readFileSync(`./comps/main.html`, 'utf-8')
        const title = fs.readFileSync(`./comps/title.html`, 'utf-8')
        const form = fs.readFileSync(`./comps/addcourseform.html`, 'utf-8')
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
            table = table.replace(/{{&ROWC2}}/g, e['credits'])
            table = table.replace(/{{&ROWC3}}/g, `courses`)
        });
        table += "</table>"
        let page = main.replace(/{{&CONTENT}}/g, form + title + table)
        page = page.replace(/{{&TITLE}}/g, 'Courses')
        res.writeHead(200, {
            'Content-type': 'text/html'
        })
        res.end(page)
    })
}
exports.getCourse = (req, res) => {
    connection.query(`SELECT * FROM courses
            LEFT JOIN (
            SELECT teachers.id AS teacherid, teachers.name AS teachername, teachers.department AS teacherdepartment, courseid FROM teaches
            LEFT JOIN teachers ON teaches.teacherid = teachers.id
            ) AS t ON courses.id = t.courseid
            LEFT JOIN (
            SELECT students.id AS studentid, students.name AS studentname, students.department AS studentdepartment, courseid FROM studies
            LEFT JOIN students ON studies.studentid = students.id
            ) AS s ON courses.id = s.courseid
            WHERE id = ?`, [req.params.id], (err, results) => {
        if (err) {
          console.error('Error executing query:', err.message)
          return
        }
        const main = fs.readFileSync('./comps/main.html', 'utf-8')
        const title = fs.readFileSync('./comps/title.html', 'utf-8')
        const row = fs.readFileSync('./comps/row.html', 'utf-8')
        const card = fs.readFileSync('./comps/coursedatacard.html', 'utf-8')
        let table = "<table>"
        table += `
            <tr>
                <td>ID</td>
                <td>Name</td>
                <td>Credits</td>
            </tr>`
        results.forEach(e => {
            table += row
            table = table.replace(/{{&ROWC0}}/g, e['teacherid'])
            table = table.replace(/{{&ROWC1}}/g, e['teachername'])
            table = table.replace(/{{&ROWC2}}/g, e['teacherdepartment'])
            table = table.replace(/{{&ROWC3}}/g, 'teachers')
        });
        table += "</table>"
        table += "<table>"
        table += `
            <tr>
                <td>ID</td>
                <td>Name</td>
                <td>Credits</td>
            </tr>`
        results.forEach(e => {
            table += row
            table = table.replace(/{{&ROWC0}}/g, e['studentid'])
            table = table.replace(/{{&ROWC1}}/g, e['studentname'])
            table = table.replace(/{{&ROWC2}}/g, e['studentdepartment'])
            table = table.replace(/{{&ROWC3}}/g, 'students')
        });
        table += "</table>"
        let page = main.replace(/{{&CONTENT}}/g, card + table)
        page = page.replace(/{{&COURSENAME}}/g, results[0]['name'])
        page = page.replace(/{{&COURSEID}}/g, results[0]['id'])
        page = page.replace(/{{&COURSECREDITS}}/g, results[0]['credits'])
        res.writeHead(200, {
            'Content-type': 'text/html'
        })
        res.end(page)
    })
}
exports.addCourse = (req, res) => {
    connection.query('INSERT INTO courses (id, name, credits) VALUES (?, ?, ?)', [req.body.id, req.body.name, req.body.credits], (err, results) => {
        if (err) {
          console.error('Error executing query:', err.message)
          return
        }
        res.redirect('/courses')
    })
}
exports.deleteCourse = (req, res) => {
    connection.query('DELETE FROM courses WHERE id = ?', [req.params.id], (err, results) => {
        if (err) {
          console.error('Error executing query:', err.message)
          return
        }
        res.redirect('/courses')
    })
}