import { NextApiRequest, NextApiResponse } from "next";
import { withSessionRoute } from "@/lib/ironSession/withSession";
import jwt_decode from "jwt-decode";
import { tokenPayload, tokenRes } from "@/lib/types/token";
import { auth0User, user } from "@/lib/types/user";

export default withSessionRoute(loginRoute);

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
    const { username, password } = req.body

    console.log('username y password: ', username, password)

    const user: user = {
        token: {
            access_token: 'eydsfdfsdfDSFREFGOEKGEORGKEGOK%4ogtk090k593409kt430k3fkfek',
            expires_in: 8600,
            token_type: "Bearer"
        },
        id: 'auth0|user_id',
        email: 'test@plattesgroup.net',
        name: 'Test',
        nickname: 'test user',
        picture: 'https://ui-avatars.com/api/?name=Jon+Snow&background=0D8ABC&color=fff&size=128',
        password: undefined,  // Ensure that password is removed
        isLoggedIn: true
    };

    req.session.user = user
    await req.session.save()

    console.log('TODO CORRECTO, DEVOLVIENDO STATUS 200!')

    return res.status(200).send(null);
}