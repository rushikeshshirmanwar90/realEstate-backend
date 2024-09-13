import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import prisma from "../lib/prisma.js";

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // ADDING USER TO DATABASE
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
    console.log(newUser);

    res.status(201).json({
      message: "User Created Successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Failed to create User",
    });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // CHECKING USER EXITS OR NOT
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid Credentials",
      });
    }

    // PASSWORD IS CORRECT OR NOT
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({
        message: "Invalid Credentials",
      });
    }

    // CREATING COOKIE, TOKEN AND SEND TO CLIENT
    const age = 1000 * 60 * 60 * 24 * 7;

    const token = jwt.sign(
      {
        id: user.id,
        isAdmin: true,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: age,
      }
    );

    const { password: userPass, ...userInfo } = user;

    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: age,
      })
      .json(userInfo);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to Login",
    });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token").status(200).json({
    message: "Logout Successfully",
  });
};
