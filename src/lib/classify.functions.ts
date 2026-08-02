import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { classifyWasteImage } from "./classify.server";

const ScanInput = z.object({
  image: z.string().min(32),
});

export const scanWaste = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ScanInput.parse(input))
  .handler(async ({ data }) => classifyWasteImage(data.image));
