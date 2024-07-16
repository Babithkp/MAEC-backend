import express from "express";
import cors from "cors";
import multer from "multer";
import { maecFileUpload } from "./controller/fileUploadController";
import {
  addDocuments,
  addEvalutions,
  addTotalAmt,
  compeltePayment,
  createUser,
  getAllUserDetails,
  getDocumentByUserId,
  getUserEmailById,
  getUserEvaluationDetailsById,
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
import { capturePaypalPayment, makePayment, makePaymentPaypal } from "./controller/paymentController";
dotenv.config();

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post("/api/fileupload", upload.any(), maecFileUpload);

app.post("/api/createUser", createUser);

app.post("/api/getUserEmailById", getUserEmailById);

app.post("/api/userLogin", userLogin);

app.post("/api/updateProfile", updateProfile);

app.post("/api/getUserProfileById", getUserProfileById);

app.post("/api/addEvalutions", addEvalutions);

app.post("/api/getUserEvalutionById", getUserEvalutionById);

app.post("/api/addDocuments", addDocuments);

app.post("/api/getDocumentByUserId", getDocumentByUserId);

app.get("/api/getAllUserDetails", getAllUserDetails);

app.post("/api/makePayment",makePayment)

app.post("/api/makePaymentPaypal",makePaymentPaypal)

app.post("/api/capturePaypalPayment",capturePaypalPayment)

app.post("/api/addTotalAmt",addTotalAmt)

app.post("/api/compeltePayment",compeltePayment)

app.post("/api/getUserEvaluationDetailsById",getUserEvaluationDetailsById)



app.get("/", (req, res) => {
  res.json({ message: "Server started" });
});

app.listen(process.env.PORT, () => {
  console.log("Server started listening on port " + process.env.PORT);
});

