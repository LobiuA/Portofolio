import { NextRequest, NextResponse } from 'next/server'

// GitHub OAuth — step 2: exchange the code for a token, then hand it to the
// Sveltia/Decap CMS popup via postMessage (the standard `authorization:github` handshake).
export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  // trim() guards against an accidental trailing space/newline pasted into the env var.
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID?.trim()
  const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET?.trim()

  if (!code || !clientId || !clientSecret) {
    return new NextResponse('Missing code or OAuth env vars', { status: 400 })
  }

  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
  })
  const data = (await tokenRes.json()) as { access_token?: string; error_description?: string }

  const ok = Boolean(data.access_token)
  const status = ok ? 'success' : 'error'
  const content = ok
    ? { provider: 'github', token: data.access_token }
    : { provider: 'github', error: data.error_description || 'Authentication failed' }

  // Mirror the Sveltia/Decap protocol exactly: announce `authorizing:github` to the
  // opener, then ONLY respond to the opener's matching `authorizing:github` reply
  // (posting the result to that message's origin). No premature listener removal.
  const html = `<!doctype html><html><head><meta charset="utf-8" /></head><body>
<script>
  (function () {
    window.addEventListener('message', function (e) {
      if (e.data === 'authorizing:github') {
        window.opener.postMessage(
          'authorization:github:${status}:' + ${JSON.stringify(JSON.stringify(content))},
          e.origin
        );
      }
    }, false);
    window.opener.postMessage('authorizing:github', '*');
  })();
</script>
</body></html>`

  return new NextResponse(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
}
