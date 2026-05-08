"use client"
import React, { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'

interface MaintenanceItem {
  type: string;
  value: string; // "0" or "1"
}

export default function Page() {
  const { toast } = useToast();
  const router = useRouter();
  const [maintenances, setMaintenances] = useState<MaintenanceItem[]>([]);

  // Fetch maintenance state on load
  useEffect(() => {
    const fetchMaintenanceState = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/maintenance/getmaintenance`, {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.data.data) {
          setMaintenances(response.data.data);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<{ message: string; data: string }>;
          if (axiosError.response && axiosError.response.status === 401) {
            router.push('/');
            toast({
              variant: 'destructive',
              title: `${axiosError.response.data.message}`,
              description: `${axiosError.response.data.data}`,
            });
          }
        }
      }
    };

    fetchMaintenanceState();
  }, []);

  // Update maintenance state
  const toggleMaintenance = async (type: string, newValue: boolean) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/maintenance/changemaintenance`, {
        type,
        value: newValue ? "1" : "0",
      }, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      });

      // Update local state to reflect change
      setMaintenances(prev => prev.map(m => m.type === type ? { ...m, value: newValue ? "1" : "0" } : m));

      toast({
        variant: "default",
        title: "Maintenance Updated",
        description: `${type} maintenance has been ${newValue ? "enabled" : "disabled"}.`,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string, data: string }>;
        if (axiosError.response && axiosError.response.status === 401) {
          router.push('/');
          toast({
            variant: 'destructive',
            title: `${axiosError.response.data.message}`,
            description: `${axiosError.response.data.data}`,
          });
        }
      }
    }
  };

  return (
    <div className="flex w-full h-screen">
   
        <div className="w-full h-[500px] flex flex-col items-center justify-center p-4 md:p-10">
          <div className="relative w-full h-[180px] rounded-lg flex items-end p-6 shadow-lg overflow-hidden border-[1px] border-opacity-50 border-orange-300"
            style={{ backgroundImage: "url('/dashboard/assets/Tab.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#000000] to-[#00000000] rounded-lg"></div>
            <h2 className="relative z-10 text-2xl font-bold text-secondary">Maintenance</h2>
          </div>

          <div className="w-full h-full mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
              {maintenances.map((maintenance, index) => (
                <div key={index} className="flex items-center justify-center w-full rounded-lg bg-zinc-950 p-4 relative"
                 >
                    <div className=' w-full h-full grid grid-cols-[40%_1fr] bg-[#CA6A03]'>
                      <div className=' w-full'>
                      <img src={`/maintenance/Assets/${index === 0 ? 'gameque' : 'full'}.png`} className=' h-full w-full'/>

                      </div>
                      <div className="flex flex-col items-center justify-center gap-4 h-full ">
                        <p className=" text-sm md:text-[1rem] font-bold text-center text-amber-950 max-w-32">
                          {maintenance.type === "fullgame" ? "Maintenance Fullgame" : "Maintenance In-Game Queue"}
                        </p>
                        <Switch
                          checked={maintenance.value === "1"}
                          onCheckedChange={(checked) => toggleMaintenance(maintenance.type, checked)}
                        />
                      </div>
                    </div>
                  
                </div>
              ))}
            </div>
          </div>
        </div>
    </div>
  );
}
