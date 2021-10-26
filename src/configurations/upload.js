const multer = require('multer');

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, __dirname + '/../../' + '/tmp/')
    },
    filename: (_req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname)
    }
});

const csvFilter = (_req, file, cb) => {
    if (file.mimetype.includes("csv")) {
        cb(null, true);
    } else {
        cb("Please upload only csv file.", false);
    }
};
 exports.upload = multer({ storage: storage, fileFilter: csvFilter });