import { BackButton } from "../components/ui";

const SECTIONS = [
  {
    id: "overview",
    title: "Overview",
    content: `Lappal is a peer-to-peer laptop marketplace that allows buyers and sellers to connect, 
negotiate, and complete transactions directly. The platform includes an AI-powered price 
estimator to help sellers list their laptops at fair market prices.`,
  },
  {
    id: "getting-started",
    title: "Getting Started",
    items: [
      {
        heading: "Creating an Account",
        text: `Click Register on the landing page. Enter your username, email address, and a 
password of at least 6 characters. Select whether you are registering as a Buyer 
or a Seller — this determines which dashboard you see after logging in.`,
      },
      {
        heading: "Logging In",
        text: `Click Login on the landing page and enter your registered email and password. 
Press Enter or click the Login button. Your session is saved automatically so 
you will not need to log in again unless you manually log out.`,
      },
    ],
  },
  {
    id: "buyers",
    title: "For Buyers",
    items: [
      {
        heading: "Browsing Listings",
        text: `After logging in you will land on the Marketplace page. Use the Brand checkboxes 
and Price range filters at the top to narrow down results. A live count shows 
how many listings match your current filters. Click Clear filters to reset.`,
      },
      {
        heading: "Viewing a Listing",
        text: `Click any listing card to open the full product detail page. You can browse 
multiple photos using the thumbnails below the main image. The right panel 
shows the price, description, full specifications, and seller information 
including their rating and total sales.`,
      },
      {
        heading: "Contacting a Seller",
        text: `On the product detail page click Message Seller to open a direct chat. 
Type your message and press Enter or click Send. The seller will receive 
your message and respond in the same thread. Each sent message shows a 
checkmark confirming delivery.`,
      },
      {
        heading: "Marking a Purchase Complete",
        text: `Once you have received your laptop, open the chat with that seller and click 
Mark as Purchased in the top right of the chat screen. A confirmation dialog 
will appear — confirm to proceed. You will then be prompted to leave a star 
rating and a written review for the seller.`,
      },
    ],
  },
  {
    id: "sellers",
    title: "For Sellers",
    items: [
      {
        heading: "Your Dashboard",
        text: `After logging in as a Seller you will see your Dashboard which lists all your 
active listings. The header shows a live count of how many listings you currently 
have. Click any listing image to view its full product detail page.`,
      },
      {
        heading: "Adding a Listing",
        text: `Click the Add New Listing button in the top right of your Dashboard. Fill in 
the laptop title, price in USD, and optionally an image URL. Title and price 
are required — price must be greater than zero. Click Add Listing to save.`,
      },
      {
        heading: "Editing a Listing",
        text: `Click the Edit button on any listing card in your Dashboard. The same form 
will open pre-filled with the current details. Make your changes and click 
Save Changes. Click Cancel to close without saving.`,
      },
      {
        heading: "Deleting a Listing",
        text: `Click the Delete button on any listing card. A confirmation dialog will appear 
asking you to confirm before the listing is permanently removed. Click 
Yes, Delete to confirm or Cancel to go back. This action cannot be undone.`,
      },
    ],
  },
  {
    id: "messages",
    title: "Messages",
    content: `The Messages page shows all your active conversations. Use the search bar at the 
top to filter conversations by seller name or message content. Click any conversation 
to open the full chat thread. You can send messages by typing in the input field 
and pressing Enter or clicking Send. A character limit of 500 applies per message. 
Once a deal is complete you can mark it as purchased directly from the chat screen.`,
  },
  {
    id: "profile",
    title: "Your Profile",
    content: `Your Profile page shows your account information, stats (listings, sales, rating), 
your active listings, and reviews left by buyers. Click Edit Profile to update 
your name, location, or avatar initials. Reviews appear here automatically after 
buyers complete a purchase and submit a rating through the chat screen.`,
  },
  {
    id: "estimator",
    title: "AI Price Estimator",
    items: [
      {
        heading: "What it does",
        text: `The AI Price Estimator uses a machine learning model trained on thousands of 
real laptop sales to predict a fair market price for your device. It takes into 
account the brand, specifications, age, condition, and battery health.`,
      },
      {
        heading: "How to use it",
        text: `Click Price Estimator in the navbar. Fill in all required fields — Brand, 
Product Name, CPU, RAM, Storage, and GPU. Then adjust the three sliders 
for Age, Condition (4 to 10), and Battery Health (60% to 100%). 
Click Get Price Estimate to run the prediction.`,
      },
      {
        heading: "Understanding the result",
        text: `The result shows a price in PKR along with a category label — Entry Level, 
Budget, Mid-Range, or Premium. The estimate may vary by approximately 
±15% from actual market prices depending on local demand. Use it as a 
starting guide when setting your listing price — the final price is always 
set by you.`,
      },
    ],
  },
  {
    id: "navigation",
    title: "Navigation",
    content: `The navbar at the top of every screen provides quick access to all main sections. 
The currently active page is highlighted with a blue underline. As a Buyer you 
can access Dashboard, Messages, Price Estimator, and Profile. As a Seller you 
can access Home (Marketplace), Price Estimator, and Profile. Click the Lappal 
logo on the left to return to your home screen at any time.`,
  },
  {
    id: "reviews",
    title: "Reviews & Ratings",
    content: `Reviews can only be left after a buyer marks a deal as complete through the 
chat screen. The buyer is prompted to select a star rating from 1 to 5 and 
write a short comment. Submitted reviews appear immediately on the seller's 
public profile page and on any product listing by that seller. The seller's 
average rating updates automatically with each new review.`,
  },
];

