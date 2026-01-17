"use client";

import { useState, useEffect } from "react";
import { IPFS_CONFIG } from "../lib/ipfsConfig";
import { useReadContract } from "wagmi";
import { IMAGE_SHARE_CONFIG } from "../lib/imageShareConfig";

interface ImageCardProps {
  id: number;
  owner: string;
  imageHash: string;
  text: string;
  likes: number;
  timestamp: number;
  onLike: (imageId: number) => void;
  isLiking: boolean;
  userAddress?: string;
}

export default function ImageCard({
  id,
  owner,
  imageHash,
  text,
  likes: initialLikes,
  timestamp,
  onLike,
  isLiking,
  userAddress,
}: ImageCardProps) {
  const [formattedDate, setFormattedDate] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [likes, setLikes] = useState(initialLikes);

  // Read like status from contract
  const { data: hasLikedOnChain } = useReadContract({
    ...IMAGE_SHARE_CONFIG,
    functionName: "hasLiked",
    args: [BigInt(id), userAddress as `0x${string}`],
    query: {
      enabled: !!userAddress,
    },
  });

  const isLiked = !!hasLikedOnChain;

  useEffect(() => {
    setLikes(initialLikes);
  }, [initialLikes]);

  useEffect(() => {
    const date = new Date(Number(timestamp) * 1000);
    setFormattedDate(date.toLocaleString());
  }, [timestamp]);

  useEffect(() => {
    setImageUrl(IPFS_CONFIG.getIpfsGatewayUrl(imageHash));
  }, [imageHash]);

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden mb-6 border border-gray-100">
      <div className="p-4 flex items-center justify-between border-b border-gray-50 bg-gray-50/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-sm">
            <span className="font-bold text-sm">{owner.slice(0, 2)}</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">
              {owner.slice(0, 6)}...{owner.slice(-4)}
            </p>
            <p className="text-xs text-gray-500">{formattedDate}</p>
          </div>
        </div>
      </div>

      <div className="relative aspect-video bg-gray-100">
        <img
          src={imageUrl}
          alt={text}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://via.placeholder.com/600x400?text=Image+Not+Available";
          }}
        />
      </div>

      <div className="p-5">
        <p className="text-gray-700 mb-4 text-base leading-relaxed">{text}</p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          <button
            onClick={() => onLike(id)}
            disabled={isLiking || isLiked}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
              isLiked
                ? "bg-pink-50 text-pink-600 cursor-default"
                : "bg-gray-100 text-gray-600 hover:bg-pink-50 hover:text-pink-600"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill={isLiked ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`w-5 h-5 ${isLiked ? "scale-110" : ""} transition-transform`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
            <span className="font-medium">{likes} Likes</span>
          </button>
        </div>
      </div>
    </div>
  );
}
