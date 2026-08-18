import { Router } from "express";
import { db } from "@workspace/db";
import { reviewsTable, insertReviewSchema } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";

const router = Router();

// GET /api/public/reviews
router.get("/", async (req, res) => {
  try {
    const reviews = await db
      .select()
      .from(reviewsTable)
      .where(eq(reviewsTable.status, "approved"))
      .orderBy(desc(reviewsTable.createdAt));
    res.json({ reviews });
  } catch (error) {
    req.log.error(error, "Failed to fetch reviews");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/public/reviews
router.post("/", async (req, res) => {
  try {
    // Validate request body
    const data = insertReviewSchema.parse(req.body);
    
    const [review] = await db
      .insert(reviewsTable)
      .values({
        ...data,
        status: "pending", // Force status to pending for new reviews
      })
      .returning();
      
    res.status(201).json({ review, message: "Review submitted successfully and is pending approval." });
  } catch (error) {
    req.log.error(error, "Failed to submit review");
    res.status(400).json({ error: "Invalid request data" });
  }
});

export default router;
