import { client } from ".";
import { getStaff } from "./staffService";

type StaffTargetResult = {
    staff_id: string;
    staff_name: string;
    target_staff_id: string | null;
    check_in: string | null;
    check_out: string | null;
    working_hours: number | null;
    target: number | null;
    target_shift_id: string | null;
    shift_id: string | null;
    shift_name: string | null;
    target_at: Date | null;
    target_id: string | null;
};

export const getTargetStaff = async (req: { [key: string]: any }) => {
    const { query } = req;
    const { staff_id, start_date, end_date } = query;

    return await client
        .$transaction(async prisma => {
            const staff = await getStaff({ id: staff_id });
            const targetStaff = await prisma.targetStaff.findMany({
                orderBy: {
                    created_at: "desc",
                },
                where: {
                    staff_id: staff_id,

                    target_shift: {
                        target:
                            start_date && end_date
                                ? {
                                      target_at: {
                                          gte: new Date(start_date),
                                          lte: new Date(
                                              new Date(query.end_date).setDate(
                                                  new Date(
                                                      query.end_date,
                                                  ).getDate() + 1,
                                              ),
                                          ),
                                      },
                                  }
                                : undefined,
                    },
                },
                select: {
                    id: true,
                    check_in: true,
                    check_out: true,
                    target: true,
                    working_hours: true,

                    target_shift: {
                        select: {
                            target: {
                                select: {
                                    id: true,
                                    target_at: true,
                                },
                            },

                            shift: {
                                select: {
                                    name: true,
                                },
                            },
                        },
                    },

                    staff: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            });

            const totalWorkingHours = targetStaff.reduce(
                (sum, item) => sum + (item.working_hours || 0),
                0,
            );
            const totalTarget = targetStaff.reduce(
                (sum, item) => sum + (item.target || 0),
                0,
            );

            return {
                code: 200,
                message: "Get target staff successfully!",
                data: {
                    id: staff?.data?.id || query.staff_id,
                    name: staff?.data?.name || "",
                    totalWorkingHours,
                    totalTarget,
                    shifts: targetStaff.map((item: any) => {
                        return {
                            ...item,
                            shift_name: item.target_shift.shift.name,
                            target_at: item.target_shift.target.target_at,
                            target_shift: undefined,
                            staff: undefined,
                        };
                    }),
                },
            };
        })
        .catch(err => {
            return {
                code: 404,
                message: err.message,
                data: [],
            };
        });
};

export const getTargetStaffByQueryRaw = async (req: { [key: string]: any }) => {
    const { query } = req;
    const { staff_id, start_date, end_date } = query;

    const staff = await getStaff({ id: staff_id });
    const result = await client.$queryRawUnsafe<StaffTargetResult[]>(
        `
              SELECT
                  ts.id AS target_staff_id,
                  ts.check_in,
                  ts.check_out,
                  ts.working_hours,
                  ts.target,
                  t_shift.id AS target_shift_id,
                  s.id AS shift_id,
                  s.name AS shift_name,
                  t.target_at,
                  t.id AS target_id
              FROM target_staff ts
              INNER JOIN target_shift t_shift ON ts.target_shift_id = t_shift.id
              INNER JOIN shift s ON t_shift.shift_id = s.id
              INNER JOIN target t ON t.id = t_shift.target_id
              WHERE ts.staff_id = $1
              ${
                  start_date && end_date
                      ? "AND t.target_at BETWEEN $2 AND $3"
                      : ""
              }
            `,
        ...(start_date && end_date
            ? [
                  staff_id,
                  new Date(start_date),
                  new Date(
                      new Date(query.end_date).setDate(
                          new Date(query.end_date).getDate() + 1,
                      ),
                  ),
              ]
            : [staff_id]),
    );

    const totalWorkingHours = result.reduce(
        (sum, item) => sum + (item.working_hours || 0),
        0,
    );
    const totalTarget = result.reduce(
        (sum, item) => sum + (item.target || 0),
        0,
    );

    return {
        code: 200,
        message: "Get staff id successfully!",
        data: {
            staff_id: staff?.data?.id || staff_id,
            staff_name: staff?.data?.name || "",
            totalWorkingHours,
            totalTarget,
            shifts: result.map(r => ({
                target_shift_id: r.target_shift_id,
                check_in: r.check_in,
                check_out: r.check_out,
                working_hours: r.working_hours,
                target: r.target,
                shift_name: r.shift_name,
                target_at: r.target_at,
            })),
        },
    };
};
