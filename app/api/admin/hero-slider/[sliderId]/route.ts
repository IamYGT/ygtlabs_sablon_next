import type { UserWithPermissions } from "@/lib/permissions";
import { withPermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Validation schemas for update
const LocalizedContentSchema = z.object({
  tr: z.string().min(1, "Turkish content is required"),
  en: z.string().min(1, "English content is required"),
});

const ButtonConfigSchema = z.object({
  tr: z.object({
    text: z.string().min(1, "Button text is required"),
    href: z.string().url("Valid URL is required"),
  }),
  en: z.object({
    text: z.string().min(1, "Button text is required"),
    href: z.string().url("Valid URL is required"),
  }),
});

const StatisticItemSchema = z.object({
  tr: z.object({
    label: z.string().min(1, "Label is required"),
    value: z.string().min(1, "Value is required"),
    icon: z.string().optional(),
  }),
  en: z.object({
    label: z.string().min(1, "Label is required"),
    value: z.string().min(1, "Value is required"),
    icon: z.string().optional(),
  }),
});

const UpdateSliderSchema = z.object({
  title: LocalizedContentSchema.optional(),
  subtitle: LocalizedContentSchema.optional(),
  description: LocalizedContentSchema.optional(),
  badge: LocalizedContentSchema.optional(),
  backgroundImage: z.string().url("Valid background image URL is required").optional(),
  primaryButton: ButtonConfigSchema.optional(),
  secondaryButton: ButtonConfigSchema.optional(),
  statistics: z.array(StatisticItemSchema).optional(),
  isActive: z.boolean().optional(),
  order: z.number().int().min(0).optional(),
});

// GET - Tek bir hero slider'ı getir
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sliderId: string }> }
) {
  return withPermission(
    "admin.hero-slider.view",
    async (_request: NextRequest, _user: UserWithPermissions) => {
      try {
        const { sliderId } = await params;

        const slider = await prisma.heroSlider.findUnique({
          where: { id: sliderId },
          include: {
            createdBy: { select: { id: true, name: true, email: true } },
            updatedBy: { select: { id: true, name: true, email: true } },
          },
        });

        if (!slider) {
          return NextResponse.json(
            { error: "Slider not found" },
            { status: 404 }
          );
        }

        return NextResponse.json(
          {
            success: true,
            data: slider,
          },
          {
            headers: { "Content-Type": "application/json; charset=utf-8" },
          }
        );
      } catch (error) {
        console.error("Hero slider fetch error:", error);
        return NextResponse.json(
          {
            success: false,
            error: "Failed to fetch hero slider",
          },
          { status: 500 }
        );
      }
    }
  )(request);
}

// PUT - Hero slider'ı güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ sliderId: string }> }
) {
  return withPermission(
    "admin.hero-slider.update",
    async (request: NextRequest, user: UserWithPermissions) => {
      try {
        const { sliderId } = await params;
        const body = await request.json();

        // Validate request body
        const validationResult = UpdateSliderSchema.safeParse(body);
        if (!validationResult.success) {
          return NextResponse.json(
            {
              success: false,
              error: "Validation failed",
              details: validationResult.error.errors,
            },
            { status: 400 }
          );
        }

        const validatedData = validationResult.data;

        // Check if slider exists
        const existingSlider = await prisma.heroSlider.findUnique({
          where: { id: sliderId },
        });

        if (!existingSlider) {
          return NextResponse.json(
            {
              success: false,
              error: "Slider not found",
            },
            { status: 404 }
          );
        }

        // Check if order is already taken by another slider
        if (validatedData.order !== undefined && validatedData.order !== existingSlider.order) {
          const conflictingSlider = await prisma.heroSlider.findFirst({
            where: {
              order: validatedData.order,
              id: { not: sliderId },
            },
          });
          if (conflictingSlider) {
            return NextResponse.json(
              {
                success: false,
                error: "Order position is already taken by another slider",
              },
              { status: 400 }
            );
          }
        }

        const dataToUpdate: Record<string, unknown> = { ...validatedData };
        dataToUpdate.updatedById = user.id;

        const updatedSlider = await prisma.heroSlider.update({
          where: { id: sliderId },
          data: dataToUpdate,
          include: {
            createdBy: { select: { id: true, name: true, email: true } },
            updatedBy: { select: { id: true, name: true, email: true } },
          },
        });

        return NextResponse.json(
          {
            success: true,
            message: "Hero slider updated successfully",
            data: updatedSlider,
          },
          {
            headers: {
              "Content-Type": "application/json; charset=utf-8",
            },
          }
        );
      } catch (error) {
        console.error("Hero slider update error:", error);
        return NextResponse.json(
          {
            success: false,
            error: "Failed to update hero slider",
          },
          { status: 500 }
        );
      }
    }
  )(request);
}

// DELETE - Hero slider'ı sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ sliderId: string }> }
) {
  return withPermission(
    "admin.hero-slider.delete",
    async (_request: NextRequest, _user: UserWithPermissions) => {
      try {
        const { sliderId } = await params;

        // Check if slider exists
        const existingSlider = await prisma.heroSlider.findUnique({
          where: { id: sliderId },
        });

        if (!existingSlider) {
          return NextResponse.json(
            {
              success: false,
              error: "Slider not found",
            },
            { status: 404 }
          );
        }

        await prisma.heroSlider.delete({
          where: { id: sliderId },
        });

        return NextResponse.json(
          {
            success: true,
            message: "Hero slider deleted successfully",
          },
          {
            headers: {
              "Content-Type": "application/json; charset=utf-8",
            },
          }
        );
      } catch (error) {
        console.error("Hero slider delete error:", error);
        return NextResponse.json(
          {
            success: false,
            error: "Failed to delete hero slider",
          },
          { status: 500 }
        );
      }
    }
  )(request);
}
