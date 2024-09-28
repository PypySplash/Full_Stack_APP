import { useState } from "react";

import { useRouter } from "next/navigation";

export default function useTweet() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const postTweet = async ({
    handle,
    content,
    replyToTweetId,
    startAt,
    endAt
  }: {
    handle: string;
    content: string;
    replyToTweetId?: number;
    startAt?: string;
    endAt?: string;
  }) => {
    setLoading(true);

    const res = await fetch("/api/tweets", {
      method: "POST",
      body: JSON.stringify({
        handle,
        content,
        replyToTweetId,
        startAt,
        endAt
      }),
    });

    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }
    const resJson = await res.json();
    const tweetId = resJson.message;

    // router.refresh() is a Next.js function that refreshes the page without
    // reloading the page. This is useful for when we want to update the UI
    // from server components.
    router.refresh();
    setLoading(false);
    return tweetId;
  };

  return {
    postTweet,
    loading
  };
}
