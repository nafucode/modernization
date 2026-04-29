import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "电气勘测信息表",
  description: "电梯电气改造勘测数据采集",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen">
        {children}
        <Script id="iframe-resize" strategy="afterInteractive">{`
          function sendHeight() {
            window.parent.postMessage({ iframeHeight: document.body.scrollHeight }, '*');
          }
          window.addEventListener('load', sendHeight);
          window.addEventListener('resize', sendHeight);
          // 内容变化时也更新（比如展开折叠）
          new MutationObserver(sendHeight).observe(document.body, { subtree: true, childList: true, attributes: true });
        `}</Script>
      </body>
    </html>
  );
}
