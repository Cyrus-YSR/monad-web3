"use client";

import { useState, useEffect } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { IMAGE_SHARE_CONFIG } from "../lib/imageShareConfig";
import ImageCard from "../components/ImageCard";

export default function LeaderboardPage() {
  const { address, isConnected } = useAccount();

  interface ImageData {
    id: bigint;
    owner: string;
    imageHash: string;
    text: string;
    likes: bigint;
    timestamp: bigint;
  }

  const [images, setImages] = useState<ImageData[]>([]);
  const [likingImages, setLikingImages] = useState<Set<number>>(new Set());

  const { data: allImages, isLoading } = useReadContract({
    ...IMAGE_SHARE_CONFIG,
    functionName: "getAllImages",
    query: {
      enabled: true,
      refetchInterval: 5000,
    },
  });

  useEffect(() => {
    if (allImages) {
      // Sort by likes descending
      const sorted = [...allImages].sort((a, b) => {
        const diff = b.likes - a.likes;
        return Number(diff);
      });
      setImages(sorted);
    }
  }, [allImages]);

  const { writeContract } = useWriteContract();

  const handleLike = async (imageId: number) => {
    if (!isConnected || !address) return;

    setLikingImages((prev) => new Set(prev).add(imageId));

    try {
      await writeContract({
        ...IMAGE_SHARE_CONFIG,
        functionName: "likeImage",
        args: [BigInt(imageId)],
      });

      // Optimistic update
      setImages((prev) => {
        const newImages = prev.map((image) =>
          Number(image.id) === imageId
            ? { ...image, likes: image.likes + 1n }
            : image,
        );
        return newImages;
      });
    } catch (err) {
      console.error("Error liking image:", err);
    } finally {
      setLikingImages((prev) => {
        const newSet = new Set(prev);
        newSet.delete(imageId);
        return newSet;
      });
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="text-center mb-12 pt-8">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-600 mb-2">
          🏆 Hall of Fame
        </h1>
        <p className="text-gray-600 text-lg">
          Top rated moments from our community
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-500 border-t-transparent"></div>
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100 mx-auto max-w-md">
          <p className="text-gray-500 text-lg">No rankings yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
          {images.map((image, index) => (
            <div key={Number(image.id)} className="relative group">
              {/* Rank Badge */}
              <div
                className={`absolute -top-5 -left-5 z-20 w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-xl border-4 border-white transform transition-all duration-300 group-hover:scale-110 ${
                  index === 0
                    ? "bg-gradient-to-br from-yellow-400 to-yellow-600"
                    : index === 1
                      ? "bg-gradient-to-br from-slate-300 to-slate-500"
                      : index === 2
                        ? "bg-gradient-to-br from-orange-400 to-orange-600"
                        : "bg-white text-gray-400 border-gray-100 shadow-md"
                }`}
              >
                {index <= 2 ? (
                  <span>{index + 1}</span>
                ) : (
                  <span className="text-lg text-gray-500">#{index + 1}</span>
                )}
                {index === 0 && (
                  <span className="absolute -top-2 -right-2 text-xl">👑</span>
                )}
              </div>

              <div className="transform transition-transform duration-300 group-hover:-translate-y-2">
                <ImageCard
                  id={Number(image.id)}
                  owner={image.owner}
                  imageHash={image.imageHash}
                  text={image.text}
                  likes={Number(image.likes)}
                  timestamp={Number(image.timestamp)}
                  onLike={handleLike}
                  isLiking={likingImages.has(Number(image.id))}
                  userAddress={address}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
