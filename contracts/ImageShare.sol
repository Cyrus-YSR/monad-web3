// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "./AccountNFT.sol";

contract ImageShare {
    struct Image {
        uint256 id;
        address owner;
        string imageHash;
        string text;
        uint256 likes;
        uint256 timestamp;
        uint256 networkId; // 添加网络ID字段
    }

    AccountNFT public accountNFT;
    uint256 private _imageIdCounter;
    mapping(uint256 => Image) public images;
    mapping(uint256 => mapping(address => bool)) public hasLiked;
    mapping(address => uint256[]) public userImages;
    mapping(uint256 => uint256[]) public networkImages; // 按网络ID分组图片
    uint256[] public allImageIds;

    event ImageShared(uint256 indexed id, address indexed owner, string imageHash, string text, uint256 networkId);
    event ImageLiked(uint256 indexed id, address indexed user);

    constructor(address accountNFTAddress) {
        accountNFT = AccountNFT(accountNFTAddress);
        _imageIdCounter = 0;
    }

    function shareImage(string memory imageHash, string memory text, uint256 networkId) public {
        require(accountNFT.hasAccount(msg.sender), "Must have an account NFT");

        uint256 imageId = _imageIdCounter;
        _imageIdCounter++;

        Image storage newImage = images[imageId];
        newImage.id = imageId;
        newImage.owner = msg.sender;
        newImage.imageHash = imageHash;
        newImage.text = text;
        newImage.likes = 0;
        newImage.timestamp = block.timestamp;
        newImage.networkId = networkId;

        userImages[msg.sender].push(imageId);
        allImageIds.push(imageId);
        networkImages[networkId].push(imageId); // 将图片添加到对应网络分组

        emit ImageShared(imageId, msg.sender, imageHash, text, networkId);
    }

    function likeImage(uint256 imageId) public {
        require(accountNFT.hasAccount(msg.sender), "Must have an account NFT");
        require(images[imageId].id == imageId, "Image does not exist");
        require(!hasLiked[imageId][msg.sender], "Already liked this image");

        images[imageId].likes++;
        hasLiked[imageId][msg.sender] = true;

        emit ImageLiked(imageId, msg.sender);
    }

    function getImage(uint256 imageId) public view returns (Image memory) {
        require(images[imageId].id == imageId, "Image does not exist");
        return images[imageId];
    }

    // 获取特定网络的所有图片
    function getAllImages(uint256 networkId) public view returns (Image[] memory) {
        uint256[] memory networkImageIds = networkImages[networkId];
        uint256 totalImages = networkImageIds.length;
        Image[] memory result = new Image[](totalImages);

        for (uint256 i = 0; i < totalImages; i++) {
            result[i] = images[networkImageIds[i]];
        }

        return result;
    }

    // 获取所有网络的图片（兼容旧版本）
    function getAllImages() public view returns (Image[] memory) {
        uint256 totalImages = allImageIds.length;
        Image[] memory result = new Image[](totalImages);

        for (uint256 i = 0; i < totalImages; i++) {
            result[i] = images[allImageIds[i]];
        }

        return result;
    }

    function getUserImages(address user) public view returns (Image[] memory) {
        uint256 userImageCount = userImages[user].length;
        Image[] memory result = new Image[](userImageCount);

        for (uint256 i = 0; i < userImageCount; i++) {
            result[i] = images[userImages[user][i]];
        }

        return result;
    }

    // 获取特定用户在特定网络的图片
    function getUserImages(address user, uint256 networkId) public view returns (Image[] memory) {
        uint256 userImageCount = userImages[user].length;
        uint256[] memory filteredImageIds = new uint256[](userImageCount);
        uint256 filteredCount = 0;

        // 过滤出该用户在指定网络的图片
        for (uint256 i = 0; i < userImageCount; i++) {
            uint256 imageId = userImages[user][i];
            if (images[imageId].networkId == networkId) {
                filteredImageIds[filteredCount] = imageId;
                filteredCount++;
            }
        }

        // 创建结果数组
        Image[] memory result = new Image[](filteredCount);
        for (uint256 i = 0; i < filteredCount; i++) {
            result[i] = images[filteredImageIds[i]];
        }

        return result;
    }

    function getTotalImages() public view returns (uint256) {
        return allImageIds.length;
    }

    // 获取特定网络的图片总数
    function getTotalImages(uint256 networkId) public view returns (uint256) {
        return networkImages[networkId].length;
    }
}
