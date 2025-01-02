"use client";

import { useEffect, useState, useTransition } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";
import Editor from "./Editor";
import useOwner from "@/lib/isOwner";
import DeleteDocument from "./DeleteDocument";
import InviteUser from "./InviteUser";

const Document = ({ id }: { id: string }) => {
  const isOwner = useOwner();
  const [data] = useDocumentData(doc(db, "documents", id));
  const [input, setInput] = useState("");
  const [updating, startTransition] = useTransition();
  useEffect(() => {
    if (data) {
      setInput(data.title);
    }
  }, [data]);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      startTransition(async () => {
        // update the document
        await updateDoc(doc(db, "documents", id), {
          title: input,
        });
      });
    }
  };
  return (
    <div className="flex-1 h-full bg-white p-5">
      <div className="flex max-w-6xl mx-auto justify-between pb-5">
        {/* update the title */}
        <form onSubmit={handleUpdate} className="flex flex-1 space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="bg-white"
          />

          <Button type="submit" disabled={updating}>
            {updating ? "Updating..." : "Update"}
          </Button>
          {/* if isOwner Then Invite User, Delete Document */}
          {isOwner && (
            // Invite User
            <>
              <InviteUser />
              <DeleteDocument />
            </>
          )}
        </form>
      </div>
      <div>
        {/* manage users */}
        {/* avatars */}
      </div>
      {/* collaborative editor */}
      <Editor />
    </div>
  );
};
export default Document;
