import { z } from "zod";

export const TemplateSlideSchema = z.object({
  key: z.string(),
  title: z.string(),
  backgroundAssetId: z.string().optional()
});

export const TemplateDefinitionSchema = z.object({
  name: z.string(),
  slides: z.array(TemplateSlideSchema).min(1)
});
