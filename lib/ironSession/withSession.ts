// libraries imports
import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next';
import {
    GetServerSidePropsContext,
    GetServerSidePropsResult,
    NextApiHandler,
} from 'next';

// Local imports
import { ironConfig } from './config';

export function withSessionRoute(handler: NextApiHandler) {
    return withIronSessionApiRoute(handler, ironConfig);
};

export function withSessionSsr<
    P extends { [key: string]: unknown } = { [key: string]: unknown },
>(
    handler: (
        context: GetServerSidePropsContext,
    ) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>,
) {
    return withIronSessionSsr(handler, ironConfig);
};