import { readMessages, writeMessages } from "@/lib/i18n/messages";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const MODEL = process.env.GOOGLE_GENAI_MODEL || "gemini-1.5-flash";

export async function POST(request: Request) {
  const {
    sourceLocale,
    targetLocale,
    ns = "base",
  } = (await request.json()) as {
    sourceLocale: string;
    targetLocale: string;
    ns?: "base" | "admin";
  };
  if (!sourceLocale || !targetLocale)
    return NextResponse.json(
      { error: "sourceLocale and targetLocale required" },
      { status: 400 }
    );

  const source = await readMessages(sourceLocale, ns);

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
  const model = genAI.getGenerativeModel({ model: MODEL });

  const prompt = `You are a translation engine. Translate the following JSON values from ${sourceLocale} to ${targetLocale}. Keep JSON keys and structure unchanged. Respond with JSON only.\n\n${JSON.stringify(
    source
  )}`;

  const result = await model.generateContent(prompt);
  const text = result.response?.text?.() ?? "{}";
  let translated: Record<string, unknown> = {};
  try {
    translated = JSON.parse(text);
  } catch {
    // Fallback: try to extract JSON code block
    const match = text.match(/\{[\s\S]*\}/);
    if (!match)
      return NextResponse.json(
        { error: "Failed to parse translation" },
        { status: 500 }
      );
    translated = JSON.parse(match[0]);
  }

  await writeMessages(targetLocale, ns, translated);
  return NextResponse.json({
    ok: true,
    targetLocale,
    ns,
    count: Object.keys(translated).length,
  });
}
