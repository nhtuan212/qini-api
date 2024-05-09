import { client } from ".";
import { Reports } from "../../dist/generated/client";

// Get method
export const getReport = async ({ params }: { params: any }) => {
    const { id } = params;

    const reportWhereClause = {
        ...(Object.keys(params).length > 0 && {
            ...(id && { id }),
        }),
    };

    return await client.reports
        .findMany({
            where: {
                ...reportWhereClause,
            },
            include: {
                shift: {
                    select: {
                        name: true,
                    },
                },
                reportsOnStaffs: {
                    select: {
                        checkIn: true,
                        checkOut: true,
                        target: true,
                        timeWorked: true,
                        staff: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createAt: "desc",
            },
        })
        .then(res => {
            return {
                code: 200,
                message: "Get report successfully!",
                data: res,
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

//** Post method */
// Create
export const createReport = async ({ body }: { body: Reports }) => {
    return await client.reports
        .create({
            data: {
                revenue: Number(body.revenue),
                shiftId: body.shiftId,
                createAt: body.createAt,
            },
        })
        .then(res => {
            return {
                code: 200,
                message: "Add report successfully!",
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

// Delete method
export const deleteReport = async ({ body }: { body: Reports }) => {
    const { id } = body;

    return await client.reports
        .delete({
            where: {
                id,
            },
        })
        .then(res => {
            return {
                code: 200,
                message: "Delete report successfully!",
                data: res,
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
