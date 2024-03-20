import { client } from ".";
import { Reports } from "@prisma/client";
import { isDateValid } from "../utils";

// Get method
export const getReport = async ({
    path,
    id,
    query,
}: {
    path: string;
    id: string;
    query: any;
}) => {
    const whereByDate = {
        ...(Object.keys(query).length > 0 && {
            ...(isDateValid(query.startDate) &&
                isDateValid(query.endDate) && {
                    createAt: {
                        gte: new Date(query.startDate),
                        lte: new Date(`${query.endDate}T23:59:59.999Z`), // End of day
                    },
                }),
        }),
    };

    if (path.includes("salary")) {
        const staff = await client.staffs.findMany();

        return await client.reports
            .groupBy({
                by: ["staffId"],
                _sum: {
                    target: true,
                    timeWorked: true,
                },
                where: {
                    ...whereByDate,
                },
            })
            .then(res => {
                const maxTarget = Math.max(
                    ...res.map(
                        item =>
                            (item._sum.target as number) /
                            (item._sum.timeWorked as number),
                    ),
                );

                const secondMaxTarget = Math.max(
                    ...res
                        .map(
                            item =>
                                (item._sum.target as number) /
                                (item._sum.timeWorked as number),
                        )
                        .filter(item => item !== maxTarget),
                );

                return {
                    code: 200,
                    message: "Get report by staff successfully!",
                    data: res.map(item => {
                        const staffName = staff.find(
                            staffItem => staffItem.id === item.staffId,
                        )?.name;
                        const salary =
                            staff.find(
                                staffItem => staffItem.id === item.staffId,
                            )?.salary || 0;

                        const totalTarget = item._sum.target as number;
                        const totalTime = item._sum.timeWorked as number;
                        const salaryByTime = totalTime * salary;
                        const performance = totalTarget / totalTime;

                        let rank = "";
                        let rate = 0;
                        let total = 0;

                        switch (performance) {
                            case maxTarget:
                                rank = "A";
                                rate = 0.012;
                                total = salaryByTime + totalTarget * rate;
                                break;
                            case secondMaxTarget:
                                rank = "B";
                                rate = 0.011;
                                total = salaryByTime + totalTarget * rate;
                                break;
                            default:
                                rank = "normal";
                                rate = 0.01;
                                total = salaryByTime + totalTarget * rate;
                                break;
                        }

                        return {
                            staffName,
                            salary,
                            rank,
                            rate,
                            totalTarget,
                            totalTime,
                            total,
                            performance,
                            ...item,
                        };
                    }),
                };
            });
    }

    return await client.reports
        .findMany({
            orderBy: {
                createAt: "desc",
            },
            where: {
                ...(path.includes("revenue") && { revenueId: id }),
                ...(path.includes("staff") && { staffId: id }),
                ...whereByDate,
            },
            include: {
                staff: {
                    select: {
                        // id: true,
                        name: true,
                    },
                },
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

// Post method
export const createReport = async ({ body }: { body: Reports }) => {
    return await client.reports
        .createMany({
            data: body,
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
