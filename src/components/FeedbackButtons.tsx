import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faThumbsUp, faThumbsDown, faFileExport } from '@fortawesome/free-solid-svg-icons';
import "./css/FeedbackButtons.scss";

// Define types for the props
interface Message {
  text: string;
  timestamp: string;
}

interface FeedbackButtonsProps {
  message: Message;
  handleThumbUp: (message: Message) => void;
  handleThumbDown: (message: Message) => void;
}

const FeedbackButtons: React.FC<FeedbackButtonsProps> = ({ message, handleThumbUp, handleThumbDown }) => {

  const handleCopy = (message: Message) => {
    navigator.clipboard.writeText(message.text);
    alert('Message copied!');
  };

  const handleExport = (message: Message) => {
    // Create a blob with the message content
    const blob = new Blob([message.text], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    // Create a link element to download the file
    const link = document.createElement("a");
    link.href = url;
    link.download = `message-${message.timestamp}.txt`; // File name
    // Programmatically click the link to trigger the download
    link.click();
    // Clean up the URL object
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="feedback_buttonwrap">
      <button title="Copy" onClick={() => handleCopy(message)} style={{ marginRight: 10 }}>
        <FontAwesomeIcon icon={faCopy} />
      </button>
      <button title="Like" onClick={() => handleThumbUp(message)} style={{ marginRight: 10 }}>
        <FontAwesomeIcon icon={faThumbsUp} />
      </button>
      <button title="Dislike" onClick={() => handleThumbDown(message)} style={{ marginRight: 10 }}>
        <FontAwesomeIcon icon={faThumbsDown} />
      </button>
      <button title="Download" onClick={() => handleExport(message)}>
        <FontAwesomeIcon icon={faFileExport} />
      </button>
    </div>
  );
};

export default FeedbackButtons;
