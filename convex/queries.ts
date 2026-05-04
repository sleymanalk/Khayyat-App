import { query } from "./_generated/server";
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

// SHOPS — public

export const listShops = query({
  args: {},
  handler: async (ctx) => {
    const shops = await ctx.db.query("shops").collect();
    return shops.sort((a, b) => {
      if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
      return b.createdAt - a.createdAt;
    });
  },
});

export const listFeaturedShops = query({
  args: {},
  handler: async (ctx) => {
    const shops = await ctx.db
      .query("shops")
      .withIndex("by_featured", (q: any) => q.eq("isFeatured", true))
      .collect();
    return shops.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const getShop = query({
  args: { id: v.id("shops") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getMyShop = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx) as BetterAuthUser | null;
    if (!user) return null;
    return await ctx.db
      .query("shops")
      .withIndex("by_owner", (q: any) => q.eq("ownerId", user._id))
      .first();
  },
});

// BOOKINGS

export const listBookings = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx) as BetterAuthUser | null;
    if (!user) return [];
    return await ctx.db
      .query("bookings")
      .withIndex("by_user", (q: any) => q.eq("userId", user._id))
      .collect();
  },
});

export const getMyBookings = listBookings;
export const listMyBookings = listBookings;

export const getBooking = query({
  args: { id: v.id("bookings") },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx) as BetterAuthUser | null;
    if (!user) return null;
    const item = await ctx.db.get(args.id);
    if (!item || item.userId !== user._id) return null;
    return item;
  },
});

export const listConversations = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx) as BetterAuthUser | null;
    if (!user) return [];
    const convos = await ctx.db
      .query("conversations")
      .withIndex("by_user", (q: any) => q.eq("userId", user._id))
      .collect();
    return convos.sort((a, b) => b.lastMessageAt - a.lastMessageAt);
  },
});

export const getConversation = query({
  args: { tailorId: v.string() },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx) as BetterAuthUser | null;
    if (!user) return null;
    return await ctx.db
      .query("conversations")
      .withIndex("by_user_tailor", (q: any) =>
        q.eq("userId", user._id).eq("tailorId", args.tailorId)
      )
      .first();
  },
});

export const listMessages = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx) as BetterAuthUser | null;
    if (!user) return [];
    const convo = await ctx.db.get(args.conversationId);
    if (!convo || convo.userId !== user._id) return [];
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q: any) => q.eq("conversationId", args.conversationId))
      .collect();
    return messages.sort((a, b) => a.createdAt - b.createdAt);
  },
});
