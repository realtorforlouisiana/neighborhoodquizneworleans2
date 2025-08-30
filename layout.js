export const metadata = {
  title: "Neighborhood Match Quiz – New Orleans",
  description: "Find your best-fit New Orleans neighborhood based on lifestyle and home preferences."
};
import "./../styles/globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-b from-white to-purple-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
