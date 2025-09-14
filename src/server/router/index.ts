import { chatRouter } from './chatRouter'; 
import { authRouter } from './auth';
import { createTRPCRouter } from '../trpc';

export const appRouter = createTRPCRouter({
  auth: authRouter,
  chat: chatRouter,
});

export type AppRouter = typeof appRouter;