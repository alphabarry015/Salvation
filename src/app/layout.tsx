import type { Metadata, Viewport } from "next";
import { Newsreader, Noto_Naskh_Arabic, Source_Sans_3 } from "next/font/google";
import { AppShell } from "@/components/layout/AppShell";
import { ThemeProvider } from "@/components/ThemeProvider";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const ui = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-ui",
  display: "swap",
});

const scripture = Newsreader({
  subsets: ["latin"],
  variable: "--font-scripture",
  display: "swap",
});

const arabic = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  variable: "--font-naskh",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: "Salvation. Torah, Bible et Coran à l’écoute les uns des autres",
  description:
    "Un lieu calme pour lire la Torah, la Bible et le Coran ensemble, en français. Chaque livre a son exégèse : une lecture seule ne suffit pas à en connaître le vrai sens.",
  applicationName: "Salvation",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
  },
  keywords: [
    "Torah",
    "Bible",
    "Coran",
    "lecture croisée",
    "dialogue interreligieux",
    "textes sacrés",
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#fff8f1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${ui.variable} ${scripture.variable} ${arabic.variable} h-full antialiased`}
    >
      <body className="min-h-full overflow-x-hidden bg-cream font-sans text-ink">
        <ThemeProvider>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
