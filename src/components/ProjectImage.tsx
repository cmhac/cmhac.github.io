"use client";

import Image from "next/image";
import { useState } from "react";

interface ProjectImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function ProjectImage({
  src,
  alt,
  className,
}: ProjectImageProps) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return null;
  }

  // Handle both absolute and relative paths
  const imageSrc = src.startsWith("/") ? src : `/${src}`;

  return (
    <div className="relative h-48">
      <Image
        src={imageSrc}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className={`object-cover ${className || ""}`}
        priority={false}
        onError={() => setHasError(true)}
      />
    </div>
  );
}
