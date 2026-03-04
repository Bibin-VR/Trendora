import React, { useState } from "react";
import "./App.css";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import IntroScreen from "./components/IntroScreen";
import AuthPage from "./components/AuthPage";
import HeroSection from "./components/HeroSection";
import CollectionsSection from "./components/CollectionsSection";
import FeaturedSection from "./components/FeaturedSection";
import CartDrawer from "./components/CartDrawer";
import CheckoutPage from "./components/CheckoutPage";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

function AppContent() {
  const { user, loading } = useAuth();
  const [entered, setEntered] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  if (loading) {
    return (
      <div className="App min-h-screen theme-bg flex items-center justify-center" role="status" aria-label="Loading">
        <div className="text-center">
          <h1 className="text-3xl tracking-tight mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>TRENDORA</h1>
          <div className="w-32 h-[1px] bg-current opacity-10 mx-auto">
            <div className="h-full bg-current opacity-50 animate-pulse" style={{ width: '60%' }} />
          </div>
        </div>
      </div>
    );
  }

  if (!entered) {
    return (
      <div className="App min-h-screen theme-bg">
        <IntroScreen onEnter={() => setEntered(true)} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="App min-h-screen theme-bg">
        <AuthPage onBack={() => setEntered(false)} />
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
