"use client";

import Link from "next/link";
import { useState } from "react";

const PAGE = 5;

interface ListItem {
  slug: string;
  title: string;
  note: string;
}

export default function ShowMoreList({ items }: { items: ListItem[] }) {
  const [count, setCount] = useState(PAGE);
  const shown = items.slice(0, count);
  const hasMore = count < items.length;

  return (
    <>
      <div className="flex flex-col">
        {shown.map((item) => (
          <Link
            key={item.slug}
            href={`/work/${item.slug}`}
            className="row block"
          >
            <span className="flex flex-col gap-1 min-w-0">
              <span className="font-medium">{item.title}</span>
              <span className="opacity-[0.55] [text-wrap:pretty]">
                {item.note}
              </span>
            </span>
          </Link>
        ))}
      </div>
      {hasMore && (
        <button
          type="button"
          onClick={() => setCount((c) => c + PAGE)}
          className="self-start appearance-none bg-transparent border-0 p-0 m-0 cursor-pointer text-[13px] opacity-[0.55] underline underline-offset-[3px] hover:opacity-100"
        >
          Show more
        </button>
      )}
    </>
  );
}
