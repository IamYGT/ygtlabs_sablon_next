import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session-utils";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Default preferences
    const preferences = {
      theme: "system",
      language: "tr",
    };

    return NextResponse.json(preferences);
  } catch (error) {
    console.error("Preferences fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { theme, language } = await request.json();

    // Validation
    if (theme && !["light", "dark", "system"].includes(theme)) {
      return NextResponse.json({ error: "Invalid theme" }, { status: 400 });
    }

    if (language && !["tr", "en"].includes(language)) {
      return NextResponse.json({ error: "Invalid language" }, { status: 400 });
    }

    // For this simple implementation, we'll return success
    // In a real app, you might want to store these in a user preferences table
    return NextResponse.json({
      success: true,
      message: "Preferences updated successfully",
      data: { theme, language },
    });
  } catch (error) {
    console.error("Preferences update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
