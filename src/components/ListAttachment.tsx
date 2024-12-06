import React, { useState } from 'react';
import "./css/ListAttachment.scss";

// Define types for the props
interface Action {
  title: string;
  data: any; // The type of data can vary, so it's set to any for flexibility
}

interface Attachment {
  contentType: string;
  content: {
    actions: Action[];
  };
}

interface Message {
  attachments: Attachment[];
}

interface ListAttachmentProps {
  message: Message;
  handleActionSubmit: (data: any) => void;
}

const ListAttachment: React.FC<ListAttachmentProps> = ({ message, handleActionSubmit }) => {
  const [pressedState, setPressedState] = useState<Record<number, boolean>>({});

  const handleButtonClick = (data: any, idx: number) => {
    // Only update the state if the button hasn't been pressed before
    if (!pressedState[idx]) {
      setPressedState((prevState) => ({
        ...prevState,
        [idx]: true,
      }));
    }
    // Call the action submit function
    handleActionSubmit(data);
  };

  return (
    <>
      {message?.attachments && message.attachments.length > 0 && message.attachments.map((attachment, index) => {
        switch (attachment.contentType) {
          case "application/vnd.microsoft.card.adaptive":
            return (
              <div key={index}>
                {attachment?.content?.actions?.map((action, idx) => (
                  <button
                    type="button"
                    key={idx}
                    id={String(idx)}
                    onClick={() => handleButtonClick(action.data, idx)}
                    className="pushButton"
                    aria-label={action.title}
                    title={action.title}
                    aria-pressed={pressedState[idx] ? 'true' : 'false'}
                  >
                    {action.title}
                  </button>
                ))}
              </div>
            );
          default:
            return <div key={index}>Unsupported attachment</div>;
        }
      })}
    </>
  );
};

export default ListAttachment;
