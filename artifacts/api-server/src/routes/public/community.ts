import { Router } from "express";
import { db } from "@workspace/db";
import { siteStatsTable, membersTable } from "@workspace/db/schema";
import { eq, asc } from "drizzle-orm";

const router = Router();

// GET /api/public/community/stats
router.get("/stats", async (req, res) => {
  try {
    const stats = await db
      .select()
      .from(siteStatsTable)
      .orderBy(asc(siteStatsTable.displayOrder));
    res.json({ stats });
  } catch (error) {
    req.log.error(error, "Failed to fetch community stats");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/public/community/members
router.get("/members", async (req, res) => {
  try {
    const members = await db
      .select()
      .from(membersTable)
      .where(eq(membersTable.status, "active"));
    res.json({ members });
  } catch (error) {
    req.log.error(error, "Failed to fetch active members");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
