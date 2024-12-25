import { GoogleGenerativeAI } from '@google/generative-ai'
import { OAuth2Client } from 'google-auth-library'
import { google } from 'googleapis'

const addEventFunctionDeclaration = {
	name: 'addCalendarEvent',
	description: 'Add a new event to the user\'s Google Calendar',
	parameters: {
		type: 'OBJECT',
		properties: {
			summary: { type: 'STRING', description: 'Event title' },
			description: { type: 'STRING', description: 'Event description' },
			start: { type: 'STRING', description: 'Start time (ISO 8601 format)' },
			end: { type: 'STRING', description: 'End time (ISO 8601 format)' }
		},
		required: ['summary', 'start', 'end']
	}
}

const updateEventFunctionDeclaration = {
	name: 'updateCalendarEvent',
	description: 'Update an existing event in the user\'s Google Calendar',
	parameters: {
		type: 'OBJECT',
		properties: {
			eventId: { type: 'STRING', description: 'ID of the event to update' },
			summary: { type: 'STRING', description: 'New event title' },
			description: { type: 'STRING', description: 'New event description' },
			start: {
				type: 'STRING',
				description: 'New start time (ISO 8601 format)'
			},
			end: { type: 'STRING', description: 'New end time (ISO 8601 format)' }
		},
		required: ['eventId', 'start', 'end']
	}
}

const deleteEventFunctionDeclaration = {
	name: 'deleteCalendarEvent',
	description: 'Delete an event from the user\'s Google Calendar',
	parameters: {
		type: 'OBJECT',
		properties: {
			eventId: { type: 'STRING', description: 'ID of the event to delete' }
		},
		required: ['eventId']
	}
}

const getCalendarEventsFunctionDeclaration = {
	name: 'getCalendarEvents',
	description: 'Get the user\'s calendar events for the next week',
	parameters: {
		type: 'OBJECT',
        properties: {
            eventId: { type: 'STRING', description: 'ID of the event to delete' }
        },
		required: []
	}
}

const getCurrentDateFunctionDeclaration = {
	name: 'getCurrentDate',
	description: 'Get the current date and time in ISO 8601 format',
  parameters: {
    type: 'OBJECT',
    properties: {
      format: {
        type: 'STRING',
        description: 'The format of the date (ignored in this implementation)',
        enum: ['ISO', 'UTC', 'local']
      }
    },
    required: []
  }
}

const addCalendarEvent = async (oAuth2Client: OAuth2Client, params: any) => {
	const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })
	const event = {
		summary: params.summary,
		description: params.description,
		start: { dateTime: params.start },
		end: { dateTime: params.end }
	}
	const result = await calendar.events.insert({
		calendarId: 'primary',
		requestBody: event
	})
	return `Event added with ID: ${result.data.id}`
}

const updateCalendarEvent = async (oAuth2Client: OAuth2Client, params: any) => {
	const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })
	const event = {
		summary: params.summary,
		description: params.description,
		start: { dateTime: params.start },
		end: { dateTime: params.end }
	}
	const result = await calendar.events.update({
		calendarId: 'primary',
		eventId: params.eventId,
		requestBody: event
	})
	return `Event updated with ID: ${result.data.id}`
}

const deleteCalendarEvent = async (oAuth2Client: OAuth2Client, params: any) => {
	const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })
	await calendar.events.delete({
		calendarId: 'primary',
		eventId: params.eventId
	})
	return `Event deleted with ID: ${params.eventId}`
}

const getCalendarEvents = async (oAuth2Client: OAuth2Client) => {
	const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })
	const now = new Date()
	const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
	const events = await calendar.events.list({
		calendarId: 'primary',
		timeMin: now.toISOString(),
		timeMax: oneWeekFromNow.toISOString(),
		singleEvents: true,
		orderBy: 'startTime'
	})

	return events.data.items?.map((event) => ({
		summary: event.summary,
		description: event.description,
		start: event.start?.dateTime,
		end: event.end?.dateTime,
		eventId: event.id
	}))
}

