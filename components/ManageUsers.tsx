"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormEvent, useState, useTransition } from "react";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { inviteUserToDocument, removeUserFromDocument } from "@/actions/actions";
import { useUser } from "@clerk/nextjs";
import { useRoom } from "@liveblocks/react";
import useOwner from "@/lib/isOwner";
import { useCollection } from "react-firebase-hooks/firestore";
import { collectionGroup, query, where } from "firebase/firestore";
import { db } from "@/firebase";

const ManageUsers = () => {
  const [isOpen, changeIsOpen] = useState(false);
  const { user } = useUser();
  const room = useRoom();
  const owner = useOwner();
  const [usersInRoom] = useCollection(
    user && query(collectionGroup(db, "rooms"), where("roomId", "==", room.id))
  );
  const [isPending, startTransition] = useTransition();
 
  const handleDelete = (userId:string) => {
    startTransition(async () => {
      // delete the document
      const { success } = await removeUserFromDocument(room.id, userId);
      if (success) {
        toast.success("User removed successfully");
      } else {
        // show error
        toast.error("Error removing user");
      }
    });
  };
  return (
    <Dialog open={isOpen} onOpenChange={changeIsOpen}>
      <Button asChild variant="outline">
        <DialogTrigger>Users {usersInRoom?.docs.length}</DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Users with Access</DialogTitle>
          <DialogDescription>
            Below is a list of users who have access to this document. 
          </DialogDescription>
        </DialogHeader>

        <hr className="my-2"/>
        <div className="flex flex-col space-y-2">
        {usersInRoom?.docs.map((doc)=>(
            <div key={doc.data().userId} className="flex justify-between items-center">
                <p className="font-light">
                {doc.data().userId === user?.emailAddresses[0].toString() ? `You ${doc.data().userId}` : doc.data().userId}
                </p>
                <div className="flex items-center gap-2">
                    <Button variant={"outline"}>{doc.data().role}</Button>

                    {owner && doc.data().userId !== user?.emailAddresses[0].toString() && 
                    (
                        <Button variant={"destructive"} onClick={() => handleDelete(doc.data().userId)} disabled={isPending} size={"sm"}>X</Button>
                    )}
                </div>
            </div>
        ))}
        </div>
  
      </DialogContent>
    </Dialog>
  );
};
export default ManageUsers;
