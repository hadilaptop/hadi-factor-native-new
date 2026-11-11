import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Customer {
  id: string | number;
  customerCode?: number;
  name: string;
  address?: string;
  phone?: string;
  economicCode?: string;
  avatar?: string;
}

const CUSTOMERS_STORAGE_KEY = "@hadi_factor_customers";
const NEXT_CUSTOMER_CODE_KEY = "@hadi_factor_next_customer_code";
const CUSTOMER_CODE_START = 1001;

function isValidCustomerCode(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= CUSTOMER_CODE_START
  );
}

async function getStoredNextCustomerCode(): Promise<number> {
  const stored = await AsyncStorage.getItem(NEXT_CUSTOMER_CODE_KEY);
  const parsed = stored ? Number(stored) : NaN;

  return Number.isInteger(parsed) && parsed >= CUSTOMER_CODE_START
    ? parsed
    : CUSTOMER_CODE_START;
}

/**
 * دریافت تمام مشتری‌های ذخیره‌شده
 */
export async function getCustomers(): Promise<Customer[]> {
  try {
    const storedData = await AsyncStorage.getItem(CUSTOMERS_STORAGE_KEY);

    if (!storedData) {
      return [];
    }

    const parsedCustomers = JSON.parse(storedData);

    if (!Array.isArray(parsedCustomers)) {
      return [];
    }

    const customers = parsedCustomers as Customer[];
    const usedCodes = new Set<number>();
    let highestCode = CUSTOMER_CODE_START - 1;

    for (const customer of customers) {
      if (isValidCustomerCode(customer.customerCode)) {
        usedCodes.add(customer.customerCode);
        highestCode = Math.max(highestCode, customer.customerCode);
      }
    }

    let nextCode = Math.max(
      CUSTOMER_CODE_START,
      await getStoredNextCustomerCode(),
      highestCode + 1
    );

    let migrated = false;

    const normalizedCustomers = customers.map((customer) => {
      if (isValidCustomerCode(customer.customerCode)) {
        return customer;
      }

      while (usedCodes.has(nextCode)) {
        nextCode += 1;
      }

      const customerWithCode = {
        ...customer,
        customerCode: nextCode,
      };

      usedCodes.add(nextCode);
      nextCode += 1;
      migrated = true;

      return customerWithCode;
    });

    if (migrated) {
      await AsyncStorage.setItem(
        CUSTOMERS_STORAGE_KEY,
        JSON.stringify(normalizedCustomers)
      );
    }

    const requiredNextCode = Math.max(nextCode, highestCode + 1);
    const storedNextCode = await getStoredNextCustomerCode();

    if (migrated || storedNextCode !== requiredNextCode) {
      await AsyncStorage.setItem(
        NEXT_CUSTOMER_CODE_KEY,
        String(requiredNextCode)
      );
    }

    return normalizedCustomers;
  } catch (error) {
    console.error("خطا در دریافت مشتری‌ها:", error);
    return [];
  }
}

/**
 * دریافت کد بعدی مشتری
 */
export async function getNextCustomerCode(): Promise<number> {
  try {
    await getCustomers();

    const nextCode = await getStoredNextCustomerCode();

    await AsyncStorage.setItem(
      NEXT_CUSTOMER_CODE_KEY,
      String(nextCode + 1)
    );

    return nextCode;
  } catch (error) {
    console.error("خطا در دریافت کد مشتری:", error);
    return CUSTOMER_CODE_START;
  }
}

/**
 * ذخیره کامل لیست مشتری‌ها
 */
export async function saveCustomers(
  customers: Customer[]
): Promise<boolean> {
  try {
    await AsyncStorage.setItem(
      CUSTOMERS_STORAGE_KEY,
      JSON.stringify(customers)
    );

    return true;
  } catch (error) {
    console.error("خطا در ذخیره مشتری‌ها:", error);
    return false;
  }
}

/**
 * افزودن مشتری جدید
 */
export async function addCustomer(
  customer: Customer
): Promise<boolean> {
  try {
    const customers = await getCustomers();

    customers.push(customer);

    return await saveCustomers(customers);
  } catch (error) {
    console.error("خطا در افزودن مشتری:", error);
    return false;
  }
}

/**
 * ویرایش مشتری موجود
 */
export async function updateCustomer(
  customer: Customer
): Promise<boolean> {
  try {
    const customers = await getCustomers();

    const index = customers.findIndex(
      (item) => String(item.id) === String(customer.id)
    );

    if (index === -1) {
      return false;
    }

    customers[index] = customer;

    return await saveCustomers(customers);
  } catch (error) {
    console.error("خطا در ویرایش مشتری:", error);
    return false;
  }
}

/**
 * حذف مشتری
 */
export async function deleteCustomer(
  customerId: string | number
): Promise<boolean> {
  try {
    const customers = await getCustomers();

    const filteredCustomers = customers.filter(
      (item) => String(item.id) !== String(customerId)
    );

    return await saveCustomers(filteredCustomers);
  } catch (error) {
    console.error("خطا در حذف مشتری:", error);
    return false;
  }
}

/**
 * افزودن یا ویرایش مشتری
 */
export async function saveCustomer(
  customer: Customer
): Promise<boolean> {
  try {
    const customers = await getCustomers();

    const index = customers.findIndex(
      (item) => String(item.id) === String(customer.id)
    );

    if (index === -1) {
      customers.push(customer);
    } else {
      customers[index] = customer;
    }

    return await saveCustomers(customers);
  } catch (error) {
    console.error("خطا در ذخیره مشتری:", error);
    return false;
  }
}

/**
 * حذف تمام مشتری‌ها
 * فعلاً برای استفاده داخلی/تست
 */
export async function clearCustomers(): Promise<boolean> {
  try {
    await AsyncStorage.multiRemove([
      CUSTOMERS_STORAGE_KEY,
      NEXT_CUSTOMER_CODE_KEY,
    ]);
    return true;
  } catch (error) {
    console.error("خطا در پاک کردن مشتری‌ها:", error);
    return false;
  }
}
