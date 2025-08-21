// SSE bağlantılarını tutacak Map
const connections = new Map<string, ReadableStreamDefaultController>();

// Event gönderme helper fonksiyonu (diğer API'lerden kullanılacak)
export function sendSSEEvent(
  userId: string | string[],
  eventType: string,
  data: Record<string, unknown>
) {
  const encoder = new TextEncoder();
  const userIds = Array.isArray(userId) ? userId : [userId];

  userIds.forEach((id) => {
    const controller = connections.get(id);
    if (controller) {
      try {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: eventType, ...data })}\n\n`
          )
        );
      } catch (_error) {
        // Bağlantı kopmuş olabilir, sil
        connections.delete(id);
      }
    }
  });
}

// Tüm admin'lere event gönderme
export function broadcastToAdmins(eventType: string, data: Record<string, unknown>) {
  const encoder = new TextEncoder();
  
  connections.forEach((controller, userId) => {
    // Admin kontrolü yapılmalı (gerçek implementasyonda session'dan kontrol edilmeli)
    try {
      controller.enqueue(
        encoder.encode(
          `data: ${JSON.stringify({ type: eventType, ...data })}\n\n`
        )
      );
    } catch (_error) {
      connections.delete(userId);
    }
  });
}

// Connection yönetimi
export function addConnection(userId: string, controller: ReadableStreamDefaultController) {
  connections.set(userId, controller);
}

export function removeConnection(userId: string) {
  connections.delete(userId);
}

export function getConnection(userId: string) {
  return connections.get(userId);
}
