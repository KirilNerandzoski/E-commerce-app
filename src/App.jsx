import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { Navbar } from "./components/common/Navbar";
import { Footer } from "./components/common/Footer";
import { ToastContainer } from "./components/common/ToastContainer";
import { MobileBottomNav } from "./components/common/MobileBottomNav";
import { QuickViewModal } from "./components/common/QuickViewModal";
import { ComparisonModal } from "./components/common/ComparisonModal";
import { CartDrawer } from "./components/common/CartDrawer";
import { FloatingCompareDock } from "./components/common/FloatingCompareDock";
import { AuthModal } from "./components/common/AuthModal";

// Pages
import { HomePage } from "./components/home/HomePage";
import { ProductCatalog } from "./components/catalog/ProductCatalog";
import { ProductDetailPage } from "./components/pdp/ProductDetailPage";
import { CartPage } from "./components/cart/CartPage";
import { WishlistPage } from "./components/wishlist/WishlistPage";
import { CheckoutPage } from "./components/checkout/CheckoutPage";
import { ProfilePage } from "./components/profile/ProfilePage";

const MainContent = () => {
  const { currentView } = useApp();

  return (
    <main className="min-h-[70vh]">
      {currentView === "home" && <HomePage />}
      {currentView === "catalog" && <ProductCatalog />}
      {currentView === "product" && <ProductDetailPage />}
      {currentView === "cart" && <CartPage />}
      {currentView === "wishlist" && <WishlistPage />}
      {currentView === "checkout" && <CheckoutPage />}
      {currentView === "profile" && <ProfilePage />}
    </main>
  );
};

const AppShell = () => {
  const { isAuthModalOpen, setIsAuthModalOpen } = useApp();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col justify-between selection:bg-orange-500 selection:text-white">
      <div>
        <Navbar />
        <MainContent />
      </div>
      <Footer />

      {/* Global Modals, Drawers & Notifications */}
      <QuickViewModal />
      <ComparisonModal />
      <CartDrawer />
      <FloatingCompareDock />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <ToastContainer />
      <MobileBottomNav />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}

export default App;
