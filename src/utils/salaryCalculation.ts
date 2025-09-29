type CalculateTotalSalaryProps = {
    salary: number;
    workingDays: number;
    lunchAllowancePerDay: number;
    gasolineAllowancePerDay: number;
    bonus: number;
    workingHours: number;
};

const calculateTotalSalary = ({
    salary,
    workingDays,
    lunchAllowancePerDay,
    gasolineAllowancePerDay,
    bonus,
    workingHours,
}: CalculateTotalSalaryProps) => {
    const hourlySalaryRate = salary / (workingDays * 7.5);
    const calculatedTotal = Math.floor(hourlySalaryRate * workingHours);

    const totalLunch = lunchAllowancePerDay * workingDays;
    const totalTransport = gasolineAllowancePerDay * workingDays;
    const totalBonus = totalLunch + totalTransport + bonus;

    const calculatedSalary =
        calculatedTotal >= salary ? salary : calculatedTotal;
    const total = calculatedSalary + totalBonus;

    return total;
};

export { calculateTotalSalary };
