import React, { useState, useRef, useEffect } from "react";
import useDirectLine from "../services/useDirectLine"; // Import the custom hook
import RenderMessage from "./RenderMessage";
import InputBar from "./InputBar";
import "./css/ChatContainer.scss";

// Define types for message, handlers, and component props
interface Message {
    from: {
        id: string;
    };
    text: string;
}



const ChatContainer = () => {
    const secret = "SF4CLL7Oe8w.qh8jk1kw_A0rA03D-BA6AERkoal0CHhFylwt4anCGro"; // Bot secret

    // Use the DirectLine hook and extract needed values
    const {
        messages,
        isTyping,
        sendMessage,
        handleActionSubmit,
        handleThumbUp,
        handleThumbDown
    } = useDirectLine(secret);

    const chatContainerRef = useRef<HTMLDivElement | null>(null);

    // Auto-scroll to the bottom when the messages array is updated
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);
    {console.log(messages, "messages")}
    return (
        <div className="chat-container">
           
            <div ref={chatContainerRef} className="chat-body">
                {messages?.map((message: any, index: number) => (
                    <div key={index} className={`chat-message ${message.from.id === 'user' ? 'userwrap' : 'chatbotwrap'}`}>
                        <div className="chatbot__imageAvatar__image">
                            <div className="imageAvatar">
                                {message.from.id === 'user' ? (
                                    <img src="https://cdn-icons-png.flaticon.com/128/1999/1999625.png" alt="" />
                                ) : (
                                    <img src="https://chainiq-tst.outsystemsenterprise.com/ChainIQ_UILayer_SCP/img/ChainIQ_Foundation_CW.chatboaticon.png" alt="" />
                                )}
                            </div>
                        </div>
                        <div className="chatbot__layout__content">
                            <div className="">
                                <RenderMessage
                                    message={message}
                                    handleThumbUp={handleThumbUp}
                                    handleThumbDown={handleThumbDown}
                                    handleActionSubmit={handleActionSubmit}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <InputBar isTyping={isTyping} sendMessage={sendMessage} />
        </div>
    );
};

export default ChatContainer;
