import { OAuth2Client } from 'google-auth-library'
import { google } from 'googleapis'

export default defineEventHandler(async (event) => {
  // Load environment variables
  const clientId = import.meta.env.G_AUTH_CLIENT_ID
  const clientSecret = import.meta.env.G_AUTH_CLIENT_SECRET

  const body = await readBody(event)
  const { credentials, queryParams } = body

  if (!credentials) {
    throw createError({ status: 401, message: 'No credentials provided' })
  }

  const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret)
  oAuth2Client.setCredentials({
    access_token: credentials.access_token,
    refresh_token: credentials.refresh_token,
    expiry_date: credentials.expiry_date
  })

  const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })

  try {
    const response = await calendar.events.list({
      calendarId: 'primary',
      ...queryParams
    })

    return {
      status: 200,
      data: response.data.items
    }
  } catch (error: any) {
    throw createError({ status: 401, message: error.message })
  }
})
