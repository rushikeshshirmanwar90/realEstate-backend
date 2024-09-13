import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();

    res.status(200).json(users);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Failed to fetch the users",
    });
  }
};

export const getUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    res.status(200).json(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Failed to fetch the user",
    });
  }
};

export const updateUser = async (req, res) => {
  const id = req.params.id;
  const userId = req.userId;
  const { password, avatar, ...inputs } = req.body;

  if (id !== userId) {
    res.status(403).json({
      message: "User Not Verified",
    });
  }

  let hashedPassword = null;
  if (password) {
    hashedPassword = await bcrypt.hash(password, 10);
  }

  try {
    const updatedUser = await prisma.user.update({
      where: {
        id,
      },
      data: {
        ...inputs,
        ...(password && { password: hashedPassword }),
        ...(avatar && { avatar: avatar }),
      },
    });

    const { password: userPassword, ...rest } = updatedUser;

    res.status(200).json(rest);
    console.log(updatedUser);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  const id = req.params.id;
  const userId = req.userId;

  if (id !== userId) {
    res.status(403).json({
      message: "User Not Verified",
    });
  }
  try {
    const deletedUser = await prisma.user.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      message: "User Deleted Successfully",
      userDetails: deletedUser,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Failed to delete the user",
    });
  }
};
