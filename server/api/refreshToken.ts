import { OAuth2Client } from 'google-auth-library'

export default defineEventHandler(async (event) => {
  const clientId = import.meta.env.G_AUTH_CLIENT_ID
  const clientSecret = import.meta.env.G_AUTH_CLIENT_SECRET

  const body = await readBody(event)
  const { refresh_token } = body

  if (!refresh_token) {
    throw createError({ status: 400, message: 'No refresh token provided' })
  }

  try {
    const oAuth2Client = new OAuth2Client(clientId, clientSecret)
    oAuth2Client.setCredentials({
      refresh_token
    })

    const { credentials } = await oAuth2Client.refreshAccessToken()

    return {
      status: 200,
      access_token: credentials.access_token,
      expiry_date: credentials.expiry_date
    }
  } catch (error: any) {
    console.error('Token refresh error:', error)
    throw createError({
      status: 401,
      message: error.message || 'Failed to refresh token'
    })
  }
})
