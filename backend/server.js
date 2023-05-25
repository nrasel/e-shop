const app = require("./app");
const connectDatabase = require("./db/Database");

//handlin uncaught exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`shutting down the server from uncaught exception`);
});

// config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "backend/config/.env",
  });
}
app.get("/", (req, res) => {
  res.send("ok");
});

// connect db
connectDatabase();

//create server
const server = app.listen(process.env.PORT, () => {
  console.log(`server is running on http://localhost:${process.env.PORT}`);
});

// unhandle promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`shutting down the server fjor ${err.message}`);
  console.log(`shutting down the server for unhnadle promise rejection`);

  server.close(() => {
    process.exit(1);
  });
});
