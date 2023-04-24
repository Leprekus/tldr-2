import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { setCookie } from 'cookies-next';
const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = jwt.sign('credentials', process.env.NEXTAUTH_SECRET!)
  setCookie('test', token, { req, res, maxAge: 60 * 60 * 24 })

  return res.status(200)
  }

export default handler