"use client";

import { useRef, useState } from "react";

import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useOutsideClick } from '@/hooks/useOutsideClick';
// import { useRef } from "react";

import { Separator } from "@/components/ui/separator";
import useTweet from "@/hooks/useTweet";
import useUserInfo from "@/hooks/useUserInfo";
// import { cn } from "@/lib/utils";

// all components is src/components/ui are lifted from shadcn/ui
// this is a good set of components built on top of tailwindcss
// see how to use it here: https://ui.shadcn.com/
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useLike from "@/hooks/useLike";

export default function AddEventDialog(props: { tweets: {
  id: number;
  content: string;
  username: string;
  handle: string;
  likes: number;
  createdAt: Date | null;
  liked: boolean;
}[], open: boolean, onClosed: () => void }) {
  // const [dialogOpen, setDialogOpen] = useState(false);
  // const { dialogOpen, setDialogOpen } = props;
  const { open, onClosed, tweets } = props;
  const searchParams = useSearchParams();
  const { handle } = useUserInfo();
  const textareaRef = useRef<HTMLInputElement>(null);
  const startDateRef = useRef<HTMLInputElement>(null);
  // const startTimeRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);
  // const endTimeRef = useRef<HTMLInputElement>(null);
  const { postTweet } = useTweet();
  const [endTime, setEndTime] = useState("");
  const [startTime, setStartTime] = useState("");
  const { likeTweet } = useLike();
  const router = useRouter();

  const dialogRef = useOutsideClick(() => {
    onClosed();
  });

  // handleSave modifies the query params to set the username and handle
  // we get from the input fields. src/app/page.tsx will read the query params
  // and insert the user into the database.
  const handleSave = async () => {
    const content = textareaRef.current?.value;
    const startDate = startDateRef.current?.value;
    const endDate = endDateRef.current?.value;
    if (!content) {
      alert("請輸入活動標題");
      return;
    }
    if (!startDate || !endDate || !startTime || !endTime) {
      alert("請輸入開始與結束日期與時間");
      return;
    }
    if (!handle) return;
    let contentExisted = false;
    tweets.forEach(tweet => {
      if(tweet.content === content) {
        contentExisted = true;
      }
    });
    if(contentExisted) {
      alert("活動標題已存在，請換一個標題");
      return;
    }

    const date1 = new Date(startDate); 
    const date2 = new Date(endDate);
      
    // To calculate the time difference of two dates 
    const Difference_In_Time = date2.getTime() - date1.getTime(); 
      
    // To calculate the no. of days between two dates 
    const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24); 
    if(Difference_In_Days >= 7) {
      alert("開始與結束時間相差最多 7 天");
      return;
    }
    if(Difference_In_Days < 0 || (Difference_In_Days === 0 && (parseInt(startTime.substring(0, 2)) >= parseInt(endTime.substring(0, 2))))) {
      alert("開始時間應早於結束時間");
      return;
    }

    const startAt = startDate + " " + startTime;
    const endAt = endDate + " " + endTime;

    try {
      const postedId = await postTweet({
        handle,
        content,
        startAt,
        endAt
      });
      textareaRef.current.value = "";
      startDateRef.current.value = "";  // todo empty default
      endDateRef.current.value = "";

      await likeTweet({
        tweetId: postedId,
        userHandle: handle,
        okTime: ""
      });

      const params = new URLSearchParams(searchParams);
      router.push(`/tweet/${postedId}?${params.toString()}`);

      // startTimeRef.current.value = "";
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
    // setDialogOpen(false);
    // onClosed();
    // router.push(`${pathname}?${params.toString()}`);
    return true;
  };

  // You might notice that the dialog doesn't close when you click outside of
  // it. This is beacuse we perform some validation when the dialog closes.
  // If you pass `setDialogOpen` directly to the Dialog component, it will
  // behave like a normal dialog and close when you click outside of it.
  //
  // The Dialog component calls onOpenChange when the dialog wants to open or
  // close itself. We can perform some checks here to prevent the dialog from
  // closing if the input is invalid.
  
  return (
    <Dialog open={open}>
    {/* <Dialog open={open} onOpenChange={handleOpenChange}> */}
      <DialogContent className="sm:max-w-[425px]" ref={dialogRef}>
        <DialogHeader>
          <DialogTitle>Welcome to Join Me!</DialogTitle>
          <DialogDescription>
            新增活動標題與時間日期
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <input
            ref={textareaRef}
            className="bg-transparent outline-none placeholder:text-gray-500"
            placeholder="活動標題"
          />
          <Separator />
          <div className="flex gap-3">
            <h5>from</h5>
            <input ref={startDateRef} type="date" />
            {/* <input type="time"  /> */}
            {/* <input ref={startTimeRef} type="number" min="00" max="24" /> */}
            {/* <h5>:00</h5> */}
            
            <select onChange={(e)=>{setStartTime(e.currentTarget.value);}}>
              <option selected disabled hidden>開始時間</option> 
              {[...Array(24).keys()].map((num) => (
                <option key={num.toString()+"start"}>{String(num).padStart(2, "0") + ":00"}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3">
            <h5>to</h5>
            <input ref={endDateRef} type="date" />
            {/* <input type="time"  /> */}
            {/* <input ref={endTimeRef} type="number" min="00" max="24" /> */}
            <select onChange={(e)=>{setEndTime(e.currentTarget.value);}}>
              <option selected disabled hidden>結束時間</option> 
              {[...Array(24).keys()].map((num) => (
                <option key={num.toString()+"end"}>{String(num+1).padStart(2, "0") + ":00"}</option>
              ))}
            </select>
            {/* <h5>:00</h5> */}
          </div>
          {/* <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              placeholder="Web Programming"
              defaultValue={searchParams.get("username") ?? ""}
              className={cn(usernameError && "border-red-500", "col-span-3")}
              ref={usernameInputRef}
            />
            {usernameError && (
              <p className="col-span-3 col-start-2 text-xs text-red-500">
                Invalid username, use only{" "}
                <span className="font-mono">[a-z0-9 ]</span>, must be between 1
                and 50 characters long.
              </p>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Handle
            </Label>
            <div className="col-span-3 flex items-center gap-2">
              <span>@</span>
              <Input
                placeholder="web.prog"
                defaultValue={searchParams.get("handle") ?? ""}
                className={cn(handleError && "border-red-500")}
                ref={handleInputRef}
              />
            </div>
            {handleError && (
              <p className="col-span-3 col-start-2 text-xs text-red-500">
                Invalid handle, use only{" "}
                <span className="font-mono">[a-z0-9\._-]</span>, must be between
                1 and 25 characters long.
              </p>
            )}
          </div> */}
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>ADD</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
