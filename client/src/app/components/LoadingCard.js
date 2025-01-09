import React from 'react';

// components/LoadingCard.js
export default function LoadingCard() {
  return (

    <div className="min-h-screen w-full bg-gradient-to-br from-green-300 via-teal-200 to-cyan-300">
      {/* Skeleton Navbar */}
      <div className="bg-green-500 text-white p-4 shadow-md w-full animate-pulse">
        <div className="flex justify-between items-center w-full max-w-screen-xl mx-auto">
          <div className="h-6 bg-gray-300 rounded w-20"></div> {/* Logo or Brand Placeholder */}
        </div>
      </div>

      <div className="min-h-screen w-full bg-gradient-to-br from-green-300 via-teal-200 to-cyan-300 p-5">
        {/* Skeleton Content Card */}
        <div className="bg-white rounded-2xl box-border min-h-[600px] p-5 w-full sm:w-[520px] mx-auto animate-pulse ">
          <div className="h-8 bg-gray-300 rounded mb-4"></div>
          <div className="h-10 bg-gray-300 rounded mb-4"></div>
          <div className="h-10 bg-gray-300 rounded mb-4"></div>
          <div className="h-10 bg-gray-300 rounded mb-4"></div>
          <div className="h-10 bg-gray-300 rounded mb-4"></div>
          <div className="h-10 bg-gray-300 rounded mb-4"></div>
          <div className="h-12 bg-gray-300 rounded mb-4"></div>
        </div>
      </div>
    </div>

  );
}
