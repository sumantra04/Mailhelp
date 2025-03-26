import { categorizeEmail } from "./services/categorizeEmail";


async function processEmail(email) {
  const category = await categorizeEmail(email.subject, email.body);
  console.log(`Email categorized as: ${category}`);
  
  return {
    ...email,
    category, 
  };
}
