import React from "react";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./main.scss";
import "./styles/typography/headings.scss";
import "./styles/colors/colors.scss";
import { ConfigProvider } from "antd";
import { antdThemeConfig } from "./styles/antdThemeConfig/antdThemeConfig.ts";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ConfigProvider theme={antdThemeConfig}>
        <App />
      </ConfigProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
