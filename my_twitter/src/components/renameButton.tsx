"use client";

// import renameDialog from "@/components/renameDialog";
import RenameDialog from "@/components/renameDialog";
import { useState } from "react";

export default function RenameButton() {
const [ dialogOpen, setDialogOpen ] = useState(false);

  return (
    <div>
      <button
        className="flex items-center gap-2 rounded-full ml-2 p-1.5 text-start transition-colors duration-300 hover:bg-gray-200"
        // go to home page without any query params to allow the user to change their username and handle
        // see src/components/NameDialog.tsx for more details
        onClick={() => {setDialogOpen(true)}}
      >
        切換使用者
      </button>
      <RenameDialog open={dialogOpen} onClosed={()=>{setDialogOpen(false);}} />
    </div>
  );
}
