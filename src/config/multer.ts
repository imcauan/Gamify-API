import path from "path";
import multer from "multer"

export default {
    storage: multer.diskStorage({
        destination: path.join(__dirname, "..", "..", "uploads"),
        filename(req, file, cb) {
            cb(null, `${Date.now()}-${file.originalname}`)
        }
    })
}