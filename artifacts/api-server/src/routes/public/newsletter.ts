import { Router } from "express";
import { db } from "@workspace/db";
import { newsletterSubscribersTable, insertNewsletterSubscriberSchema } from "@workspace/db/schema";

const router = Router();

// POST /api/public/newsletter
router.post("/", async (req, res) => {
  try {
    const data = insertNewsletterSubscriberSchema.parse(req.body);
    
    await db
      .insert(newsletterSubscribersTable)
      .values(data)
      .onConflictDoNothing(); // Prevent error if already subscribed
      
    res.status(201).json({ message: "Thank you for subscribing!" });
  } catch (error) {
    req.log.error(error, "Failed to subscribe to newsletter");
    res.status(400).json({ error: "Invalid email" });
  }
});

export default router;
