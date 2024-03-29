import "../globals.css";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="">
        <div className="flex items-center justify-center w-screen h-screen min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
