import { Router } from "express";
import { localRegister, localSignin, signin, signout } from "../controllers/authController.js";
import passport from "../middlewares/microsoftMiddleware.js";
import "../middlewares/microsoftMiddleware.js"
import authenticateToken from "../middlewares/authenticateToken.js";

const authRoute = Router();

authRoute.post("/signin",localSignin);
authRoute.post("/register",localRegister);
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
