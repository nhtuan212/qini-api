import { client } from ".";
import { Staff, TargetShift, TimeSheet } from "../../dist/generated/client";

const targetShiftSelect = {
    id: true,
    revenue: true,
    cash: true,
    transfer: true,
    point: true,
    deduction: true,
    description: true,

    time_sheet: {
        select: {
            id: true,
            check_in: true,
            check_out: true,
            staff: {
                select: {
                    name: true,
                },
            },
        },
    },
};

const formatTargetShiftResponse = (res: any) => {
    let data;

    const format_time_sheet_data = (item: TimeSheet & { staff: Staff }[]) => {
        return item.map((item: any) => {
            const { staff, ...rest } = item;
            return {
                ...rest,
                staff_name: staff.name,
            };
        });
    };

    if (Array.isArray(res)) {
        data = res.map(item => {
            return {
                ...item,
                time_sheet: format_time_sheet_data(item.time_sheet),
            };
        });
    } else {
        data = {
            ...res,
            time_sheet: format_time_sheet_data(res.time_sheet),
        };
    }

    return {
        code: 200,
        message: "Get target shift successfully!",
        data,
    };
};

//** Get target shift */
export const getTargetShift = async (req: { [key: string]: any }) => {
    const { id } = req.params;

    if (id) {
        return await client.targetShift
            .findUnique({
                select: targetShiftSelect,
                where: { id },
            })
            .then(res => {
                return formatTargetShiftResponse(res);
            });
    }

    return await client.targetShift
        .findMany({
            select: targetShiftSelect,
        })
        .then(res => {
            return formatTargetShiftResponse(res);
        });
};

//** Create target shift */
export const createTargetShift = async ({ body }: { body: TargetShift }) => {
    return await client.targetShift
        .create({
            data: {
                ...body,
            },
        })
        .then(res => {
            return {
                code: 200,
                message: "Create target shift successfully!",
                data: res,
            };
        })
        .catch(err => {
            if (err.code === "P2002") {
                return {
                    code: 400,
                    message: `Create failed because "${err?.meta?.target}" already exists!`,
                    data: [],
                };
            }

            return {
                code: 404,
                message: err.message,
                data: [],
            };
        });
};

//** Update target shift */
export const updateTargetShift = async ({
    id,
    body,
}: {
    id: string;
    body: TargetShift;
}) => {
    const { revenue, cash, transfer, deduction } = body;

    const data = {
        ...body,
        revenue: revenue ? Number(body.revenue) : 0,
        cash: cash ? Number(body.cash) : 0,
        transfer: transfer ? Number(body.transfer) : 0,
        deduction: deduction ? Number(body.deduction) : 0,
    };

    const updateTargetShift = await client.targetShift.update({
        where: { id },
        data,
    });

    return Promise.all([updateTargetShift]).then(
        async ([updateTargetShift]) => {
            return {
                code: 200,
                message: "Update target shift successfully!",
                data: updateTargetShift,
            };
        },
    );
};
