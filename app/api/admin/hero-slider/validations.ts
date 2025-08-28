import { z } from "zod";

// Dinamik dil içeriği için schema
const DynamicLocalizedContentSchema = z.record(z.string(), z.string().optional());

// Dinamik button schema
const DynamicLocalizedButtonSchema = z.record(z.string(), z.object({
  text: z.string().optional(),
  url: z.string().optional(),
}));

// İstatistik alanları
const StatisticSchema = z.object({
  value: z.string().min(1, "Value is required"),
  label: z.string().min(1, "Label is required"),
});

// Çok dilli istatistik schema
const MultilingualStatisticSchema = z.record(z.string(), z.object({
  value: z.string(),
  label: z.string(),
}));

// Ana hero slider schema - dinamik dil desteği ile
export const DynamicHeroSliderSchema = z.object({
  title: DynamicLocalizedContentSchema,
  subtitle: DynamicLocalizedContentSchema.optional(),
  description: DynamicLocalizedContentSchema,
  badge: DynamicLocalizedContentSchema.optional(),
  backgroundImage: z.string().min(1, "Background image is required"),
  primaryButton: DynamicLocalizedButtonSchema,
  secondaryButton: DynamicLocalizedButtonSchema.optional(),
  statistics: z.array(z.union([StatisticSchema, MultilingualStatisticSchema])).optional(),
  isActive: z.boolean().default(true),
  order: z.number().default(0),
});

// Dinamik validasyon fonksiyonu - tüm diller için
export function validateHeroSliderDynamic(data: z.infer<typeof DynamicHeroSliderSchema>) {
  const errors: Record<string, string[]> = {};
  const generalErrors: string[] = [];
  
  // Tüm dil kodlarını topla
  const languageCodes = new Set<string>();
  
  Object.keys(data.title || {}).forEach(code => languageCodes.add(code));
  Object.keys(data.description || {}).forEach(code => languageCodes.add(code));
  Object.keys(data.primaryButton || {}).forEach(code => languageCodes.add(code));
  
  // Eğer hiç dil yoksa hata
  if (languageCodes.size === 0) {
    generalErrors.push("At least one language content is required");
    return { isValid: false, errors: { general: generalErrors } };
  }
  
  // Her dil için validasyon
  languageCodes.forEach(langCode => {
    errors[langCode] = [];
    
    // Title kontrolü
    if (!data.title?.[langCode]?.trim()) {
      errors[langCode].push("Title is required");
    }
    
    // Description kontrolü
    if (!data.description?.[langCode]?.trim()) {
      errors[langCode].push("Description is required");
    }
    
    // Primary button kontrolü
    if (!data.primaryButton?.[langCode]?.text?.trim()) {
      errors[langCode].push("Primary button text is required");
    }
    
    if (data.primaryButton?.[langCode]?.text?.trim() && !data.primaryButton?.[langCode]?.url?.trim()) {
      errors[langCode].push("Primary button URL is required when text is provided");
    }
    
    // Secondary button URL kontrolü (opsiyonel, ancak text varsa URL gerekli)
    if (data.secondaryButton?.[langCode]?.text?.trim() && !data.secondaryButton?.[langCode]?.url?.trim()) {
      errors[langCode].push("Secondary button URL is required when text is provided");
    }
    
    // Boş error array'leri temizle
    if (errors[langCode].length === 0) {
      delete errors[langCode];
    }
  });
  
  // Geçerli olup olmadığını kontrol et
  const isValid = Object.keys(errors).length === 0 && generalErrors.length === 0;
  
  if (!isValid && generalErrors.length > 0) {
    errors.general = generalErrors;
  }
  
  return { isValid, errors };
}

// Geriye uyumluluk için eski fonksiyon (tr ve en için)
export function validateHeroSliderByLanguage(data: Record<string, unknown>) {
  // Eski format ile uyumluluk için wrapper
  const dynamicData = {
    ...data,
    title: data.title || {},
    description: data.description || {},
    primaryButton: data.primaryButton || {},
    secondaryButton: data.secondaryButton,
  };
  
  return validateHeroSliderDynamic(dynamicData as z.infer<typeof DynamicHeroSliderSchema>);
}

// Type exports
export type DynamicHeroSliderInput = z.infer<typeof DynamicHeroSliderSchema>;

// Geriye uyumluluk için eski schema ve type'ları da export et
export const HeroSliderSchema = DynamicHeroSliderSchema;
export type HeroSliderInput = DynamicHeroSliderInput;
