import UserHeader from "@/components/UserHeader";
import UserSidebar from "@/components/UserSidebar";
import ClientProviders from "@/utils/ClientProviders";



export default function UserLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>
          <div className=' flex w-full h-full'>
              <UserSidebar/>
              <main className=' bg-zinc-900 w-full text-white'
              style={{backgroundImage: "url('/dashboard/assets/BG.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat:"no-repeat"}}
              
              >
                  <UserHeader/>
                  <div className=' flex flex-col gap-4 w-full rounded-lg p-4 md:p-10'> 
                      {children}
                  </div>
              </main>
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}