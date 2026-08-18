import { Router } from "express";
import { db } from "@workspace/db";
import { membersTable, insertMemberSchema } from "@workspace/db/schema";

const router = Router();

// POST /api/public/members
router.post("/", async (req, res) => {
  try {
    const data = insertMemberSchema.parse(req.body);
    
    // Always insert as pending
    await db.insert(membersTable).values({
      ...data,
      status: "pending"
    });
      
    res.status(201).json({ message: "Membership application submitted" });
  } catch (error) {
    req.log.error(error, "Failed to submit membership application");
    res.status(400).json({ error: "Invalid membership data" });
  }
});

export default router;
