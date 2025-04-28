import Header from "@/components/assets/header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen justify-center my-background-image flex flex-col flex-1">
        <Header/>
          {children}
     </div>
  );
}