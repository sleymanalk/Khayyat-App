import { mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { authComponent } from "./auth";

interface BetterAuthUser {
  _id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  emailVerified?: boolean;
  createdAt: number;
  updatedAt: number;
}

const shopFields = {
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
};

export const upsertShop = mutation({
  args: shopFields,
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx) as BetterAuthUser | null;
    if (!user) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("shops")
      .withIndex("by_owner", (q: any) => q.eq("ownerId", user._id))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, args);
      return existing._id;
    }

    return await ctx.db.insert("shops", {
      ownerId: user._id,
      ...args,
      rating: 5.0,
      reviewCount: 0,
      yearsExperience: 1,
      verified: false,
      isFeatured: false,
      featuredUntil: undefined,
      createdAt: Date.now(),
    });
  },
});

export const upgradeShopToFeatured = mutation({
  args: { days: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx) as BetterAuthUser | null;
    if (!user) throw new Error("Not authenticated");
    const shop = await ctx.db
      .query("shops")
      .withIndex("by_owner", (q: any) => q.eq("ownerId", user._id))
      .first();
    if (!shop) throw new Error("Register your shop first");
    const days = args.days ?? 30;
    const until = Date.now() + days * 24 * 60 * 60 * 1000;
    await ctx.db.patch(shop._id, { isFeatured: true, featuredUntil: until });
    return shop._id;
  },
});

export const cancelFeatured = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx) as BetterAuthUser | null;
    if (!user) throw new Error("Not authenticated");
    const shop = await ctx.db
      .query("shops")
      .withIndex("by_owner", (q: any) => q.eq("ownerId", user._id))
      .first();
    if (!shop) return null;
    await ctx.db.patch(shop._id, { isFeatured: false, featuredUntil: undefined });
    return shop._id;
  },
});

// BOOKINGS

export const createBooking = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx) as BetterAuthUser | null;
    if (!user) throw new Error("Not authenticated");
    return await ctx.db.insert("bookings", {
      userId: user._id,
      ...args,
    });
  },
});

export const updateBooking = mutation({
  args: {
    id: v.id("bookings"),
    status: v.optional(v.string()),
    notes: v.optional(v.string()),
    date: v.optional(v.string()),
    time: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx) as BetterAuthUser | null;
    if (!user) throw new Error("Not authenticated");
    const existing = await ctx.db.get(args.id);
    if (!existing || existing.userId !== user._id) {
      throw new Error("Not found or not authorized");
    }
    const { id, ...updates } = args;
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );
    await ctx.db.patch(args.id, cleanUpdates);
    return args.id;
  },
});

export const deleteBooking = mutation({
  args: { id: v.id("bookings") },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx) as BetterAuthUser | null;
    if (!user) throw new Error("Not authenticated");
    const existing = await ctx.db.get(args.id);
    if (!existing || existing.userId !== user._id) {
      throw new Error("Not found or not authorized");
    }
    await ctx.db.delete(args.id);
    return args.id;
  },
});

// CHAT

export const sendMessage = mutation({
  args: {
    tailorId: v.string(),
    tailorName: v.string(),
    tailorImage: v.optional(v.string()),
    text: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx) as BetterAuthUser | null;
    if (!user) throw new Error("Not authenticated");

    if (!args.text && !args.imageUrl) {
      throw new Error("Message must have text or image");
    }

    const now = Date.now();
    const preview = args.text ?? "📷 Photo";

    let convo = await ctx.db
      .query("conversations")
      .withIndex("by_user_tailor", (q: any) =>
        q.eq("userId", user._id).eq("tailorId", args.tailorId)
      )
      .first();

    let conversationId;
    if (!convo) {
      conversationId = await ctx.db.insert("conversations", {
        userId: user._id,
        tailorId: args.tailorId,
        tailorName: args.tailorName,
        tailorImage: args.tailorImage,
        lastMessage: preview,
        lastMessageAt: now,
        unreadByUser: 0,
        unreadByTailor: 1,
      });
    } else {
      conversationId = convo._id;
      await ctx.db.patch(conversationId, {
        lastMessage: preview,
        lastMessageAt: now,
        unreadByTailor: convo.unreadByTailor + 1,
      });
    }

    await ctx.db.insert("messages", {
      conversationId,
      senderId: user._id,
      senderRole: "user",
      text: args.text,
      imageUrl: args.imageUrl,
      createdAt: now,
    });

    await ctx.scheduler.runAfter(1500, (await import("./_generated/api")).internal.mutations.tailorAutoReply, {
      conversationId,
    });

    return conversationId;
  },
});

const REPLIES = [
  "Thanks for reaching out! I'd love to help with your design ✨",
  "Sure, I can do that. When would you like to come in for measurements?",
  "Beautiful inspiration! I'll prepare a quote for you shortly.",
  "Yes, that's available. Would you prefer in-store or a home visit?",
  "I'll send you fabric options today. What's your budget range?",
];

export const tailorAutoReply = internalMutation({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const convo = await ctx.db.get(args.conversationId);
    if (!convo) return;
    const reply = REPLIES[Math.floor(Math.random() * REPLIES.length)];
    const now = Date.now();
    await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      senderId: convo.tailorId,
      senderRole: "tailor",
      text: reply,
      createdAt: now,
    });
    await ctx.db.patch(args.conversationId, {
      lastMessage: reply,
      lastMessageAt: now,
      unreadByUser: convo.unreadByUser + 1,
    });
  },
});

export const markConversationRead = mutation({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx) as BetterAuthUser | null;
    if (!user) throw new Error("Not authenticated");
    const convo = await ctx.db.get(args.conversationId);
    if (!convo || convo.userId !== user._id) return;
    await ctx.db.patch(args.conversationId, { unreadByUser: 0 });
  },
});
