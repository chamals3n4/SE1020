import React from "react";
import { Heart } from "lucide-react";

const WeddingHeader = () => {
  return (
    <div className="relative w-full py-6 flex flex-col items-center justify-center overflow-hidden">
      {/* Top decorative elements */}
      <div className="absolute top-0 left-0 w-24 h-24 opacity-20 -rotate-45">
        <div className="w-full h-full border-t-2 border-l-2 border-wedding-rose rounded-tl-3xl"></div>
      </div>
      <div className="absolute top-0 right-0 w-24 h-24 opacity-20 rotate-45">
        <div className="w-full h-full border-t-2 border-r-2 border-violet-500 rounded-tr-3xl"></div>
      </div>

      {/* Heart icon */}
      <Heart className="text-violet-500 w-10 h-10 animate-heart-beat mb-2" />

      {/* Title */}
      <h1 className="font-serif text-4xl font-light text-gray-800 tracking-wider mb-1">
        Forever <span className="text-violet-500">&</span> Always
      </h1>

      {/* Subtitle */}
      <div className="flex items-center gap-3 text-sm text-gray-600 tracking-widest">
        <span className="inline-block w-12 h-px bg-gray-400"></span>
        <span>BEGIN YOUR JOURNEY</span>
        <span className="inline-block w-12 h-px bg-gray-400"></span>
      </div>
    </div>
  );
};

export default WeddingHeader;
