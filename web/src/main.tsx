import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import App from "./App";
import TicketsPage from "./TicketsPage";
import "./index.css";

function Layout() {
  return (
    <div>
      <header style={{ padding: 12, borderBottom: "1px solid #e5e5e5", fontFamily: "system-ui" }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <Link to="/" style={{ display: "inline-flex", alignItems: "center" }}>
              <img src="https://i.imgur.com/pVpGvx9.png" alt="BEASTPass" style={{ height: 128, width: "auto" }} />
            </Link>

            <nav style={{ display: "flex", gap: 14 }}>
              <Link to="/" style={{ textDecoration: "none" }}>Events</Link>
              <Link to="/tickets" style={{ textDecoration: "none" }}>My Tickets</Link>
            </nav>
          </div>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/tickets" element={<TicketsPage />} />
      </Routes>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  </React.StrictMode>
);
