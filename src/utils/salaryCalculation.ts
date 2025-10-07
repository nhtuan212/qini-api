type CalculateTotalSalaryProps = {
    salary: number;
    paidLeave: number;
    workingMonth: number;
    workingDay: number;
    lunchAllowancePerDay: number;
    gasolineAllowancePerDay: number;
    bonus: number;
    workingHours: number;
};

const calculateTotalSalary = ({
    salary,
    paidLeave = 0,
    workingMonth,
    workingDay,
    lunchAllowancePerDay,
    gasolineAllowancePerDay,
    bonus,
    workingHours,
}: CalculateTotalSalaryProps) => {
    const hourlySalaryRate = salary / (workingMonth * 7.5);
    const calculatedTotal = Math.floor(hourlySalaryRate * workingHours);

    const totalLunch = lunchAllowancePerDay * (workingDay - paidLeave);
    const totalTransport = gasolineAllowancePerDay * (workingDay - paidLeave);
    const totalBonus = totalLunch + totalTransport + bonus;

    const calculatedSalary =
        calculatedTotal >= salary ? salary : calculatedTotal;
    const total = calculatedSalary + totalBonus;

    return total;
};

export { calculateTotalSalary };
