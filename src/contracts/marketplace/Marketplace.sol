// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract GameNFT is ERC721, ERC721Burnable, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    string private baseTokenURI;
    uint256 private _totalSupply;
    string private devAddress = "0x68bac6f007495faa74767b93eecc34b2a55923d0";
    
    struct Listing {
        address seller;
        uint256 price;
        bool active;
    }

    mapping(uint256 => Listing) public listings;
    uint256[] private _activeListings;

    event NFTMinted(address indexed owner, uint256 indexed tokenId);
    event NFTGifted(address indexed from, address indexed to, uint256 indexed tokenId);
    event Listed(uint256 indexed tokenId, address indexed seller, uint256 price);
    event ListingCancelled(uint256 indexed tokenId);

    constructor(
        string memory baseURI,
        address initialOwner
    ) ERC721("Game NFT", "GNFT") Ownable(initialOwner) {
        baseTokenURI = baseURI;
        _totalSupply = 0;
    }

    // --- Set / Update Base URI ---
    function setBaseURI(string memory newBaseURI) external onlyOwner {
        baseTokenURI = newBaseURI;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseTokenURI;
    }

    // --- Minting ---
    function mint(address to) external onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _totalSupply++;
        emit NFTMinted(to, tokenId);
    }

    // --- Gifting NFTs ---
    function gift(address to, uint256 tokenId) external onlyOwner {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        _safeTransfer(msg.sender, to, tokenId, "");
        emit NFTGifted(msg.sender, to, tokenId);
    }

    // --- Listing NFTs ---
    function listNFT(uint256 tokenId, uint256 price) external {
        require(ownerOf(tokenId) == msg.sender, "Not token owner");
        require(price > 0, "Invalid price");

        listings[tokenId] = Listing(msg.sender, price, true);
        _activeListings.push(tokenId); // Add to active listings array
        emit Listed(tokenId, msg.sender, price);
    }
    
    function cancelListing(uint256 tokenId) external {
        Listing storage l = listings[tokenId];
        require(l.active, "Listing inactive");
        require(l.seller == msg.sender, "Not seller");

        l.active = false;

        // Remove from active listings array
        for (uint256 i = 0; i < _activeListings.length; i++) {
            if (_activeListings[i] == tokenId) {
                _activeListings[i] = _activeListings[_activeListings.length - 1]; // Replace with last element
                _activeListings.pop(); // Remove last element
                break;
            }
        }

        emit ListingCancelled(tokenId);
    }

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    // --- View NFTs by wallet ---
    function walletOfOwner(address owner) external view returns (uint256[] memory) {
        uint256 balance = balanceOf(owner);
        uint256[] memory ids = new uint256[](balance);
        uint256 counter = 0;

        for (uint256 i = 0; i < _tokenIdCounter.current(); i++) {
            try this.ownerOf(i) returns (address tokenOwner) {
                if (tokenOwner == owner) {
                    ids[counter] = i;
                    counter++;
                }
            } catch {
                // token not minted, skip
                continue;
            }
        }
        return ids;
    }

    function getActiveListings() external view returns (uint256[] memory) {
        return _activeListings;
    }

    function getListingDetails(uint256 tokenId) external view returns (address, uint256, bool) {
        Listing memory listing = listings[tokenId];
        return (listing.seller, listing.price, listing.active);
    }
}
