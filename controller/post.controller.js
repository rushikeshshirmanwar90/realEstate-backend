import prisma from "../lib/prisma.js";

export const getPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany();

    res.status(200).json(posts);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Failed to get the posts",
    });
  }
};

export const getPost = async (req, res) => {
  try {
    const id = req.params.id;

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        postDetails,
        user: {
          select: {
            username,
            avatar,
          },
        },
      },
    });

    res.status(200).json(post);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Failed to get the post",
    });
  }
};

export const addPost = async (req, res) => {
  try {
    const tokenId = req.userId;
    const body = req.body;

    const newPost = await prisma.post.create({
      data: {
        ...body.postData,
        userId: tokenId,
        postDetails: {
          create: body.postDetails,
        },
      },
    });

    res.status(200).json(newPost);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Failed to add the post",
    });
  }
};

export const updatePost = async (req, res) => {
  try {
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Failed to update the post",
    });
  }
};

export const deletePost = async (req, res) => {
  const id = req.params.id;
  const tokenId = req.userId;

  try {
    const post = await prisma.post.findUnique({
      where: {
        id,
      },
    });

    if (post.userId !== tokenId) {
      res.status(403).json({
        message: "User Not Authorized",
      });
    }

    const deletedPost = await prisma.post.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      message: "Post Deleted Successfully",
      postDetails: deletedPost,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "failed to delete Post",
    });
  }
};
