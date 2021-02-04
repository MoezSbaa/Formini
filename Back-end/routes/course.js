const express = require('express');
const course = express.Router();
const db = require('../lib/db.js');
const bodyParser = require('body-parser');
var jsonParser = bodyParser.json()


course.get('/img/:id', jsonParser, function (req, res) {
    const id = req.params.id
    db.query(`select image from course where id =${id}`, (err, result) => {
        if (err) {
            throw err;
            return res.status(400).send({
                msg: 'image not found '
            });
        }
        var json = JSON.stringify(result);
        var file = JSON.parse(json);
        res.sendFile(file[0].image);
    })
}) 


course.get('/', (req, res, next) => {

    db.query(
        `SELECT course.id,course.name_co,course.description,course.rating,course.date,course.duration,course.price,category.nom category,center.name center
FROM course 
JOIN center on center.id=course.id_center 
JOIN category on category.id= course.idCategory;`,
        (err, result) => {
            if (err) {
                throw err;
                return res.status(400).send({
                    msg: err
                });
            }

            return res.status(200).send({
                msg: 'course',
                course: result
            });

        })
})
course.get('/notbought/:id', (req, res, next) => {
    const id = req.params.id

    db.query(
        `SELECT course.id,course.name_co,course.description,course.rating,course.date,course.duration,course.price,
category.nom category,center.name center
FROM course
JOIN center on center.id=course.id_center 
JOIN category on category.id= course.idCategory
WHERE course.id not in(select enrollments.idCourse FROM enrollments where enrollments.idClient=${id} );
`,
        (err, result) => {
            if (err) {
                throw err;
                return res.status(400).send({
                    msg: err
                });
            }
            return res.status(200).send({
                msg: 'course',
                course: result
            });

        })
})


course.get('/user/:id', (req, res, next) => {
    const id = req.params.id

    db.query(
        `SELECT course.id,course.name_co,course.description,course.rating,course.date,course.duration,course.price,category.nom category,center.name center
         FROM enrollments 
         JOIN course on course.id = enrollments.idCourse 
         JOIN category ON course.idCategory=category.id 
         JOIN center on center.id=course.id_center
         WHERE enrollments.idClient=${id}`,
        (err, result) => {
            if (err) {
                throw err;
                return res.status(400).send({
                    msg: err
                });
            }
            return res.status(200).send({
                msg: 'course',
                course: result
            });

        })
})


course.get('/:id', (req, res, next) => {
    const id = req.params.id
    console.log(id)
    db.query(
        `SELECT course.id,course.name_co,course.description,course.rating,course.date,course.duration,course.price,category.nom category,center.name center
FROM course 
JOIN center on center.id=course.id_center 
JOIN category on category.id= course.idCategory 
where course.id=${id}
;`,
        (err, result) => {
            if (err) {
                throw err;
                return res.status(400).send({
                    msg: err
                });
            }

            return res.status(200).send({
                msg: 'course',
                course: result
            });

        })
})
course.get('/category/:id/:iduser', (req, res, next) => {
    const id = req.params.id
    const iduser = req.params.iduser
    console.log(req.params.iduser)
    console.log(id)
    db.query(
        `SELECT course.id,course.name_co,course.description,course.rating,course.date,course.duration,course.price,category.nom category,center.name center
FROM course 
JOIN center on center.id=course.id_center 
JOIN category on category.id= course.idCategory
where category.id=${id} and 
course.id not in(select enrollments.idCourse FROM enrollments where enrollments.idClient=${iduser} );`,
        (err, result) => {
            if (err) {
                throw err;
                return res.status(400).send({
                    msg: err
                });
            }

            return res.status(200).send({
                msg: 'course',
                course: result
            });

        })
})

course.get('/category/:id', (req, res, next) => {
    const id = req.params.id
    console.log(id)
    db.query(
        `SELECT course.id,course.name_co,course.description,course.rating,course.date,course.duration,course.price,category.nom category,center.name center
FROM course 
JOIN center on center.id=course.id_center 
JOIN category on category.id= course.idCategory 
where category.id=${id}
;`,
        (err, result) => {
            if (err) {
                throw err;
                return res.status(400).send({
                    msg: err
                });
            }

            return res.status(200).send({
                msg: 'course',
                course: result
            });

        })
})


module.exports = course;
