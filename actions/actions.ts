"use server";

import { adminDb } from "@/firebase-admin";
import liveblocks from "@/lib/liveblocks";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const protectedActionsRedirectUrl = "https://immense-caiman-80.accounts.dev/sign-in"

export async function createNewDocument() {

    const {sessionClaims} = await auth();
    
    if (!sessionClaims) {
        redirect(protectedActionsRedirectUrl);
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

export async function deleteDocument(roomId: string)
{
    const {sessionClaims} = await auth();
    
    if (!sessionClaims) {
        redirect(protectedActionsRedirectUrl);
    }

    try {
        await adminDb.collection("documents").doc(roomId).delete();

        const query = await adminDb.collectionGroup("rooms").where("roomId", "==", roomId).get();

        const batch = adminDb.batch();
        query.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });

        await batch.commit();

        await liveblocks.deleteRoom(roomId);

        return {success: true};
    } catch (error) {
        console.log(error);
        return {success: false};
    }
} 

export async function inviteUserToDocument(roomId: string, email:string)
{
    const {sessionClaims} = await auth();
    
    if (!sessionClaims) {
        redirect(protectedActionsRedirectUrl);
    }
    
    
    
    try {
        
        await adminDb.collection("users").doc(email).collection("rooms").doc(roomId).set({
            userId: email,
            role: "editor",
            createdAt: new Date(),
            roomId: roomId,
        });
    
        return {success: true};
    } catch (error) {
        console.log(error);
        return {success: false};
    }
}

export async function removeUserFromDocument(roomId: string, userId: string) {
    
    const {sessionClaims} = await auth();
    
    if (!sessionClaims) {
        redirect(protectedActionsRedirectUrl);
    }

    try {
        await adminDb.collection("users").doc(userId).collection("rooms").doc(roomId).delete();
        return {success: true};
    } catch (error) {
        console.log(error);
        return {success: false};
    }
}