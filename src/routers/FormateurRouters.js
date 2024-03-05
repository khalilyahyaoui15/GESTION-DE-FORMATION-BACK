import express from 'express'
import { auth } from '../middleware/auth.js'
import Formateur from '../models/Formateur.js'

const router = new express.Router()


//CREATE FORMATEUR
router.post("/",auth, async (req, res) => {
  try{
    const formateur = new Formateur({
      ...req.body,
    });
    await formateur.save();
    res.status(201).send(formateur);
  } catch (e){
      res.status(400).send(e);
  }
});

//GET ALL FORMATEUR
router.get("/", async (req, res) => {
  try {
    const formateurs = await Formateur.find({
      $or: [
        {
          nom: {
            $regex: new RegExp(`.*${req.query.criteria || ""}.*`, "i"),
          },
        },
        {
          prenom: {
            $regex: new RegExp(`.*${req.query.criteria || ""}.*`, "i"),
          },
        },
        {
          email: { $regex: new RegExp(`.*${req.query.criteria || ""}.*`, "i") },
        },
      ],
    });
    return res.send(formateurs);
  } catch (err) {
    res.status(500).send(err);
  }
});

//GET FORMATEUR BY ID 
router.get("/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const formateur = await Formateur.findOne({ _id});
    if (!formateur) return res.status(404).send();
    res.send(formateur);
  } catch (e) {
    res.status(500).send(e);
  }
});


//UPDATE FORMATEUR
router.patch("/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["email","nom", "prenom","tel"];
  const isValid = updates.every((update) => allowedUpdates.includes(update));

  if (!isValid) return res.status(400).send({ error: "Invalid updates" });

  try {
    const _id = req.params.id;
    const formateur = await Formateur.findOne({ _id});
    if (!formateur) return res.status(404).send();
    updates.forEach((update) => (formateur[update] = req.body[update]));
    await formateur.save();
    res.send(formateur);
  } catch (e) {
    res.status(400).send(e);
  }
});

//DELETE FORMATEUR
router.delete("/:id", auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const formateur = await Formateur.findOneAndDelete({ _id,});
    if (!formateur) return res.status(404).send();
    res.send(formateur);
  } catch (e) {
    res.status(500).send(e);
  }
});



export default router
