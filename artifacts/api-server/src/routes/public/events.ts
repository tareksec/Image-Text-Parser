import { Router } from "express";
import { db } from "@workspace/db";
import { eventsTable, eventRegistrationsTable, insertEventRegistrationSchema } from "@workspace/db/schema";
import { desc } from "drizzle-orm";

const router = Router();

// GET /api/public/events
router.get("/", async (req, res) => {
  try {
    const events = await db
      .select()
      .from(eventsTable)
      .orderBy(desc(eventsTable.createdAt)); // In real scenario, order by date
    res.json({ events });
  } catch (error) {
    req.log.error(error, "Failed to fetch events");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/public/events/:id/register
router.post("/:id/register", async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    if (isNaN(eventId)) {
      res.status(400).json({ error: "Invalid event ID" });
      return;
    }

    const data = insertEventRegistrationSchema.parse({
      ...req.body,
      eventId
    });
    
    const [registration] = await db
      .insert(eventRegistrationsTable)
      .values(data)
      .returning();
      
    res.status(201).json({ registration, message: "Successfully registered for the event." });
  } catch (error) {
    req.log.error(error, "Failed to register for event");
    res.status(400).json({ error: "Invalid registration data" });
  }
});

export default router;
