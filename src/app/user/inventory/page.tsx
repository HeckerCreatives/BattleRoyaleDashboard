'use client'

import React, { useEffect } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { useGetMyNFTs, useGetAvailableNFTs } from '../../../api/nft/list';
import { useRouter } from 'next/navigation';
import ItemCard from './components/ItemCard';
import toast from 'react-hot-toast';
import { useGetMyInventory } from '@/api/inventory/list';
import MintAction from './components/MintAction';
import { useCheckSession } from '@/app/api/auth/auth';
import { useCheckOwnedTokens, useClaimInventory } from '@/api/inventory/mutations';

export default function InventoryPage() {
    const { address, isConnected } = useAccount();
    const { disconnect } = useDisconnect();
    const router = useRouter();
    const { data: sessionData, isLoading: sessionLoading } = useCheckSession();
    
    // State management (must be before conditional returns)
    const [inGamePage, setInGamePage] = React.useState<number>(0);
    const inGameLimit = 20;
    const [bridgeBackendPage, setBridgeBackendPage] = React.useState<number>(0);
    const bridgeBackendLimit = 9;
    const [onchainPage, setOnchainPage] = React.useState<number>(0);
    const onchainLimit = 9;
    const [selectedBackend, setSelectedBackend] = React.useState<number[]>([]);
    const [selectedOnchain, setSelectedOnchain] = React.useState<number[]>([]);
    const [tab, setTab] = React.useState<'in-game'|'bridge'>('in-game');
    
    // Data fetching hooks (must be before conditional returns)
    const { data: items, isLoading, isError } = useGetMyNFTs(address as string, !!address);
    const { data: invInGameResp, isLoading: invInGameLoading } = useGetMyInventory({ page: inGamePage, limit: inGameLimit });
    const { data: invBridgeResp, isLoading: invBridgeLoading } = useGetMyInventory({ page: bridgeBackendPage, limit: bridgeBackendLimit, includeNFTs: true });
    
    // Check if user has wallet address in session and matches connected wallet
    useEffect(() => {
        if (!sessionLoading && sessionData) {
            const sessionWallet = sessionData.data?.walletAddress;
            
            // If no wallet in session but wagmi is connected, disconnect
            if (isConnected && !sessionWallet) {
                disconnect();
                toast.error('Please link your wallet to your account first');
                return;
            }
            
            // If both connected and session wallet exists, check if they match
            if (isConnected && sessionWallet && address) {
                const addressesMatch = sessionWallet.toLowerCase() === address.toLowerCase();
                
                if (!addressesMatch) {
                    disconnect();
                    toast.error('Connected wallet does not match your account wallet');
                }
            }
        }
    }, [sessionData, sessionLoading, isConnected, disconnect, address]);

    // Map backend inventory API entries into ItemCard shape
    const backendItems = React.useMemo(() => {
            const entries = invInGameResp?.data?.inventory || [];
            return entries.map(e => ({
                tokenId: e.tokenId,
                inventoryId: e._id, // preserve backend inventory ID
                name: e.itemname || e.item?.itemname || '',
                image: e.ipfsImage || e.item?.ipfsImage || '',
                description: e.item?.description || '',
                price: '0',
                seller: '',
                listed: !!e.isListed,
                isMinted: !!e.isMinted,
            }));
        }, [invInGameResp]);

        // Bridge left items (paged)
        const bridgeBackendItems = React.useMemo(() => {
            const entries = invBridgeResp?.data?.inventory || [];
            return entries.map(e => ({
                tokenId: e.tokenId,
                inventoryId: e._id, // preserve backend inventory ID
                name: e.itemname || e.item?.itemname || '',
                image: e.ipfsImage || e.item?.ipfsImage || '',
                description: e.item?.description || '',
                price: '0',
                seller: '',
                listed: !!e.isListed,
                isMinted: !!e.isMinted,
            }));
        }, [invBridgeResp]);

    // Paginate on-chain items client-side
    const pagedOnchainItems = React.useMemo(() => {
        const all = items || [];
        const start = onchainPage * onchainLimit;
        return all.slice(start, start + onchainLimit);
    }, [items, onchainPage]);

    // Check which tokens from current page are already owned in backend
    const pageTokenIds = React.useMemo(() => pagedOnchainItems.map(i => i.tokenId), [pagedOnchainItems]);
    const { data: checkResp } = useCheckOwnedTokens(pageTokenIds, !!pageTokenIds.length && tab === 'bridge');
    const ownedOnchainIds = React.useMemo(() => new Set<number>(checkResp?.owned || []), [checkResp]);

    // Claim/bridge mutation
    const { mutate: claimInventory, isPending: isClaiming } = useClaimInventory();


    
    // Show loading while checking session
    if (sessionLoading) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div>Loading...</div>
            </div>
        );
    }

    // Don't show inventory if user doesn't have a wallet linked in session
    if (!sessionData?.data?.walletAddress) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold mb-2">Wallet Not Linked</h2>
                    <p className="text-gray-500 mb-4">Please link your wallet to access the NFT inventory</p>
                    <button
                        onClick={() => router.push('/user/profile')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Go to Profile to Link Wallet
                    </button>
                </div>
            </div>
        );
    }
    
    // Check if wallet is connected
    if (!isConnected || !address) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold mb-2">Wallet Not Connected</h2>
                    <p className="text-gray-500 mb-4">Please connect your wallet to access the NFT inventory</p>
                    <button
                        onClick={() => router.push('/user/profile')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Go to Profile to Connect Wallet
                    </button>
                </div>
            </div>
        );
    }

    function resolveImage(img?: string) {
        if (!img) return '';
        if (img.startsWith('ipfs://')) return img.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');
        return img;
    }

    const handleBridgeNFT = (tokenId: number) => {
        if (!address) {
            toast.error('Wallet not connected');
            return;
        }
        claimInventory(
            { tokenId, walletAddress: address },
            {
                onSuccess: () => toast.success(`Successfully bridged token #${tokenId} to your account`),
                onError: (e: any) => toast.error(e?.message || 'Bridge failed'),
            }
        );
    }

    return (
        <div className="w-full h-full p-4">
            <div className="mb-4">
                <div className="flex gap-2">
                    <button
                        onClick={() => setTab('in-game')}
                        className={`px-3 py-1 rounded ${tab === 'in-game' ? 'bg-blue-600 text-white' : 'bg-white/5'}`}
                    >
                        In-Game Inventory
                    </button>
                    <button
                        onClick={() => setTab('bridge')}
                        className={`px-3 py-1 rounded ${tab === 'bridge' ? 'bg-blue-600 text-white' : 'bg-white/5'}`}
                    >
                        Bridge
                    </button>
                </div>
            </div>

            {isLoading && <div>Loading your NFTs...</div>}
            {isError && <div className="text-red-500">Error loading NFTs.</div>}

            {tab === 'in-game' && (
                <>
                        <div>
                            {invInGameLoading && <div>Loading inventory...</div>}
                            {!invInGameLoading && backendItems.length === 0 && (
                                <div className="text-center py-12">
                                    <div className="text-gray-400 text-lg mb-2">No items in your inventory</div>
                                    <div className="text-gray-500 text-sm">Items you receive will appear here</div>
                                </div>
                            )}
                            {backendItems.length > 0 && (
                                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-stretch">
                                    {backendItems
                                        .filter(item => item.inventoryId)
                                        .map(item => (
                                        <div key={item.inventoryId || item.tokenId} className={`relative ${selectedBackend.includes(item.tokenId) ? 'ring-2 ring-indigo-500' : ''}`}>
                                    
                                            <ItemCard item={item as any} mintAction={!item.isMinted ? <MintAction item={item as any} /> : undefined} isMinted={item.isMinted} />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Pagination controls for in-game inventory */}
                            <div className="mt-4 flex items-center justify-center gap-2">
                                <button
                                    className="px-3 py-1 bg-white/5 rounded disabled:opacity-50"
                                    disabled={!invInGameResp || (invInGameResp.data.pagination.currentPage <= 0)}
                                    onClick={() => setInGamePage(p => Math.max(0, p - 1))}
                                >Prev</button>
                                <div className="text-sm">Page {invInGameResp ? invInGameResp.data.pagination.currentPage + 1 : 0} / {invInGameResp ? invInGameResp.data.pagination.totalPages : 0}</div>
                                <button
                                    className="px-3 py-1 bg-white/5 rounded disabled:opacity-50"
                                    disabled={!invInGameResp || (invInGameResp.data.pagination.currentPage >= (invInGameResp.data.pagination.totalPages - 1))}
                                    onClick={() => setInGamePage(p => p + 1)}
                                >Next</button>
                            </div>
                        </div>
                </>
            )}

            {tab === 'bridge' && (
                <div className="mt-6 flex gap-4">
                    <div className="w-1/2">
                        <h4 className="text-sm font-semibold mb-2">In-Game Inventory</h4>
                        {invBridgeLoading && <div>Loading inventory...</div>}
                        {!invBridgeLoading && bridgeBackendItems.length === 0 && (
                            <div className="text-center py-12">
                                <div className="text-gray-400 text-sm">No items to display</div>
                            </div>
                        )}
                        {bridgeBackendItems.length > 0 && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                                {bridgeBackendItems
                                    .filter(item => item.inventoryId)
                                    .map(item => (
                                    <div key={item.inventoryId || `backend-${item.tokenId}`} className={`relative ${selectedBackend.includes(item.tokenId) ? 'ring-2 ring-indigo-500' : ''}`}>
                                        
                                        <ItemCard item={item as any} mintAction={!item.isMinted ? <MintAction item={item as any} /> : undefined} isMinted={item.isMinted} />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pagination controls for bridge in-game list */}
                        <div className="mt-4 flex items-center justify-center gap-2">
                            <button
                                className="px-3 py-1 bg-white/5 rounded disabled:opacity-50"
                                disabled={!invBridgeResp || (invBridgeResp.data.pagination.currentPage <= 0)}
                                onClick={() => setBridgeBackendPage(p => Math.max(0, p - 1))}
                            >Prev</button>
                            <div className="text-sm">Page {invBridgeResp ? invBridgeResp.data.pagination.currentPage + 1 : 0} / {invBridgeResp ? invBridgeResp.data.pagination.totalPages : 0}</div>
                            <button
                                className="px-3 py-1 bg-white/5 rounded disabled:opacity-50"
                                disabled={!invBridgeResp || (invBridgeResp.data.pagination.currentPage >= (invBridgeResp.data.pagination.totalPages - 1))}
                                onClick={() => setBridgeBackendPage(p => p + 1)}
                            >Next</button>
                        </div>
                    </div>

                    <div className="w-1/6 flex flex-col items-center justify-center">
                        <div className="text-4xl font-bold mb-2">⇆</div>
                        <div className="mb-2 text-sm text-gray-400 text-center">Bridge</div>
                    </div>

                    <div className="w-1/2">
                        <h4 className="text-sm font-semibold mb-2">Your NFTs</h4>
                        {isLoading && <div>Loading your NFTs...</div>}
                        {!isLoading && items && items.length === 0 && (
                            <div className="text-center py-12">
                                <div className="text-gray-400 text-sm mb-2">No NFTs found</div>
                                <div className="text-gray-500 text-xs">Mint or purchase NFTs to see them here</div>
                            </div>
                        )}
                        {!isLoading && pagedOnchainItems && pagedOnchainItems.length > 0 && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                                {pagedOnchainItems?.map(item => {
                                    const isBridgeable = !ownedOnchainIds.has(item.tokenId);
                                    return (
                                        <div key={`my-${item.tokenId}`} className={`relative ${selectedOnchain.includes(item.tokenId) ? 'ring-2 ring-indigo-500' : ''}`}>
                                            <ItemCard 
                                                item={item} 
                                                onList={() => {}} 
                                                onBridge={isBridgeable ? handleBridgeNFT : undefined} 
                                                isMinted={true}
                                                isBridgePending={isClaiming}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Pagination controls for on-chain NFTs (client-side) */}
                        <div className="mt-4 flex items-center justify-center gap-2">
                            <button
                                className="px-3 py-1 bg-white/5 rounded disabled:opacity-50"
                                disabled={!(items && onchainPage > 0)}
                                onClick={() => setOnchainPage(p => Math.max(0, p - 1))}
                            >Prev</button>
                            <div className="text-sm">Page {items ? (onchainPage + 1) : 0} / {items ? Math.max(1, Math.ceil(items.length / onchainLimit)) : 0}</div>
                            <button
                                className="px-3 py-1 bg-white/5 rounded disabled:opacity-50"
                                disabled={!(items && ((onchainPage + 1) * onchainLimit < (items?.length || 0)))}
                                onClick={() => setOnchainPage(p => p + 1)}
                            >Next</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}