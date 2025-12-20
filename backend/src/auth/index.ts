import { Router } from "express";
import Login from "./login/login";
import Singup from "./signup/signup";
import LoginVerification from "./verification/loginVerification";
import SignupVerification from "./verification/signupVerification";
import { handleGoogleAuthCallback } from "./google/google";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { prisma } from "../lib/prisma";

const AuthRouter = Router();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env["GOOGLE_CLIENT_ID"]!,
      clientSecret: process.env["GOOGLE_CLIENT_SECRET"]!,
      callbackURL: process.env["GOOGLE_CALLBACK_URL"]!,
      scope: ["profile", "email"],
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const primaryEmail = profile.emails?.[0];
        if (!primaryEmail || !primaryEmail.value) {
          return done(new Error("Google profile missing email"), undefined);
        }

        const email = primaryEmail.value;
        let user = await prisma.user.findUnique({ where: { email } });

        if (user) {
          return done(null, user);
        } else {
          const googleFullName =
            profile.displayName ||
            `${profile.name?.givenName || ""} ${
              profile.name?.familyName || ""
            }`.trim() ||
            email.split("@")[0];

          const tempUserData = {
            isNewUser: true,
            email: email,
            fullName: googleFullName,
          };

          return done(null, tempUserData);
        }
      } catch (error) {
        return done(error as Error, undefined);
      }
    }
  )
);

// Serialization (Optional if session: false, but good to have)
passport.serializeUser((user: any, done) => done(null, user.id || user.email));
passport.deserializeUser((obj: any, done) => done(null, obj));

// --- ROUTES ---

AuthRouter.post("/login", Login);
AuthRouter.post("/signup", Singup);
AuthRouter.post("/login-otp", LoginVerification);
AuthRouter.post("/signup-otp", SignupVerification);

// 1. Trigger Google Login
AuthRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// 2. Google Callback (FIXED)
AuthRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "http://localhost:3000/login?error=auth_failed",
  }),
  handleGoogleAuthCallback // Ab yahan req.user mil jaye ga!
);

export default AuthRouter;
