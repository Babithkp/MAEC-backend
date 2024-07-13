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
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
app.post("/api/fileupload", upload.any(), fileUploadController_1.maecFileUpload);
app.post("/api/createUser", crudController_1.createUser);
app.post("/api/userLogin", crudController_1.userLogin);
app.post("/api/updateProfile", crudController_1.updateProfile);
app.post("/api/getUserProfileById", crudController_1.getUserProfileById);
app.get('/', (req, res) => {
    res.json({ message: "Server started" });
});
app.listen(3000, () => {
    console.log("Server started listening on port 3000");
});
