import { Router, type IRouter } from "express";
import authRouter from "./auth";
import postsRouter from "./posts";
import reviewsRouter from "./reviews";
import eventsRouter from "./events";
import membersRouter from "./members";
import teamRouter from "./team";
import statsRouter from "./stats";
import seedRouter from "./seed";

const router: IRouter = Router();

// Auth routes (login/logout are unprotected, /me is protected inside)
router.use("/admin", authRouter);

// Seed route (has its own internal guard)
router.use("/admin", seedRouter);

// Resource routes (each applies adminAuth internally)
router.use("/admin/posts", postsRouter);
router.use("/admin/reviews", reviewsRouter);
router.use("/admin/events", eventsRouter);
router.use("/admin/members", membersRouter);
router.use("/admin/team", teamRouter);
router.use("/admin/stats", statsRouter);

export default router;
