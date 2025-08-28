import { z } from "zod";

// Her dil için ayrı validasyon schema'sı
const LocalizedContentSchema = z.object({
  tr: z.string().optional(),
  en: z.string().optional(),
});

// Button yapısı her dil için
const LocalizedButtonSchema = z.object({
  tr: z.object({
    text: z.string().optional(),
    url: z.string().optional(),
  }),
  en: z.object({
    text: z.string().optional(), 
    url: z.string().optional(),
  }),
});

// İstatistik alanları
const StatisticSchema = z.object({
  value: z.string().min(1, "Value is required"),
  label: z.string().min(1, "Label is required"),
});

// Ana hero slider schema
export const HeroSliderSchema = z.object({
  title: LocalizedContentSchema,
  subtitle: LocalizedContentSchema.optional(),
  description: LocalizedContentSchema,
  badge: LocalizedContentSchema.optional(),
  backgroundImage: z.string().min(1, "Background image is required"),
  primaryButton: LocalizedButtonSchema,
  secondaryButton: LocalizedButtonSchema.optional(),
  statistics: z.array(StatisticSchema).optional(),
  isActive: z.boolean().default(true),
  order: z.number().default(0),
});

// Her dil için özel validasyon fonksiyonu
export function validateHeroSliderByLanguage(data: z.infer<typeof HeroSliderSchema>) {
  const errors: Record<string, string[]> = { tr: [], en: [] };
  
  // Hangi dillerde içerik var kontrol et
  const hasTurkishContent = !!(data.title?.tr || data.description?.tr || 
    data.primaryButton?.tr?.text || data.badge?.tr);
  const hasEnglishContent = !!(data.title?.en || data.description?.en || 
    data.primaryButton?.en?.text || data.badge?.en);

  // Eğer hiçbir dilde içerik yoksa genel hata
  if (!hasTurkishContent && !hasEnglishContent) {
    errors.general = ["At least one language content is required"];
    return { isValid: false, errors };
  }

  // Türkçe içerik validasyonu
  if (hasTurkishContent) {
    if (!data.title?.tr?.trim()) {
      errors.tr.push("Title is required for Turkish content");
    }
    if (!data.description?.tr?.trim()) {
      errors.tr.push("Description is required for Turkish content");
    }
    if (!data.primaryButton?.tr?.text?.trim()) {
      errors.tr.push("Primary button text is required for Turkish content");
    }
    if (data.primaryButton?.tr?.text?.trim() && !data.primaryButton?.tr?.url?.trim()) {
      errors.tr.push("Primary button URL is required when text is provided");
    }
  }

  // İngilizce içerik validasyonu
  if (hasEnglishContent) {
    if (!data.title?.en?.trim()) {
      errors.en.push("Title is required for English content");
    }
    if (!data.description?.en?.trim()) {
      errors.en.push("Description is required for English content");
    }
    if (!data.primaryButton?.en?.text?.trim()) {
      errors.en.push("Primary button text is required for English content");
    }
    if (data.primaryButton?.en?.text?.trim() && !data.primaryButton?.en?.url?.trim()) {
      errors.en.push("Primary button URL is required when text is provided");
    }
  }

  // Geçerli olup olmadığını kontrol et
  const isValid = errors.tr.length === 0 && errors.en.length === 0 && !errors.general;

  return { isValid, errors };
}

// Type export
export type HeroSliderInput = z.infer<typeof HeroSliderSchema>;
