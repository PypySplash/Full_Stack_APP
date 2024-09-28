"use client";
import Link from "next/link";

import { Separator } from "@/components/ui/separator";
import { useSearchParams } from "next/navigation";
import { Check } from 'lucide-react';

type TweetProps = {
  username?: string;
  handle?: string;
  id: number;
  authorName: string;
  authorHandle: string;
  content: string;
  likes: number;
  createdAt: Date;
  liked?: boolean;
};

// note that the Tweet component is also a server component
// all client side things are abstracted away in other components
export default function Tweet({
  username,
  handle,
  id,
  content,
  likes,
  liked,
}: TweetProps) {
  // const [searchText, setSearchText]
  // useEffect(() => {
  //   const search = searchParams.get("search");
  //   // if any of the username or handle is not valid, open the dialog
  //   setDialogOpen(!validateUsername(username) || !validateHandle(handle));
  // }, [searchParams]);

  const searchParams = useSearchParams();

  return (
    <div>
      <Link
        // key={id}
        style={{display: (content.includes(searchParams.get("search")!) || !searchParams.get("search"))?"block":"none"}}
        // style={{display: (content.includes(searchParams.get("search")!) || searchParams.get("search")==="null" || !searchParams.get("search"))?"block":"none"}}
        className="w-full px-4 pt-3 transition-colors hover:bg-gray-50"
        href={{
          pathname: `/tweet/${id}`,
          query: {
            username,
            handle,
          },
        }}
      >
        <div className="flex content-center break-all px-15">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <div className="w-2/3">{content}</div>
          <div className="flex w-1/3 px-4">
            <div className="">{likes > 0 ? likes : 0}人參加</div>
            {liked ? <Check className="px-1" color="green" size={30} /> : <></>}
          </div>
        </div>
      <Separator />
      </Link>
    </div>
  );
}
