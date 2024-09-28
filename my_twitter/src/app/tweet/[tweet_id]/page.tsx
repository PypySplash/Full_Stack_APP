import Link from "next/link";
import { redirect } from "next/navigation";

import { eq, sql, and } from "drizzle-orm";
import {
  ArrowLeft,
} from "lucide-react";

import LikeButton from "@/components/LikeButton";
import ReplyInput from "@/components/ReplyInput";
import TimeText from "@/components/TimeText";
import TimeTable from "@/components/TimeTable";
import { Separator } from "@/components/ui/separator";
import { db } from "@/db";
import { likesTable, tweetsTable, usersTable } from "@/db/schema";

type TweetPageProps = {
  params: {
    // this came from the file name: [tweet_id].tsx
    tweet_id: string;
  };
  searchParams: {
    // this came from the query string: ?username=madmaxieee
    username?: string;
    handle?: string;
  };
};

// these two fields are always available in the props object of a page component
export default async function TweetPage({
  params: { tweet_id },
  searchParams: { username, handle },
}: TweetPageProps) {
  // this function redirects to the home page when there is an error
  const errorRedirect = () => {
    const params = new URLSearchParams();
    username && params.set("username", username);
    handle && params.set("handle", handle);
    redirect(`/?${params.toString()}`);
  };

  // if the tweet_id can not be turned into a number, redirect to the home page
  const tweet_id_num = parseInt(tweet_id);
  if (isNaN(tweet_id_num)) {
    errorRedirect();
  }

  // This is the easiest way to get the tweet data
  // you can run separate queries for the tweet data, likes, and liked
  // and then combine them in javascript.
  //
  // This gets things done for now, but it's not the best way to do it
  // relational databases are highly optimized for this kind of thing
  // we should always try to do as much as possible in the database.

  // This piece of code runs the following SQL query on the tweets table:
  // SELECT
  //   id,
  //   content,
  //   user_handle,
  //   created_at
  //   FROM tweets
  //   WHERE id = {tweet_id_num};
  const [tweetData] = await db
    .select({
      id: tweetsTable.id,
      content: tweetsTable.content,
      userHandle: tweetsTable.userHandle,
      createdAt: tweetsTable.createdAt,
      startAt: tweetsTable.startAt,
      endAt: tweetsTable.endAt,
    })
    .from(tweetsTable)
    .where(eq(tweetsTable.id, tweet_id_num))
    .execute();

  // Although typescript thinks tweetData is not undefined, it is possible
  // that tweetData is undefined. This can happen if the tweet doesn't exist.
  // Thus the destructuring assignment above is not safe. We need to check
  // if tweetData is undefined before using it.
  if (!tweetData) {
    errorRedirect();
  }

  // This piece of code runs the following SQL query on the tweets table:
  // SELECT
  //  id,
  //  FROM likes
  //  WHERE tweet_id = {tweet_id_num};
  // Since we only need the number of likes, we don't actually need to select
  // the id here, we can select a constant 1 instead. Or even better, we can
  // use the count aggregate function to count the number of rows in the table.
  // This is what we do in the next code block in likesSubquery.
  const likes = await db
    .select({
      id: likesTable.id,
    })
    .from(likesTable)
    .where(eq(likesTable.tweetId, tweet_id_num))
    .execute();

  const numLikes = likes.length;

  const [liked] = await db
    .select({
      id: likesTable.id,
    })
    .from(likesTable)
    .where(
      and(
        eq(likesTable.tweetId, tweet_id_num),
        eq(likesTable.userHandle, handle ?? ""),
      ),
    )
    .execute();

  const [user] = await db
    .select({
      displayName: usersTable.displayName,
      handle: usersTable.handle,
    })
    .from(usersTable)
    .where(eq(usersTable.handle, tweetData.userHandle))
    .execute();

  const tweet = {
    id: tweetData.id,
    content: tweetData.content,
    username: user.displayName,
    handle: user.handle,
    likes: numLikes,
    createdAt: tweetData.createdAt,
    startAt: tweetData.startAt,
    endAt: tweetData.endAt,
    liked: Boolean(liked),
  };

  // The following code is almost identical to the code in src/app/page.tsx
  // read the comments there for more info.
  const likesSubquery = db.$with("likes_count").as(
    db
      .select({
        tweetId: likesTable.tweetId,
        likes: sql<number | null>`count(*)`.mapWith(Number).as("likes"),
      })
      .from(likesTable)
      .groupBy(likesTable.tweetId),
  );

  const likedSubquery = db.$with("liked").as(
    db
      .select({
        tweetId: likesTable.tweetId,
        liked: sql<number>`1`.mapWith(Boolean).as("liked"),
      })
      .from(likesTable)
      .where(eq(likesTable.userHandle, handle ?? "")),
  );

  const replies = await db
    .with(likesSubquery, likedSubquery)
    .select({
      id: tweetsTable.id,
      content: tweetsTable.content,
      username: usersTable.displayName,
      handle: usersTable.handle,
      likes: likesSubquery.likes,
      createdAt: tweetsTable.createdAt,
      liked: likedSubquery.liked,
    })
    .from(tweetsTable)
    .where(eq(tweetsTable.replyToTweetId, tweet_id_num))
    .orderBy(tweetsTable.createdAt)
    .innerJoin(usersTable, eq(tweetsTable.userHandle, usersTable.handle))
    .leftJoin(likesSubquery, eq(tweetsTable.id, likesSubquery.tweetId))
    .leftJoin(likedSubquery, eq(tweetsTable.id, likedSubquery.tweetId))
    .execute();

    const okTimes = await db
    .select({
      okTime: likesTable.okTime,
      userHandle: likesTable.userHandle
    })
    .from(likesTable)
    .where(
      and(
        eq(likesTable.tweetId, tweet_id_num)
      )
    )
    .execute();

    const [myOkTime] = await db
    .select({
      okTime: likesTable.okTime,
      userHandle: likesTable.userHandle
    })
    .from(likesTable)
    .where(
      and(
        eq(likesTable.tweetId, tweet_id_num),
        eq(likesTable.userHandle, handle ?? "")
      )
    )
    .execute();

  return (
    <>
      <div className="flex h-screen w-full max-w-7xl flex-col overflow-scroll pt-2">
        <div className="mb-2 flex items-center gap-8 px-4">
          <Link href={{ pathname: "/", query: { username, handle, search:"" } }}>
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-xl font-bold">Join Event</h1>
        </div>
        <div className="flex flex-col px-4 pt-3">
          {/* <div className="flex justify-between">
            <div className="flex w-full gap-3"> */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {/* <img
                src={getAvatar(tweet.username)}
                alt="user avatar"
                width={48}
                height={48}
                className="h-12 w-12 rounded-full"
              />
              <div>
                <p className="font-bold">{tweet.username ?? "..."}</p>
                <p className="font-normal text-gray-500">
                  @{tweet.handle ?? "..."}
                </p>
              </div>
            </div>
            <button className="h-fit rounded-full p-2.5 text-gray-400 transition-colors duration-300 hover:bg-brand/10 hover:text-brand">
              <MoreHorizontal size={16} />
            </button>
          </div> */}
          <article className="mt-3 whitespace-pre-wrap text-xl font-bold">
            {tweet.content}
          </article>
          <div className="flex ">
            <article className="mt-3 whitespace-pre-wrap w-4/5">
            {tweet.likes > 0 ? tweet.likes : 0} 人參加            
          </article>
          <LikeButton
              handle={handle}
              initialLikes={tweet.likes}
              initialLiked={tweet.liked}
              tweetId={tweet.id}
            />
          </div>
          
          <article className="mt-3 whitespace-pre-wrap">
            {"from "+tweet.startAt+" to "+tweet.endAt}
          </article>
          <time className="my-4 block text-sm text-gray-500">
            <TimeText date={tweet.createdAt} format="h:mm A · D MMM YYYY" />
          </time>
          {/* <Separator />
          <div className="my-2 flex items-center justify-between gap-4 text-gray-400">
            <button className="rounded-full p-1.5 transition-colors duration-300 hover:bg-brand/10 hover:text-brand">
              <MessageCircle size={20} className="-scale-x-100" />
            </button>
            <button className="rounded-full p-1.5 transition-colors duration-300 hover:bg-brand/10 hover:text-brand">
              <Repeat2 size={22} />
            </button>
            <button className="rounded-full p-1.5 transition-colors duration-300 hover:bg-brand/10 hover:text-brand">
              <Share size={18} />
            </button>
          </div>
          <Separator /> */}
        </div>
        <Separator />
          
            <div className="flex justify-self-center py-5">
              <div className="px-4 py-5 pr-10 w-3/5">
              {liked ? <ReplyInput replyToTweetId={tweet.id} replyToHandle={tweet.handle} /> : <h1 className="font-bold text-xl">參加活動來加入討論吧</h1>}
              {/* <ReplyInput replyToTweetId={tweet.id} replyToHandle={tweet.handle} /> */}
              <div className="py-1"></div>
              {replies.map((reply,i) => (

                <div key={"reply"+i.toString()} className="flex flex-col gap-1">
                  <div className="flex content-end break-all">
                    <div className="w-2/12">
                    {reply.handle+"："}
                    </div>
                    <div className="w-7/12 px-3">
                    {reply.content}
                    </div>
                    <div className="3/12">
                    <time className="my-1 block text-sm text-gray-500">
                    <TimeText date={reply.createdAt} format="h:mm A · D MMM YYYY" />
                  </time>
                    </div>
                    {/* <div className="w-1/2">
                      <Typography className="text-start" variant="h6">
                        Link
                      </Typography>
                    </div> */}
                  </div>
                </div>
                    
                // <div className="flex gap-3">
                //   <div>{reply.handle+"："}</div>
                //   <div className="w-7/12">{reply.content}</div>
                //   <time className="my-1 block text-sm text-gray-500">
                //     <TimeText date={reply.createdAt} format="h:mm A · D MMM YYYY" />
                //   </time>
                //   {/* {reply.handle+"："+reply.content+" "+reply.createdAt} */}
                // </div>
                // <Tweet
                //   key={reply.id}
                //   id={reply.id}
                //   username={username}
                //   handle={handle}
                //   authorName={reply.username}
                //   authorHandle={reply.handle}
                //   content={reply.content}
                //   likes={reply.likes}
                //   liked={reply.liked}
                //   createdAt={reply.createdAt!}
                // />
              ))}
            </div>
            <TimeTable 
            okTimes={okTimes} 
            // startAt={tweet.startAt ?? ""} 
            // endAt={tweet.endAt ?? ""}
            startDate={(tweet.startAt ?? "").split(" ")[0]}
            days={((new Date((tweet.endAt ?? " ").split(" ")[0]).getTime())-(new Date((tweet.startAt ?? " ").split(" ")[0]).getTime()))/ (1000 * 3600 * 24) + 1}
            startI={parseInt((tweet.startAt ?? " ").split(" ")[1].split(":")[0])}
            endI={parseInt((tweet.endAt ?? " ").split(" ")[1].split(":")[0])}
            myOkTime={(liked) ? (myOkTime.okTime ?? "") : ""} tweetId={tweet.id} liked={tweet.liked} handle={handle ?? ""} />
          </div>
      </div>
    </>
  );
}
