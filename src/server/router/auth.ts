import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { prisma } from "../db";
import { hash } from "bcryptjs";

export const authRouter = router({
  signup: publicProcedure
    .input(z.object({
      email: z.email(),
      password: z.string().min(8)
    }))
    .mutation(async ({ input }) => {
      const existing = await prisma.user.findUnique({ where: { email: input.email } });
      if (existing) throw new Error("User already exists.");
      const hashed = await hash(input.password, 10);
      await prisma.user.create({
        data: { email: input.email, password: hashed }
      });
      return { success: true, message: "User created successfully." };
    }),
});