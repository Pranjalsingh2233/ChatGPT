const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const ports = 8080;
const mongoose = require("mongoose");
const openAiChat = require("./routes/chat");
const userRouter = require("./routes/authRoute");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(
  cors({
    origin: "https://chatgpt-ai-chat.netlify.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/api", openAiChat);
app.use("/api", userRouter);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.listen(ports, () => {
  console.log("Server listening on port 8080");
});
