import express from 'express';
import { getHotelsSignature } from '../../controllers/hotels/signature.controller.js';
import { getHotelsSearch } from '../../controllers/hotels/search.controller.js';
import { getHotelsInfoInit } from '../../controllers/hotels/getHotelsInfo.controller.js';
const router = express.Router();

router.post("/signature", getHotelsSignature);
router.post("/search", getHotelsSearch);
router.post('/info/init', getHotelsInfoInit);

export default router;