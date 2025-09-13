import { relations } from "drizzle-orm/relations";
import { target, targetShift, shift, timeSheet, staff } from "./schema";

export const targetShiftRelations = relations(targetShift, ({ one, many }) => ({
    target: one(target, {
        fields: [targetShift.targetId],
        references: [target.id],
    }),
    shift: one(shift, {
        fields: [targetShift.shiftId],
        references: [shift.id],
    }),
    timeSheets: many(timeSheet),
}));

export const targetRelations = relations(target, ({ many }) => ({
    targetShifts: many(targetShift),
}));

export const shiftRelations = relations(shift, ({ many }) => ({
    targetShifts: many(targetShift),
}));

export const timeSheetRelations = relations(timeSheet, ({ one }) => ({
    targetShift: one(targetShift, {
        fields: [timeSheet.targetShiftId],
        references: [targetShift.id],
    }),
    staff: one(staff, {
        fields: [timeSheet.staffId],
        references: [staff.id],
    }),
}));

export const staffRelations = relations(staff, ({ many }) => ({
    timeSheets: many(timeSheet),
}));
