import 'bootstrap/dist/css/bootstrap.min.css'
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ระบบจัดสรรสินค้าบริจาค",
  description: "Donation Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        
        {/* เมนูด้านบน */}
        <Navbar />

        {/* เนื้อหาของแต่ละหน้า */}
        <main className="container mt-4">
          {children}
        </main>

      </body>
    </html>
  );
}
