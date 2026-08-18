import { Router } from "express";
import communityRouter from "./community";
import reviewsRouter from "./reviews";
import eventsRouter from "./events";
import newsletterRouter from "./newsletter";
import contactRouter from "./contact";
import postsRouter from "./posts";
import membersRouter from "./members";
import teamRouter from "./team";

const router = Router();

router.use("/community", communityRouter);
router.use("/reviews", reviewsRouter);
router.use("/events", eventsRouter);
router.use("/newsletter", newsletterRouter);
router.use("/contact", contactRouter);
router.use("/posts", postsRouter);
router.use("/members", membersRouter);
router.use("/team", teamRouter);

export default router;
