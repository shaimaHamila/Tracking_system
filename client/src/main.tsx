import React from "react";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./main.scss";
import "./styles/typography/headings.scss";
import "./styles/colors/colors.scss";
import { ConfigProvider } from "antd";
import { antdThemeConfig } from "./styles/antdThemeConfig/antdThemeConfig.ts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ConfigProvider theme={antdThemeConfig}>
          <App />
        </ConfigProvider>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen position='right' buttonPosition='bottom-right' />
    </QueryClientProvider>
  </React.StrictMode>,
);
