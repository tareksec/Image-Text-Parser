import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { teamMembersTable } from "@workspace/db/schema";
import { eq, asc } from "drizzle-orm";
import { adminAuth } from "../../middlewares/adminAuth";

const router: IRouter = Router();
router.use(adminAuth);

// GET /admin/team
router.get("/", async (_req, res) => {
  try {
    const team = await db
      .select()
      .from(teamMembersTable)
      .orderBy(asc(teamMembersTable.displayOrder));

    res.json({ team });
  } catch {
    res.status(500).json({ error: "Failed to fetch team members" });
  }
});

// GET /admin/team/:id
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [member] = await db
      .select()
      .from(teamMembersTable)
      .where(eq(teamMembersTable.id, id))
      .limit(1);

    if (!member) {
      res.status(404).json({ error: "Team member not found" });
      return;
    }
    res.json({ member });
  } catch {
    res.status(500).json({ error: "Failed to fetch team member" });
  }
});

// POST /admin/team
router.post("/", async (req, res) => {
  try {
    const { name, designation, photoUrl, linkedinUrl, displayOrder } = req.body;

    const [member] = await db
      .insert(teamMembersTable)
      .values({
        name,
        designation,
        photoUrl: photoUrl || null,
        linkedinUrl: linkedinUrl || null,
        displayOrder: displayOrder ?? 0,
      })
      .returning();

    res.status(201).json({ member });
  } catch {
    res.status(500).json({ error: "Failed to create team member" });
  }
});

// PUT /admin/team/:id
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, designation, photoUrl, linkedinUrl, displayOrder } = req.body;

    const [member] = await db
      .update(teamMembersTable)
      .set({ name, designation, photoUrl, linkedinUrl, displayOrder })
      .where(eq(teamMembersTable.id, id))
      .returning();

    if (!member) {
      res.status(404).json({ error: "Team member not found" });
      return;
    }
    res.json({ member });
  } catch {
    res.status(500).json({ error: "Failed to update team member" });
  }
});

// DELETE /admin/team/:id
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [deleted] = await db
      .delete(teamMembersTable)
      .where(eq(teamMembersTable.id, id))
      .returning();

    if (!deleted) {
      res.status(404).json({ error: "Team member not found" });
      return;
    }
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to delete team member" });
  }
});

export default router;
