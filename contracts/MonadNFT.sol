// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// 导入OpenZeppelin的ERC721标准合约+元数据+所有权管理
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MonadNFT is ERC721, ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter; // NFT的ID计数器

    // 构造函数：初始化NFT的【名称】和【符号】，部署时生效
    constructor() ERC721("MonadTestNFT", "MTN") Ownable(msg.sender) {}

    // 铸造NFT的方法（仅合约部署者可铸造，防止滥铸）
    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _tokenIdCounter++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    // 重写URI方法（ERC721URIStorage必需）
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    // 重写销毁方法（ERC721URIStorage必需）
    function burn(uint256 tokenId) public onlyOwner {
        _burn(tokenId);
    }
}