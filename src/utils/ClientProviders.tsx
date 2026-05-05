'use client';

import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from 'wagmi';
import { Toaster } from "react-hot-toast";
import { Check, CircleCheck, CircleX, X } from "lucide-react";
// import AuthSync from '@/components/auth/AuthSync';
import { config } from "@/wagmi/config";
import { WalletAuthProvider } from "@/context/WalletAuthContext";

export default function ClientProviders({ children }: { children: ReactNode }) {
 const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,    
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
      },
    },
  });

  return (
      <QueryClientProvider client={queryClient}>
          {children}
        <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          success: {
            icon: <CircleCheck size={18} className="text-emerald-400 shrink-0" />,
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '10px 14px',
              backgroundColor: '#052e16',  // dark green
              color: '#86efac',             // green-300
              fontSize: '12px',
              fontWeight: '500',
              borderRadius: '8px',
              border: '1px solid #166534', // green-800
              boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            },
          },
          error: {
            icon: <CircleX size={18} className="text-red-400 shrink-0" />,
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '10px 14px',
              backgroundColor: '#2d0a0a',  // dark red
              color: '#fca5a5',             // red-300
              fontSize: '12px',
              fontWeight: '500',
              borderRadius: '8px',
              border: '1px solid #7f1d1d', // red-900
              boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            },
          },
        }}
        />
      </QueryClientProvider>
  );
}
