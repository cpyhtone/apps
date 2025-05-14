import NextAuth from "next-auth";
import Providers from "next-auth/providers";

export default NextAuth({
  providers: [
    Providers.Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Replace this with your own user authentication logic
        const user = { id: 1, name: "Admin", email: "admin@example.com" };

        if (credentials?.username === "admin" && credentials?.password === "password") {
          return user;
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async session(session, user) {
      session.user = user;
      return session;
    },
    /**
     * Handles the JSON Web Token (JWT) callback in the authentication flow.
     * This function is invoked whenever a JWT is created or updated.
     *
     * @param token - The current JWT token object. This object may contain existing claims or properties.
     * @param user - The user object, which is available during the sign-in process. It contains user-specific data.
     * @returns The updated JWT token object with additional properties, if applicable.
     *
     * @remarks
     * - If the `user` object is provided (e.g., during sign-in), the user's `id` is added to the token.
     * - This function allows customization of the token payload for use in subsequent requests.
     */
    async jwt(token, user) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
