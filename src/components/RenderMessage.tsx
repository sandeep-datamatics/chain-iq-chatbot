import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatTimestamp } from "../utils/Constant";
import CarouselAttachment from "./CarouselAttachment";
import FeedbackButtons from "./FeedbackButtons";
import ListAttachment from "./ListAttachment";
import "./css/RenderMessage.scss";
import { faFile } from "@fortawesome/free-solid-svg-icons";
import React from "react";

// Define types for the props
interface Attachment {
  contentType: string;
  contentUrl: string;
  name: string;
}

interface Message {
  text: string;
  timestamp: string;
  attachmentLayout?: string;
  attachments: Attachment[];
  from: {
    id: string;
  };
}

interface RenderMessageProps {
  message: any;
  handleThumbUp: any;
  handleThumbDown: any;
  handleActionSubmit: any;
}

const RenderMessage: React.FC<RenderMessageProps> = ({ message, handleThumbUp, handleThumbDown, handleActionSubmit }) => {
  message.text = message.text || "";
  message.attachments = message.attachments || [];
  if (message.attachmentLayout === "list") {
    return <ListAttachment message={message} handleActionSubmit={handleActionSubmit} />;
  } else if (message.attachmentLayout === "carousel") {
    return <CarouselAttachment message={message} handleActionSubmit={handleActionSubmit} />;
  } else if (message.attachments && message.attachments.length > 0) {
    return (
      <>
        {message.attachments.map((attachment:any, index:number) => {
          if (attachment.contentType.startsWith("image/")) {
            return (
              <div className="attach_content_container" key={index}>
                {message.text ? <div className="chatbotContent">{message.text}</div> : ""}
                <div className="chatbot_attach_file">
                  <img
                    src={attachment.contentUrl}
                    alt={attachment.name}
                    style={{ maxWidth: "200px", borderRadius: "5px" }}
                  />
                </div>
                <div className="chatbot__activity__time">
                  {formatTimestamp(message.timestamp)}
                </div>
              </div>
            );
          } else if (attachment.contentType.startsWith("video/")) {
            return (
              <div className="attach_content_container" key={index}>
                {message.text ? <div className="chatbotContent">{message.text}</div> : ""}
                <div className="chatbot_attach_file">
                  <video
                    src={attachment.contentUrl}
                    style={{ maxWidth: "200px", borderRadius: "5px" }}
                    controls
                  />
                </div>
                <div className="chatbot__activity__time">
                  {formatTimestamp(message.timestamp)}
                </div>
              </div>
            );
          } else if (attachment.contentType.startsWith("application/")) {
            return (
              <div className="attach_content_container" key={index}>
                {message.text ? <div className="chatbotContent">{message.text}</div> : ""}
                <div className="chatbot_attach_applicationfile">
                  <FontAwesomeIcon icon={faFile} />
                  <a href={attachment.contentUrl} target="_blank" rel="noreferrer">
                    {attachment.name}
                  </a>
                </div>
                <div className="chatbot__activity__time">
                  {formatTimestamp(message.timestamp)}
                </div>
              </div>
            );
          } else {
            return (
              <div className="attach_content_container" key={index}>
                {message.text ? <div className="chatbotContent">{message.text}</div> : ""}
                <div className="chatbot_attach_applicationfile">
                  <FontAwesomeIcon icon={faFile} />
                  <a href={attachment.contentUrl} target="_blank" rel="noreferrer">
                    {attachment.name}
                  </a>
                </div>
                <div className="chatbot__activity__time">
                  {formatTimestamp(message.timestamp)}
                </div>
              </div>
            );
          }
        })}
      </>
    );
  } else {
    return (
      <>
        <div
          className="chatbotContent"
          dangerouslySetInnerHTML={{
            __html: message?.text?.toLowerCase().includes("[click here]")
              ? message.text.replace(/\[([^\]]+)\]\(([^)]+)\)/, '<a href="$2" target="_blank">$1</a>')
              : message.text || "chip Click",
          }}
        />
        {message.from.id && message.from.id.toLowerCase() === "henribotai" && (
          <FeedbackButtons
            message={message}
            handleThumbUp={handleThumbUp}
            handleThumbDown={handleThumbDown}
          />
        )}
        <div className="chatbot__activity__time">{formatTimestamp(message.timestamp)}</div>
      </>
    );
  }
};

export default RenderMessage;
