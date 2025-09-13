import {createTRPCReact} from '@trpc/react-query'
import type {AppRouter} from "../server/router/index.ts"

export const trpc = createTRPCReact<AppRouter>();

