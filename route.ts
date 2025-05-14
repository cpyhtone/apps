import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcrypt"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = users.find((user) => user.email === credentials.email)
        if (!user) {
          return null
        }

        const isPasswordValid = await compare(credentials.password, user.password)
        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub
        session.user.role = token.role
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  // Add the secret key for JWT encryption
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key-change-in-production",
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }// This would typically come from a database
export const users = [
  {
    id: "1",
    name: "Admin User",
    email: "eunoiacom4@gmail.com",
    password: "$2b$10$8OxDlUUu9jQyVJYmU1hRPuof/D07o.MYHUkDOXsyvJUNa/UtldaDK", // "23xx13xx"
    role: "admin",
  },
  {
    id: "2",
    name: "Regular User",
    email: "admin@eunoia.id",
    password: "$2b$10$8OxDlUUu9jQyVJYmU1hRPuof/D07o.MYHUkDOXsyvJUNa/UtldaDK", // "23xx13xx"
    role: "user",
  },
];

