import express from "express";
import DashboardController from "../controllers/dashboard/dashboard.controlller";


const router = express.Router();

router.get('/social-stats', DashboardController.getSocialStats)

export const dashboardRouter = router;