import { Request, Response } from "express";
import AsyncLocalStorageUtils from "../../utils/async-local-storage/async-local-storage.utils";
import { User } from "../../models/entities/user/user.model";
import { SocialStatsDto } from "../../models/dtos/dashboard/social-stats.dto";


export default class DashboardController {


    static getSocialStats = async (req: Request, res: Response) => {
        try {
            const userId = AsyncLocalStorageUtils.getLoggedInUserId();
            const user = await User.findByPk(userId, {
                include: [
                    { association: 'following' },
                    { association: 'followers' },
                    { association: 'posts' }
                ]
            }) as User;
            if (!user) throw new Error("User not found")
            const { posts, following, followers } = user;
            const stats = { posts: posts?.length || 0, followers: followers?.length || 0, following: following?.length || 0 } as SocialStatsDto
            return res.send(stats);
        } catch (error: any) {
            res.status(500).send({ message: error?.message || 'Something went wrong' })
        }
    }

}