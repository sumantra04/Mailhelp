import Imap from "imap-simple";
import imapConfig from "../config/imapConfig";

export async function fetchEmails() {
  try {
    const connection = await Imap.connect(imapConfig);
    await connection.openBox("INBOX");

    const searchCriteria = ["ALL"];
    const fetchOptions = { bodies: ["HEADER", "TEXT"], struct: true };

    const messages = await connection.search(searchCriteria, fetchOptions);

    const emails = messages.map((message) => {
      const headers = message.parts.find((part) => part.which === "HEADER");
      const body = message.parts.find((part) => part.which === "TEXT");

      return {
        from: headers?.body.from?.[0] || "Unknown",
        subject: headers?.body.subject?.[0] || "No Subject",
        body: body?.body || "No Content",
      };
    });

    console.log(emails);

    connection.end(); 
    return emails;
  } catch (error) {
    console.error("Error fetching emails:", error);
    return [];
  }
}
