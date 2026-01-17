"use client";

import { useState, useEffect } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { IMAGE_SHARE_CONFIG } from "./lib/imageShareConfig";
import ImageCard from "./components/ImageCard";

export default function Home() {
  const { address, isConnected, chain } = useAccount();

  interface ImageData {
    id: bigint;
    owner: string;
    imageHash: string;
    text: string;
    likes: bigint;
    timestamp: bigint;
    networkId: bigint; // 添加networkId字段
  }

  const [images, setImages] = useState<ImageData[]>([]);
  const [likingImages, setLikingImages] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string>("");

  // 使用当前网络的ID作为networkId
  const currentNetworkId = chain?.id || 10143; // 默认使用Monad测试网ID

  // 获取特定网络的所有图片
  const { data: allImages, isLoading: isReadingImages, refetch: refetchImages } = useReadContract({
    ...IMAGE_SHARE_CONFIG,
    functionName: "getAllImages",
    args: [BigInt(currentNetworkId)], // 传递当前网络ID
    query: {
      enabled: true,
      refetchInterval: 5000,
    },
  });

  useEffect(() => {
    if (allImages) {
      setImages([...allImages].reverse());
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

      // 点赞成功后立即刷新图片数据
      await refetchImages();
    } catch (err) {
      console.error("Error liking image:", err);
      setError(
        `Error liking image: ${err instanceof Error ? err.message : String(err)}`
      );
    } finally {
      setLikingImages((prev) => {
        const newSet = new Set(prev);
        newSet.delete(imageId);
        return newSet;
      });
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Latest Moments
      </h2>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {isReadingImages ? (
        <div className="flex flex-col justify-center items-center py-20 space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          <p className="text-gray-500 font-medium">Loading amazing shots...</p>
        </div>
      ) : images.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            No images yet
          </h3>
          <p className="text-gray-500 mb-6">
            Be the first one to share a moment!
          </p>
          {isConnected && (
            <a
              href="/share"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
            >
              Share Now
            </a>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {images.map((image) => (
            <ImageCard
              key={Number(image.id)}
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
          ))}
        </div>
      )}
    </div>
  );
}
