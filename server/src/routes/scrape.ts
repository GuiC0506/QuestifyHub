import { Router } from "express";
import ScrapeController from "../controllers/Scrapper";

const router = Router();

router.get("/scrape", ScrapeController.performCrawl);

export default router;
