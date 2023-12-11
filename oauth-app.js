// This is required to refresh the token when it expires

require("dotenv").config();
const express = require("express");
const fs = require("fs");
const { google } = require("googleapis");

const app = express();
const port = 3001;
const TOKEN_PATH = "token.json";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "http://localhost:3001/oauthcallback",
);

app.get("/", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/calendar"],
  });
  res.send(`<a href="${url}">Authenticate with Google</a>`);
});

app.get("/oauthcallback", async (req, res) => {
  const { code } = req.query;
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  // Save the token to a file
  fs.writeFile(TOKEN_PATH, JSON.stringify(tokens), (err) => {
    if (err) return console.error(err);
    console.log("Token stored to", TOKEN_PATH);
  });

  res.send(
    "Authentication successful! Token saved to token.json. You can close this window.",
  );
});

app.listen(port, () => {
  console.log(`OAuth app listening at http://localhost:${port}`);
});
