const express = require('express');
const router = express.Router();
const db = require('../lib/db.js');
const bodyParser = require('body-parser');
var jsonParser = bodyParser.json()
const upload = require("../middleware/upload");
var path=require("path")
router.get('/img/:id',jsonParser, function (req, res) {
    const id = req.params.id
    if(id>0){
        db.query(`select image from client where id =${id}`, (err, result) => {
            if (err) {
                throw err;
                return res.status(400).send({
                    msg: 'image not found '
                });
            }

            console.log(result)
            res.sendFile(result[0].image);
        })
    }else {
        return res.status(400).send({
            msg: 'image not found '
        });
    }


})
router.post('/login', jsonParser, (req, res) => {
    const mail = req.body.mail;
    const password = req.body.password;
    db.query("select id,mail,profession,first_name,last_name from client where mail=? and password=? ", [mail, password], (err, rows, fields) => {
       if(err){
            return res.status(404).send({
               "message":"Something bad happend !"
           })
       }

        if (rows.length===0){
            return res.status(404).send({
                "message":"Wrong Email  or password !"
            })
        }
      return   res.status(200).send({"user":rows})
    })
})


router.post('/', upload.single("file"), jsonParser, (req, res) => {
    console.log(req.body)
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const profession = req.body.profession;
    const gender = req.body.gender;
    const mail = req.body.mail;
    const phone = req.body.phone;
    const adress = req.body.adress;
    const password = req.body.password;
    const image ='/home/developer/Desktop/ExpressJS/'+req.file.path;
    db.query(`INSERT INTO client(id, first_name, last_name, profession, gender, mail, phone, adress, image, password) VALUES (default, ?,?, ?, ?, ?,?, ?, ?,?)`, [first_name, last_name, profession, gender, mail, phone, adress, image, password],
        (err, rows, fields) => {
            if (err) {
                if (err.errno === 1062) {
                    return res.status(400).send({message: "this email already exist !"})
                }
                console.log(err)
                return res.status(400).send('something went wrong')


            }
            console.log(err)
            return res.status(200).send({rows});
        })
})
router.get('/', (req, res) => {
    db.query("select * from client;", (err, rows, fields) => {
        if (err) {
            return res.status(404).send("client not found")
        }
        console.log(err)
        return res.status(200).send({rows});
    })
})
router.post('/checkout', (req, res) => {
    const courses=req.body.courses;
    const userId=req.body.id;
    var selledCourses=[];
    courses.forEach(function(course){
       selledCourses.push([userId,course.id],);
    });
        db.query("INSERT INTO enrollments(idClient, idCourse) VALUES ? ;", [selledCourses],(err, rows, fields) => {
            if (err) {
                console.log(err)
                return  res.status(400).send({"message": "failed to checkout"})
            }

            return res.status(200).send({"message":"You own this course now "})
        })
})

module.exports = router;
