const express = require('express')
const {teachers, getTeacher, addTeacher, deleteTeacher} = require('./teachercontrollers')
const {students, getStudent, addStudent, deleteStudent} = require('./studentcontrollers')
const {courses, getCourse, addCourse, deleteCourse} = require('./coursecontrollers')

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/teachers', teachers)
app.get('/teachers/:id', getTeacher)
app.post('/teachers', addTeacher)
app.get('/teachers/:id/delete', deleteTeacher)

app.get('/students', students)
app.get('/students/:id', getStudent)
app.post('/students', addStudent)
app.get('/students/:id/delete', deleteStudent)

app.get('/courses', courses)
app.get('/courses/:id', getCourse)
app.post('/courses', addCourse)
app.get('/courses/:id/delete', deleteCourse)

app.listen(3000, () => {
    console.log('server started')
})