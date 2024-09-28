"use client";

import { useEffect } from "react";

import { usePathname, useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
// import { validateHandle } from "@/lib/utils";

export default function UserName() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // const [handleError, setHandleError] = useState(false);

  useEffect(() => {
    const handle = searchParams.get("handle");
    if(!handle) {
      const handleSave = () => {
        const handle = "使用者名稱";
    
        // const newHandleError = !validateHandle(handle);
        // setHandleError(newHandleError);
    
        // if (newHandleError) {
        // if (handleError) {
        //   return false;
        // }
        const params = new URLSearchParams(searchParams);
        params.set("handle", handle!);
        params.set("username", "name");
        params.set("search", searchParams.get("search") ?? "");
        router.push(`${pathname}?${params.toString()}`);
    
        return true;
      };
      handleSave();
    }
  }, );
  return (
    <div className="bg-white px-4 align-bottom text-slate-600">{"@"+ searchParams.get("handle")}</div>
  );
}
