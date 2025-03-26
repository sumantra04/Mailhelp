export const categorizeEmail = async (subject: string, body: string): Promise<string> => {
    const emailText = `${subject} ${body}`.toLowerCase();
  
    if (emailText.includes("meeting") || emailText.includes("schedule")) {
      return "Meeting Booked";
    }
    if (emailText.includes("interested")) {
      return "Interested";
    }
    if (emailText.includes("not interested")) {
      return "Not Interested";
    }
    if (emailText.includes("out of office")) {
      return "Out of Office";
    }
    return "Spam"; 
  };
  