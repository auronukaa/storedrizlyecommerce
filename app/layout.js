import Navbar from "@/components/navbar";
import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";
import Footer from "@/components/footer";
import ToastProvider from "@/provider/toast-provider";
import Provider from "@/provider/provider";
import FacebookMSG from "@/components/facebook";

const inter = Plus_Jakarta_Sans({
  subsets: ["latin"],
});

export const metadata = {
  title: "Drizlymall",
  description: "Online Shop Drizlymall",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="pt-[64.8px]">
      <body className={inter.className}>
        <ToastProvider />
        <Navbar />
        <Provider>{children}</Provider>
        <FacebookMSG />
        <Footer />
      </body>
    </html>
  );
}
