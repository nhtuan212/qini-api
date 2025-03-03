import { client } from ".";
import { Reports } from "../../dist/generated/client";
import { Pagination } from "../constants";
import { paginationQuery } from "../utils";

// Get method
export const getReport = async (req: { [key: string]: any }) => {
    const { query, params } = req;
    const { id } = params;

    const reportWhereClause = {
        ...(Object.keys(params).length > 0 && {
            ...(id && { id }),
        }),
    };

    return await client.reports
        .findMany({
            ...paginationQuery(query),
            where: {
                ...reportWhereClause,
            },
            include: {
                _count: {
                    select: {
                        reportsOnStaffs: true,
                    },
                },
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
        .then(async res => {
            return {
                code: 200,
                message: "Get report successfully!",
                data: res,
                pagination: {
                    page: Number(query.page || 1),
                    rowsPerPage: Number(query.limit || Pagination.limit),
                    total: await client.reports.count({
                        where: {
                            ...reportWhereClause,
                        },
                    }),
                },
            };
        })
        .catch(err => {
            return {
                code: 404,
                message: err.message,
                data: [],
                pagination: {},
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
                // revenue: body.revenue && Number(body.revenue),
                // transfer: body.transfer && Number(body.transfer),
                // cash: body.cash && Number(body.cash),

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
    const { reportsOnStaffs, ...reportData } = body;
    const updateReportData = {
        ...reportData,
        revenue: body.revenue && Number(body.revenue),
    };

    const updateReport = client.reports.update({
        where: {
            id,
        },
        data: updateReportData,
    });

    const updateReportsOnStaffs = reportsOnStaffs.map(staff =>
        client.reportsOnStaffs.updateMany({
            where: {
                reportId: id,
                staffId: staff.staffId,
            },
            data: staff,
        }),
    );

    return await client
        .$transaction([updateReport, ...updateReportsOnStaffs])
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
