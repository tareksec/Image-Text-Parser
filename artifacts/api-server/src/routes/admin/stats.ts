import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { siteStatsTable } from "@workspace/db/schema";
import { eq, asc } from "drizzle-orm";
import { adminAuth } from "../../middlewares/adminAuth";

const router: IRouter = Router();
router.use(adminAuth);

// GET /admin/stats
router.get("/", async (_req, res) => {
  try {
    const stats = await db
      .select()
      .from(siteStatsTable)
      .orderBy(asc(siteStatsTable.displayOrder));

    res.json({ stats });
  } catch {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// PUT /admin/stats/:id
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { label, value, icon, displayOrder } = req.body;

    const [stat] = await db
      .update(siteStatsTable)
      .set({
        label,
        value,
        icon,
        displayOrder,
        updatedAt: new Date(),
      })
      .where(eq(siteStatsTable.id, id))
      .returning();

    if (!stat) {
      res.status(404).json({ error: "Stat not found" });
      return;
    }
    res.json({ stat });
  } catch {
    res.status(500).json({ error: "Failed to update stat" });
  }
});

export default router;
