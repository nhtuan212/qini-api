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
                                id: true,
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
export const createReport = async ({
    body,
}: {
    body: Reports & {
        reportsOnStaffs: [
            {
                checkIn: string;
                checkOut: string;
                target: number;
                timeWorked: number;
                staffId: string;
            },
        ];
    };
}) => {
    return await client.reports
        .create({
            data: {
                ...body,
                revenue: body.revenue && Number(body.revenue),
                transfer: body.transfer && Number(body.transfer),
                cash: body.cash && Number(body.cash),

                reportsOnStaffs: {
                    createMany: {
                        data: body.reportsOnStaffs,
                    },
                },
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

// Put method
export const updateReport = async ({
    id,
    body,
}: {
    id: string;
    body: Reports;
}) => {
    return await client.reports
        .update({
            where: {
                id,
            },
            data: {
                ...body,
                revenue: body.revenue && Number(body.revenue),
            },
        })
        .then(res => {
            return {
                code: 200,
                message: "Update report successfully!",
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
