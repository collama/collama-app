import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { nextAuthOptions } from "~/libs/auth"

export async function GET(request: Request) {
  const session = await getServerSession(nextAuthOptions)

  if (!session) {
    return new NextResponse(
      JSON.stringify({ status: "fail", message: "You are not logged in" }),
      { status: 401 }
    )
  }

  return NextResponse.json({
    authenticated: !!session,
    session,
  })
}
