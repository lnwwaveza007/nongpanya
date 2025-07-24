import passport from "passport";
import { Strategy as MicrosoftStrategy } from "passport-microsoft";
import dotenv from "dotenv";
import { createUser, findUserById } from "../services/userServices.js";
import axios from "axios";
import { getConfig } from "../config/envConfig.js";

dotenv.config();

// Get environment-specific configuration
const config = getConfig();

passport.use(
  new MicrosoftStrategy(
    {
      // Standard OAuth2 options
      clientID: config.microsoft.clientId || "",
      clientSecret: config.microsoft.clientSecret || "",
      callbackURL: config.microsoft.callbackUrl || "",
      scope: ["user.read"],
      authorizationURL: config.microsoft.authUrl || "",
      tokenURL: config.microsoft.tokenUrl || "",
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

        const onPremisesSamAccountName =
          response?.data?.onPremisesSamAccountName;
        if (!onPremisesSamAccountName) {
          console.error("onPremisesSamAccountName is null or undefined");
          return done(null, false, { message: "Invalid user account." });
        }
        profile.id = onPremisesSamAccountName;

        const fullname = profile.displayName;
        const mail = profile.emails[0].value;
        const id = profile.id;

        const existingUser = await findUserById(id);

        if (!existingUser) {
          const insertResult = await createUser({
            id: id,
            email: mail,
            fullname: fullname,
            auth_provider: "microsoft",
          });

          if (insertResult.affectedRows === 0) {
            console.error("Failed to create user profile in the database.");
            return done(null, false, { message: "Profile creation failed." });
          }
          return done(null, { id: id, email: mail, fullname: fullname });
        }
        return done(null, { id: id, email: mail, fullname: fullname });
      } catch (err) {
        console.error(err);
        return done(err);
      }
    }
  )
);

// passport.serializeUser((user, done) => {
//   done(null, user.studentId);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await findUserById(id);
//     done(null, user);
//   } catch (err) {
//     done(err);
//   }
// });

export default passport;
