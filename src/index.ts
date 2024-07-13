import express from "express"
import cors from "cors";
import multer from "multer";
import { maecFileUpload } from "./controller/fileUploadController";
import { createUser, getUserProfileById, updateProfile, userLogin } from "./controller/crudController";
const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
import dotenv from "dotenv";
dotenv.config();

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post("/api/fileupload", upload.any(), maecFileUpload);

app.post("/api/createUser",createUser)


app.post("/api/userLogin",userLogin)

app.post("/api/updateProfile",updateProfile)

app.post("/api/getUserProfileById",getUserProfileById)


app.get('/', (req, res) => {
    res.json({message:"Server started"})
})

app.listen(3000,()=>{
    console.log("Server started listening on port 3000");
    
})