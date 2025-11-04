import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Providers from './provider'
import "./globals.css";

export const metadata: Metadata = {
    title: "Al Hameed Computers – Gaming PCs, Laptops & Accessories",
    description:
        "Al Hameed Computers is Karachi&#039;s trusted computer shop for gaming PCs, graphics cards, motherboards, and accessories—all at affordable and competitive prices.",
};

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800", "900"],
    variable: "--font-poppins",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" data-scroll-behavior="smooth" className={poppins.variable}>
            <body>
                <Providers>
                    {children}
                    <Toaster position="top-right" reverseOrder={false} />
                </Providers>
            </body>
        </html>
    );
}