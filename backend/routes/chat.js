const express = require("express");
const Thread = require("../models/thread");
const router = express.Router();
const { getOpenAIApiRes } = require("../utils/openAi");
const { userVerification } = require("../middlewares/verifyUser");

//Get all threads
router.get("/thread", userVerification, async (req, res) => {
  try {
    const allThreads = await Thread.find({ user: req.user._id }).sort({
      updatedAt: -1,
    });
    res.status(200).json(allThreads);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch threads" });
  }
});

//Get specific thread
router.get("/thread/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const thread = await Thread.findById(id);
    if (!thread) {
      res.status(404).json({ error: "Chats not found" });
    }
    res.status(200).json(thread.messages);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch chats" });
  }
});

//Destroy specific thread
router.delete("/thread/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const thread = await Thread.findByIdAndDelete(id);
    if (!thread) {
      res.status(404).json({ error: "Failed to delete chats" });
    }
    res.status(200).json({ success: "Chats deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to delete chats" });
  }
});

//To create threads and chats
router.post("/chat", userVerification, async (req, res) => {
  const { message, id } = req.body;
  if (!id || !message) {
    return res
      .status(400)
      .json({ error: "Please provide all required fields" });
  }
  try {
    const response = await getOpenAIApiRes(message);
    let thread;
    if (id === "new") {
      thread = new Thread({
        title: message.slice(0, 24),
        messages: [
          { role: "user", content: message },
          { role: "assistant", content: response },
        ],
        user: req.user._id,
      });
      await thread.save();
    } else {
      thread = await Thread.findOne({ _id: id, user: req.user._id });
      if (!thread) {
        return res.status(404).json({ error: "Thread not found" });
      }
      thread.messages.push({ role: "user", content: message });
      thread.messages.push({ role: "assistant", content: response });
      await thread.save();
    }

    res.status(200).json({
      success: "Fetched response from openAi successfully",
      data: response,
      threadId: thread._id,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.post("/test", async (req, res) => {
  const { mssg } = req.body;
  const response = await getOpenAIApiRes(mssg);
  res.json(response.choices[0].message.content);
});

module.exports = router;
