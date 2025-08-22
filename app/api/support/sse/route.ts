import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/server-utils";
import { addConnection, removeConnection } from "@/lib/support/sse-utils";

export async function GET(request: NextRequest) {
  try {
    // Kullanıcı authentication kontrolü
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;
    const isAdmin = user.permissions?.includes("admin.support.manage");

    // SSE için response stream oluştur
    const stream = new ReadableStream({
      start(controller) {
        // Bağlantıyı kaydet
        addConnection(userId, controller);

        // İlk bağlantı mesajı gönder
        const encoder = new TextEncoder();
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ 
              type: "connection", 
              message: "Connected to support updates",
              userId,
              isAdmin 
            })}\n\n`
          )
        );

        // Heartbeat için interval (30 saniyede bir)
        const heartbeatInterval = setInterval(() => {
          try {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: "heartbeat" })}\n\n`)
            );
          } catch (_error) {
            clearInterval(heartbeatInterval);
          }
        }, 30000);

        // Cleanup on close
        request.signal.addEventListener("abort", () => {
          clearInterval(heartbeatInterval);
          removeConnection(userId);
          controller.close();
        });
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
        "X-Accel-Buffering": "no", // Nginx buffering'i kapat
      },
    });
  } catch (error) {
    console.error("SSE connection error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
