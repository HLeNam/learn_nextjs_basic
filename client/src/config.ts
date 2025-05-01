import { z } from "zod";

const configSchema = z.object({
    NEXT_PUBLIC_API_ENDPOINT: z.string().url(),
});

const rawEnv = {
    NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT,
};

const parsedEnv = configSchema.safeParse(rawEnv);

if (!parsedEnv.success) {
    console.error("❌ Invalid environment variables", parsedEnv.error.format());
    throw new Error("Invalid environment variables");
}

const config = parsedEnv.data;

export default config;
