import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import HomeScreen from "./src/screens/HomeScreen";
import InvoiceScreen from "./src/screens/InvoiceScreen";
import CustomersScreen from "./src/screens/CustomersScreen";
import CustomerPayment from "./src/screens/CustomerPayment";
import CustomerLedgerScreen from "./src/screens/CustomerLedger";
import CustomerStatementScreen from "./src/screens/CustomerStatement";
import CustomerFullStatement from "./src/screens/CustomerFullStatement";
import SettingsScreen from "./src/screens/SettingsScreen";
import AccountScreen from "./src/screens/AccountScreen";
import BottomNav from "./src/components/BottomNav";

import {
  addCustomer,
  deleteCustomer,
  getCustomers,
  updateCustomer,
  type Customer,
} from "./src/storage/customerStorage";
import {
  deleteInvoice,
  getInvoices,
  type StoredInvoice,
} from "./src/storage/invoiceStorage";
import {
  deletePayment,
  getPayments,
  savePayment,
  type Payment,
} from "./src/storage/paymentStorage";

type ScreenName =
  | "dashboard"
  | "invoice"
  | "customers"
  | "newAccount"
  | "receipt"
  | "settings"
  | "ledger"
  | "customerStatement"
  | "customerFullStatement";

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenName>("dashboard");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [invoices, setInvoices] = useState<StoredInvoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null);
  const [invoiceToEdit, setInvoiceToEdit] = useState<StoredInvoice | null>(null);
  const [invoiceInitialMode, setInvoiceInitialMode] = useState<"preview" | "form">("form");
  const [paymentToEdit, setPaymentToEdit] = useState<Payment | null>(null);
  const [returnScreen, setReturnScreen] = useState<ScreenName>("dashboard");
  const [isLoading, setIsLoading] = useState(true);

  const refreshData = useCallback(async () => {
    const [storedCustomers, storedInvoices, storedPayments] = await Promise.all([
      getCustomers(),
      getInvoices(),
      getPayments(),
    ]);
    setCustomers(storedCustomers);
    setInvoices(storedInvoices);
    setPayments(storedPayments);
  }, []);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      await refreshData();
      if (mounted) setIsLoading(false);
    };

    void load();
    return () => {
      mounted = false;
    };
  }, [refreshData]);

  const navigate = useCallback((screen: string) => {
    const validScreens: ScreenName[] = [
      "dashboard",
      "invoice",
      "customers",
      "newAccount",
      "receipt",
      "settings",
      "ledger",
      "customerStatement",
      "customerFullStatement",
    ];

    if (validScreens.includes(screen as ScreenName)) {
      setActiveScreen(screen as ScreenName);
    }
  }, []);

  const openNewCustomer = () => {
    setCustomerToEdit(null);
    setReturnScreen("dashboard");
    setActiveScreen("newAccount");
  };

  const openEditCustomer = (customer: Customer) => {
    setCustomerToEdit(customer);
    setReturnScreen("customers");
    setActiveScreen("newAccount");
  };

  const handleSaveCustomer = async (customer: Customer) => {
    const success = customerToEdit
      ? await updateCustomer(customer)
      : await addCustomer(customer);

    if (success) {
      await refreshData();
      setCustomerToEdit(null);
    }
    return success;
  };

  const handleDeleteCustomer = async (id: string | number) => {
    const success = await deleteCustomer(id);
    if (success) {
      if (selectedCustomer && String(selectedCustomer.id) === String(id)) {
        setSelectedCustomer(null);
      }
      await refreshData();
    }
  };

  const openCustomerLedger = (customer: Customer) => {
    setSelectedCustomer(customer);
    setActiveScreen("ledger");
  };

  const openInvoice = (
    customer: Customer | null = selectedCustomer,
    invoice: StoredInvoice | null = null,
    mode: "preview" | "form" = "form",
  ) => {
    if (customer) setSelectedCustomer(customer);
    setInvoiceToEdit(invoice);
    setInvoiceInitialMode(mode);
    setReturnScreen(activeScreen === "ledger" ? "ledger" : "dashboard");
    setActiveScreen("invoice");
  };

  const openPayment = (payment: Payment | null = null) => {
    setPaymentToEdit(payment);
    setActiveScreen("receipt");
  };

  const handleSavePayment = async (payment: Payment) => {
    const success = await savePayment(payment);
    if (success) {
      await refreshData();
      setPaymentToEdit(null);
    }
    return success;
  };

  const handleDeletePayment = async (id: string | number) => {
    const success = await deletePayment(id);
    if (success) await refreshData();
  };

  const handleDeleteInvoice = async (id: string | number) => {
    const success = await deleteInvoice(id);
    if (success) await refreshData();
  };

  const renderScreen = () => {
    if (isLoading) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#0f4c75" />
        </View>
      );
    }

    switch (activeScreen) {
      case "invoice":
        return (
          <InvoiceScreen
            onNavigate={navigate}
            onInvoiceSaved={refreshData}
            initialCustomer={selectedCustomer}
            invoiceToEdit={invoiceToEdit}
            initialMode={invoiceInitialMode}
            returnScreen={returnScreen}
            customers={customers}
          />
        );

      case "customers":
        return (
          <CustomersScreen
            onNavigate={(screen: string) => screen === "newAccount" ? openNewCustomer() : navigate(screen)}
            customers={customers}
            onDeleteCustomer={handleDeleteCustomer}
            onEditCustomer={openEditCustomer}
            onSelectCustomerLedger={openCustomerLedger}
          />
        );

      case "newAccount":
        return (
          <AccountScreen
            onNavigate={navigate}
            onSave={handleSaveCustomer}
            customerToEdit={customerToEdit}
            existingCustomers={customers}
            returnScreen={returnScreen}
          />
        );

      case "receipt":
        return (
          <CustomerPayment
            customers={customers}
            customer={selectedCustomer}
            paymentToEdit={paymentToEdit}
            onBack={() => {
              setPaymentToEdit(null);
              navigate(selectedCustomer ? "ledger" : "dashboard");
            }}
            onSavePayment={handleSavePayment}
          />
        );

      case "ledger":
        return selectedCustomer ? (
          <CustomerLedgerScreen
            customer={selectedCustomer}
            customers={customers}
            payments={payments}
            invoices={invoices}
            onNavigate={navigate}
            onOpenInvoice={(customer, invoice, mode) => openInvoice(customer, invoice ?? null, mode ?? "form")}
            onOpenPayment={openPayment}
            onDeletePayment={handleDeletePayment}
            onDeleteInvoice={handleDeleteInvoice}
          />
        ) : (
          <CustomersScreen
            onNavigate={navigate}
            customers={customers}
            onDeleteCustomer={handleDeleteCustomer}
            onEditCustomer={openEditCustomer}
            onSelectCustomerLedger={openCustomerLedger}
          />
        );

      case "customerStatement":
        return selectedCustomer ? (
          <CustomerStatementScreen
            customer={selectedCustomer}
            payments={payments}
            invoices={invoices}
            onBack={() => navigate("ledger")}
            onNavigate={navigate}
          />
        ) : null;

      case "customerFullStatement":
        return selectedCustomer ? (
          <CustomerFullStatement
            customer={selectedCustomer}
            payments={payments}
            invoices={invoices}
            onBack={() => navigate("ledger")}
            onNavigate={navigate}
          />
        ) : null;

      case "settings":
        return <SettingsScreen onNavigate={navigate} returnScreen="dashboard" />;

      case "dashboard":
      default:
        return (
          <HomeScreen
            onNavigate={(screen: string) => {
              if (screen === "newAccount") openNewCustomer();
              else navigate(screen);
            }}
            customerCount={customers.length}
            isInitialized={!isLoading}
          />
        );
    }
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.content}>{renderScreen()}</View>
        <BottomNav
          activeTab={activeScreen}
          onNavigate={(screen) => {
            if (screen === "newAccount") openNewCustomer();
            else if (screen === "invoice") openInvoice(selectedCustomer, null, "form");
            else if (screen === "receipt") openPayment(null);
            else navigate(screen);
          }}
        />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eaf6fc",
  },
  content: {
    flex: 1,
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eaf6fc",
  },
});