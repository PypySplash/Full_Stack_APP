"use client";

import { useRef } from "react";

import UserAvatar from "@/components/UserAvatar";
import { Separator } from "@/components/ui/separator";
import useTweet from "@/hooks/useTweet";
import useUserInfo from "@/hooks/useUserInfo";
import { cn } from "@/lib/utils";

export default function TweetInput() {
  const { handle } = useUserInfo();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const startDateRef = useRef<HTMLInputElement>(null);
  const startTimeRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);
  const endTimeRef = useRef<HTMLInputElement>(null);
  const { postTweet, loading } = useTweet();

  const handleTweet = async () => {
    const content = textareaRef.current?.value;
    const startDate = startDateRef.current?.value;
    const startTime = startTimeRef.current?.value;
    const endDate = endDateRef.current?.value;
    const endTime = endTimeRef.current?.value;
    if (!content || !startDate || !endDate || !startTime || !endTime) return;
    if (!handle) return;
    const startAt = startDate+" "+String(startTime).padStart(2, "0")+":00";
    const endAt = endDate+" "+String(endTime).padStart(2, "0")+":00";

    try {
      await postTweet({
        handle,
        content,
        startAt,
        endAt
      });
      textareaRef.current.value = "";
      // this triggers the onInput event on the growing textarea
      // thus triggering the resize
      // for more info, see: https://developer.mozilla.org/en-US/docs/Web/API/Event
      textareaRef.current.dispatchEvent(
        new Event("input", { bubbles: true, composed: true }),
      );
    } catch (e) {
      console.error(e);
      alert("Error posting tweet");
    }
  };

  return (
    // <div className="flex gap-4" onClick={() => textareaRef.current?.focus()}>
    <div className="flex gap-4">
      <UserAvatar className="h-12 w-12" />
      <div className="flex w-full flex-col px-2">
        {/* <button className="flex w-fit items-center rounded-full border-[1px] border-gray-300 px-2 text-sm font-bold text-brand">
          Everyone
          <ChevronDown size={16} className="text-gray-300" />
        </button> */}
        <div className="mb-2 mt-6">
          <textarea
            ref={textareaRef}
            className="bg-transparent outline-none placeholder:text-gray-500"
            placeholder="What's happening?"
          />
        </div>
        <Separator />
        <div className="flex">
          <h5>start time</h5>
          <input ref={startDateRef} type="date" />
          {/* <input type="time"  /> */}
          <input ref={startTimeRef} type="number" min="00" max="24" />
          <h5>:00</h5>
        </div>
        <div className="flex">
          <h5>end time</h5>
          <input ref={endDateRef} type="date" />
          {/* <input type="time"  /> */}
          <input ref={endTimeRef} type="number" min="00" max="24" />
          <h5>:00</h5>
        </div>
        <div className="flex justify-end">
          <button
            className={cn(
              "my-2 rounded-full bg-brand px-4 py-2 text-white transition-colors hover:bg-brand/70",
              "disabled:cursor-not-allowed disabled:bg-brand/40 disabled:hover:bg-brand/40",
            )}
            onClick={handleTweet}
            disabled={loading}
          >
            Tweet
          </button>
        </div>
      </div>
    </div>
  );
}
