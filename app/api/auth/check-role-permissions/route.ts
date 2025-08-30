import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/server-utils";

export async function POST(request: NextRequest) {
  try {
    // Cookie'den kullanıcıyı al (HttpOnly cookie kullanımı)
    const currentUser = await getCurrentUser(request);

    if (!currentUser) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const body = await request.json();
    const { roleNames } = body;

    if (!roleNames || !Array.isArray(roleNames)) {
      return NextResponse.json(
        { error: "Geçersiz rol listesi" },
        { status: 400 }
      );
    }

    // Dinamik rol yetki kontrolü - yetki sayısına göre
    const results: { [key: string]: boolean } = {};

    // Kullanıcının rol atama yetkisi var mı?
    const hasRoleAssignPermission = 
      currentUser.permissions.includes("admin.roles.assign") || 
      currentUser.permissions.includes("roles.assign") ||
      currentUser.primaryRole === "super_admin";
    
    // Debug logging
    console.log("[check-role-permissions] Current user role:", currentUser.primaryRole);
    console.log("[check-role-permissions] User permission count:", currentUser.permissions?.length);
    console.log("[check-role-permissions] Has role assign permission:", hasRoleAssignPermission);
    console.log("[check-role-permissions] Checking roles:", roleNames);
    
    // Eğer rol atama yetkisi yoksa hiçbir rolü atayamaz
    if (!hasRoleAssignPermission) {
      console.log("[check-role-permissions] User doesn't have role assignment permission");
      for (const roleName of roleNames) {
        results[roleName] = false;
      }
      return NextResponse.json({
        user: {
          id: currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
        },
        results,
        message: "Rol atama yetkiniz bulunmamaktadır"
      });
    }
    
    // Super admin tüm rolleri atayabilir
    if (currentUser.primaryRole === "super_admin") {
      console.log("[check-role-permissions] User is super_admin, granting all permissions");
      for (const roleName of roleNames) {
        results[roleName] = true;
      }
    } else {
      // Diğer yöneticiler super_admin rolü dışındaki rolleri atayabilir
      for (const roleName of roleNames) {
        if (roleName === "super_admin") {
          results[roleName] = false;
        } else {
          results[roleName] = true;
        }
        console.log(`[check-role-permissions] Role ${roleName}: user is not super_admin, canAssign=${results[roleName]}`);
      }
    }

    return NextResponse.json({
      user: {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
      },
      results,
    });
  } catch (error) {
    console.error("Rol yetki kontrolü hatası:", error);
    return NextResponse.json(
      { error: "Rol yetki kontrolü sırasında hata oluştu" },
      { status: 500 }
    );
  }
}
