"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useTransition } from "react";
import { Button } from "./ui/button";
import { usePathname, useRouter } from "next/navigation";
import { deleteDocument } from "@/actions/actions";
import { toast } from "sonner";

const DeleteDocument = () => {
  const [isOpen, changeIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const pathName = usePathname();
  const router = useRouter();
  const handleDelete = () => {
    const roomId = pathName.split("/").pop();
    if (!roomId) return;
    startTransition(async () => {
      // delete the document
      const { success } = await deleteDocument(roomId!);
        if (success) {
            changeIsOpen(false);
            router.push("/");
            toast.success("Document deleted successfully");
        }
        else {
            // show error
            toast.error("Error deleting document");
        }
    });
    }
  return (
    <Dialog open={isOpen} onOpenChange={changeIsOpen}>
      <Button asChild variant="destructive">
        <DialogTrigger>Delete</DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete?</DialogTitle>
          <DialogDescription>
                This will delete the document and all its contents, removing all the users in the document 
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
            <Button
            type="button"
            variant={"destructive"}
            onClick={handleDelete}
            disabled={isPending}
    >{isPending? "Deleting...": "Delete"}</Button>
        <DialogClose>
            <Button type="button" variant={"secondary"}>Close</Button>
        </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default DeleteDocument;
