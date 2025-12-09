'use client'

import { useState } from 'react';
import { ethers } from 'ethers';
import { useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { useRequestNonce, useLinkWallet } from '@/app/api/auth/auth';
import { usePathname, useRouter } from 'next/navigation';

interface LinkWalletProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function LinkWallet({ onSuccess, onError }: LinkWalletProps) {
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingRequest, setPendingRequest] = useState(false);
  const router = useRouter()
  const pathName = usePathname()


  // Wait/poll for accounts after requesting approval
  async function waitForAccounts(provider: any, timeout = 20000, interval = 500) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      try {
        const accounts = await provider.listAccounts();
        if (accounts && accounts.length > 0) return true;
      } catch (e) {
        // ignore and retry
      }
      await new Promise((r) => setTimeout(r, interval));
    }
    return false;
  }

  const requestNonceMutation = useRequestNonce();
  const linkWalletMutation = useLinkWallet();

  const handleLinkWallet = async () => {
    // Handlers for provider events — attached during this login flow and removed in finally
    const accountsChangedHandler = (accounts: any) => {
      if (!accounts || accounts.length === 0) {
        setError('No wallet account available. Please connect your wallet.');
        setPendingRequest(false);
        setLoading(false);
      }
    };

    const disconnectHandler = () => {
      setError('Wallet disconnected.');
      setPendingRequest(false);
      setLoading(false);
    };

    try {
      // Prevent duplicate wallet requests (MetaMask RPC -32002)
      if (pendingRequest) {
        const msg = 'A wallet request is already pending. Please check your wallet.';
        setError(msg);
        onError?.(msg);
        return;
      }
      setPendingRequest(true);
      setLoading(true);
      setError(null);

      if (!window.ethereum) {
        const errorMsg = 'MetaMask not detected. Please install it to continue.';
        setError(errorMsg);
        onError?.(errorMsg);
        window.open('https://metamask.io/download/', '_blank');
        return;
      }

      // Attach quick listeners to react to account/disconnect events while the
      // login flow is in progress (helps when the extension updates accounts).
      try {
        if ((window as any).ethereum && (window as any).ethereum.on) {
          (window as any).ethereum.on('accountsChanged', accountsChangedHandler);
          (window as any).ethereum.on('disconnect', disconnectHandler);
        }
      } catch (e) {
        // ignore
      }

      // Connect to provider and request accounts if needed
      const provider = new ethers.BrowserProvider(window.ethereum);
      try {
        const accounts = await provider.listAccounts();
        if (!accounts || accounts.length === 0) {
          setError('Waiting for wallet approval...');
          await provider.send('eth_requestAccounts', []);

          const ok = await waitForAccounts(provider, 20000, 500);
          setError(null);
          if (!ok) {
            const msg = 'No wallet account detected after approval. Please approve the connection in your wallet.';
            setError(msg);
            onError?.(msg);
            return;
          }
        }
      } catch (acctErr: any) {
        console.warn('Account request failed', acctErr);
        if (acctErr && (acctErr.code === -32002 || acctErr?.message?.includes('already pending'))) {
          const msg = 'A wallet approval is already pending in your wallet. Please approve it there.';
          setError(msg);
          onError?.(msg);
          return;
        }
        throw acctErr;
      }

      const signer = await provider.getSigner();
      const walletAddress = await signer.getAddress();

      // Request nonce (use mutateAsync for linear flow)
      try {
        console.log('Requesting nonce for', walletAddress);
        const nonceResponse: any = await requestNonceMutation.mutateAsync({ walletAddress });
        if (nonceResponse?.message !== 'success') {
          throw new Error('Failed to get nonce from server');
        }

        // Sign message with wallet. Try provider `personal_sign` first for reliability,
        // then fall back to ethers `signer.signMessage`.
        const message = nonceResponse.data.message;
        console.log('Signing message:', message);

        let signature: string | null = null;
        setError('Waiting for signature approval...');

        // Use personal_sign through window.ethereum.request (most reliable for MetaMask)
        try {
          signature = await (window as any).ethereum.request({
            method: 'personal_sign',
            params: [message, walletAddress],
          });
          console.log('personal_sign succeeded');
        } catch (signErr: any) {
          console.error('personal_sign failed', signErr);
          
          // User explicitly rejected (code 4001) or not authorized yet (4100)
          if (signErr && (signErr.code === 4001 || signErr.code === 4100)) {
            disconnect();
            const msg = signErr.code === 4001 
              ? 'Signature request was rejected. Please try again and approve the signature in your wallet.'
              : 'Signature not authorized. Please approve the signature request in your wallet and try again.';
            setError(msg);
            onError?.(msg);
            return;
          }
          
          // For other errors, show generic message and stop
          disconnect();
          const msg = signErr?.message || 'Failed to sign message. Please try again.';
          setError(msg);
          onError?.(msg);
          return;
        }

        setError(null);

        if (!signature) {
          throw new Error('Failed to sign message with wallet');
        }

        // Link wallet to current user account (requires existing session)
        try {
          const linkResponse: any = await linkWalletMutation.mutateAsync({ walletAddress, signature });
          console.log('Link wallet response:', linkResponse);
          if (linkResponse?.message === 'success') {
            connect({ connector: injected() });
            onSuccess?.();
            // Optionally refresh the page to show updated wallet info
            window.location.reload();
          } else {
            // Disconnect wallet if linking failed (e.g., already linked to another account)
            disconnect();
            const msg = linkResponse?.data || 'Failed to link wallet';
            onError?.(msg);
            setError(msg);
          }
        } catch (linkErr: any) {
          // Disconnect wallet on error
          disconnect();
          const msg = (linkErr && linkErr.message) || 'Failed to link wallet to account';
          onError?.(msg);
          setError(msg);
        }
      } catch (err: any) {
        const msg = (err && err.message) || 'Failed to request nonce or sign';
        onError?.(msg);
        setError(msg);
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to link wallet';
      setError(errorMsg);
      onError?.(errorMsg);
      console.error('Link wallet error:', err);
    } finally {
      setLoading(false);
      setPendingRequest(false);
      // Clean up any event listeners we attached earlier
      try {
        if ((window as any).ethereum && (window as any).ethereum.removeListener) {
          (window as any).ethereum.removeListener('accountsChanged', accountsChangedHandler);
          (window as any).ethereum.removeListener('disconnect', disconnectHandler);
        }
      } catch (e) {
        // ignore
      }
    }
  };

  return (
    <Button
      onClick={handleLinkWallet}
      disabled={loading}
      className="flex items-center justify-center gap-2 py-2 w-full lg:text-sm xl:text-sm font-bold text-amber-950 ease-in-out duration-200 bg-gradient-to-r from-orange-300 to-orange-400 rounded-md"
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="animate-spin">⏳</span>
          Linking Wallet...
        </span>
      ) : (
        <>
          <LogIn size={15} />
          Link MetaMask Wallet
        </>
      )}
    </Button>
  );
}
