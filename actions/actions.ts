"use server";

import { adminDb } from "@/firebase-admin";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";


export async function createNewDocument() {

    const {sessionClaims} = await auth();
    
    if (!sessionClaims) {
        redirect("https://immense-caiman-80.accounts.dev/sign-in");
    }

    const docCollectionRef = await adminDb.collection("documents");

    const docRef = await docCollectionRef.add({
        title: "New Doc",
    });
    
    if (!sessionClaims?.email) {
        throw new Error("User email is undefined");
    }
    await adminDb.collection("users").doc(sessionClaims.email).collection("rooms").doc(docRef.id).set({
        userId: sessionClaims.email!,
        role: "owner",
        createdAt: new Date(),
        roomId: docRef.id,
    });

    return {docId: docRef.id};
}
