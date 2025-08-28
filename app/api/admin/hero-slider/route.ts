import { withPermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";

// Validation schemas
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

const CreateSliderSchema = z.object({
  title: LocalizedContentSchema,
  subtitle: LocalizedContentSchema.optional(),
  description: LocalizedContentSchema,
  badge: LocalizedContentSchema.optional(),
  backgroundImage: z.string().url("Valid background image URL is required"),
  primaryButton: ButtonConfigSchema,
  secondaryButton: ButtonConfigSchema.optional(),
  statistics: z.array(StatisticItemSchema).optional(),
  isActive: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
});

// GET - Tüm hero slider'ları listele
export const GET = withPermission("admin.hero-slider.view", async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const isActive = searchParams.get("isActive");

    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (isActive !== null && isActive !== undefined && isActive !== "all") {
      where.isActive = isActive === "true";
    }

    const [sliders, totalCount] = await Promise.all([
      prisma.heroSlider.findMany({
        where,
        orderBy: [{ order: "asc" }, { createdAt: "desc" }],
        skip,
        take: limit,
        include: {
          createdBy: {
            select: { id: true, name: true, email: true },
          },
          updatedBy: {
            select: { id: true, name: true, email: true },
          },
        },
      }),
      prisma.heroSlider.count({ where }),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: sliders,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit),
        },
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
        error: "Failed to fetch hero sliders",
        data: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 }
      },
      { status: 500 }
    );
  }
});

// POST - Yeni hero slider oluştur
export const POST = withPermission(
  "admin.hero-slider.create",
  async (request: NextRequest, user) => {
    try {
      const body = await request.json();
      
      // Validate request body
      const validationResult = CreateSliderSchema.safeParse(body);
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

      // Check if order is already taken
      if (validatedData.order && validatedData.order > 0) {
        const existingSlider = await prisma.heroSlider.findFirst({
          where: { order: validatedData.order },
        });
        if (existingSlider) {
          // Auto-increment order to avoid conflicts
          const maxOrder = await prisma.heroSlider.findFirst({
            orderBy: { order: "desc" },
            select: { order: true },
          });
          validatedData.order = (maxOrder?.order || 0) + 1;
        }
      }

      // Create new slider
      const slider = await prisma.heroSlider.create({
        data: {
          title: validatedData.title,
          subtitle: validatedData.subtitle || undefined,
          description: validatedData.description,
          badge: validatedData.badge || undefined,
          backgroundImage: validatedData.backgroundImage,
          primaryButton: validatedData.primaryButton,
          secondaryButton: validatedData.secondaryButton || undefined,
          statistics: validatedData.statistics || Prisma.JsonNull,
          isActive: validatedData.isActive,
          order: validatedData.order,
          createdById: user.id,
        },
        include: {
          createdBy: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      return NextResponse.json(
        {
          success: true,
          message: "Hero slider created successfully",
          data: slider,
        },
        {
          status: 201,
          headers: { "Content-Type": "application/json; charset=utf-8" },
        }
      );
    } catch (error) {
      console.error("Hero slider creation error:", error);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to create hero slider",
        },
        { status: 500 }
      );
    }
  }
);
