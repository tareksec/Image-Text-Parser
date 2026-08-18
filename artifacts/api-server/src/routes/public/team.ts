import { Router } from "express";
import { db } from "@workspace/db";
import { teamMembersTable } from "@workspace/db/schema";
import { asc } from "drizzle-orm";

const router = Router();

// GET /api/public/team
router.get("/", async (req, res) => {
  try {
    const team = await db
      .select({
        id: teamMembersTable.id,
        name: teamMembersTable.name,
        designation: teamMembersTable.designation,
        photoUrl: teamMembersTable.photoUrl,
        linkedinUrl: teamMembersTable.linkedinUrl,
        displayOrder: teamMembersTable.displayOrder,
      })
      .from(teamMembersTable)
      .orderBy(asc(teamMembersTable.displayOrder));
      
    res.json({ team });
  } catch (error) {
    req.log.error(error, "Failed to fetch team members");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
