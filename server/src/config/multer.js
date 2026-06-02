import multer from "multer";
import path from "path";
import fs from "fs";

const uploadPath = "uploads/documents";

if(!fs.existsSync(uploadPath)){
    fs.mkdirSync(uploadPath,{
        recursive: true
    });
}

const storage = multer.diskStorage({
    destination: (req, file, cb)=> {
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueName = 
        Date.now() + "-" + Math.round(Math.random() * 1e9) +
        path.extname(file.originalname);

        cb(null, uniqueName);
    },
});

const upload = multer({
    storage,

    limits: {
        fileSize: 10 * 1024 * 1024,
    },
});
export default upload;