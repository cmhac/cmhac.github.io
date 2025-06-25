import Image from "next/image";

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
  return (
    <div className="relative h-48">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className={`object-cover ${className || ""}`}
      />
    </div>
  );
}
