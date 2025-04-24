import { Prisma } from "@prisma/client";


export type VideoFullType = Prisma.VideoGetPayload<{ select: { [K in keyof Required<Prisma.VideoSelect>]: true } }>