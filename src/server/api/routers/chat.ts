import { z } from 'zod';
import { publicProcedure, router } from '@/server/trpc';
import { prisma } from '@/server/db';
import { TRPCError } from '@trpc/server';
import { Role } from '@/generated/prisma';
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

// Define the schema for a single chat message
const chatMessageSchema = z.object({
    role: z.enum(['user', 'model']),
    parts: z.array(z.object({
        text: z.string(),
    })),
});

export const chatRouter = router({
    // Fetch all chat sessions for the current user.
    getChatSessions: publicProcedure
        .input(z.object({ userId: z.string() }))
        .query(async ({ input }) => {
            const { userId } = input;
            const sessions = await prisma.chatSession.findMany({
                where: { userId },
                orderBy: { updatedAt: 'desc' },
                include: {
                    messages: {
                        orderBy: { createdAt: 'desc' },
                        take: 1,
                    },
                },
            });

            // Map sessions to expected frontend shape
            return sessions.map(session => ({
                id: session.id,
                title: session.title,
                lastMessage: session.messages[0]?.content ?? '',
                active: false, // Set this in frontend based on selection
            }));
        }),

    // Create a new chat session for the current user.
    createChatSession: publicProcedure
        .input(z.object({ userId: z.string(), title: z.string(), userEmail: z.email() }))
        .mutation(async ({ input }) => {
            const { userId, title, userEmail } = input;
            const newSession = await prisma.chatSession.create({
                data: {
                    title,
                    user: {
                        connectOrCreate: {
                            where: { email: userEmail }, // Use email here!
                            create: { id: userId, email: userEmail },
                        },
                    },
                },
            });
            return newSession;
        }),

    // Send and receive messages.
    sendMessage: publicProcedure
        .input(z.object({
            message: z.string(),
            sessionId: z.string(),
            history: z.array(z.object({
                role: z.enum(['user', 'model']),
                parts: z.array(z.object({
                    text: z.string(),
                })),
            })).optional(),
        }))
        .mutation(async ({ input }) => {
            const { message, sessionId, history } = input;


            const session = await prisma.chatSession.findUnique({
                where: { id: sessionId },
            });
            if (!session) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Chat session does not exist.',
                });
            }

            // 1. Save the user's message to the database
            const userMessage = await prisma.message.create({
                data: {
                    content: message,
                    role: Role.USER,
                    chatSessionId: sessionId,
                },
            });

            // 2. Call your AI API to get a response
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const chat = model.startChat({ history: input.history });
            const result = await chat.sendMessage(message);
            const response = await result.response;
            const aiResponseContentRaw = response.text();
            // Remove all asterisks
            const aiResponseContent = aiResponseContentRaw.replace(/\*/g, '');
         
            const aiMessage = await prisma.message.create({
                data: {
                    content: aiResponseContent,
                    role: Role.MODEL,
                    chatSessionId: sessionId,
                },
            });
           
            return {
                role: 'model',
                parts: [{ text: aiMessage.content }],
            };

            // 4. Update the session's 'updatedAt' timestamp
            await prisma.chatSession.update({
                where: { id: sessionId },
                data: { updatedAt: new Date() },
            });

            // 5. Return the AI's message to the frontend.
            return {
                role: 'MODEL',
                parts: [{ text: aiMessage.content }],
            };
        }),

    // Fetch all messages for a specific session.
    getMessagesBySessionId: publicProcedure
        .input(z.object({ sessionId: z.string() }))
        .query(async ({ input }) => {
            const { sessionId } = input;
            const messages = await prisma.message.findMany({
                where: { chatSessionId: sessionId },
                orderBy: { createdAt: 'asc' },
            });

            // Map messages to expected frontend shape
            return messages.map(msg => ({
                id: msg.id,
                text: msg.content,
                sender: msg.role === 'USER' ? 'user' : 'ai',
                timestamp: msg.createdAt.toISOString(),
            }));
        }),


    //to update the chat name in chatWindow
    updateChatSessionTitle: publicProcedure
        .input(z.object({
            sessionId: z.string(),
            title: z.string().min(1),
        }))
        .mutation(async ({input}) => {
            const {sessionId, title} = input;
            const updated = await prisma.chatSession.update({
                where: {id: sessionId},
                data: {title}
            });
            return updated;
        })
});