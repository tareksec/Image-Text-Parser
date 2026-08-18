import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import { db } from "@workspace/db";
import { usersTable, siteStatsTable } from "@workspace/db/schema";
import { count } from "drizzle-orm";

const router: IRouter = Router();

// POST /admin/seed — Creates default admin and seed data (only if no users exist)
router.post("/seed", async (_req, res) => {
  try {
    const [{ total }] = await db
      .select({ total: count() })
      .from(usersTable);

    if (total > 0) {
      res.status(400).json({ error: "Database already seeded. Users exist." });
      return;
    }

    // Create default admin user
    const passwordHash = await bcrypt.hash("admin123", 12);
    const [admin] = await db
      .insert(usersTable)
      .values({
        email: "admin@bec.org.bd",
        passwordHash,
        name: "BEC Admin",
        role: "admin",
      })
      .returning();

    // Seed default site stats
    await db.insert(siteStatsTable).values([
      {
        key: "professionals",
        label: "Professionals Connected",
        value: "10,000+",
        icon: "UsersRound",
        displayOrder: 1,
      },
      {
        key: "partners",
        label: "Partner Organizations",
        value: "500+",
        icon: "Building2",
        displayOrder: 2,
      },
      {
        key: "careers",
        label: "Career Opportunities Shared",
        value: "2,000+",
        icon: "BriefcaseBusiness",
        displayOrder: 3,
      },
      {
        key: "workshops",
        label: "Training & Workshops Conducted",
        value: "150+",
        icon: "Landmark",
        displayOrder: 4,
      },
      {
        key: "impact",
        label: "Impact Across Industries",
        value: "Nationwide",
        icon: "Globe2",
        displayOrder: 5,
      },
    ]);

    res.status(201).json({
      success: true,
      message: "Database seeded successfully",
      admin: {
        email: admin.email,
        name: admin.name,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to seed database" });
  }
});

export default router;
