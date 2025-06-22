import React from 'react';
import { prisma } from '@/lib/prisma';
import UsersPageClient from './components/UsersPageClient';

type PrismaUser = {
    id: string;
    name: string | null;
    email: string | null;
    profileImage: string | null;
    isActive: boolean;
    createdAt: Date;
    roleId: string | null;
    roleAssignedAt: Date | null;
    role: {
        id: string;
        name: string;
        displayName: string;
        color: string | null;
    } | null;
};

type PrismaRole = {
    id: string;
    name: string;
    displayName: string;
    description: string | null;
    color: string | null;
    layoutType: string;
    isActive: boolean;
    isSystemDefault: boolean;
};

export default async function AdminUsersPage() {
    // Kullanıcıları tek rol sistemi ile al
    const usersData = await prisma.user.findMany({
        include: {
            role: true, // Tek rol sistemi
        },
        orderBy: { createdAt: 'desc' }
    });

    // Rolleri direkt Prisma ile al
    const rolesData = await prisma.authRole.findMany({
        where: { isActive: true },
        orderBy: { displayName: 'asc' }
    });

    // Kullanıcı verilerini UsersPageClient için dönüştür (Tek rol sistemi)
    const users = usersData.map((user: PrismaUser) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        isActive: user.isActive,
        createdAt: user.createdAt.toISOString(),
        roleId: user.roleId,
        roleAssignedAt: user.roleAssignedAt?.toISOString(),
        // Tek rol sistemi - kullanıcının tek rolü
        currentRole: user.role ? {
            id: user.role.id,
            name: user.role.name,
            displayName: user.role.displayName,
            color: user.role.color,
        } : null,
    }));

    // Rol verilerini dönüştür
    const roles = rolesData.map((role: PrismaRole) => ({
        id: role.id,
        name: role.name,
        displayName: role.displayName,
        description: role.description,
        color: role.color,
        layoutType: role.layoutType,
        isActive: role.isActive,
        isSystemDefault: role.isSystemDefault,
        permissions: [], // Yeni sistemde permissions ayrı yönetiliyor
    }));

    return (
        <UsersPageClient
            users={users}
            roles={roles}
        />
    );
}
