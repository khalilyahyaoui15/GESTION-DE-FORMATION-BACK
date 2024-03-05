import express from 'express'
import { auth, adminAuth } from '../middleware/auth.js'
import Participant from '../models/Participant.js'

const router = new express.Router()

//CREATE PARTICIPANT
router.post("/",auth, async (req, res) => {
  try{
    const participant = new Participant({
      ...req.body,
    });
    await participant.save();
    res.status(201).send(participant);
  } catch (e){
      res.status(400).send(e);
  }
});

//GET ALL PARTICIPANT
router.get("/", async (req, res) => {
  try {
    const participants = await Participant.find({
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
    }).populate('session');
    return res.send(participants);
  } catch (err) {
    res.status(500).send(err);
  }
});


//GET PARTICIPANT BY ID 
router.get("/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const participant = await Participant.findOne({ _id}).populate('session');
    if (!participant) return res.status(404).send();
    res.send(participant);
  } catch (e) {
    res.status(500).send(e);
  }
});

//UPDATE PARTICIPANT
router.patch("/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["email","firstName", "lastName","phone","session"];
  const isValid = updates.every((update) => allowedUpdates.includes(update));

  if (!isValid) return res.status(400).send({ error: "Invalid updates" });

  try {
    const _id = req.params.id;
    const participant = await Participant.findOne({ _id}).populate('session');
    if (!participant) return res.status(404).send();
    updates.forEach((update) => (participant[update] = req.body[update]));
    await participant.save();
    res.send(participant);
  } catch (e) {
    res.status(400).send(e);
  }
});

//DELETE PARTICIPANT
router.delete("/:id", auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const participant = await Participant.findOneAndDelete({ _id,});
    if (!participant) return res.status(404).send();
    res.send(participant);
  } catch (e) {
    res.status(500).send(e);
  }
});
export default router
