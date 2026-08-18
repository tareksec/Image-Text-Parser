import { Router } from "express";
import { db } from "@workspace/db";
import { contactMessagesTable, insertContactMessageSchema } from "@workspace/db/schema";

const router = Router();

// POST /api/public/contact
router.post("/", async (req, res) => {
  try {
    const data = insertContactMessageSchema.parse(req.body);
    
    await db.insert(contactMessagesTable).values(data);
      
    res.status(201).json({ message: "Message sent successfully" });
  } catch (error) {
    req.log.error(error, "Failed to submit contact message");
    res.status(400).json({ error: "Invalid contact data" });
  }
});

export default router;
