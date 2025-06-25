# Bilgi Bankası (Knowledge Base)

Bu dosya, proje geliştirme sırasında karşılaşılan hataları ve çözümlerini içerir. Amaç, aynı sorunlarla tekrar karşılaşıldığında daha hızlı ve verimli bir şekilde çözüm bulmaktır.

---

## Error: Route `/[locale]/...` used `params.locale`. `params` should be awaited before using its properties.

**Solution:** Next.js 15 ve üzeri sürümlerde, Sunucu Bileşenlerindeki (Server Components) dinamik route parametreleri (`params`) artık asenkron hale gelmiştir ve bir `Promise` döndürür. Bu hatayı çözmek için:
1.  Parametreyi kullanan bileşeni (örneğin, Layout veya Page) `async` olarak işaretleyin (`async function MyComponent(...)`).
2.  `params` prop'unun tipini bir `Promise` ile sarmalayın (ör. `params: Promise<{ locale: string }>`).
3.  `params` objesinin özelliklerine erişmeden önce `await` anahtar kelimesini kullanın (ör. `const { locale } = await params;`).

**Date:** 2024-07-28
**Technology:** Next.js, TypeScript, React Server Components
**Context:** Bu hata, Next.js 15 sürümüne yükselttikten sonra ortaya çıktı. Dinamik bir `layout.tsx` dosyasında `params` objesi `await` kullanılmadan çağrıldığında meydana geldi. 