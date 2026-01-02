import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import App from "./App";
import TicketsPage from "./TicketsPage";
import "./index.css";

function Layout() {
  return (
    <div>
      <nav style={{ padding: 12, borderBottom: "1px solid #e5e5e5", fontFamily: "system-ui" }}>
        <div style={{ maxWidth: 980, margin: "0 auto", display: "flex", gap: 14 }}>
          <Link to="/" style={{ textDecoration: "none" }}>Events</Link>
          <Link to="/tickets" style={{ textDecoration: "none" }}>My Tickets</Link>
        </div>
      </nav>
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