export default function DocsScreen({ onNavigate }) {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="page" style={{ maxWidth: 900, margin: "0 auto" }}>

      <BackButton onClick={() => onNavigate("marketplace")} label="Marketplace" />

      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
          Documentation
        </h1>
        <p style={{ fontSize: 14, color: "#8b949e", lineHeight: 1.7 }}>
          Everything you need to know about using Lappal — the trusted marketplace
          for buying and selling laptops.
        </p>
      </div>

<div className="docs-layout" style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 40, alignItems: "start" }}>
        {/* Sidebar — table of contents */}
        <div className="docs-sidebar" style={{
  position: "sticky", top: 76,
  background: "#161b22", border: "1px solid #21262d",
  borderRadius: 12, padding: "16px 0", flexShrink: 0,
}}>
          <div style={{
            fontSize: 12, fontWeight: "bolder", color: "#8b949e",
            textTransform: "uppercase", letterSpacing: "0.8px",
            padding: "0 16px", marginBottom: 10,
          }}>
            Contents:
          </div>
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              style={{
                display: "block", width: "100%", textAlign: "left",
                background: "none", border: "none", padding: "8px 16px",
                fontSize: 13, color: "#8b949e", cursor: "pointer",
                fontFamily: "inherit", transition: "color 0.15s, background 0.15s",
                borderRadius: 0,
              }}
              onMouseEnter={(e) => {
                e.target.style.color = "#e6edf3";
                e.target.style.background = "#1c2330";
              }}
              onMouseLeave={(e) => {
                e.target.style.color = "#8b949e";
                e.target.style.background = "none";
              }}
            >
              {s.title}
            </button>
          ))}
        </div>

        {/* Main content */}
        <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
          {SECTIONS.map((s) => (
            <section
              key={s.id}
              id={s.id}
              style={{
                background: "#161b22", border: "1px solid #21262d",
                borderRadius: 14, padding: 28,
              }}
            >
              {/* Section title */}
              <h2 style={{
                fontSize: 18, fontWeight: 700, marginBottom: 16,
                paddingBottom: 12, borderBottom: "1px solid #21262d",
              }}>
                {s.title}
              </h2>

              {/* Plain content */}
              {s.content && (
                <p style={{
                  fontSize: 14, color: "#c9d1d9", lineHeight: 1.8,
                  whiteSpace: "pre-line",
                }}>
                  {s.content}
                </p>
              )}

              {/* Sub-items */}
              {s.items && (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {s.items.map((item, i) => (
                    <div key={i}>
                      <h3 style={{
                        fontSize: 14, fontWeight: 600, color: "#e6edf3",
                        marginBottom: 6, display: "flex", alignItems: "center", gap: 8,
                      }}>
                        {/* Step number */}
                        <span style={{
                          width: 22, height: 22, borderRadius: "50%",
                          background: "rgba(37,99,235,0.2)",
                          border: "1px solid rgba(37,99,235,0.4)",
                          color: "#2563eb", fontSize: 11, fontWeight: 700,
                          display: "inline-flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0,
                        }}>
                          {i + 1}
                        </span>
                        {item.heading}
                      </h3>
                      <p style={{
                        fontSize: 13, color: "#8b949e", lineHeight: 1.8,
                        paddingLeft: 30, whiteSpace: "pre-line",
                      }}>
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}