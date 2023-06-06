import { NextApiRequest, NextApiResponse } from "next"
import { withSessionRoute } from "@/lib/ironSession/withSession"

export default withSessionRoute(logoutRoute)

async function logoutRoute(req: NextApiRequest, res: NextApiResponse) { 
    req.session.destroy()
    return res.status(200).send("OK")
}