import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const HF_API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-mnli";
const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;

if (!HF_API_KEY) {
  console.error("Hugging Face API Key is missing! Please set it in the .env file.");
  process.exit(1);
}

const categories = ["spam", "important", "promotions", "social", "updates"];

export const categorizeEmail = async (emailBody: string): Promise<string> => {
  try {
    const response = await axios.post(
      HF_API_URL,
      {
        inputs: emailBody,
        parameters: {
          candidate_labels: categories, 
        },
      },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
        },
      }
    );

    if (!response.data || response.data.length === 0) {
      throw new Error("Invalid response from Hugging Face API");
    }

    const category = response.data?.labels?.[0] || "Unknown";
    console.log("Hugging Face Response:", response.data);
    return category;
  } catch (error: any) {
    console.error("Error in email categorization:", error.response?.data || error.message);
    return "Error";
  }
};
