import express from "express";
import { auth, adminAuth } from "../middleware/auth.js";
import User from "../models/User.js";

const router = new express.Router();

router.get("/me", auth, async (req, res) => {
  res.send(req.user);
});

router.patch("/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["firstName", "lastName", "email", "password"];
  const isValid = updates.every((update) => allowedUpdates.includes(update));
  if (!isValid) return res.status(400).send({ error: "invalid update" });
  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.delete("/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send({ message: "user deleted successfully" });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await User.find({
      $or: [
        {
          firstName: {
            $regex: new RegExp(`.*${req.query.criteria || ""}.*`, "i"),
          },
        },
        {
          lastName: {
            $regex: new RegExp(`.*${req.query.criteria || ""}.*`, "i"),
          },
        },
        {
          email: { $regex: new RegExp(`.*${req.query.criteria || ""}.*`, "i") },
        },
      ],
    });
    return res.send(users);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/:id", adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send({ message: "user not found" });
    }
    return res.send(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.patch("/:id", adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send({ message: "user not found" });
    }
    const updates = Object.keys(req.body);
    const allowedUpdates = [
      "firstName",
      "lastName",
      "email",
      "password",
      "role",
    ];
    const isValid = updates.every((update) => allowedUpdates.includes(update));
    if (!isValid) return res.status(400).send({ error: "invalid update" });
    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();
    res.send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send({ message: "user not found" });
    }
    await user.remove();
    return res.send({ message: "user deleted successfully" });
  } catch (err) {
    res.status(500).send(err);
  }
});
router.post("/",adminAuth, async (req, res) => {
  try{
    const user = new User({
      ...req.body,
    });
    await user.save();
    res.status(201).send(user);
  } catch (e){
      res.status(400).send(e);
  }
});

export default router;
