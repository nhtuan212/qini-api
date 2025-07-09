import { dataFetching } from "../utils/dataFetching";
import { KIOT_URL } from "../constants";

interface Payment {
    id: number;
    code: string;
    amount: number;
    accountId?: number;
    bankAccount?: string;
    description?: string;
    method: "Transfer" | "Cash" | "Point";
    status: number;
    statusValue: string;
    transDate: string;
}

interface InvoiceDetail {
    productId: number;
    productCode: string;
    productName: string;
    categoryId: number;
    categoryName: string;
    tradeMarkId?: number;
    tradeMarkName?: string;
    quantity: number;
    price: number;
    discount: number;
    usePoint?: boolean;
    subTotal: number;
    note?: string;
    serialNumbers: string;
    returnQuantity: number;
}

interface Invoice {
    id: number;
    uuid: string;
    code: string;
    purchaseDate: string;
    branchId: number;
    branchName: string;
    soldById: number;
    soldByName: string;
    customerId?: number;
    customerCode?: string;
    customerName?: string;
    orderCode: string;
    total: number;
    totalPayment: number;
    discount?: number;
    status: number;
    statusValue: string;
    description?: string;
    usingCod: boolean;
    modifiedDate?: string;
    createdDate: string;
    invoiceDetails: InvoiceDetail[];
    payments: Payment[];
}

interface PaymentResult {
    invoiceCode: string;
    soldById: number;
    soldByName: string;
    totalPayment: number;
    transfer: number;
    cash: number;
    point: number;
}

const processPayments = (
    data: Invoice[],
    soldById?: number,
): PaymentResult[] => {
    const results: PaymentResult[] = [];

    // Filter by soldById if provided
    const filteredInvoices: Invoice[] = soldById
        ? data.filter(invoice => invoice.soldById === soldById) || []
        : data;

    filteredInvoices.map(invoice => {
        const payments = invoice.payments || [];
        const totalPayment = invoice.totalPayment;
        let transfer = 0;
        let cash = 0;
        let point = 0;

        payments.map(payment => {
            if (payment.method === "Transfer") {
                transfer += payment.amount;
            } else if (payment.method === "Cash") {
                cash += payment.amount;
            } else if (payment.method === "Point") {
                point += payment.amount;
            }
        });

        results.push({
            invoiceCode: invoice.code,
            soldById: invoice.soldById,
            soldByName: invoice.soldByName,
            totalPayment: totalPayment,
            transfer: transfer,
            cash: cash,
            point: point,
        });
    });

    return results;
};

export const getInvoice = async (req: { [key: string]: any }) => {
    const { targetAt, soldById } = req.query;

    return await dataFetching(
        `${KIOT_URL}/invoices?createdDate=${targetAt}&includePayment=true&pageSize=100`,
    ).then(res => {
        const processedData = processPayments(res.data, Number(soldById));

        const data = {
            revenue: 0,
            transfer: 0,
            cash: 0,
            point: 0,
        };

        processedData.map((result: PaymentResult) => {
            data.revenue += result.totalPayment;
            data.transfer += result.transfer;
            data.cash += result.cash;
            data.point += result.point;
        });

        return {
            data,
        };
    });
};
