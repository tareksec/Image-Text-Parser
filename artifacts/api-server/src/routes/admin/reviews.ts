import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { reviewsTable } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";
import { adminAuth } from "../../middlewares/adminAuth";

const router: IRouter = Router();
router.use(adminAuth);

// GET /admin/reviews
router.get("/", async (_req, res) => {
  try {
    const reviews = await db
      .select()
      .from(reviewsTable)
      .orderBy(desc(reviewsTable.createdAt));

    res.json({ reviews });
  } catch {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

// PATCH /admin/reviews/:id/status
router.patch("/:id/status", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    if (!["approved", "rejected", "pending"].includes(status)) {
      res.status(400).json({ error: "Invalid status" });
      return;
    }

    const [review] = await db
      .update(reviewsTable)
      .set({ status })
      .where(eq(reviewsTable.id, id))
      .returning();

    if (!review) {
      res.status(404).json({ error: "Review not found" });
      return;
    }
    res.json({ review });
  } catch {
    res.status(500).json({ error: "Failed to update review status" });
  }
});

// DELETE /admin/reviews/:id
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [deleted] = await db
      .delete(reviewsTable)
      .where(eq(reviewsTable.id, id))
      .returning();

    if (!deleted) {
      res.status(404).json({ error: "Review not found" });
      return;
    }
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to delete review" });
  }
});

export default router;
