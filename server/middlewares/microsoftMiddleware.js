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
      // Add token refresh configuration
      passReqToCallback: false,
      skipUserProfile: false,
    },
    async function (accessToken, refreshToken, profile, done) {
      profile.accessToken = accessToken;
      profile.refreshToken = refreshToken; // Store refresh token for later use
      
      try {
        const response = await axios.get(
          `https://graph.microsoft.com/v1.0/me?$select=onPremisesSamAccountName`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            timeout: 10000, // Add timeout to prevent hanging requests
          }
        );

        const onPremisesSamAccountName =
          response?.data?.onPremisesSamAccountName;
        if (!onPremisesSamAccountName) {
          console.error("onPremisesSamAccountName is null or undefined");
          return done(null, false, { message: "Invalid user account. Please ensure you have a valid organizational account." });
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
          return done(null, { id: id, email: mail, fullname: fullname, role: 'user' });
        }
        return done(null, { 
          id: id, 
          email: mail, 
          fullname: fullname, 
          role: existingUser.role || 'user'
        });
      } catch (err) {
        console.error('Microsoft OAuth Error:', err.message);
        
        // Handle specific OAuth errors
        if (err.response?.status === 401) {
          return done(null, false, { message: "Authentication failed. Please try signing in again." });
        }
        
        if (err.code === 'ECONNABORTED') {
          return done(null, false, { message: "Authentication timeout. Please try again." });
        }
        
        if (err.message.includes('AADSTS70008')) {
          return done(null, false, { message: "Authorization code expired. Please sign in again." });
        }
        
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
