"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

export default function SearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();


  const handleSearch = (e:React.ChangeEvent<HTMLInputElement> ) => {
    const params = new URLSearchParams(searchParams);
    const username = searchParams.get("username");
    const handle = searchParams.get("handle");
    params.set("username", username!);
    params.set("handle", handle!);
    params.set("search", !e.target.value?"":e.target.value);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <input className="border-2 border-slate-400 p-1 mt-1 bg-transparent text-sm rounded outline-none placeholder:text-gray-500 w-full" type="text" onChange={handleSearch} placeholder="search..." />
  );
}
