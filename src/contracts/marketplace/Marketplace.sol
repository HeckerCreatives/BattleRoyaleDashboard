// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract GameNFT is ERC721URIStorage, ERC721Burnable, Ownable, ReentrancyGuard {

    // baseTokenURI removed — using per-token URIs via ERC721URIStorage
    uint256 private _totalSupply;
    uint256 private _tokenIdCounter;

    // Public sale / whitelist controls
    bool public saleActive = false;
    bool public whitelistActive = false;
    uint256 public mintPrice = 0.01 ether;
    uint256 public maxPerWallet = 2;
    uint256 public maxSupply = type(uint256).max; // owner should set realistic cap
    mapping(address => uint256) public mintedCount;
    bytes32 public merkleRoot;

    // string private devAddress = "0x68bac6f007495faa74767b93eecc34b2a55923d0";
    
    struct Listing {
        address seller;
        uint256 price;
        bool active;
    }

    mapping(uint256 => Listing) public listings;
    uint256[] private _activeListings;

    event NFTMinted(address indexed owner, uint256 indexed tokenId);
    event NFTMintedURI(address indexed owner, uint256 indexed tokenId, string tokenURI);
    event NFTGifted(address indexed from, address indexed to, uint256 indexed tokenId);
    event Listed(uint256 indexed tokenId, address indexed seller, uint256 price);
    event ListingCancelled(uint256 indexed tokenId);
    event NFTSold(uint256 indexed tokenId, address indexed buyer, address indexed seller, uint256 price);

    constructor(address initialOwner) ERC721("Game NFT", "GNFT") Ownable(initialOwner) {
        _totalSupply = 0;
    }

    // --- Owner setters for sale configuration ---
    function setSaleActive(bool active) external onlyOwner {
        saleActive = active;
    }

    function setWhitelistActive(bool active) external onlyOwner {
        whitelistActive = active;
    }

    function setMintPrice(uint256 price) external onlyOwner {
        mintPrice = price;
    }

    function setMintPriceEther(uint256 ethAmount) external onlyOwner {
        mintPrice = ethAmount * 1 ether;
    }

    function setMaxPerWallet(uint256 max) external onlyOwner {
        maxPerWallet = max;
    }

    function setMaxSupply(uint256 supply) external onlyOwner {
        maxSupply = supply;
    }

    function setMerkleRoot(bytes32 root) external onlyOwner {
        merkleRoot = root;
    }

    // Base URI removed — tokenURI is per-token via ERC721URIStorage

    // --- Minting ---
    function mint(address to) external onlyOwner {
        revert("Use mintWithId to mint with an explicit tokenId");
    }

    // Owner mints a specific tokenId (no duplicates) and optionally sets tokenURI
    function mintWithId(address to, uint256 tokenId, string calldata uri) external onlyOwner {
        // Use ownerOf try/catch to check existence to avoid relying on internal _exists
        try this.ownerOf(tokenId) returns (address) {
            revert("Token already minted");
        } catch {
            // token does not exist, proceed
        }
        // require a non-empty token URI for per-token metadata
        require(bytes(uri).length > 0, "Empty token URI");
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        emit NFTMintedURI(to, tokenId, uri);
        // ensure token counter moves forward so walletOfOwner scans work
        if (tokenId + 1 > _tokenIdCounter) {
            _tokenIdCounter = tokenId + 1;
        }
        _totalSupply++;
        emit NFTMinted(to, tokenId);
    }

    // --- Public Payable Mint ---
    // Public mint a single specified tokenId. Prevent duplicate minting.
    function mintPublic(uint256 tokenId, string calldata uri) external payable nonReentrant {
        require(saleActive, "Sale not active");
        // check existence via ownerOf try/catch
        try this.ownerOf(tokenId) returns (address) {
            revert("Token already minted");
        } catch {
            // not minted, continue
        }
        require(tokenId + 1 <= maxSupply, "Exceeds max supply");
        require(msg.value == mintPrice, "Incorrect ETH amount");
        require(mintedCount[msg.sender] + 1 <= maxPerWallet, "Exceeds per-wallet limit");

        // require a non-empty token URI
        require(bytes(uri).length > 0, "Empty token URI");
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);
        emit NFTMintedURI(msg.sender, tokenId, uri);
        if (tokenId + 1 > _tokenIdCounter) {
            _tokenIdCounter = tokenId + 1;
        }
        _totalSupply++;
        mintedCount[msg.sender] += 1;
        emit NFTMinted(msg.sender, tokenId);
    }

    // --- Whitelist Mint (Merkle) ---
    // Whitelist mint a single specific tokenId (requires valid Merkle proof)
    function mintWhitelist(uint256 tokenId, bytes32[] calldata proof, string calldata uri) external payable nonReentrant {
        require(whitelistActive, "Whitelist not active");
        // check existence via ownerOf try/catch
        try this.ownerOf(tokenId) returns (address) {
            revert("Token already minted");
        } catch {
            // not minted, continue
        }
        require(msg.value == mintPrice, "Incorrect ETH amount");
        require(mintedCount[msg.sender] + 1 <= maxPerWallet, "Exceeds per-wallet limit");
        require(tokenId + 1 <= maxSupply, "Exceeds max supply");
        require(merkleRoot != bytes32(0), "Merkle root not set");

        bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
        require(MerkleProof.verify(proof, merkleRoot, leaf), "Invalid Merkle proof");

        // require a non-empty token URI
        require(bytes(uri).length > 0, "Empty token URI");
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);
        emit NFTMintedURI(msg.sender, tokenId, uri);
        if (tokenId + 1 > _tokenIdCounter) {
            _tokenIdCounter = tokenId + 1;
        }
        _totalSupply++;
        mintedCount[msg.sender] += 1;
        emit NFTMinted(msg.sender, tokenId);
    }

    // --- Gifting NFTs ---
    // Allow the token owner to gift (transfer) their NFT to another address
    function gift(address to, uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Not token owner");
        _safeTransfer(msg.sender, to, tokenId, "");
        emit NFTGifted(msg.sender, to, tokenId);
    }

    // --- Listing NFTs ---
    function listNFT(uint256 tokenId, uint256 price) external {
        require(ownerOf(tokenId) == msg.sender, "Not token owner");
        require(price != 0, "Invalid price");
        Listing storage l = listings[tokenId];
        require(!l.active, "Already listed"); // prevent duplicate active listings

        l.seller = msg.sender;
        l.price = price;
        l.active = true;

        _activeListings.push(tokenId);
        emit Listed(tokenId, msg.sender, price);
    }

    function cancelListing(uint256 tokenId) external {
        Listing storage l = listings[tokenId];
        require(l.active, "Listing inactive");
        require(l.seller == msg.sender, "Not seller");

        l.active = false;

        // Remove from active listings array
        for (uint256 i = 0; i < _activeListings.length; ++i) {
            if (_activeListings[i] == tokenId) {
                _activeListings[i] = _activeListings[_activeListings.length - 1];
                _activeListings.pop();
                break;
            }
        }
        emit ListingCancelled(tokenId);
    }
    // --- Burn NFT ---
    function _customBurn(uint256 tokenId) internal {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");        
        super._burn(tokenId); // ERC721URIStorage._burn clears tokenURI

        if (_totalSupply > 0) {
            _totalSupply -= 1;
        }

        // Clear active listing if present
        Listing storage l = listings[tokenId];
        if (l.active) {
            l.active = false;
            for (uint256 i = 0; i < _activeListings.length; ++i) {
                if (_activeListings[i] == tokenId) {
                    _activeListings[i] = _activeListings[_activeListings.length - 1];
                    _activeListings.pop();
                    break;
                }
            }
        }

        delete listings[tokenId];
    }
    // --- Buy listed NFT ---
    function buy(uint256 tokenId) external payable nonReentrant {
        Listing storage l = listings[tokenId];
        require(l.active, "Listing inactive");
        require(msg.value == l.price, "Incorrect value");

        address seller = l.seller;
        require(seller != address(0), "Invalid seller");
        require(ownerOf(tokenId) == seller, "Seller no longer owner");

        // Mark listing inactive and remove from active array
        l.active = false;
        for (uint256 i = 0; i < _activeListings.length; ++i) {
            if (_activeListings[i] == tokenId) {
                _activeListings[i] = _activeListings[_activeListings.length - 1];
                _activeListings.pop();
                break;
            }
        }

        // Transfer NFT to buyer
        _safeTransfer(seller, msg.sender, tokenId, "");

        // Payout seller
        (bool sent, ) = payable(seller).call{value: msg.value}("");
        require(sent, "Payment failed");

        emit NFTSold(tokenId, msg.sender, seller, msg.value);
    }

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    // --- View NFTs by wallet ---
    function walletOfOwner(address owner) external view returns (uint256[] memory) {
        uint256 balance = balanceOf(owner);
        uint256[] memory ids = new uint256[](balance);
        uint256 counter = 0;

        for (uint256 i = 0; i < _tokenIdCounter; ++i) {
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

    function withdraw() external onlyOwner nonReentrant {
        uint256 bal = address(this).balance;
        require(bal > 0, "No balance");
        (bool sent, ) = payable(owner()).call{value: bal}("");
        require(sent, "Withdraw failed");
    }

    function getActiveListings() external view returns (uint256[] memory) {
        return _activeListings;
    }

    function getListingDetails(uint256 tokenId) external view returns (address, uint256, bool) {
        Listing storage listing = listings[tokenId];
        return (listing.seller, listing.price, listing.active);
    }

    /**
     * Per-token tokenURI is provided by ERC721URIStorage; if not set, ERC721's
     * default behavior (baseURI + tokenId) is used by the inherited implementation.
     */

    // Multiple base contracts define these functions; explicitly override.
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function tokenURI(uint256 tokenId) public view virtual override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    // rely on inherited _burn implementations from ERC721URIStorage/ERC721
}
