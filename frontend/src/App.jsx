import { useState } from "react";
import { globalStyles } from "./styles/theme";
import { Navbar } from "./components/ui";
import LogoutModal from "./components/LogoutModal";
import { SELLERS } from "./data/listings";

import LandingScreen       from "./screens/LandingScreen";
import LoginScreen         from "./screens/LoginScreen";
import RegisterScreen      from "./screens/RegisterScreen";
import MarketplaceScreen   from "./screens/MarketplaceScreen";
import ProductDetailScreen from "./screens/ProductDetailScreen";
import MessagesScreen      from "./screens/MessagesScreen";
import ChatScreen          from "./screens/ChatScreen";
import SellerDashboard     from "./screens/SellerDashboard";
import SellerProfileScreen from "./screens/SellerProfileScreen";
import ProfileScreen       from "./screens/ProfileScreen";
import PriceEstimatorScreen from "./screens/PriceEstimatorScreen";

// Build initial reviews state from SELLERS mock data
const buildInitialReviews = () => {
  const map = {};
  Object.entries(SELLERS).forEach(([id, seller]) => {
    map[id] = seller.reviews || [];
  });
  return map;
};

// Helper: recalculate average rating — exported so other screens can use it
export const calcRating = (reviews) => {
  if (!reviews || reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
};

export default function App() {
  const [screen, setScreen]               = useState("landing");
  const [user, setUser]                   = useState(null);
  const [showLogout, setShowLogout]       = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);
  const [activeSeller, setActiveSeller]   = useState(null);
  const [activeChat, setActiveChat]       = useState(null);

  // Single source of truth for all reviews
  const [reviews, setReviews] = useState(buildInitialReviews());

  // Called from ChatScreen when a review is submitted
  const addReview = (sellerId, newReview) => {
    setReviews((prev) => ({
      ...prev,
      [sellerId]: [newReview, ...(prev[sellerId] || [])],
    }));
  };

  const navigate    = (s) => setScreen(s);

  const login = (u) => {
    setUser(u);
    setScreen(u.role === "seller" ? "dashboard" : "marketplace");
  };

  const logout = () => {
    setUser(null);
    setShowLogout(false);
    setScreen("landing");
  };

  const viewProduct = (id) => { setActiveProduct(id); setScreen("product"); };
  const viewSeller  = (id) => { setActiveSeller(id);  setScreen("seller-profile"); };
  const openChat    = (id) => { setActiveChat(id);    setScreen("chat"); };

  const authScreens = ["landing", "login", "register"];
  const showNavbar  = user && !authScreens.includes(screen);

  return (
    <>
      <style>{globalStyles}</style>

      {showNavbar && (
        <Navbar user={user} onNavigate={navigate} onLogoutClick={() => setShowLogout(true)} />
      )}

      {showLogout && (
        <LogoutModal onConfirm={logout} onCancel={() => setShowLogout(false)} />
      )}

      {screen === "landing"  && <LandingScreen onNavigate={navigate} />}
      {screen === "login"    && <LoginScreen onLogin={login} />}
      {screen === "register" && <RegisterScreen onLogin={login} />}

      {screen === "marketplace" && (
        <MarketplaceScreen onViewProduct={viewProduct} />
      )}

      {screen === "product" && activeProduct && (
        <ProductDetailScreen
          listingId={activeProduct}
          onBack={() => navigate("marketplace")}
          onViewSeller={viewSeller}
          onMessageSeller={openChat}
          reviews={reviews}
        />
      )}

      {screen === "messages" && (
        <MessagesScreen onOpenChat={openChat} />
      )}

      {screen === "chat" && activeChat && (
        <ChatScreen
          sellerId={activeChat}
          onBack={() => navigate("messages")}
          onAddReview={addReview}
          user={user}
        />
      )}

      {screen === "dashboard" && (
        <SellerDashboard user={user} onViewProduct={viewProduct} />
      )}

      {screen === "seller-profile" && activeSeller && (
        <SellerProfileScreen
          sellerId={activeSeller}
          onBack={() => navigate("product")}
          onViewProduct={viewProduct}
          reviews={reviews}
        />
      )}

      {screen === "profile" && (
        <ProfileScreen
          onBack={() => navigate("marketplace")}
          onViewProduct={viewProduct}
          onNavigate={navigate}
          reviews={reviews}
        />
      )}

      {screen === "estimator" && (
  <PriceEstimatorScreen />
)}
    </>
  );
}