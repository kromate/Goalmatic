import crypto from 'crypto'
import { OAuth2Client } from 'google-auth-library'

export default defineEventHandler(async (event) => {
  // Load environment variables

  const host = getRequestHeader(event, 'host')
	let redirectUri
	if (host?.includes('localhost')) {
		redirectUri = `http://${host}/api/oauth2callback`
	} else {
    redirectUri = `https://${host}/api/oauth2callback`
  }

  const clientId = import.meta.env.G_AUTH_CLIENT_ID
  const clientSecret = import.meta.env.G_AUTH_CLIENT_SECRET

  // Determine integration type from query parameter; default to 'calendar'
  const query = getQuery(event) || {}
  const integration = query.integration ? String(query.integration).toLowerCase() : 'calendar'

  // Set scopes based on integration type
  let scopes: string[]
  switch (integration) {
    case 'spreadsheet':
      scopes = ['https://www.googleapis.com/auth/spreadsheets', 'email', 'profile', 'openid']
      break
    case 'calendar':
    default:
      scopes = ['https://www.googleapis.com/auth/calendar', 'email', 'profile', 'openid']
  }

  // Create OAuth2Client
  const oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUri)

  // Generate the authorization URL
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    state: crypto.randomBytes(20).toString('hex'),
    prompt: 'consent'
  })

  // Return the authorization URL
  return { authUrl }
})
