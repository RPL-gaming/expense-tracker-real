import fs from "fs";
import { google, calendar_v3 } from "googleapis";

const TOKEN_PATH = "token.json";

/**
 * Authenticate with Google Calendar API
 * @returns {Promise<calendar_v3.Calendar>} Authenticated Google Calendar API client
 */
async function authenticate(): Promise<calendar_v3.Calendar> {
  const { client_secret, client_id, redirect_uris } = {
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uris: [process.env.GOOGLE_REDIRECT_URIS],
  };
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0],
  );

  if (fs.existsSync(TOKEN_PATH)) {
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf8"));
    oAuth2Client.setCredentials(token);
  } else {
    throw new Error("Token file not found. Run the authentication flow.");
  }

  // Check if the token is expired or not valid, and refresh if necessary
  if (
    !oAuth2Client.credentials ||
    new Date().getTime() > (oAuth2Client.credentials.expiry_date ?? 0)
  ) {
    try {
      await oAuth2Client.refreshAccessToken(); // This will automatically refresh the token
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(oAuth2Client.credentials)); // Save the new token
    } catch (error) {
      console.error("Error while trying to refresh access token:", error);
      throw error;
    }
  }

  return google.calendar({ version: "v3", auth: oAuth2Client });
}

/**
 * Create a Google Meet event and return the link
 * @param {string} customerEmail
 * @param {string} advisorEmail
 * @param {string} advisorName
 * @param {Date} startTime
 * @returns {Promise<string>} Google Meet link
 */
export const createGoogleMeetEvent = async (
  customerEmail: string,
  advisorEmail: string,
  advisorName: string,
  startTime: Date,
) => {
  const calendar = await authenticate();

  const startDateTime = new Date(startTime).toISOString();
  const endDateTime = new Date(
    new Date(startTime).getTime() + 3600000,
  ).toISOString(); // End in 1 hour

  const event = {
    summary: `Spendwise Advisor Meeting with ${advisorName}`,
    description: `Meeting with a financial advisor (${advisorName}) from Spendwise`,
    start: { dateTime: startDateTime, timeZone: "Asia/Jakarta" },
    end: { dateTime: endDateTime, timeZone: "Asia/Jakarta" },
    attendees: [{ email: customerEmail }, { email: advisorEmail }],
    conferenceData: {
      createRequest: {
        requestId: "random-string",
        conferenceSolutionKey: { type: "hangoutsMeet" },
      },
    },
  };

  try {
    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
      conferenceDataVersion: 1,
    });

    return response.data.hangoutLink;
  } catch (error) {
    console.error("Error creating calendar event:", error);
    throw error;
  }
};
