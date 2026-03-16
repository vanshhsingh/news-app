import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

app.post("/summary", async (req, res) => {
  try {
    const { title } = req.body;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    const result = await model.generateContent(
      `Summarize this headline in two sentences: ${title}`
    );

    const response = await result.response;

    res.json({ summary: response.text() });

  } catch (err) {
      console.error(err);
        if (err.status === 429) {
            return res.json({ summary: "Rate limit reached. Try again in a minute." });
        }

        res.status(500).json({ error: "AI request failed" });
    }
});

app.listen(5000, () => console.log("AI server running on port 5000"));