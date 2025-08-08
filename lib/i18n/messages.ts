import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();

export type Namespace = "admin" | "base";

export function getMessageFilePath(locale: string, ns: Namespace): string {
  if (ns === "admin")
    return path.join(ROOT, "messages", "admin", `admin_${locale}.json`);
  return path.join(ROOT, "messages", `${locale}.json`);
}

export async function readMessages(
  locale: string,
  ns: Namespace
): Promise<Record<string, unknown>> {
  const filePath = getMessageFilePath(locale, ns);
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return {};
    throw err;
  }
}

export async function writeMessages(
  locale: string,
  ns: Namespace,
  messages: Record<string, unknown>
): Promise<void> {
  const filePath = getMessageFilePath(locale, ns);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  const json = JSON.stringify(messages, null, 2);
  await fs.writeFile(filePath, `${json}\n`, "utf8");
}

export async function updateMessages(
  locale: string,
  ns: Namespace,
  updater: (current: Record<string, unknown>) => Record<string, unknown>
): Promise<Record<string, unknown>> {
  const current = await readMessages(locale, ns);
  const next = updater(current);
  await writeMessages(locale, ns, next);
  return next;
}


