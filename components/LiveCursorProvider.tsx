"use client";

import { useMyPresence, useOthers } from "@liveblocks/react/suspense";
import React from "react"
import FollowPointer from "./FollowPointer";

const LiveCursorProvider = ({children}: {children: React.ReactNode}) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [myPresence, updateMyPresence] = useMyPresence();
    const others = useOthers();
    const handlePointerMove = (e: React.PointerEvent) => {
        const cursor = {x: Math.floor(e.pageX), y: Math.floor(e.pageY)};
        updateMyPresence({cursor});
    }
    const handlePointerLeave = () => {
        updateMyPresence({cursor: null});
    }
  return (
    <div onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>
        {others.filter((other) => other.presence.cursor !== null).map(({connectionId, presence, info}) => (
            <FollowPointer 
            key={connectionId}
            x={presence.cursor!.x}
            y={presence.cursor!.y}
            info={info}
            />
        ))}
        {children}
    </div>
  )
}
export default LiveCursorProvider