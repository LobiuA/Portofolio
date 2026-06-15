import { NextRequest, NextResponse } from 'next/server'

// GitHub OAuth — step 1: send the editor to GitHub's authorize screen.
// Used by Sveltia CMS (/admin) via config.yml `base_url` + `auth_endpoint: api/auth`.
export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID
  if (!clientId) {
    return new NextResponse('Missing GITHUB_OAUTH_CLIENT_ID env var', { status: 500 })
  }

  const redirectUri = `${req.nextUrl.origin}/api/callback`
  const authUrl = new URL('https://github.com/login/oauth/authorize')
  authUrl.searchParams.set('client_id', clientId)
  authUrl.searchParams.set('redirect_uri', redirectUri)
  authUrl.searchParams.set('scope', 'repo') // needed to read/write the (private) repo
  authUrl.searchParams.set('state', crypto.randomUUID())

  return NextResponse.redirect(authUrl.toString())
}
