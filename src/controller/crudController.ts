import { PrismaClient, Prisma } from "@prisma/client";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const createUser = async (req: Request, res: Response) => {
  const userData = req.body;
  if (!userData) return res.json({ error: "Invalid User data provided" });
  if (userData.email === "admin@gmail.com")
    return res.json({ error: "Invalid User data provided" });

  try {
    const isUserExist = await prisma.user.findUnique({
      where: {
        email_address: userData.email,
      },
    });
    if (isUserExist) return res.json({ error: "User already exists" });
    await prisma.user.create({
      data: {
        email_address: userData.email,
        password: userData.password,
      },
    });
    res.json({ message: "User account has created" });
  } catch (err) {
    console.log(err);
  }
};

export const userLogin = async (req: Request, res: Response) => {
  const loginDetails = req.body;
  if (!loginDetails) return res.json({ error: "Login data is required" });
  if (loginDetails.email === "admin@gmail.com") {
    if (loginDetails.password === "admin") {
      return res.json({ admin: "login admin" });
    }
    return res.json({ wrongPassword: "wrong password" });
  }
  try {
    const response = await prisma.user.findUnique({
      where: { email_address: loginDetails.email },
    });
    if (!response) {
      return res.json({ userNotFound: "user not found" });
    }
    if (response?.password !== loginDetails.password) {
      return res.json({ wrongPassword: "wrong password" });
    } else {
      const token = jwt.sign({ userId: response?.id }, "sercet");
      return res.json({
        message: "Sign in successfully",
        userId: response?.id,
        token: token,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  const userData = req.body;
  if (!userData) return res.json({ error: "Invalid User data provided" });

  try {
    const isExist = await prisma.profile.findUnique({
      where: {
        userId: userData.userId,
      },
    });

    if (isExist) {
      await prisma.profile.update({
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

    const profile = await prisma.profile.create({
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
  } catch (err) {
    console.log(err);
  }
};

export const getUserProfileById = async (req: Request, res: Response) => {
  const userData = req.body;
  if (!userData) return res.json({ error: "Invalid User data provided" });
  try {
    const userProfile = await prisma.profile.findUnique({
      where: {
        userId: userData.userId,
      },
    });
    if (userProfile) {
      return res.json({ data: userProfile });
    } else {
      return res.json({ error: "user not found" });
    }
  } catch (err) {
    console.log(err);
  }
};