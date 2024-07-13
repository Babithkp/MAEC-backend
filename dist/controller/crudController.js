"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfileById = exports.updateProfile = exports.userLogin = exports.createUser = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = req.body;
    if (!userData)
        return res.json({ error: "Invalid User data provided" });
    if (userData.email === "admin@gmail.com")
        return res.json({ error: "Invalid User data provided" });
    try {
        const isUserExist = yield prisma.user.findUnique({
            where: {
                email_address: userData.email,
            },
        });
        if (isUserExist)
            return res.json({ error: "User already exists" });
        yield prisma.user.create({
            data: {
                email_address: userData.email,
                password: userData.password,
            },
        });
        res.json({ message: "User account has created" });
    }
    catch (err) {
        console.log(err);
    }
});
exports.createUser = createUser;
const userLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginDetails = req.body;
    if (!loginDetails)
        return res.json({ error: "Login data is required" });
    if (loginDetails.email === "admin@gmail.com") {
        if (loginDetails.password === "admin") {
            return res.json({ admin: "login admin" });
        }
        return res.json({ wrongPassword: "wrong password" });
    }
    try {
        const response = yield prisma.user.findUnique({
            where: { email_address: loginDetails.email },
        });
        if (!response) {
            return res.json({ userNotFound: "user not found" });
        }
        if ((response === null || response === void 0 ? void 0 : response.password) !== loginDetails.password) {
            return res.json({ wrongPassword: "wrong password" });
        }
        else {
            const token = jsonwebtoken_1.default.sign({ userId: response === null || response === void 0 ? void 0 : response.id }, "sercet");
            return res.json({
                message: "Sign in successfully",
                userId: response === null || response === void 0 ? void 0 : response.id,
                token: token,
            });
        }
    }
    catch (err) {
        console.log(err);
    }
});
exports.userLogin = userLogin;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = req.body;
    if (!userData)
        return res.json({ error: "Invalid User data provided" });
    try {
        const isExist = yield prisma.profile.findUnique({
            where: {
                userId: userData.userId,
            },
        });
        if (isExist) {
            yield prisma.profile.update({
                where: {
                    userId: userData.userId,
                },
                data: {
                    first_name: userData.first_name,
                    middle_name: userData.middle_name,
                    last_name: userData.last_name,
                    birth_day: userData.birth_day,
                    birth_month: userData.birth_month,
                    birth_year: userData.birth_year,
                    gender: userData.gender,
                    street_address: userData.street_address,
                    city: userData.city,
                    state: userData.state,
                    postal_code: userData.postal_code,
                    country: userData.country,
                    phone_number: userData.phone_number,
                    user: {
                        connect: {
                            id: userData.userId,
                        },
                    },
                },
            });
            return res.json({ message: "User profile updadted " });
        }
        const profile = yield prisma.profile.create({
            data: {
                first_name: userData.first_name,
                middle_name: userData.middle_name,
                last_name: userData.last_name,
                birth_day: userData.birth_day,
                birth_month: userData.birth_month,
                birth_year: userData.birth_year,
                gender: userData.gender,
                street_address: userData.street_address,
                city: userData.city,
                state: userData.state,
                postal_code: userData.postal_code,
                country: userData.country,
                phone_number: userData.phone_number,
                user: {
                    connect: {
                        id: userData.userId,
                    },
                },
            },
        });
        return res.json({ message: "User profile updadted", profile });
    }
    catch (err) {
        console.log(err);
    }
});
exports.updateProfile = updateProfile;
const getUserProfileById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = req.body;
    if (!userData)
        return res.json({ error: "Invalid User data provided" });
    try {
        const userProfile = yield prisma.profile.findUnique({
            where: {
                userId: userData.userId,
            },
        });
        if (userProfile) {
            return res.json({ data: userProfile });
        }
        else {
            return res.json({ error: "user not found" });
        }
    }
    catch (err) {
        console.log(err);
    }
});
exports.getUserProfileById = getUserProfileById;
