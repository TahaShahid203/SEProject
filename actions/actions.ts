"use server";

import { adminDb } from "@/firebase-admin";
import { auth } from "@clerk/nextjs/server";

export async function createNewDocument() {
    auth.protect();

    const {sessionClaims} = await auth();
    console.log("1");

    const docCollectionRef = await adminDb.collection("documents");

    console.log("2");
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
