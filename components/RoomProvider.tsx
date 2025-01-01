"use client";
import {
  RoomProvider as RoomProviderBase,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import LoadingSpinner from "./LoadingSpinner";
import LiveCursorProvider from "./LiveCursorProvider";

const RoomProvider = ({
  children,
  roomId,
}: {
  children: React.ReactNode;
  roomId: string;
}) => {
  return (
    <RoomProviderBase
      id={roomId}
      initialPresence={{
        cursor: null,
      }}
    >
      
      <ClientSideSuspense fallback={<LoadingSpinner/>}>
      <LiveCursorProvider>
        {children}
      </LiveCursorProvider>
      </ClientSideSuspense>
    </RoomProviderBase>
  );
};
export default RoomProvider;
