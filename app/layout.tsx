import type { Metadata } from "next";
import { Outfit } from "next/font/google"; // Import Outfit font
import "./globals.css"; // Import global styles
import { StoreProvider } from "./redux/StoreProvider";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { GoogleOAuthProvider } from "@react-oauth/google";
import MobileViewDetector from "./components/MobileViewDetector";
import theme from "./theme";
import LoginDrawer from "./components/LoginDrawer";
import CookieConsentPopup from "./components/CookiesConset";


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
      <GoogleOAuthProvider clientId={String(process.env.GOOGLE_CLIENT_ID)}>
        <html lang="en">
          <body className={`${outfit.variable} app`}> {/* Apply Outfit font */}
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <CookieConsentPopup/>
              <MobileViewDetector />
              <LoginDrawer />
            {/* Include MobileViewDetector */}
              {children}
            </ThemeProvider>
          </body>
        </html>
      </GoogleOAuthProvider>
    </StoreProvider>
  );
}
