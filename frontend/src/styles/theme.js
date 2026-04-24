export const theme = {
  bg: "#0d1117",
  surface: "#161b22",
  surfaceHover: "#1c2330",
  border: "#21262d",
  blue: "#2563eb",
  blueHover: "#1d4ed8",
  text: "#e6edf3",
  muted: "#8b949e",
  red: "#ef4444",
};

export const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: ${theme.bg};
    color: ${theme.text};
    font-family: 'Sora', sans-serif;
    min-height: 100vh;
  }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: ${theme.bg}; }
  ::-webkit-scrollbar-thumb { background: ${theme.border}; border-radius: 3px; }

  /* Navbar */
  .navbar {
    background: ${theme.surface};
    border-bottom: 1px solid ${theme.border};
    padding: 0 32px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .navbar-brand {
    display: flex; align-items: center; gap: 10px;
    font-weight: 700; font-size: 18px; color: ${theme.text};
    cursor: pointer; text-decoration: none;
  }
  .logo-icon {
    width: 34px; height: 34px; background: ${theme.blue};
    border-radius: 8px; display: flex; align-items: center;
    justify-content: center; font-size: 16px;
  }
  .navbar-links { display: flex; align-items: center; gap: 24px; }
  .nav-link {
    color: ${theme.muted}; font-size: 14px; cursor: pointer;
    transition: color 0.15s; font-weight: 500; background: none;
    border: none; padding: 0; font-family: 'Sora', sans-serif;
  }
  .nav-link:hover { color: ${theme.text}; }

  /* Landing */
  .landing {
    min-height: 100vh; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    background: radial-gradient(ellipse 80% 60% at 50% 40%, #1a2744 0%, ${theme.bg} 70%);
  }
  .landing-logo { display: flex; align-items: center; gap: 14px; margin-bottom: 16px; }
  .landing-logo-icon {
    width: 54px; height: 54px; background: ${theme.blue};
    border-radius: 14px; display: flex; align-items: center;
    justify-content: center; font-size: 26px;
  }
  .landing-title { font-size: 42px; font-weight: 700; letter-spacing: -1px; }
  .landing-subtitle {
    color: ${theme.muted}; font-size: 16px; margin-bottom: 40px;
    text-align: center; max-width: 340px; line-height: 1.6;
  }
  .landing-buttons { display: flex; gap: 16px; }

  /* Buttons */
  .btn {
    padding: 12px 32px; border-radius: 10px; font-size: 15px;
    font-weight: 600; cursor: pointer; transition: all 0.15s;
    font-family: 'Sora', sans-serif; border: none;
  }
  .btn-primary { background: ${theme.blue}; color: #fff; }
  .btn-primary:hover { background: ${theme.blueHover}; transform: translateY(-1px); }
  .btn-outline { background: transparent; color: ${theme.blue}; border: 2px solid ${theme.blue}; }
  .btn-outline:hover { background: rgba(37,99,235,0.1); }
  .btn-danger { background: ${theme.red}; color: #fff; }
  .btn-danger:hover { background: #dc2626; }
  .btn-ghost { background: ${theme.surfaceHover}; color: ${theme.text}; border: 1px solid ${theme.border}; }
  .btn-ghost:hover { background: #262d38; }
  .btn-full { width: 100%; }
  .btn-sm { padding: 7px 16px; font-size: 13px; border-radius: 7px; }

  /* Modal */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.6);
    display: flex; align-items: center; justify-content: center;
    z-index: 200; backdrop-filter: blur(4px);
  }
  .modal-card {
    background: ${theme.surface}; border: 1px solid ${theme.border};
    border-radius: 16px; padding: 36px; width: 100%; max-width: 440px;
    box-shadow: 0 24px 60px rgba(0,0,0,0.5); animation: popIn 0.2s ease;
  }
  .modal-card-wide { max-width: 520px; }
  @keyframes popIn {
    from { opacity: 0; transform: scale(0.95) translateY(8px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
  .modal-logo {
    display: flex; align-items: center; gap: 10px;
    justify-content: center; margin-bottom: 20px;
  }
  .modal-logo-icon {
    width: 34px; height: 34px; background: ${theme.blue};
    border-radius: 8px; display: flex; align-items: center;
    justify-content: center; font-size: 16px;
  }
  .modal-logo span { font-size: 20px; font-weight: 700; }
  .modal-title { font-size: 22px; font-weight: 700; text-align: center; margin-bottom: 24px; }

  /* Forms */
  .form-group { margin-bottom: 16px; }
  .form-label { display: block; font-size: 13px; font-weight: 500; margin-bottom: 6px; color: ${theme.muted}; }
  .form-input {
    width: 100%; background: #1c2330; border: 1px solid ${theme.border};
    border-radius: 9px; padding: 12px 14px; font-size: 14px;
    color: ${theme.text}; font-family: 'Sora', sans-serif;
    outline: none; transition: border-color 0.15s;
  }
  .form-input:focus { border-color: ${theme.blue}; }
  .form-input::placeholder { color: #4d5562; }
  .radio-group { display: flex; gap: 20px; margin-top: 4px; }
  .radio-label { display: flex; align-items: center; gap: 7px; cursor: pointer; font-size: 14px; font-weight: 500; }
  .radio-label input { accent-color: ${theme.blue}; }

  /* Page wrapper */
  .page { padding: 28px 32px; max-width: 1280px; margin: 0 auto; }

  /* Filter Bar */
  .filter-bar {
    background: ${theme.surface}; border: 1px solid ${theme.border};
    border-radius: 12px; padding: 16px 24px; margin-bottom: 28px;
    display: flex; align-items: center; gap: 24px; flex-wrap: wrap;
  }
  .filter-section { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
  .filter-label { font-size: 13px; font-weight: 600; color: ${theme.muted}; white-space: nowrap; }
  .filter-divider { width: 1px; height: 24px; background: ${theme.border}; }
  .checkbox-label { display: flex; align-items: center; gap: 6px; font-size: 13px; cursor: pointer; font-weight: 500; }
  .checkbox-label input { accent-color: ${theme.blue}; }

  /* Listings Grid */
  .listings-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }

  /* Listing Card */
  .listing-card {
    background: ${theme.surface}; border: 1px solid ${theme.border};
    border-radius: 14px; overflow: hidden; cursor: pointer; transition: all 0.2s;
  }
  .listing-card:hover { border-color: #3d4757; transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,0.4); }
  .listing-card img { width: 100%; height: 220px; object-fit: cover; display: block; }
  .listing-card-body { padding: 16px; }
  .listing-card-title { font-size: 17px; font-weight: 600; margin-bottom: 8px; }
  .listing-price { font-size: 20px; font-weight: 700; color: ${theme.blue}; margin-bottom: 6px; font-family: 'JetBrains Mono', monospace; }
  .listing-seller { font-size: 13px; color: ${theme.muted}; }

  /* Product Detail */
  .product-layout { display: grid; grid-template-columns: 1fr 360px; gap: 28px; align-items: start; }
  .product-main-img { width: 100%; height: 460px; object-fit: cover; border-radius: 14px; border: 1px solid ${theme.border}; display: block; margin-bottom: 12px; }
  .thumbnail-row { display: flex; gap: 10px; }
  .thumbnail { width: 80px; height: 65px; object-fit: cover; border-radius: 8px; cursor: pointer; border: 2px solid transparent; transition: border-color 0.15s; opacity: 0.7; }
  .thumbnail.active { border-color: ${theme.blue}; opacity: 1; }
  .product-side { display: flex; flex-direction: column; gap: 16px; }
  .product-info-card { background: ${theme.surface}; border: 1px solid ${theme.border}; border-radius: 14px; padding: 22px; }
  .product-title { font-size: 24px; font-weight: 700; margin-bottom: 8px; }
  .product-price { font-size: 28px; font-weight: 700; color: ${theme.blue}; margin-bottom: 14px; font-family: 'JetBrains Mono', monospace; }
  .product-desc-label { font-size: 12px; color: ${theme.muted}; margin-bottom: 8px; }
  .product-desc { font-size: 14px; line-height: 1.7; color: #c9d1d9; }
  .specs-section { background: ${theme.surface}; border: 1px solid ${theme.border}; border-radius: 14px; padding: 22px; margin-top: 16px; }
  .specs-title { font-size: 17px; font-weight: 600; margin-bottom: 16px; }
  .specs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .spec-key { font-size: 11px; color: ${theme.muted}; margin-bottom: 3px; text-transform: uppercase; letter-spacing: 0.5px; }
  .spec-value { font-size: 14px; font-weight: 500; }
  .seller-info-card { background: ${theme.surface}; border: 1px solid ${theme.border}; border-radius: 14px; padding: 22px; }
  .seller-info-title { font-size: 16px; font-weight: 600; margin-bottom: 14px; }
  .seller-info-row { margin-bottom: 10px; }
  .seller-info-key { font-size: 11px; color: ${theme.muted}; margin-bottom: 2px; text-transform: uppercase; letter-spacing: 0.5px; }
  .seller-info-val { font-size: 14px; font-weight: 500; }
  .seller-link { color: ${theme.blue}; cursor: pointer; }
  .seller-link:hover { text-decoration: underline; }

  /* Inbox */
  .inbox-header { text-align: center; font-size: 20px; font-weight: 700; padding: 20px 0 0; margin-bottom: 20px; }
  .inbox-list { background: ${theme.surface}; border: 1px solid ${theme.border}; border-radius: 14px; overflow: hidden; max-width: 760px; margin: 0 auto; }
  .inbox-item { display: flex; align-items: center; gap: 14px; padding: 18px 22px; cursor: pointer; border-bottom: 1px solid ${theme.border}; transition: background 0.15s; }
  .inbox-item:last-child { border-bottom: none; }
  .inbox-item:hover { background: ${theme.surfaceHover}; }
  .avatar { width: 44px; height: 44px; border-radius: 50%; background: ${theme.blue}; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 17px; flex-shrink: 0; }
  .inbox-name { font-size: 15px; font-weight: 600; }
  .inbox-preview { font-size: 13px; color: ${theme.muted}; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 380px; }
  .inbox-time { font-size: 12px; color: ${theme.muted}; margin-left: auto; white-space: nowrap; }

  /* Chat */
  .chat-wrapper { display: flex; flex-direction: column; height: calc(100vh - 56px); }
  .chat-header { background: ${theme.surface}; border-bottom: 1px solid ${theme.border}; padding: 14px 24px; display: flex; align-items: center; gap: 12px; }
  .chat-back { background: none; border: none; color: ${theme.muted}; font-size: 20px; cursor: pointer; padding: 4px; transition: color 0.15s; }
  .chat-back:hover { color: ${theme.text}; }
  .chat-messages { flex: 1; overflow-y: auto; padding: 24px; display: flex; flex-direction: column; gap: 12px; }
  .message-bubble { max-width: 480px; padding: 12px 16px; border-radius: 14px; font-size: 14px; line-height: 1.5; }
  .message-bubble.me { background: ${theme.blue}; color: #fff; align-self: flex-end; border-bottom-right-radius: 4px; }
  .message-bubble.them { background: ${theme.surface}; border: 1px solid ${theme.border}; align-self: flex-start; border-bottom-left-radius: 4px; }
  .message-time { font-size: 11px; opacity: 0.65; margin-top: 4px; }
  .chat-input-row { background: ${theme.surface}; border-top: 1px solid ${theme.border}; padding: 14px 24px; display: flex; gap: 12px; align-items: center; }
  .chat-input { flex: 1; background: #1c2330; border: 1px solid ${theme.border}; border-radius: 10px; padding: 12px 16px; font-size: 14px; color: ${theme.text}; font-family: 'Sora', sans-serif; outline: none; transition: border-color 0.15s; }
  .chat-input:focus { border-color: ${theme.blue}; }
  .chat-input::placeholder { color: #4d5562; }

  /* Seller Dashboard */
  .dash-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; }
  .dash-title { font-size: 24px; font-weight: 700; }
  .my-listings-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
  .my-listing-card { background: ${theme.surface}; border: 1px solid ${theme.border}; border-radius: 14px; overflow: hidden; }
  .my-listing-card img { width: 100%; height: 200px; object-fit: cover; display: block; }
  .my-listing-body { padding: 14px 16px; }
  .my-listing-actions { display: flex; gap: 10px; margin-top: 12px; }
  .btn-edit {
    flex: 1; background: #21262d; border: 1px solid ${theme.border}; color: ${theme.text};
    padding: 8px; border-radius: 8px; font-size: 13px; font-weight: 500; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 6px;
    font-family: 'Sora', sans-serif; transition: background 0.15s;
  }
  .btn-edit:hover { background: #2d333b; }
  .btn-delete-card {
    flex: 1; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); color: ${theme.red};
    padding: 8px; border-radius: 8px; font-size: 13px; font-weight: 500; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 6px;
    font-family: 'Sora', sans-serif; transition: background 0.15s;
  }
  .btn-delete-card:hover { background: rgba(239,68,68,0.2); }

  /* Seller Profile */
  .seller-profile-layout { display: grid; grid-template-columns: 300px 1fr; gap: 28px; align-items: start; }
  .seller-profile-card { background: ${theme.surface}; border: 1px solid ${theme.border}; border-radius: 14px; padding: 24px; }
  .seller-profile-name { font-size: 20px; font-weight: 700; margin-bottom: 16px; }
  .profile-row { margin-bottom: 14px; }
  .profile-key { font-size: 11px; color: ${theme.muted}; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px; }
  .profile-val { font-size: 15px; font-weight: 500; }
  .seller-listings-title { font-size: 19px; font-weight: 700; margin-bottom: 18px; }
  .seller-listings-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; }

  /* Logout modal */
  .logout-modal-card { max-width: 380px; text-align: center; }
  .logout-buttons { display: flex; gap: 12px; margin-top: 8px; }

  /* Back button */
  .back-btn {
    display: inline-flex; align-items: center; gap: 6px;
    background: none; border: none; color: ${theme.muted}; font-size: 14px;
    font-weight: 500; cursor: pointer; margin-bottom: 20px; padding: 0;
    font-family: 'Sora', sans-serif; transition: color 0.15s;
  }
  .back-btn:hover { color: ${theme.text}; }

  /* Toast */
  .toast {
    position: fixed; bottom: 28px; right: 28px; background: #1a7f37;
    border: 1px solid #2ea043; color: #fff; padding: 12px 20px;
    border-radius: 10px; font-size: 14px; font-weight: 500; z-index: 9999;
    animation: slideUp 0.3s ease; box-shadow: 0 8px 24px rgba(0,0,0,0.4);
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Empty State */
  .empty-state { text-align: center; padding: 60px 20px; color: ${theme.muted}; }
  .empty-state-icon { font-size: 40px; margin-bottom: 12px; }
  .empty-state-text { font-size: 16px; }

  /* ─── Responsive ─────────────────────────────────── */

/* Tablet (max 900px) */
@media (max-width: 900px) {
  .product-layout {
    grid-template-columns: 1fr;
  }
  .product-side {
    flex-direction: column;
  }
  .seller-profile-layout {
    grid-template-columns: 1fr;
  }
  .specs-grid {
    grid-template-columns: 1fr;
  }
}

/* Mobile (max 600px) */
@media (max-width: 600px) {
  /* Page padding */
  .page {
    padding: 16px;
  }

  /* Navbar */
  .navbar {
    padding: 0 16px;
  }
  .nav-link {
    font-size: 13px;
  }
  .navbar-links {
    gap: 14px;
  }

  /* Landing */
  .landing-title {
    font-size: 28px;
  }
  .landing-subtitle {
    font-size: 14px;
  }
  .landing-buttons {
    flex-direction: column;
    width: 100%;
    padding: 0 32px;
  }
  .btn {
    width: 100%;
    text-align: center;
  }

  /* Filter bar */
  .filter-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    padding: 14px 16px;
  }
  .filter-divider {
    display: none;
  }
  .filter-section {
    gap: 10px;
  }

  /* Listings grid — single column */
  .listings-grid {
    grid-template-columns: 1fr;
  }

  /* My listings grid — single column */
  .my-listings-grid {
    grid-template-columns: 1fr;
  }

  /* Product detail */
  .product-layout {
    grid-template-columns: 1fr;
  }
  .product-main-img {
    height: 260px;
  }
  .product-title {
    font-size: 20px;
  }
  .product-price {
    font-size: 22px;
  }
  .thumbnail {
    width: 60px;
    height: 50px;
  }

  /* Seller profile */
  .seller-profile-layout {
    grid-template-columns: 1fr;
  }
  .seller-listings-grid {
    grid-template-columns: 1fr;
  }

  /* Modal card */
  .modal-card {
    margin: 16px;
    padding: 24px 20px;
  }

  /* Inbox */
  .inbox-preview {
    max-width: 180px;
  }

  /* Dashboard header */
  .dash-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  /* Chat */
  .chat-input-row {
    padding: 10px 14px;
  }
}

/* ── Profile Screen ───────────────────────────────── */
  .profile-section { margin-bottom: 24px; }
  .profile-section-label {
    font-size: 11px; font-weight: 600; color: #8b949e;
    text-transform: uppercase; letter-spacing: 0.8px;
    margin-bottom: 10px; padding-bottom: 6px;
    border-bottom: 1px solid #21262d;
  }
  .profile-user-card {
    display: flex; flex-direction: column; align-items: center;
    padding: 24px 16px; background: #161b22;
    border: 1px solid #21262d; border-radius: 14px;
  }
  .profile-avatar {
    width: 72px; height: 72px; border-radius: 50%;
    background: #2563eb; display: flex; align-items: center;
    justify-content: center; font-size: 24px; font-weight: 700;
    color: white; margin-bottom: 12px;
  }
  .profile-name { font-size: 20px; font-weight: 700; margin-bottom: 6px; }
  .profile-meta { font-size: 13px; color: #8b949e; }

  .profile-stats-row {
    display: flex; align-items: center; justify-content: space-around;
    background: #161b22; border: 1px solid #21262d;
    border-radius: 14px; padding: 20px 16px;
  }
  .profile-stat { text-align: center; flex: 1; }
  .profile-stat-value { font-size: 22px; font-weight: 700; margin-bottom: 4px; }
  .profile-stat-label { font-size: 12px; color: #8b949e; }
  .profile-stat-divider { width: 1px; height: 36px; background: #21262d; }

  .profile-listings-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
  }
  .profile-listing-card {
    background: #161b22; border: 1px solid #21262d;
    border-radius: 12px; overflow: hidden; cursor: pointer; transition: all 0.2s;
  }
  .profile-listing-card:hover { border-color: #3d4757; transform: translateY(-1px); }
  .profile-listing-card img { width: 100%; height: 110px; object-fit: cover; display: block; }
  .profile-listing-body { padding: 10px 12px; }
  .profile-listing-title { font-size: 13px; font-weight: 500; margin-bottom: 3px; }
  .profile-listing-price { font-size: 14px; font-weight: 700; color: #2563eb; font-family: 'JetBrains Mono', monospace; }
  .profile-add-tile {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; min-height: 140px; cursor: pointer;
    border: 2px dashed #21262d; background: transparent;
    border-radius: 12px; transition: border-color 0.2s;
  }
  .profile-add-tile:hover { border-color: #2563eb; }

  .profile-reviews-list {
    background: #161b22; border: 1px solid #21262d;
    border-radius: 14px; overflow: hidden;
  }
  .profile-review-item {
    padding: 16px 20px; border-bottom: 1px solid #21262d;
  }
  .profile-review-item:last-child { border-bottom: none; }
  .profile-review-header {
    display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;
  }
  .profile-review-name { font-size: 14px; font-weight: 600; }
  .profile-review-comment { font-size: 13px; color: #c9d1d9; line-height: 1.5; }
  .profile-review-date { font-size: 11px; color: #8b949e; margin-top: 4px; }
`;
