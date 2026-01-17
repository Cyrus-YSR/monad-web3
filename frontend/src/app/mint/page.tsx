import MintNFT from "../components/MintNFT";

export default function MintPage() {
  return (
    <div className="flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Create Account NFT
        </h1>
        <MintNFT />
      </div>
    </div>
  );
}
