import React, { useState } from "react";
import "./App.css";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CartProvider } from "./contexts/CartContext";
import IntroScreen from "./components/IntroScreen";
import HeroSection from "./components/HeroSection";
import CollectionsSection from "./components/CollectionsSection";
import FeaturedSection from "./components/FeaturedSection";
import CartDrawer from "./components/CartDrawer";
import CheckoutPage from "./components/CheckoutPage";

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {
  const [entered, setEntered] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  if (!entered) {
    return (
      <div className="App min-h-screen theme-bg">
        <IntroScreen onEnter={() => setEntered(true)} />
      </div>
    );
  }

  return (
    <CartProvider>
      <div className="App min-h-screen theme-bg">
        {/* Skip to content - Accessibility */}
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:text-sm">
          Skip to main content
        </a>

        {showCheckout ? (
          <CheckoutPage onBack={() => setShowCheckout(false)} />
        ) : (
          <main id="main-content" className="animate-fade-in">
            <HeroSection />
            <CollectionsSection />
            <FeaturedSection />
          </main>
        )}

        <CartDrawer onCheckout={() => setShowCheckout(true)} />
      </div>
    </CartProvider>
  );
}

export default App;
