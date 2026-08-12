import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "@/shared/Header";
import { Footer } from "@/shared/Footer";
import { ScrollToTop } from "@/shared/ScrollToTop";

export const Layout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
