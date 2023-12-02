import express from "express";
import DashboardController from "../controllers/dashboard.controlller";


const router = express.Router();

router.get('/stats', DashboardController.getSocialStats)
router.post('/follow/:userId', DashboardController.followUser)
router.post('/unfollow/:userId', DashboardController.unfollowUser)

export const socialRouter = router;