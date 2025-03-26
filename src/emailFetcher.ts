import { saveToElasticsearch } from "./elasticsearch";

async function processEmails(emails: any[]) {
  for (const email of emails) {
    const category = await categorizeEmail(email.subject, email.body);
    email.category = category;
    
    await saveToElasticsearch(email); 
    console.log(`Email categorized as: ${category}`);
  }
}
