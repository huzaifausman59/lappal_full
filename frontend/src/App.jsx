import { useState } from "react";
import { globalStyles } from "./styles/theme";
import { Navbar, PageProgress } from "./components/ui";
import LogoutModal from "./components/LogoutModal";

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
import DocsScreen from "./screens/DocsScreen";

// Exported so screens can import and use it
export const calcRating = (reviews) => {
  if (!reviews || reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
};

export default function App() {
  const [screen, setScreen]               = useState("landing");
  const [prevScreen, setPrevScreen]       = useState(null);
  const [user, setUser]                   = useState(null);
  const [showLogout, setShowLogout]       = useState(false);
  const [showProgress, setShowProgress]   = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);
  const [activeSeller, setActiveSeller]   = useState(null);
  const [activeChat, setActiveChat]       = useState(null);
  const [reviews, setReviews] = useState({});

  // Navigate with page progress indicator — Nielsen #1
  const navigate = (s) => {
    setShowProgress(true);
    setTimeout(() => setShowProgress(false), 900);
    setPrevScreen(screen);
    setScreen(s);
  };

  const login = (u) => {
    setUser(u);
    navigate("marketplace");
};

  const logout = () => {
    setUser(null);
    setShowLogout(false);
    navigate("landing");
  };

  const addReview = (sellerId, newReview) => {
    setReviews((prev) => ({
      ...prev,
      [sellerId]: [newReview, ...(prev[sellerId] || [])],
    }));
  };

  const viewProduct = (id) => { setActiveProduct(id); navigate("product"); };
  const viewSeller  = (id) => { setActiveSeller(id);  navigate("seller-profile"); };
const openChat = (conversationId, otherUser) => {
  setActiveChat({ conversationId, otherUser });
  navigate("chat");
};
  const authScreens = ["landing", "login", "register"];
  const showNavbar  = user && !authScreens.includes(screen);

  return (
    <>
      <style>{globalStyles}</style>

      {/* Page transition progress bar — visibility of system status */}
      {showProgress && <PageProgress />}

      {/* Navbar — passes activeScreen so current link is highlighted */}
      {showNavbar && (
        <Navbar
          user={user}
          onNavigate={navigate}
          onLogoutClick={() => setShowLogout(true)}
          activeScreen={screen}
        />
      )}

      {showLogout && (
        <LogoutModal onConfirm={logout} onCancel={() => setShowLogout(false)} />
      )}

      {/* Auth screens */}
      {screen === "landing" && <LandingScreen onNavigate={navigate} />}

      {screen === "login" && (
        <LoginScreen
          onLogin={login}
          onSwitchToRegister={() => navigate("register")}
        />
      )}

      {screen === "register" && (
        <RegisterScreen
          onLogin={login}
          onSwitchToLogin={() => navigate("login")}
        />
      )}

      {/* Main screens */}
      {screen === "marketplace" && (
        <MarketplaceScreen onViewProduct={viewProduct} />
      )}

      {screen === "product" && activeProduct && (
        <ProductDetailScreen
          listingId={activeProduct}
          onBack={() => navigate("marketplace")}
          onViewSeller={viewSeller}
          onMessageSeller={openChat}
        />
      )}

      {screen === "messages" && (
        <MessagesScreen onOpenChat={openChat} />
      )}

      {screen === "chat" && activeChat && (
  <ChatScreen
    conversationId={activeChat.conversationId}
    otherUser={activeChat.otherUser}
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
          onBack={() => navigate("marketplace")}
          onViewProduct={viewProduct}
          reviews={reviews}
        />
      )}

      {screen === "profile" && (
        <ProfileScreen
          onBack={() => navigate("marketplace")}
          onViewProduct={viewProduct}
          onNavigate={navigate}
          user = {user}
        />
      )}

      {screen === "estimator" && (
        <PriceEstimatorScreen user={user} />
      )}
      {screen === "docs" && (
        <DocsScreen onNavigate={navigate} />
      )}
    </>
  );
}