import React from "react";

export default function Loading() {
  return (
    <div className="h-screen w-full flex items-center justify-center fixed top-0 left-0 z-[99999] bg-fourth_color">
      <div className="loader"></div>
    </div>
  );
}