const getCurrentDate = () => {
	return new Date().toISOString()
}
let oAuth2Client: OAuth2Client

export default defineEventHandler(async (event) => {
	try {
		const GEMINI_API_KEY = import.meta.env.GEMINI_API_KEY
		const clientId = import.meta.env.G_AUTH_CLIENT_ID
		const clientSecret = import.meta.env.G_AUTH_CLIENT_SECRET

		if (!GEMINI_API_KEY || !clientId || !clientSecret) {
			throw new Error('Missing required API keys')
		}

		const { prompt, history } = await readBody(event)
		if (!prompt) {
			throw new Error('Missing required parameter: prompt')
		}

		let calendarLinked = false

		const cookies = parseCookies(event).currentGoogleCalToken
		if (cookies) {
			const googleCalendar = JSON.parse(cookies)
			oAuth2Client = new google.auth.OAuth2(
				clientId,
				clientSecret
			) as any
			oAuth2Client.setCredentials({
				access_token: googleCalendar.access_token,
				refresh_token: googleCalendar.refresh_token,
				expiry_date: googleCalendar.expiry_date
			})

			calendarLinked = true
		}

		const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
		const model = genAI.getGenerativeModel({
			model: 'gemini-pro',
			generationConfig: {
				maxOutputTokens: 2048,
				temperature: 0.9,
				topK: 1,
				topP: 1
			},
			tools: {
				// @ts-ignore
				functionDeclarations: [
					addEventFunctionDeclaration,
					updateEventFunctionDeclaration,
					deleteEventFunctionDeclaration,
                    getCalendarEventsFunctionDeclaration,
                    getCurrentDateFunctionDeclaration
				]
			}
		})

		const chat = model.startChat({
			history: history || []
		})

		let assistantPrompt =
			'You are an AI assistant helping with general tasks and questions.'
		if (calendarLinked) {
			assistantPrompt += ' The user has linked their Google Calendar. You can use the getCalendarEvents function to fetch their upcoming events for the next week when needed.'
		} else {
			assistantPrompt +=
				' The user hasn\'t linked their Google Calendar yet. Suggest linking it for more personalized calendar-related assistance when appropriate.'
		}
		assistantPrompt += `
      The user's query is: "${prompt}". 
      Provide helpful suggestions, answer questions, or offer advice as needed. 
      If the user wants to make changes to their calendar and it's linked, use the tools provided to make changes to their calendar.
      Remember to use the getCalendarEvents function first if you need to know about the user's upcoming events before making any changes or providing calendar-related information.`

		const result = await chat.sendMessage(assistantPrompt)

		let response = result.response.text()
		const functions = {
			addCalendarEvent: (params: any) =>
				addCalendarEvent(oAuth2Client, params),
			updateCalendarEvent: (params: any) =>
				updateCalendarEvent(oAuth2Client, params),
			deleteCalendarEvent: (params: any) =>
				deleteCalendarEvent(oAuth2Client, params),
            getCalendarEvents: () => getCalendarEvents(oAuth2Client),
            getCurrentDate: () => getCurrentDate()
		} as any

		// Check if the model wants to call a function
		const functionCalls = result.response.functionCalls()

		if (functionCalls && functionCalls.length > 0 && calendarLinked) {
			for (const functionCall of functionCalls) {
				const { name, args } = functionCall
				if (name in functions) {
					const functionResult = await functions[name](args)
					response += `\n\nFunction called: ${name}\nResult: ${functionResult}`
				}
			}
		}

		return { response, calendarLinked }
	} catch (error) {
		console.error('Error in Gemini API handler:', error)
		if (error instanceof Error) {
			throw createError({
				statusCode: 500,
				message: error.message
			})
		} else {
			throw createError({
				statusCode: 500,
				message: 'An unexpected error occurred'
			})
		}
	}
})
