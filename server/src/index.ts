import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./db/connect";

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB(process.env.MONGO_URL!, process.env.MONGO_DB!);

    const app = express();
  
    app.use(cors());
    app.use(express.json());
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("Error starting server:", err);
    process.exit(1);
  }
}

startServer();
