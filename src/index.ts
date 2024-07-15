import express from "express";
import cors from "cors";
import multer from "multer";
import { maecFileUpload } from "./controller/fileUploadController";
import {
  addDocuments,
  addEvalutions,
  createUser,
  getAllUserDetails,
  getDocumentByUserId,
  getUserEvalutionById,
  getUserProfileById,
  updateProfile,
  userLogin,
} from "./controller/crudController";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
import dotenv from "dotenv";
import { makePayment } from "./controller/paymentController";
dotenv.config();

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post("/api/fileupload", upload.any(), maecFileUpload);

app.post("/api/createUser", createUser);

app.post("/api/userLogin", userLogin);

app.post("/api/updateProfile", updateProfile);

app.post("/api/getUserProfileById", getUserProfileById);

app.post("/api/addEvalutions", addEvalutions);

app.post("/api/getUserEvalutionById", getUserEvalutionById);

app.post("/api/addDocuments", addDocuments);

app.post("/api/getDocumentByUserId", getDocumentByUserId);

app.get("/api/getAllUserDetails", getAllUserDetails);

app.post("/api/makePayment",makePayment)

app.get("/", (req, res) => {
  res.json({ message: "Server started" });
});

app.listen(process.env.PORT, () => {
  console.log("Server started listening on port " + process.env.PORT);
});

