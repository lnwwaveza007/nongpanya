import passport from "passport";
import { Strategy as MicrosoftStrategy } from "passport-microsoft";
import dotenv from "dotenv";
import { createUser, findUserById } from "../models/userModels.js";
import axios from "axios";

dotenv.config();

passport.use(
  new MicrosoftStrategy(
    {
      // Standard OAuth2 options
      clientID: process.env.MICROSOFT_CLIENT_ID || "",
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET || "",
      callbackURL: process.env.MICROSOFT_CALLBACK_URL || "",
      scope: ["user.read"],
      authorizationURL: process.env.MICROSOFT_AUTH_URL || "",
      tokenURL: process.env.MICROSOFT_TOKEN_URL || "",
      apiEntryPoint: "https://graph.microsoft.com",
    },
    async function (accessToken, refreshToken, profile, done) {
      profile.accessToken = accessToken;
      try {
        
        const response = await axios.get(
          `https://graph.microsoft.com/v1.0/me?$select=onPremisesSamAccountName`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        const onPremisesSamAccountName = response?.data?.onPremisesSamAccountName;
        if (!onPremisesSamAccountName) {
          console.error("onPremisesSamAccountName is null or undefined");
          return done(null, false, { message: "Invalid user account." });
        }
        profile.studentId = onPremisesSamAccountName;

        const firstname = profile.name.givenName;
        const lastname = profile.name.familyName;
        const mail = profile.emails[0].value;
        const studentId = profile.studentId

        const existingUser = await findUserById(studentId);
        if (existingUser.length === 0) {
          const insertResult = await createUser(studentId, mail, firstname, lastname);

          if (insertResult.affectedRows === 0) {
            console.error("Failed to create user profile in the database.");
            return done(null, false, { message: "Profile creation failed." });
          }
          return done(null, profile);
        }
        return done(null, profile);
      } catch (err) {
        console.error(err);
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.studentId);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await findUserById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;
