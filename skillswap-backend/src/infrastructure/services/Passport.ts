import passport from "passport"
import { Strategy as GoogleStrategy }
from "passport-google-oauth20"
import { Strategy as GithubStrategy } from "passport-github2"

passport.use(

  new GoogleStrategy(

    {
      clientID:
        process.env.GOOGLE_CLIENT_ID!,

      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET!,

      callbackURL:
        process.env.GOOGLE_CALLBACK_URL!

    },

    async (_, __, profile, done) => {

      const user = {

        email:
          profile.emails?.[0].value,

        name:
          profile.displayName

      }

      return done(null, user)

    }

  )

)
passport.use(

  new GithubStrategy(

    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL:
        "http://localhost:5000/auth/github/callback",

      scope: ["user:email"]

    },

    async (_, __, profile, done) => {

      const email =
        profile.emails?.[0]?.value ||
        `${profile.username}@github.com`

      return done(null, { email })

    }

  )

)


export default passport