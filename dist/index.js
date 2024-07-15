"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const fileUploadController_1 = require("./controller/fileUploadController");
const crudController_1 = require("./controller/crudController");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
const dotenv_1 = __importDefault(require("dotenv"));
const paymentController_1 = require("./controller/paymentController");
dotenv_1.default.config();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
app.post("/api/fileupload", upload.any(), fileUploadController_1.maecFileUpload);
app.post("/api/createUser", crudController_1.createUser);
app.post("/api/userLogin", crudController_1.userLogin);
app.post("/api/updateProfile", crudController_1.updateProfile);
app.post("/api/getUserProfileById", crudController_1.getUserProfileById);
app.post("/api/addEvalutions", crudController_1.addEvalutions);
app.post("/api/getUserEvalutionById", crudController_1.getUserEvalutionById);
app.post("/api/addDocuments", crudController_1.addDocuments);
app.post("/api/getDocumentByUserId", crudController_1.getDocumentByUserId);
app.get("/api/getAllUserDetails", crudController_1.getAllUserDetails);
app.post("/api/makePayment", paymentController_1.makePayment);
app.get("/", (req, res) => {
    res.json({ message: "Server started" });
});
app.listen(process.env.PORT, () => {
    console.log("Server started listening on port " + process.env.PORT);
});
