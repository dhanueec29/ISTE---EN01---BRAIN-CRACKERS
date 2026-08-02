import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const ResultSchema = z.object({
  itemName: z.string(),
  category: z.string(),
  material: z.string(),
  binColor: z.string(),
  recyclable: z.boolean(),
  confidence: z.number(),
  summary: z.string(),
  disposalSteps: z.array(z.string()),
  tips: z.array(z.string()),
  environmentalImpact: z.string(),
  isWaste: z.boolean(),
});

export type ScanResult = z.infer<typeof ResultSchema>;

const SYSTEM = `You are an expert municipal waste-sorting and recycling assistant.
Given a photo, identify the main discarded item and explain exactly how to dispose of it.
Rules:
- category must be one of: Recyclable, Organic, Hazardous, E-Waste, Landfill, Reusable.
- binColor is the common colour-coded bin (e.g. "Blue", "Green", "Red", "Black", "Yellow").
- confidence is 0-100.
- disposalSteps: 3 to 5 short imperative steps.
- tips: 2 to 4 short practical tips (reuse, upcycling, local drop-off).
- environmentalImpact: one sentence on the impact of correct disposal.
- summary: one sentence describing the item and its category.
- isWaste is false if the photo contains no identifiable waste item; then keep other fields short and explain in summary.`;

export async function classifyWasteImage(imageDataUrl: string): Promise<ScanResult> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("AI service is not configured.");

  const gateway = createLovableAiGatewayProvider(apiKey);

  try {
    const { text } = await generateText({
      model: gateway("google/gemini-3.6-flash"),
      system: `${SYSTEM}
Respond with ONLY a JSON object with keys: itemName (string), category (string), material (string), binColor (string), recyclable (boolean), confidence (number), summary (string), disposalSteps (string array), tips (string array), environmentalImpact (string), isWaste (boolean). No markdown fences, no commentary.`,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Identify this waste item and how to dispose of it." },
            { type: "file", mediaType: "image/jpeg", data: imageDataUrl },
          ],
        },
      ],
    });

    const raw = text
      .trim()
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/```$/, "")
      .trim();
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    const json = start >= 0 && end > start ? raw.slice(start, end + 1) : raw;
    return ResultSchema.parse(JSON.parse(json));
  } catch (error) {
    console.error("waste classification failed", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    if (message.includes("429")) throw new Error("Too many scans right now — try again in a moment.");
    if (message.includes("402"))
      throw new Error("AI credits exhausted. Add credits to continue scanning.");
    throw new Error("Could not analyse that image. Please try another photo.");
  }
}

