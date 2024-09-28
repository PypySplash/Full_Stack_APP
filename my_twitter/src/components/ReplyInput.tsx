"use client";

import React, { useRef } from "react";

import useTweet from "@/hooks/useTweet";
import useUserInfo from "@/hooks/useUserInfo";

type ReplyInputProps = {
  replyToTweetId: number;
  replyToHandle: string;
};

export default function ReplyInput({
  replyToTweetId,
}: ReplyInputProps) {
  const { handle } = useUserInfo();
  const textareaRef = useRef<HTMLInputElement>(null);
  const { postTweet } = useTweet();

  const handleReply = async (e:React.KeyboardEvent<HTMLInputElement>) => {
    const content = textareaRef.current?.value;
    if (!content || content.length===0) return;
    if (e.keyCode !== 13) return;
    if (!handle) return;

    try {
      await postTweet({
        handle,
        content,
        replyToTweetId,
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
      alert("Error posting reply");
    }
  };

  return (
    // this allows us to focus (put the cursor in) the textarea when the user
    // clicks anywhere on the div
    <div onClick={() => textareaRef.current?.focus()}>
    <input
      ref={textareaRef}
      // wrapperClassName="col-start-2 row-start-2"
      className="border-2 border-slate-400 p-2 bg-transparent text-sm rounded outline-none placeholder:text-gray-500 w-full"
      placeholder={handle+"，你可以在此留下你的想法"}
      onKeyDown={(e) => handleReply(e)}
    />
      {/* <div className="grid grid-cols-[fit-content(48px)_1fr] gap-4 px-4 pt-4"> */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {/* <UserAvatar className="col-start-1 row-start-2 h-12 w-12" /> */}
        {/* <p className="col-start-2 row-start-1 text-gray-500">
          Replying to <span className="text-brand">@{replyToHandle}</span>
        </p> */}
        {/* <textarea
          ref={textareaRef}
          // wrapperClassName="col-start-2 row-start-2"
          className="bg-transparent text-xl outline-none placeholder:text-gray-500 w-full"
          placeholder="Tweet your reply"
          onKeyDown={(e) => handleReply(e)}
        /> */}
      {/* </div> */}
      {/* <div className="p-4 text-end">
        <button
          className={cn(
            "my-2 rounded-full bg-brand px-4 py-2 text-white transition-colors hover:bg-brand/70",
            "disabled:cursor-not-allowed disabled:bg-brand/40 disabled:hover:bg-brand/40",
          )}
          onClick={handleReply}
          disabled={loading}
        >
          Reply
        </button>
      </div> */}
    </div>
  );
}
