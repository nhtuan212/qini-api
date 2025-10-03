type CalculateTotalSalaryProps = {
    salary: number;
    paidLeave: number;
    workingDays: number;
    lunchAllowancePerDay: number;
    gasolineAllowancePerDay: number;
    bonus: number;
    workingHours: number;
};

const calculateTotalSalary = ({
    salary,
    paidLeave = 0,
    workingDays,
    lunchAllowancePerDay,
    gasolineAllowancePerDay,
    bonus,
    workingHours,
}: CalculateTotalSalaryProps) => {
    const hourlySalaryRate = salary / (workingDays * 7.5);
    const calculatedTotal = Math.floor(hourlySalaryRate * workingHours);

    const totalLunch = lunchAllowancePerDay * (workingDays - paidLeave);
    const totalTransport = gasolineAllowancePerDay * (workingDays - paidLeave);
    const totalBonus = totalLunch + totalTransport + bonus;

    const calculatedSalary =
        calculatedTotal >= salary ? salary : calculatedTotal;
    const total = calculatedSalary + totalBonus;

    return total;
};

export { calculateTotalSalary };
