import UserHeader from "@/components/UserHeader";
import UserSidebar from "@/components/UserSidebar";

export default function UserLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className=' flex w-full h-full min-h-screen'>
        <UserSidebar/>
        <div className=' bg-zinc-900 w-full text-white'
        style={{backgroundImage: "url('/dashboard/assets/BG.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat:"no-repeat"}}
        
        >
            <UserHeader/>
            <div className=' flex flex-col gap-4 w-full rounded-lg p-4 md:p-10'> 
                {children}
            </div>
        </div>
    </div>
  );
}