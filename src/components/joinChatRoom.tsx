"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function JoinChatRoomComponent() {
  const [chatRoom, setChatRoom] = useState("");

  // PUB
  const joinChatRoom = () => {
    // router.push(`/chat/${chatRoom}`);
    window.location.href = `/chat/${chatRoom}`;
    setChatRoom("");
  };
  return (
    <div className="flex w-full max-w-sm items-center space-x-2">
      <Input
        type="text"
        value={chatRoom}
        placeholder="Type your chatroom id here. . ."
        onChange={(e) => setChatRoom(e.target.value)}
      />
      <Button onClick={joinChatRoom}>Join</Button>
    </div>
  );
}
