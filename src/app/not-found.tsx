import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-[660px] mx-auto px-[28px] pt-[96px] pb-[160px] flex flex-col gap-[28px]">
      <h1 className="m-0 text-[30px] font-medium leading-[1.2] tracking-[-0.01em]">
        Page not found
      </h1>
      <p className="m-0 max-w-[50ch] opacity-[0.55]">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        data-testid="home-link"
        className="text-[13px] opacity-[0.55] hover:opacity-100 self-start"
      >
        ← Chris Hacker
      </Link>
    </div>
  );
}
