import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Page Not Found</h1>
      <p className="text-gray-600 mb-8">
        The page you're looking for doesn't exist.
      </p>
      <Link
        href="/"
        className="text-blue-600 hover:text-blue-800 underline"
        data-testid="home-link"
      >
        Return Home
      </Link>
    </div>
  );
}
