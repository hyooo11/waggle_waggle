// "use client";
import StoreProvider from "./StoreProvider";
import store from "../store";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../component/common/Header.js";
import Footer from "../component/common/Footer.js";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StoreProvider store={store}>
          <Header />
          {children}
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
