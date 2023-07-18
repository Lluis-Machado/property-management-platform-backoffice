import { NextApiRequest, NextApiResponse } from 'next';
import { withSessionRoute } from '@/lib/ironSession/withSession';

export default withSessionRoute(userRoute);

async function userRoute(req: NextApiRequest, res: NextApiResponse) {
    const user = req.session.user;

    if (user)
        res.status(200).json({
            ...user,
        });
    else
        res.status(401).json({
            error: 'User not found.',
        });
}
