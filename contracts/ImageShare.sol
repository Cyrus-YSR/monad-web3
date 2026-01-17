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
    }

    AccountNFT public accountNFT;
    uint256 private _imageIdCounter;
    mapping(uint256 => Image) public images;
    mapping(uint256 => mapping(address => bool)) public hasLiked;
    mapping(address => uint256[]) public userImages;
    uint256[] public allImageIds;

    event ImageShared(uint256 indexed id, address indexed owner, string imageHash, string text);
    event ImageLiked(uint256 indexed id, address indexed user);

    constructor(address accountNFTAddress) {
        accountNFT = AccountNFT(accountNFTAddress);
        _imageIdCounter = 0;
    }

    function shareImage(string memory imageHash, string memory text) public {
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

        userImages[msg.sender].push(imageId);
        allImageIds.push(imageId);

        emit ImageShared(imageId, msg.sender, imageHash, text);
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

    function getTotalImages() public view returns (uint256) {
        return allImageIds.length;
    }
}
