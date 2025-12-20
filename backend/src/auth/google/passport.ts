// src/lib/passport.ts (Updated for Verification Only)
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { prisma } from "../../lib/prisma";

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error, undefined);
  }
});

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
        // --- FIX: Proper check lagaya ---
        const primaryEmail = profile.emails?.[0];

        if (!primaryEmail || !primaryEmail.value) {
          // Ya toh emails array empty hai, ya pehle item mein 'value' property nahi hai
          return done(new Error("Google profile missing email"), undefined);
        }

        const email = primaryEmail.value; // Ab email guaranteed string hai
        // --- FIX END ---

        // --- 1. User Lookup (Verification) ---
        let user = await prisma.user.findUnique({ where: { email } });
        // ... (rest of your logic is good) ...

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

export default passport;
