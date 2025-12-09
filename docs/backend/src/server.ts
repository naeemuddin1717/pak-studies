import dotenv from "dotenv";
import express, { Request, Response } from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY is missing in .env");
}

// ====== 1) CHAPTER FILES LOAD KARNA (ON STARTUP) ======

/**
 * Yahan Pakistan Studies ke chapter .md files ke paths daalo.
 * Make sure ye files __dirname/chapters folder mein hon.
 */
const CHAPTER_PATHS = [
  path.join(__dirname, "chapters", "Ideology of Pakistan.md"),
  path.join(__dirname, "chapters", "Two Nation Theory.md"),
  path.join(__dirname, "chapters", "Creation of Pakistan 1947.md"),
  path.join(__dirname, "chapters", "Quaid-e-Azam’s Role.md"),
];

let BOOK_CONTEXT = "";

/**
 * Synchronous read: app start hote hi chapters memory mein aa jaate hain.
 * Ye simple hai aur small text files ke liye bilkul theek hai.
 */
function loadChapters() {
  try {
    const parts: string[] = [];

    for (const filePath of CHAPTER_PATHS) {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, "utf-8");
        parts.push(`\n\n===== FILE: ${path.basename(filePath)} =====\n\n${content}`);
      } else {
        console.warn(`⚠️ Chapter file not found: ${filePath}`);
      }
    }

    BOOK_CONTEXT = parts.join("\n\n");
    console.log("📚 Loaded book context. Total length:", BOOK_CONTEXT.length);
  } catch (err) {
    console.error("❌ Error loading chapter files:", err);
  }
}

// App start hote hi chapters load karo
loadChapters();

// ====== 2) NORMAL EXPRESS SETUP ======

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://pak-studies.vercel.app",
    ],
  })
);


app.use(express.json());

interface ChatBody {
  message?: string;
}

app.post("/api/chat", async (req: Request<{}, {}, ChatBody>, res: Response) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({ error: "Message is required" });
    }

    if (!BOOK_CONTEXT) {
      console.warn("⚠️ BOOK_CONTEXT is empty – make sure chapter files are loaded correctly.");
    }

    // ==== 3) SYSTEM PROMPT SPECIFICALLY FOR PAK STUDIES BOOK ====

    const systemPrompt =
      'You are a helpful tutor for the Pakistan Studies book "Ideology of Pakistan & Creation of Pakistan". ' +
      "You must answer ONLY using the information from the provided textbook chapters. " +
      "If the answer is not clearly supported by the chapters, say you do not know yet " +
      "and suggest which chapter or section the student should read (Ideology of Pakistan, Two Nation Theory, Creation of Pakistan 1947, Quaid-e-Azam’s Role). " +
      "Explain step-by-step, keep the language clear, and stay focused on the book content.";

    // ==== 4) FULL PROMPT: BOOK CONTEXT + USER QUESTION ====

    const promptText = `
${systemPrompt}

Below are the available textbook chapters (Markdown):

${BOOK_CONTEXT}

Now answer the student's question strictly using ONLY the information from the chapters above.

Student's question:
${userMessage}
`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY!,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: promptText,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      "Sorry, I couldn't generate a response.";

    res.json({ reply });
  } catch (err) {
    console.error("🔥 Server Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
