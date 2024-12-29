import { z, genkit } from 'genkit'
import { OAuth2Client } from 'google-auth-library'
import { google } from 'googleapis'
import { gemini15Flash, googleAI } from '@genkit-ai/googleai'

const GEMINI_API_KEY = import.meta.env.GEMINI_API_KEY
let globalEvent: any

const ai = genkit({
	plugins: [googleAI({ apiKey: GEMINI_API_KEY })],
	model: gemini15Flash
})
let calendarLinked = false

const getCalendarInstance = () => {
		const clientId = import.meta.env.G_AUTH_CLIENT_ID
	const clientSecret = import.meta.env.G_AUTH_CLIENT_SECRET

		if (!clientId || !clientSecret) {
			throw new Error('Missing required API keys')
		}


		let oAuth2Client: OAuth2Client
		const cookies = parseCookies(globalEvent).currentGoogleCalToken
		if (cookies) {
			const googleCalendar = JSON.parse(cookies)
			oAuth2Client = new google.auth.OAuth2(clientId, clientSecret) as any
			oAuth2Client.setCredentials({
				access_token: googleCalendar.access_token,
				refresh_token: googleCalendar.refresh_token,
				expiry_date: googleCalendar.expiry_date
			})
			calendarLinked = true
			return google.calendar({ version: 'v3', auth: oAuth2Client })
		}
}

const addEventTool = ai.defineTool(
	{
		name: 'addCalendarEvent',
		description: 'Add a new event to the user\'s Google Calendar',
		inputSchema: z.object({
			summary: z.string().describe('Event title'),
			description: z.string().optional().describe('Event description'),
			start: z.string().describe('Start time (ISO 8601 format)'),
			end: z.string().describe('End time (ISO 8601 format)')
		})
	},
	async (input: any) => {
		const event = {
			summary: input.summary,
			description: input.description,
			start: { dateTime: input.start },
			end: { dateTime: input.end }
		}
		const calendar = getCalendarInstance()
		if (!calendar) {
			throw new Error('Calendar not linked')
		}
		const result = await calendar.events.insert({
			calendarId: 'primary',
			requestBody: event
		})
		return `Event added with ID: ${result.data.id}`
	}
)

// Define specialized agents
const calendarViewAgent = ai.definePrompt(
	{
		name: 'calendarViewAgent',
		description: 'Calendar View Agent helps users view their calendar events',
		tools: []
	},
	`{{role "system"}} Help users view and understand their calendar events. 
	 Always check current events before providing information.`
)

const calendarModifyAgent = ai.definePrompt(
	{
		name: 'calendarModifyAgent',
		description: 'Calendar Modify Agent helps users add/update/delete events',
		tools: [addEventTool]
	},
	`{{role "system"}} Help users modify their calendar by adding, updating, or 
	 deleting events. Always confirm details before making changes.`
)

// Main orchestration agent
const mainAgent = ai.definePrompt(
	{
		name: 'mainAgent',
		description: 'Main Calendar Assistant',
		tools: [calendarViewAgent, calendarModifyAgent]
	},
	`{{role "system"}} You are an AI calendar assistant. Direct calendar viewing 
	 requests to the Calendar View Agent and modification requests to the Calendar 
	 Modify Agent. If the calendar is not linked, suggest linking it.`
)

export default defineEventHandler(async (event) => {
	try {
		globalEvent = event




		if (!GEMINI_API_KEY) {
			throw new Error('Missing required API keys')
		}

		const { prompt, history } = await readBody(event)
		if (!prompt) {
			throw new Error('Missing required parameter: prompt')
		}


		// Start chat with main agent
		const chat = ai.chat(mainAgent)

		// Add context about calendar status
		const contextPrompt = calendarLinked
			? `${prompt} (Calendar is linked)`
			: `${prompt} (Calendar is not linked yet)`

		const result = await chat.send(contextPrompt)

		return {
			response: result.text
		}
	} catch (error) {
		console.error('Error in Calendar Assistant:', error)
		if (error instanceof Error) {
			throw createError({
				statusCode: 500,
				message: error.message
			})
		}
		throw createError({
			statusCode: 500,
			message: 'An unexpected error occurred'
		})
	}
})
