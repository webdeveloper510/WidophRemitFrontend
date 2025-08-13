import React from "react";

export default function DinoOfflinePage() {
  return (
    <div style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#fff",
      fontFamily: "sans-serif",
      color: "#333",
      textAlign: "center"
    }}>
      <div style={{ fontSize: "48px", marginBottom: "20px" }}>🦖</div>
      <h1 style={{ marginBottom: "10px" }}>No Internet</h1>
      <p style={{ maxWidth: "300px", fontSize: "14px", color: "#666" }}>
        Try:
        <br />• Checking the network cables, modem, and router
        <br />• Reconnecting to Wi-Fi
        <br />• Running Network Diagnostics
      </p>
      <p style={{ fontSize: "12px", color: "#999", marginTop: "20px" }}>
        ERR_INTERNET_DISCONNECTED
      </p>
    </div>
  );
}
