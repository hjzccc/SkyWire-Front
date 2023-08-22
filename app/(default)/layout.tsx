"use client";

import { useEffect } from "react";

import AOS from "aos";
import "aos/dist/aos.css";
import "../css/style.css";
import Footer from "@/components/ui/footer";
export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    AOS.init({
      once: true,
      disable: "phone",
      duration: 700,
      easing: "ease-out-cubic",
    });
  });

  return (
    <html>
      <body>
        <main className="grow">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
