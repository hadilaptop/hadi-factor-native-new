import AsyncStorage from "@react-native-async-storage/async-storage";

export interface InvoiceItem {
  id: string | number;
  desc: string;
  quantity: string | number;
  unitPrice: string | number;
}

export interface StoredInvoice {
  id: string | number;
  customerId: string | number;
  type: string;
  number: string | number;
  date: string;
  amount: number;
  note?: string;
  items?: InvoiceItem[];
  createdAt?: string;
  buyerName?: string;
  buyerPhone?: string;
  buyerEconomicCode?: string;
  buyerAddress?: string;
  sellerName?: string;
  sellerPhone?: string;
  sellerAddress?: string;
  sellerEconomicCode?: string;
  sellerLogo?: string | null;
}

const STORAGE_KEY = "@hadi_factor_invoices";

export async function getInvoices(): Promise<StoredInvoice[]> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("خطا در دریافت فاکتورها:", error);
    return [];
  }
}

export async function saveInvoice(invoice: StoredInvoice): Promise<boolean> {
  try {
    const invoices = await getInvoices();
    const index = invoices.findIndex((item) => String(item.id) === String(invoice.id));

    if (index === -1) invoices.push(invoice);
    else invoices[index] = invoice;

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
    return true;
  } catch (error) {
    console.error("خطا در ذخیره فاکتور:", error);
    return false;
  }
}

export async function deleteInvoice(invoiceId: string | number): Promise<boolean> {
  try {
    const invoices = await getInvoices();
    const filtered = invoices.filter((item) => String(item.id) !== String(invoiceId));
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error("خطا در حذف فاکتور:", error);
    return false;
  }
}
