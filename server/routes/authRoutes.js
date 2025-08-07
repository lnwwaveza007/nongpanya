import { Router } from "express";
import { localRegister, localSignin, signin, signout } from "../controllers/authController.js";
import passport from "../middlewares/microsoftMiddleware.js";
import "../middlewares/microsoftMiddleware.js"
import authenticateToken from "../middlewares/authenticateToken.js";
import { authorizeRoles } from "../middlewares/authorizeRole.js";

const authRoute = Router();

authRoute.post("/signin",localSignin);
authRoute.post("/register", authenticateToken, authorizeRoles('admin','superadmin'), localRegister);
authRoute.get(
  "/microsoft",
  passport.authenticate("microsoft", {
    prompt: "select_account",
    session: false,
  })
);

authRoute.get(
  "/microsoft/callback",
  passport.authenticate("microsoft", {
    failureRedirect: "/auth/error?message=authentication_failed",
    session: false,
  }), 
  (req, res, next) => {
    // Handle authentication success
    if (req.user) {
      signin(req, res, next);
    } else {
      // Fallback error handling
      res.redirect("/auth/error?message=authentication_failed");
    }
  }
);

authRoute.get("/signout", signout);

// Add error handling route for OAuth failures
authRoute.get("/error", (req, res) => {
  const message = req.query.message || "authentication_failed";
  const errorMessages = {
    authentication_failed: "Authentication failed. Please try again.",
    token_expired: "Your session has expired. Please sign in again.",
    invalid_user: "Invalid user account. Please contact support.",
    timeout: "Authentication timeout. Please try again."
  };
  
  return res.status(401).json({
    success: false,
    message: errorMessages[message] || "Authentication error occurred",
    error: message
  });
});

authRoute.get("/", authenticateToken, (req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      id: req.user.id,
    },
    message: "User is authorized",
  });
});

export default authRoute;
