const express = require('express');
const router = express.Router();
const db = require('../lib/db.js');
const bodyParser = require('body-parser');
var jsonParser = bodyParser.json()



router.get('/img/:id',jsonParser, function (req, res) {
    const id = req.params.id
    db.query(`select image from category where id =${id}`, (err, result) => {
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



router.get('/', (req, res, next) => {

    db.query(
        `SELECT * from  category `,
        (err, result) => {
            if (err) {
                throw err;
                return res.status(400).send({
                    msg: err
                });
            }

            return res.status(200).send({
                msg: 'router',
                category: result
            });

        })
})



module.exports = router;
