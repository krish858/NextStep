import React, { useState } from "react";
import { User } from "@nextui-org/react";
import { Input, Button } from "@nextui-org/react";
import { MailIcon, Bolt } from "lucide-react";
import { FaBolt } from "react-icons/fa6";
import { IoSend } from "react-icons/io5";
import Markdown from "react-markdown";
import remarkBreaks from "remark-breaks";
// import "./AI.css";

const NextAI = () => {
  const [messages, setMessages] = useState([
    { text: "Hey there!", type: "received" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [typing, setTyping] = useState(false);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      // Add the sent message to the state
      const userMessage = { text: inputValue, type: "sent" };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setTyping(true);

      // Send message to Gemini API
      try {
        const response = await fetch("http://localhost:3005/sendReqToGemini", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Add any other necessary headers (like authentication) here
          },
          body: JSON.stringify({
            q: inputValue,
            token:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6I…DkyfQ.JTKAAvb744sTOChEqFLbqHp3LpXMjwqosYNcZwR8St4",
          }), // Adjust based on your API requirements
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setTyping(false);

        // Assuming the API returns a text response
        const receivedMessage = { text: data.answer, type: "received" };
        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
      } catch (error) {
        console.error("Error sending message:", error);
      }

      // Clear the input field
      setInputValue("");
    }
  };

  return (
    <div className="main w-full h-full flex flex-col items-center justify-center">
      <div className="header w-full h-[65px] flex items-center justify-center p-4 border-b-2 mt-1">
        <div className="left w-1/2">
          <User
            name="NextAI"
            description="Online"
            avatarProps={{
              src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
            }}
          />
        </div>
        <div className="right w-1/2"></div>
      </div>
      <div className="chatBody w-full h-[calc(100%-65px)] flex flex-col items-center justify-center">
        <div className="chats w-full h-[calc(100%-70px)] flex items-center justify-center">
          <div className="chats_main h-full w-full p-2 overflow-y-auto">
            {messages.map((msg, index) => (
              // <div key={index} className={msg.type === 'sent' ? 'sent-message' : 'received-message'}>
              //   {msg.text}
              // </div>
              <div
                key={index}
                className={`chat_wrapper min-h-fit w-full mt-1 flex ${
                  msg.type === "sent" ? " justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`chat ai bg-primary max-w-[50%] text-default-50 ${
                    msg.type === "sent"
                      ? "float-end p-2 rounded-lg rounded-br-[0]"
                      : "float-start p-2 rounded-lg rounded-bl-[0] "
                  } `}
                >
                  {msg.type === "received" ? (
                    <Markdown
                      remarkPlugins={[remarkBreaks]}
                      components={{
                        h1: ({ children }) => (
                          <h1 className="text-4xl font-extrabold mb-6">
                            {children}
                          </h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-3xl font-bold mb-5">
                            {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-2xl font-semibold mb-4">
                            {children}
                          </h3>
                        ),

                        // Add more components as needed
                      }}
                    >
                      {msg.text}
                    </Markdown>
                  ) : (
                    <span>{msg.text}</span> // Use <span> for consistency
                  )}
                </div>
              </div>
            ))}

            <div className={`loading mt-3 ${typing ? "block" : "hidden"}`}>
              <div className="typing-indicator">
                <div className="typing-circle"></div>
                <div className="typing-circle"></div>
                <div className="typing-circle"></div>
                <div className="typing-shadow"></div>
                <div className="typing-shadow"></div>
                <div className="typing-shadow"></div>
              </div>
            </div>

            {/* <div className="chat_wrapper h-fit w-full">
              <div className="chat ai bg-primary text-default-50  ">
                Helloooo...
              </div>
            </div> */}
          </div>
        </div>

        <div className="input_div w-full h-[70px] flex items-center justify-center p-4">
          <Input
            type="email"
            value={inputValue}
            onChange={handleInputChange}
            className="m-0 p-0"
            placeholder="Type here..."
            labelPlacement="outside"
            startContent={
              <FaBolt
                size={18}
                className="text-2xl text-default-400 pointer-events-none flex-shrink-0"
              />
            }
          />
          <Button
            color="primary"
            className=" m-0 min-w-fit p-5 rounded-[15px] ml-2"
            onClick={handleSendMessage}
          >
            <IoSend
              size={18}
              className="text-2xl pointer-events-none flex-shrink-0"
            />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NextAI;
