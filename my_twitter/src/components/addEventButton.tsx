"use client";

import AddEventDialog from "@/components/addEventDialog";
import { useState } from "react";

export default function AddEventButton(props: { tweets: {
  id: number;
  content: string;
  username: string;
  handle: string;
  likes: number;
  createdAt: Date | null;
  liked: boolean;
}[]}) {
  const [ dialogOpen, setDialogOpen ] = useState(false);
  const { tweets } = props;
  return (
    <div>
      <button
        className="flex items-center gap-2 rounded-full p-1.5 ml-3 text-start transition-colors duration-300 hover:bg-gray-200"
        // go to home page without any query params to allow the user to change their username and handle
        // see src/components/NameDialog.tsx for more details
        onClick={() => {setDialogOpen(true)}}
      >
        新增
      </button>
      <AddEventDialog tweets={tweets} open={dialogOpen} onClosed={()=>{setDialogOpen(false)}} />
    </div>
  );
}
