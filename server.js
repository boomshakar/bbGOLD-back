const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const conn = process.env.MONGO_CONNECT;

mongoose
  .connect(conn, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Mongo DB connection established"))
  .catch((error) => console.error("MongoDB connection Failed", error.message));

app.use(express.json());
// Routes
app.use("/api/users", require("./routes/user"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/product"));
app.use("/api/carts", require("./routes/cart"));
app.use("/api/orders", require("./routes/order"));
// app.use("/api/checkout", require("./routes/order"));

app.get("/", (req, res) => {
  res.send("Hello");
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
