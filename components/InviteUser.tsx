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
import { inviteUserToDocument } from "@/actions/actions";

const InviteUser = () => {
  const [isOpen, changeIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const pathName = usePathname();
  const handleInviteUser = (e: FormEvent) => {
    e.preventDefault();

    const roomId = pathName.split("/").pop();
    if (!roomId) return;
    startTransition(async () => {
      // delete the document
      const { success } = await inviteUserToDocument(roomId, email);
      if (success) {
        changeIsOpen(false);
        setEmail("");
        toast.success("User invited successfully");
      } else {
        // show error
        toast.error("Error inviting user");
      }
    });
  };
  return (
    <Dialog open={isOpen} onOpenChange={changeIsOpen}>
      <Button asChild variant="outline">
        <DialogTrigger>Invite</DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite a user to Collaborate!</DialogTitle>
          <DialogDescription>
            Enter the email of the user that you want to invite. 
          </DialogDescription>
        </DialogHeader>
       <form onSubmit={handleInviteUser} className="flex gap-2">
        <Input 
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        />
        <Button disabled={isPending || !email} type="submit">{isPending? "Inviting...": "Invite"}</Button>
       </form>
      </DialogContent>
    </Dialog>
  );
};
export default InviteUser;
