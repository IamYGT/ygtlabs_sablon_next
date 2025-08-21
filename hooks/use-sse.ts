"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export interface SSEEvent {
  type: string;
  [key: string]: any;
}

interface UseSSEOptions {
  url: string;
  onMessage?: (event: SSEEvent) => void;
  onError?: (error: Event) => void;
  onOpen?: () => void;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export function useSSE({
  url,
  onMessage,
  onError,
  onOpen,
  reconnectInterval = 5000,
  maxReconnectAttempts = 5,
}: UseSSEOptions) {
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const cleanup = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    setIsConnected(false);
  }, []);

  const connect = useCallback(() => {
    cleanup();

    try {
      const eventSource = new EventSource(url);
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        console.log("SSE connection opened");
        setIsConnected(true);
        setConnectionError(null);
        reconnectAttemptsRef.current = 0;
        onOpen?.();
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as SSEEvent;
          
          // Heartbeat mesajlarını yoksay
          if (data.type === "heartbeat") {
            return;
          }
          
          onMessage?.(data);
        } catch (error) {
          console.error("Error parsing SSE message:", error);
        }
      };

      eventSource.onerror = (error) => {
        console.error("SSE connection error:", error);
        setIsConnected(false);
        onError?.(error);

        // Yeniden bağlanmayı dene
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++;
          setConnectionError(
            `Connection lost. Reconnecting... (${reconnectAttemptsRef.current}/${maxReconnectAttempts})`
          );
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        } else {
          setConnectionError("Connection failed. Please refresh the page.");
          cleanup();
        }
      };
    } catch (error) {
      console.error("Error creating EventSource:", error);
      setConnectionError("Failed to establish connection");
    }
  }, [url, onMessage, onError, onOpen, reconnectInterval, maxReconnectAttempts, cleanup]);

  useEffect(() => {
    connect();
    return cleanup;
  }, [connect, cleanup]);

  return {
    isConnected,
    connectionError,
    reconnect: connect,
  };
}

// Support ticket için özelleştirilmiş hook
export function useRealtimeTicket(ticketId?: string) {
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const { toast } = useToast();

  const handleMessage = useCallback((event: SSEEvent) => {
    switch (event.type) {
      case "new-message":
        if (!ticketId || event.ticketId === ticketId) {
          setLastUpdate(new Date());
          toast({
            title: "Yeni Mesaj",
            description: event.message || "Yeni bir mesaj aldınız",
          });
        }
        break;

      case "ticket-update":
        if (!ticketId || event.ticketId === ticketId) {
          setLastUpdate(new Date());
          toast({
            title: "Ticket Güncellendi",
            description: event.message || "Ticket durumu güncellendi",
          });
        }
        break;

      case "user-typing":
        if (ticketId && event.ticketId === ticketId) {
          setTypingUsers((prev) => {
            if (event.isTyping && !prev.includes(event.userId)) {
              return [...prev, event.userId];
            } else if (!event.isTyping) {
              return prev.filter((id) => id !== event.userId);
            }
            return prev;
          });
        }
        break;

      case "ticket-assigned":
        if (event.assigneeId === ticketId) {
          toast({
            title: "Ticket Atandı",
            description: `Ticket size atandı: #${event.ticketNumber}`,
          });
        }
        break;
    }
  }, [ticketId]);

  const { isConnected, connectionError } = useSSE({
    url: "/api/support/sse",
    onMessage: handleMessage,
  });

  return {
    isConnected,
    connectionError,
    lastUpdate,
    typingUsers,
  };
}

// Online kullanıcı durumu için hook
export function useOnlineStatus() {
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  const handleMessage = useCallback((event: SSEEvent) => {
    if (event.type === "user-online") {
      setOnlineUsers((prev) => {
        const newSet = new Set(prev);
        if (event.isOnline) {
          newSet.add(event.userId);
        } else {
          newSet.delete(event.userId);
        }
        return newSet;
      });
    }
  }, []);

  const { isConnected } = useSSE({
    url: "/api/support/sse",
    onMessage: handleMessage,
  });

  return {
    isConnected,
    onlineUsers,
    isUserOnline: (userId: string) => onlineUsers.has(userId),
  };
}
