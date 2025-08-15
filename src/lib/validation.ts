// lib/validation.ts
import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  // daily task: no date required; scheduled task: date required (yyyy-mm-dd)
  // We'll keep shared shape and split endpoints handle semantics
});67

export const createScheduledSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // ISO date (no time)
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(["pending", "in_progress", "done"]).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(), // for scheduled updates
});
