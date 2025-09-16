import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import mongoose from "mongoose";


dotenv.config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT;

const itemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Itemmodel = mongoose.model("Item", itemSchema);

app.post("/items", async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ message: "title is required" });

    const item = new Itemmodel({ title, description });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "server error" });
  }
});

app.get("/items", async (req, res) => {
  try {
    const items = await Itemmodel.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/items/:id", async (req, res) => {
  try {
    const item = await Itemmodel.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Invalid id or request" });
  }
});

app.put("/items/:id", async (req, res) => {
  try {
    const updated = await Itemmodel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: "Item not found" });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Invalid id or request" });
  }
});

app.delete("/items/:id", async (req, res) => {
  try {
    const deleted = await Itemmodel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Deleted", id: deleted._id });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Invalid id or request" });
  }
});

app.get('/',(req,res)=>{
  res.send('server working')
})


connectDB();
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
