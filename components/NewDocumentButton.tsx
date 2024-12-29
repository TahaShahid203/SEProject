"use client";

import { useTransition } from "react";
import { Button } from "./ui/button"
import { useRouter } from "next/navigation";
import { createNewDocument } from "@/actions/actions";

const NewDocumentButton = () => {

  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const handleClickNewDocument = () => {
    startTransition(async() => {
      const {docId} = await createNewDocument();
      router.push(`/document/${docId}`);

  })
  }
  return (

    <Button onClick={handleClickNewDocument} disabled={isPending}>{isPending ? 'Creating...' : 'New Document'}</Button>
  )
}
export default NewDocumentButton