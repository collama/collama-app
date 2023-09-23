import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { nextAuthOptions } from "~/libs/auth"
import type { NextApiRequest, NextApiResponse } from "next"

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, nextAuthOptions)

  if (!session) {
    return new NextResponse(
      JSON.stringify({ status: "fail", message: "You are not logged in" }),
      { status: 401 }
    )
  }

  return res.json({
    authenticated: !!session,
    session,
  })
}
