"use client";
import React, { useEffect, useState } from "react";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const path = window.location.pathname.split("chat/")[1];
const socket = new WebSocket(`ws://localhost:4000/chat?roomId=${path}`); // Replace with your server URL

export default function ChatComponent(data: any) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [highestBid, setHighestBid] = useState({ amount: 0, userEmail: "", userName: "" });
  const [newBid, setNewBid] = useState(0);
  const [auctionEnded, setAuctionEnded] = useState(false);

  useEffect(() => {
    socket.addEventListener("message", (message) => {
      try {
        const msg = JSON.parse(message.data);

        if (msg.event === "chat-message") {
          setMessages((prevMessages) => [...prevMessages, msg]);
        } else if (msg.event === "bid") {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              event: "bid",
              content: `has placed a bid of $${msg.amount}`,
              userEmail: msg.userEmail,
              userName: msg.userName,
              amount: msg.amount,
            },
          ]);

          // Update highest bid if the new bid is higher
          if (msg.amount > highestBid.amount) {
            setHighestBid({ amount: msg.amount, userEmail: msg.userEmail, userName: msg.userName });
          }
        } else if (msg.event === "auction-end") {
          setAuctionEnded(true);
        }
      } catch (error) {
        console.error("Error parsing message data:", error);
      }
    });
  }, [highestBid.amount]); // Added highestBid.amount to the dependency array

  const sendMessage = () => {
    const payload = {
      event: "chat-message",
      content: newMessage,
      userEmail: data.data.email,
      userName: data.data.name,
    };
    socket.send(JSON.stringify(payload));
    setNewMessage("");
  };

  const placeBid = () => {
    const payload = {
      event: "bid",
      amount: newBid,
      userEmail: data.data.email,
      userName: data.data.name,
    };
    socket.send(JSON.stringify(payload));
    setNewBid(0);
  };

  const endAuction = () => {
    const payload = { event: "auction-end" };
    socket.send(JSON.stringify(payload));
  };

  return (
    <>
      <div className="sticky top-4">
        <Card className="max-w-full flex items-center">
          <Avatar className="h-[50px] w-[50px] ml-4 border-2 border-indigo-500">
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <CardHeader>
            <CardDescription className="font-bold text-slate-800">
              {auctionEnded
                ? `Highest bid by ${highestBid.userEmail}: $${highestBid.amount}`
                : "Auction in Progress"}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="h-screen p-8">
        {messages.map((message, index) => (
          <div className="flex flex-row items-center space-x-2" key={index}>
            <Avatar className="h-[50px] w-[50px] border-2 border-indigo-500">
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <Card className="max-w-md">
                <CardHeader>
                  <CardDescription className="font-bold text-xs text-purple-800">
                    {message.userName}
                  </CardDescription>
                  {message.event === "chat-message" ? (
                    <CardDescription>{message.content}</CardDescription>
                  ) : (
                    <CardDescription className="text-green-600">
                      {message.content}
                    </CardDescription>
                  )}
                </CardHeader>
              </Card>
              <p className="text-xs text-gray-500">{message.userEmail}</p>
            </div>
          </div>
        ))}

        {auctionEnded && (
          <div className="mt-4 text-center">
            <h2 className="text-2xl font-bold">Auction Ended</h2>
            <p>
              Winner: {highestBid.userName} with a bid of ${highestBid.amount}
            </p>
          </div>
        )}
      </div>

      {!auctionEnded && (
        <div className="flex space-x-4 sticky bottom-8">
          <Input
            type="text"
            value={newMessage}
            placeholder="Type your message here..."
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button onClick={sendMessage}>Send</Button>
          <Input
            type="number"
            value={newBid}
            placeholder="Place your bid..."
            onChange={(e) => setNewBid(Number(e.target.value))}
          />
          <Button onClick={placeBid}>Bid</Button>
          <Button onClick={endAuction}>End Auction</Button>
        </div>
      )}
    </>
  );
}
