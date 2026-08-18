import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { postsTable } from "@workspace/db/schema";
import { eq, desc, like, and, SQL } from "drizzle-orm";
import { adminAuth } from "../../middlewares/adminAuth";

const router: IRouter = Router();
router.use(adminAuth);

// GET /admin/posts
router.get("/", async (req, res) => {
  try {
    const { search, category, published } = req.query;
    const conditions: SQL[] = [];

    if (search && typeof search === "string") {
      conditions.push(like(postsTable.title, `%${search}%`));
    }
    if (category && typeof category === "string") {
      conditions.push(eq(postsTable.category, category));
    }
    if (published === "true") {
      conditions.push(eq(postsTable.published, true));
    } else if (published === "false") {
      conditions.push(eq(postsTable.published, false));
    }

    const posts = await db
      .select()
      .from(postsTable)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(postsTable.createdAt));

    res.json({ posts });
  } catch {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// GET /admin/posts/:id
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [post] = await db
      .select()
      .from(postsTable)
      .where(eq(postsTable.id, id))
      .limit(1);

    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }
    res.json({ post });
  } catch {
    res.status(500).json({ error: "Failed to fetch post" });
  }
});

// POST /admin/posts
router.post("/", async (req, res) => {
  try {
    const { title, slug, category, content, coverImageUrl, tags, published } =
      req.body;

    const [post] = await db
      .insert(postsTable)
      .values({
        title,
        slug,
        category: category || "general",
        content: content || "",
        coverImageUrl: coverImageUrl || null,
        tags: tags || "",
        published: published ?? false,
        authorId: req.adminUser!.userId,
      })
      .returning();

    res.status(201).json({ post });
  } catch (err: any) {
    if (err?.code === "23505") {
      res.status(409).json({ error: "A post with this slug already exists" });
      return;
    }
    res.status(500).json({ error: "Failed to create post" });
  }
});

// PUT /admin/posts/:id
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, slug, category, content, coverImageUrl, tags, published } =
      req.body;

    const [post] = await db
      .update(postsTable)
      .set({
        title,
        slug,
        category,
        content,
        coverImageUrl,
        tags,
        published,
        updatedAt: new Date(),
      })
      .where(eq(postsTable.id, id))
      .returning();

    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }
    res.json({ post });
  } catch (err: any) {
    if (err?.code === "23505") {
      res.status(409).json({ error: "A post with this slug already exists" });
      return;
    }
    res.status(500).json({ error: "Failed to update post" });
  }
});

// DELETE /admin/posts/:id
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [deleted] = await db
      .delete(postsTable)
      .where(eq(postsTable.id, id))
      .returning();

    if (!deleted) {
      res.status(404).json({ error: "Post not found" });
      return;
    }
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to delete post" });
  }
});

export default router;
