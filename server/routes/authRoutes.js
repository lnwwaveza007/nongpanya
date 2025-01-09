import { Router } from "express";
import { signin, signout } from "../controllers/authController.js";
import passport from "../middlewares/microsoftMiddleware.js";
import "../middlewares/microsoftMiddleware.js"

const authRoute = Router();

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
    failureRedirect: "/",
    session: false,
  }), signin
);

authRoute.get("/signout", signout);

export default authRoute;
