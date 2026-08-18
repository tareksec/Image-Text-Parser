import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { eventsTable } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";
import { adminAuth } from "../../middlewares/adminAuth";

const router: IRouter = Router();
router.use(adminAuth);

// GET /admin/events
router.get("/", async (_req, res) => {
  try {
    const events = await db
      .select()
      .from(eventsTable)
      .orderBy(desc(eventsTable.createdAt));

    res.json({ events });
  } catch {
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// GET /admin/events/:id
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [event] = await db
      .select()
      .from(eventsTable)
      .where(eq(eventsTable.id, id))
      .limit(1);

    if (!event) {
      res.status(404).json({ error: "Event not found" });
      return;
    }
    res.json({ event });
  } catch {
    res.status(500).json({ error: "Failed to fetch event" });
  }
});

// POST /admin/events
router.post("/", async (req, res) => {
  try {
    const { title, date, time, venue, seats, registrationLink, description } =
      req.body;

    const [event] = await db
      .insert(eventsTable)
      .values({
        title,
        date,
        time,
        venue,
        seats: seats ? Number(seats) : null,
        registrationLink: registrationLink || null,
        description: description || "",
      })
      .returning();

    res.status(201).json({ event });
  } catch {
    res.status(500).json({ error: "Failed to create event" });
  }
});

// PUT /admin/events/:id
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, date, time, venue, seats, registrationLink, description } =
      req.body;

    const [event] = await db
      .update(eventsTable)
      .set({
        title,
        date,
        time,
        venue,
        seats: seats ? Number(seats) : null,
        registrationLink,
        description,
        updatedAt: new Date(),
      })
      .where(eq(eventsTable.id, id))
      .returning();

    if (!event) {
      res.status(404).json({ error: "Event not found" });
      return;
    }
    res.json({ event });
  } catch {
    res.status(500).json({ error: "Failed to update event" });
  }
});

// DELETE /admin/events/:id
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [deleted] = await db
      .delete(eventsTable)
      .where(eq(eventsTable.id, id))
      .returning();

    if (!deleted) {
      res.status(404).json({ error: "Event not found" });
      return;
    }
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to delete event" });
  }
});

export default router;
