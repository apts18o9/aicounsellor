//chat router

import {z} from 'zod'
import { publicProcedure, createTRPCRouter } from '@/server/trpc'
import {GoogleGenerativeAI} from '@google/generative-ai'


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string)

export const chatRouter = createTRPCRouter({
    sendMessage: publicProcedure
        .input(z.object({
            message: z.string(),
            history: z.array(z.object({
                role: z.enum(['user', 'model']),
                parts: z.array(z.object({
                    text: z.string(),
                })),
            })).optional()
        }))
        .mutation(async ({input}) => {
            try {
                const model = genAI.getGenerativeModel({model: 'gemini-1.5-flash'});

                const chat = model.startChat({history: input.history})
                
                //sending user's msg to ai
                const result = await chat.sendMessage(input.message);
                const response = await result.response
                const text = response.text();

                //returning the full msg 
                return {
                    role: 'model',
                    parts: [{text: text}],
                };
            } catch (error) {
                console.error('Error in AI response', error);
                throw new Error('Failed to get a response from AI. Please try again')
                
            }
        })
})