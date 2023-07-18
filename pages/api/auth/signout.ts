import { NextApiRequest, NextApiResponse } from 'next';
import { withSessionRoute } from '@/lib/ironSession/withSession';

export default withSessionRoute(logoutRoute);

async function logoutRoute(req: NextApiRequest, res: NextApiResponse) {
    req.session.destroy();
    res.setHeader('cache-control', 'no-store, max-age=0');
    return res.status(200).send('OK');
}
