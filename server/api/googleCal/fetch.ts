import { OAuth2Client } from 'google-auth-library'
import { google } from 'googleapis'
import axios from 'axios'

export default defineEventHandler(async (event) => {
  // Load environment variables
  const clientId = import.meta.env.G_AUTH_CLIENT_ID
  const clientSecret = import.meta.env.G_AUTH_CLIENT_SECRET

  const body = await readBody(event)
  const { credentials, queryParams } = body

  if (!credentials) {
    throw createError({ statusCode: 401, message: 'No credentials provided' })
  }

  const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret)
  oAuth2Client.setCredentials({
    access_token: credentials.access_token,
    refresh_token: credentials.refresh_token,
    expiry_date: credentials.expiry_date
  })

  // Check if token is expired or will expire soon (within 5 minutes)
  const isTokenExpired = credentials.expiry_date &&
    credentials.expiry_date < Date.now() + 5 * 60 * 1000

  // If token is expired, refresh it
  if (isTokenExpired && credentials.refresh_token) {
    try {
      const host = getRequestHeader(event, 'host')
      const protocol = host?.includes('localhost') ? 'http' : 'https'
      const url = `${protocol}://${host}/api/refreshToken`

      const response = await axios.post(url, {
        refresh_token: credentials.refresh_token
      })

      if (response.data && response.data.access_token) {
        credentials.access_token = response.data.access_token
        credentials.expiry_date = response.data.expiry_date

        // Update the client credentials
        oAuth2Client.setCredentials({
          access_token: credentials.access_token,
          refresh_token: credentials.refresh_token,
          expiry_date: credentials.expiry_date
        })
      }
    } catch (error) {
      console.error('Error refreshing token in fetch:', error)
      // Continue with the old token and hope for the best
    }
  }

  const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })

  // Verify queryParams has the required fields
  if (!queryParams || !queryParams.timeMin || !queryParams.timeMax) {
    throw createError({
      statusCode: 400,
      message: 'Missing required query parameters: timeMin and timeMax'
    })
  }

  try {
    const response = await calendar.events.list({
      calendarId: 'primary',
      ...queryParams
    })

    // Return both the refreshed credentials (if any) and the events
    return {
      statusCode: 200,
      data: response.data.items,
      credentials: {
        access_token: credentials.access_token,
        expiry_date: credentials.expiry_date
      }
    }
  } catch (error: any) {
    console.error('Error fetching calendar events:', error)
    throw createError({
      statusCode: error.code || 401,
      message: error.message || 'Failed to fetch calendar events'
    })
  }
})
