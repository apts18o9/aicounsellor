import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/server/db"; 
import { compare } from "bcryptjs";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const user = await prisma.user.findUnique({
                    where: { email: credentials?.email }
                });
                if (
                    !user ||
                    typeof credentials?.password !== "string" ||
                    typeof user.password !== "string"
                ) return null;
                const isValid = await compare(credentials.password, user.password);
                if (!isValid) return null;
                return { id: user.id, email: user.email };
            }
        })
    ],
    session: { strategy: "jwt" },
    pages: {
        signIn: "/login",
        error: "/login"
    },
    callbacks: {
        async jwt({ token, user }) {
            // Add user id to the token on login
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            // Add user id from token to session
            if (session.user && token.id) {
                session.user.id = token.id as string;
            }
            return session;
        }
    }
});

export { handler as GET, handler as POST };
// ...existing code...