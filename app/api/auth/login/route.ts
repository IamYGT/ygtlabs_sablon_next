import { NextRequest, NextResponse } from "next/server";
import { prisma, hashPassword, AUTH_COOKIE_NAME } from "@/lib";

// Login API endpoint (Modern Authentication)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      password,
      deviceInfo: clientDeviceInfo,
      rememberDevice = true,
    } = body;

    // Gerekli alanlar kontrolü
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "E-posta ve şifre gereklidir" },
        { status: 400 }
      );
    }

    // IP adresi ve kullanıcı ajanını al (şimdilik kullanılmıyor)
    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const _ip = forwardedFor?.split(",")[0] || realIp || "unknown";

    const _userAgent = request.headers.get("user-agent") || "unknown";

    // Server-side device info parse et
    const serverDeviceInfo = {
      browser: "Unknown",
      os: "Unknown",
      device: "Unknown",
    };

    // Client-side device info ile merge et (daha detaylı bilgi için)
    const _mergedDeviceInfo = {
      ...serverDeviceInfo,
      ...(clientDeviceInfo && {
        screenResolution: clientDeviceInfo.screenResolution,
        timezone: clientDeviceInfo.timezone,
        language: clientDeviceInfo.language,
      }),
    };



    // Kullanıcıyı bul
    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user || !user.isActive) {
      return NextResponse.json(
        { success: false, error: "Geçersiz e-posta veya şifre" },
        { status: 401 }
      );
    }

    // Şifre kontrolü
    const isValidPassword = await hashPassword.verify(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: "Geçersiz e-posta veya şifre" },
        { status: 401 }
      );
    }

    // Session oluştur
    const sessionToken = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (body.rememberDevice ? 7 : 1)); // 7 gün veya 1 gün

    await prisma.session.create({
      data: {
        sessionToken,
        userId: user.id,
        expires: expiresAt,
        isActive: true,
        lastActive: new Date(),
      },
    });

    // Son giriş tarihini güncelle
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // User permissions'ları al
    let permissions: string[] = [];
    if (user.role) {
      const rolePermissions = await prisma.roleHasPermission.findMany({
        where: {
          roleName: user.role.name,
          isAllowed: true,
          isActive: true,
        },
        include: {
          permission: true,
        },
      });

      permissions = rolePermissions.map((rp) => rp.permission.name);
    }

    // Response user objesi
    const responseUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      isActive: user.isActive,
      roleId: user.roleId,
      roleAssignedAt: user.roleAssignedAt,
      permissions,
      userRoles: user.role ? [user.role.name] : [],
      primaryRole: user.role?.name,
      createdAt: user.createdAt,
      lastLoginAt: new Date(),
    };

    const response = NextResponse.json({
      success: true,
      user: responseUser,
      message: "Giriş başarılı",
      deviceRegistered: rememberDevice,
    });

    // Session cookie'yi set et
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: rememberDevice ? 604800 : 86400, // 7 gün veya 1 gün
      path: "/",
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("❌ Login API hatası:", error);
    return NextResponse.json(
      { success: false, error: "Sunucu hatası" },
      { status: 500 }
    );
  }
}
