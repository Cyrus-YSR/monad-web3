// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AccountNFT is ERC721, Ownable {
    uint256 public mintPrice;
    uint256 private _tokenIdCounter;
    mapping(address => bool) public hasAccount;

    event AccountCreated(address indexed owner, uint256 tokenId);

    constructor(uint256 initialMintPrice) ERC721("ImageShare Account", "ISA") Ownable(msg.sender) {
        mintPrice = initialMintPrice;
        _tokenIdCounter = 0;
    }

    function setMintPrice(uint256 newPrice) public onlyOwner {
        mintPrice = newPrice;
    }

    function mint() public payable {
        require(msg.value >= mintPrice, "Insufficient ETH sent");
        require(!hasAccount[msg.sender], "Already has an account");

        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;

        _safeMint(msg.sender, tokenId);
        hasAccount[msg.sender] = true;

        emit AccountCreated(msg.sender, tokenId);
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        payable(owner()).transfer(balance);
    }
}
