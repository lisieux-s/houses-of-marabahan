import { Router } from "express";


import houseRouter from "./houseRouter.js";
import characterRouter from "./characterRouter.js";
import kindRouter from "./kindRouter.js";

import creatorRouter from "./creatorRouter.js";

const router = Router();
router.use(houseRouter)
router.use(creatorRouter)
router.use(characterRouter)
router.use(kindRouter)

export default router;