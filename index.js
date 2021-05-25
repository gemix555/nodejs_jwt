const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./routes/aut.router");
const PORT = process.env.PORT || 6000;

const app = express();

app.use(express.json());
app.use("/auth", authRouter);

const start = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://admin:admin@cluster0.ehanz.mongodb.net/jwt?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    app.listen(PORT, () => console.log(`http://localhost:${PORT}/`));
  } catch (error) {
    console.log("Error Server", error.message);
  }
};

start();
