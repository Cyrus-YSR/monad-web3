import ImageUpload from '../components/ImageUpload';

export default function SharePage() {
  return (
    <div className="flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Share an Image</h1>
        <ImageUpload />
      </div>
    </div>
  );
}
