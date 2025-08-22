import { getCurrentUser } from "@/lib";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
  
    const currentUser = await getCurrentUser(request);

    // Debug API - silent operation, no console logs
    return NextResponse.json({
      success: true,
      debug: {
        user: currentUser?.email,
        primaryRole: currentUser?.primaryRole,
        permissionCount: currentUser?.permissions?.length || 0,
        hasAdminLayout: currentUser?.permissions?.includes("admin.layout"),
        hasDashboardView: currentUser?.permissions?.includes("admin.dashboard.view"),
      },
    });
  } catch (error) {
    console.error("Debug API error:", error);
    return NextResponse.json({ error: "Debug error" }, { status: 500 });
  }
}
