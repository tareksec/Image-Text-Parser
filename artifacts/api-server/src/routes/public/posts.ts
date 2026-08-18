import { Router } from "express";
import { db } from "@workspace/db";
import { postsTable } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";

const router = Router();

// GET /api/public/posts
router.get("/", async (req, res) => {
  try {
    const posts = await db
      .select({
        id: postsTable.id,
        title: postsTable.title,
        slug: postsTable.slug,
        category: postsTable.category,
        content: postsTable.content, // Using content for excerpt
        coverImageUrl: postsTable.coverImageUrl,
        tags: postsTable.tags,
        createdAt: postsTable.createdAt,
      })
      .from(postsTable)
      .where(eq(postsTable.published, true))
      .orderBy(desc(postsTable.createdAt));
      
    res.json({ posts });
  } catch (error) {
    req.log.error(error, "Failed to fetch published posts");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
