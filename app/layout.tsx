import type { Metadata } from "next";
import { Outfit } from "next/font/google"; // Import Outfit font
import "./globals.css"; // Import global styles
import { StoreProvider } from "./redux/StoreProvider";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./theme";
import NavBarWrapper from "./components/NavBarWrapper";
import { GoogleOAuthProvider } from "@react-oauth/google";


// Configure the Outfit font
const outfit = Outfit({
  variable: "--font-outfit", // Custom CSS variable
  subsets: ["latin"], // Load only Latin subset
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"], // Specify required weights
});

export const metadata: Metadata = {
  title: "Indian Tadka",
  description: "A Place for Complete Indian Cusinie",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StoreProvider>
      <html lang="en">
        <body className={`${outfit.variable} app`}> {/* Apply Outfit font */}
        <ThemeProvider theme={theme}>
            <CssBaseline />
             <GoogleOAuthProvider clientId={String(process.env.GOOGLE_CLIENT_ID)}>
            <NavBarWrapper />
            {children}
            </GoogleOAuthProvider>
          </ThemeProvider>
         
        </body>
      </html>
    </StoreProvider>

  );
}
