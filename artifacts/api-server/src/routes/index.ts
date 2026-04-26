import { Router, type IRouter } from "express";
import healthRouter from "./health";
import storageRouter from "./storage";
import packagesRouter from "./packages";
import vehiclesRouter from "./vehicles";
import galleryRouter from "./gallery";
import reviewsRouter from "./reviews";
import settingsRouter from "./settings";
import instagramPostsRouter from "./instagram-posts";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(storageRouter);
router.use(packagesRouter);
router.use(vehiclesRouter);
router.use(galleryRouter);
router.use(reviewsRouter);
router.use(settingsRouter);
router.use(instagramPostsRouter);
router.use(adminRouter);

export default router;
