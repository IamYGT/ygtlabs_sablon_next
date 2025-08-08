import { readMessages, writeMessages } from "@/lib/i18n/messages";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale");
  const ns = (searchParams.get("ns") as "base" | "admin") ?? "base";
  if (!locale)
    return NextResponse.json({ error: "locale required" }, { status: 400 });
  const messages = await readMessages(locale, ns);
  return NextResponse.json({ locale, ns, messages });
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale");
  const ns = (searchParams.get("ns") as "base" | "admin") ?? "base";
  if (!locale)
    return NextResponse.json({ error: "locale required" }, { status: 400 });
  const body = (await request.json()) as { messages: Record<string, unknown> };
  if (!body?.messages || typeof body.messages !== "object") {
    return NextResponse.json(
      { error: "messages object required" },
      { status: 400 }
    );
  }
  await writeMessages(locale, ns, body.messages);
  return NextResponse.json({ ok: true });
}


