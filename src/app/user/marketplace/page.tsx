"use client";

import { useGetAvailableNFTs } from '@/api/nft/list';
import { BrowserProvider, Contract, Interface, parseUnits, Wallet, formatUnits, JsonRpcProvider } from 'ethers';
import ItemCard from './components/ItemCard';
import { useAccount } from 'wagmi';


export default function MarketplacePage() {

    const { address } = useAccount();

    const { data: nfts = [], isLoading, isError, refetch } = useGetAvailableNFTs(true);

    return (
        <div className="w-full h-full p-4">
            <div>
                {/* // filters and sorting options here */}
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {isLoading ? (
                    <div className="col-span-full text-center text-gray-500">Loading NFTs...</div>
                ) : nfts.length === 0 ? (
                    <div className="col-span-full text-center text-gray-500">No NFTs available</div>
                ) : (
                    nfts.map((nft) => (
                        <ItemCard key={nft.tokenId} item={nft} currentAddress={address} onSuccess={refetch} />
                    ))
                )}
            </div>
        </div>
    )
}