import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { membersTable } from "@workspace/db/schema";
import { eq, desc, and, SQL } from "drizzle-orm";
import { adminAuth } from "../../middlewares/adminAuth";

const router: IRouter = Router();
router.use(adminAuth);

// GET /admin/members
router.get("/", async (req, res) => {
  try {
    const { tier, status } = req.query;
    const conditions: SQL[] = [];

    if (tier && typeof tier === "string" && ["basic", "professional", "corporate"].includes(tier)) {
      conditions.push(eq(membersTable.tier, tier as any));
    }
    if (status && typeof status === "string" && ["pending", "active", "rejected"].includes(status)) {
      conditions.push(eq(membersTable.status, status as any));
    }

    const members = await db
      .select()
      .from(membersTable)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(membersTable.createdAt));

    res.json({ members });
  } catch {
    res.status(500).json({ error: "Failed to fetch members" });
  }
});

// PATCH /admin/members/:id/status
router.patch("/:id/status", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    if (!["active", "pending", "rejected"].includes(status)) {
      res.status(400).json({ error: "Invalid status" });
      return;
    }

    const [member] = await db
      .update(membersTable)
      .set({ status })
      .where(eq(membersTable.id, id))
      .returning();

    if (!member) {
      res.status(404).json({ error: "Member not found" });
      return;
    }
    res.json({ member });
  } catch {
    res.status(500).json({ error: "Failed to update member status" });
  }
});

export default router;
