/**
 * @file database.js
 * @description Safe in-memory database service for web preview and migration
 * Replaced @capacitor-community/sqlite with safe persistent/in-memory storage
 * Full native implementation for mobile is in database.ts (expo-sqlite).
 */

class MockDatabaseService {
  constructor() {
    this.customers = [];
    this.payments = [];
    this.invoices = [];
  }

  async initialize() {
    return true;
  }

  async getCustomerById(id) {
    return this.customers.find((c) => String(c.id) === String(id)) || null;
  }

  async getCustomers() {
    return this.customers;
  }

  async addCustomer(customer) {
    const id = Date.now();
    this.customers.push({ ...customer, id });
    return id;
  }

  async updateCustomer(customer) {
    this.customers = this.customers.map((c) =>
      String(c.id) === String(customer.id) ? { ...c, ...customer } : c
    );
    return true;
  }

  async deleteCustomer(id) {
    this.customers = this.customers.filter((c) => String(c.id) !== String(id));
    return true;
  }

  async getPaymentsByCustomerId(customerId) {
    return this.payments.filter((p) => String(p.customerId) === String(customerId));
  }

  async getAllPayments() {
    return this.payments;
  }

  async addPayment(payment) {
    const id = Date.now();
    this.payments.push({ ...payment, id });
    return id;
  }

  async updatePayment(payment) {
    this.payments = this.payments.map((p) =>
      String(p.id) === String(payment.id) ? { ...p, ...payment } : p
    );
    return true;
  }

  async deletePayment(id) {
    this.payments = this.payments.filter((p) => String(p.id) !== String(id));
    return true;
  }

  async getInvoicesByCustomerId(customerId) {
    return this.invoices.filter((i) => String(i.customerId) === String(customerId));
  }

  async getAllInvoices() {
    return this.invoices;
  }

  async addInvoice(invoice) {
    const id = Date.now();
    this.invoices.push({ ...invoice, id });
    return id;
  }

  async updateInvoice(invoice) {
    this.invoices = this.invoices.map((i) =>
      String(i.id) === String(invoice.id) ? { ...i, ...invoice } : i
    );
    return true;
  }

  async deleteInvoice(id) {
    this.invoices = this.invoices.filter((i) => String(i.id) !== String(id));
    return true;
  }
}

export const dbService = new MockDatabaseService();

export const initDB = () => dbService.initialize();
export const getCustomerByIdFromDB = (id) => dbService.getCustomerById(id);
export const getCustomersFromDB = () => dbService.getCustomers();
export const addCustomerToDB = (customer) => dbService.addCustomer(customer);
export const updateCustomerInDB = (customer) => dbService.updateCustomer(customer);
export const deleteCustomerFromDB = (id) => dbService.deleteCustomer(id);

export const getPaymentsFromDB = (customerId) => dbService.getPaymentsByCustomerId(customerId);
export const getAllPaymentsFromDB = () => dbService.getAllPayments();
export const addPaymentToDB = (payment) => dbService.addPayment(payment);
export const updatePaymentToDB = (payment) => dbService.updatePayment(payment);
export const deletePaymentFromDB = (id) => dbService.deletePayment(id);

export const getInvoicesFromDB = (customerId) => dbService.getInvoicesByCustomerId(customerId);
export const getAllInvoicesFromDB = () => dbService.getAllInvoices();
export const addInvoiceToDB = (invoice) => dbService.addInvoice(invoice);
export const deleteInvoiceFromDB = (id) => dbService.deleteInvoice(id);
export const updateInvoiceToDB = (invoice) => dbService.updateInvoice(invoice);
