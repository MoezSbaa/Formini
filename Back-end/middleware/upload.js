var multer = require('multer')

const storage= multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./upload/');
    },
    filename: function(req,file,cb){

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)


        cb(null,uniqueSuffix+file.originalname)
    }
});



var upload = multer({storage:storage})
module.exports = upload;
