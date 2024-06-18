"use client";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

const path = window.location.pathname.split("chat/")[1];
console.log(path);
const socket = new WebSocket(`ws://localhost:4000/chat?roomId=${path}`); // Replace with your server URL

export default function ChatComponent(data: any) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  console.log(data);
  useEffect(() => {
    // Listen for incoming messages on the channelId
    // SUB
    // console.log("iamrunning?", path);
    socket.addEventListener("message", (message) => {
      console.log(message.data);
      const msg = JSON.parse(message.data);
      //   console.log(JSON.parse(message.data));

      if (msg.event == "chat-message") {
        console.log("???", msg);
        setMessages((prevMessages: any[]) => [...prevMessages, msg]);
      }
    });
  }, []);

  // PUB
  const sendMessage = () => {
    const payload = {
      event: "chat-message",
      content: newMessage,
      userEmail: data.data.email,
    };
    console.log(payload);
    socket.send(JSON.stringify(payload));
    setNewMessage("");
  };

  return (
    <>
      <div className="sticky top-4">
        <Card className="max-w-full flex items-center">
          <Avatar className="h-[50px] w-[50px] ml-4">
            {/* <AvatarImage src={data.data.image} alt="@shadcn" /> */}
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <CardHeader>
            <CardDescription className="font-bold text-slate-800">
              NOTE: THIS IS SHOULD BE THE CHATROOM
              {/* {data.data.name} */}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="h-screen p-8">
        {messages.map((message, index) =>
          data.data.email === message.userEmail ? (
            <div
              className="flex flex-row-reverse items-center space-x-2 text-right"
              key={index}
            >
              <Card className="max-w-md">
                <CardHeader>
                  <CardDescription>{message.content}</CardDescription>
                </CardHeader>
              </Card>
            </div>
          ) : (
            <div className="flex flex-row items-center space-x-2" key={index}>
              <Avatar className="h-[50px] w-[50px]">
                {/* <AvatarImage src={message.userProfileImage} alt="@shadcn" /> */}
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Card className="max-w-md">
                <CardHeader>
                  <CardDescription className="font-bold text-xs text-purple-800">
                    {message.userName}
                  </CardDescription>
                  <CardDescription>{message.content}</CardDescription>
                </CardHeader>
              </Card>
            </div>
          )
        )}
      </div>
      <div className="flex space-x-4 sticky bottom-8">
        <Input
          type="text"
          value={newMessage}
          placeholder="Type your message here. . ."
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <Button onClick={sendMessage}>Send</Button>
      </div>
    </>
  );
}
