import "antd/dist/reset.css";
import "./globals.css";
import { ConfigProvider } from "antd";
import type { ReactNode } from "react";

export const metadata = {
  title: "Tử Vi Đẩu Số",
  description: "Lập lá số tử vi và luận giải tổng quan."
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="vi">
      <body>
        <ConfigProvider>
          <div className="container">{children}</div>
        </ConfigProvider>
      </body>
    </html>
  );
};

export default RootLayout;
