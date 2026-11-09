import React, { useState } from "react";
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
import { SpinWheelModal } from "./components/gamification/SpinWheelModal";
import { FloatingSpinTrigger } from "./components/gamification/FloatingSpinTrigger";
import { LivePurchasesTicker } from "./components/gamification/LivePurchasesTicker";
import { OrderCompletedChatBubble } from "./components/common/OrderCompletedChatBubble";
import { ErrorBoundary } from "./components/common/ErrorBoundary";

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
  const { isAuthModalOpen, setIsAuthModalOpen, theme } = useApp();
  const [isSpinModalOpen, setIsSpinModalOpen] = useState(false);

  return (
    <div className={`min-h-screen ${theme} ${theme === 'light' ? 'bg-[#FBF9F5] text-[#181513]' : 'bg-[#141210] text-[#F5EFEB]'} flex flex-col justify-between selection:bg-[#E26D46] selection:text-white relative transition-colors duration-300`}>
      {/* Warm ambient background glows */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-[#D49A55]/4 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-1/3 right-10 w-96 h-96 bg-[#E26D46]/4 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
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
      <SpinWheelModal isOpen={isSpinModalOpen} onClose={() => setIsSpinModalOpen(false)} />
      <FloatingSpinTrigger onOpen={() => setIsSpinModalOpen(true)} />
      <LivePurchasesTicker />
      <ErrorBoundary>
        <OrderCompletedChatBubble />
      </ErrorBoundary>
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
