import React from "react";
import ReactDOM from "react-dom/client";
import ContentManager from "./ContentManager";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>Gestión de Contenidos</h1>
      <ContentManager />
    </div>
  </React.StrictMode>
);
