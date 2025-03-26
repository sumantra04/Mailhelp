import express, { Request, Response } from "express";
import cors from "cors"; 
import dotenv from "dotenv";
import { fetchEmails } from "./services/imapService";
import { esClient } from "./config/elasticsearchConfig";
import { categorizeEmail } from "./services/categorizeEmail";
import { sendSlackNotification, triggerWebhook } from "./services/notification";

dotenv.config();

const app = express();
app.use(express.json()); 

app.use(cors({
  origin: "http://127.0.0.1:5500", 
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
}));

const PORT = process.env.PORT || 3000;

let emails: any[] = [];

app.get("/", (req: Request, res: Response) => {
  res.send("Emailhelp Service Running...");
});

app.get("/emails", (req: Request, res: Response) => {
  res.json({ success: true, emails });
});

setInterval(async () => {
  console.log("Checking for new emails...");
  const newEmails = await fetchEmails();
  if (Array.isArray(newEmails)) {
    emails = newEmails; 
  }
}, 10000);


app.post("/categorize-email", async (req: Request, res: Response): Promise<void> => {
  try {
    const { emailBody } = req.body;
    if (!emailBody) {
      res.status(400).json({ error: "emailBody is required" });
      return;
    }

    const category = await categorizeEmail(emailBody);

    if (category.toLowerCase() === "interested") {
      await sendSlackNotification(emailBody);
      await triggerWebhook({ emailBody, category });
    }

    res.json({ category });
  } catch (error) {
    console.error("Error in categorization:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.post("/search", async (req: Request, res: Response): Promise<void> => {
  try {
    const { query } = req.body;
    if (!query) {
      res.status(400).json({ error: "Query is required" });
      return;
    }

    const result = await esClient.search({
      index: "emails",
      body: {
        query: {
          match: { subject: query },
        },
      },
    });

    const hits = (result as any).hits?.hits || [];
    res.json(hits);
  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({ error: "Error searching emails" });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
