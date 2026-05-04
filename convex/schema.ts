import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  authStats: defineTable({
    date: v.string(),
    provider: v.string(),
    signups: v.number(),
    lastUpdated: v.number(),
  })
    .index("date_provider", ["date", "provider"])
    .index("date", ["date"]),

  shops: defineTable({
    ownerId: v.string(),
    name: v.string(),
    nameAr: v.string(),
    specialty: v.string(),
    area: v.string(),
    description: v.string(),
    phone: v.string(),
    openingHours: v.string(),
    startingPrice: v.number(),
    homeVisit: v.boolean(),
    delivery: v.boolean(),
    acceptingOrders: v.boolean(),
    businessType: v.optional(v.string()),
    onlineOnly: v.optional(v.boolean()),
    coverImage: v.string(),
    services: v.array(v.object({
      id: v.string(),
      name: v.string(),
      price: v.number(),
      duration: v.string(),
    })),
    gallery: v.array(v.string()),
    tags: v.array(v.string()),
    rating: v.number(),
    reviewCount: v.number(),
    yearsExperience: v.number(),
    verified: v.boolean(),
    isFeatured: v.boolean(),
    featuredUntil: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_owner", ["ownerId"])
    .index("by_featured", ["isFeatured"])
    .index("by_area", ["area"]),

  bookings: defineTable({
    userId: v.string(),
    tailorId: v.string(),
    tailorName: v.string(),
    tailorArea: v.string(),
    serviceId: v.string(),
    serviceName: v.string(),
    servicePrice: v.number(),
    visitType: v.string(),
    date: v.string(),
    time: v.string(),
    notes: v.optional(v.string()),
    status: v.string(),
    total: v.number(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_tailorId", ["tailorId"]),

  conversations: defineTable({
    userId: v.string(),
    tailorId: v.string(),
    tailorName: v.string(),
    tailorImage: v.optional(v.string()),
    lastMessage: v.string(),
    lastMessageAt: v.number(),
    unreadByUser: v.number(),
    unreadByTailor: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_tailor", ["userId", "tailorId"])
    .index("by_tailor", ["tailorId"]),

  messages: defineTable({
    conversationId: v.id("conversations"),
    senderId: v.string(),
    senderRole: v.string(),
    text: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_conversation", ["conversationId"]),
});
