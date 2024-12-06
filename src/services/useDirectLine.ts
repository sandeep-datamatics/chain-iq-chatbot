import { useState, useEffect, useRef } from "react";
import { DirectLine, Activity } from "botframework-directlinejs";

interface Message {
  from: {
    id: string;
    name: string;
  };
  text: string;
  timestamp: Date;
  id?: string; // Optional ID for messages
}

interface UseDirectLineReturn {
  messages: Message[];
  isTyping: boolean;
  sendMessage:any;
  handleActionSubmit: any;
  handleThumbUp: any;
  handleThumbDown: any;
}

const useDirectLine = (secret: string): UseDirectLineReturn => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const directLine = useRef<DirectLine | null>(null);

  useEffect(() => {
    // Initialize DirectLine with your secret
    directLine.current = new DirectLine({ secret });

    console.log(directLine.current, "directLine.current");

    // Listen for incoming messages
    const messageSubscription = directLine.current.activity$
      .filter((activity: Activity) => activity.type === "message")
      .subscribe((activity: Activity) => {
        if (activity.from.name) {
          setMessages((prevMessages: any) => [
            ...prevMessages,
            { ...activity, timestamp: new Date() }
          ]);
        }
        console.log(activity, "activity");
        setIsTyping(false); // Stop typing when a message is received
      });

    // Listen for typing indication
    const typingSubscription = directLine.current.activity$
      .filter((activity: Activity) => activity.type === "typing")
      .subscribe(() => {
        setIsTyping(true);
      });

    // Send a welcome event to trigger the bot's welcome message
    const sendWelcomeEvent = () => {
      const customEvent: any = {
        name: "customEvent",
        type: "event",
        value: {
          token: ""
        },
        from: {
          id: "user", // You can dynamically generate or assign based on the user session
          name: "User",
          role: "user"
        }
      };

      directLine.current?.postActivity(customEvent).subscribe(
        (id) => console.log("Custom welcome event sent, ID:", id),
        (error) => console.error("Failed to send custom welcome event", error)
      );
    };

    // Call the welcome event after DirectLine initializes
    sendWelcomeEvent();

    // Cleanup subscriptions and close DirectLine connection on component unmount
    return () => {
      messageSubscription.unsubscribe();
      typingSubscription.unsubscribe();
      if (directLine.current) {
        directLine.current.end(); // Close the DirectLine connection
        console.log("directLine.end", directLine.current);
      }
    };
  }, [secret]);

  const sendMessage = (
    input: string,
    selectedFile: File | null,
    setFilePreview: (preview: string) => void,
    setSelectedFile: (file: File | null) => void,
    fileInputRef: React.RefObject<HTMLInputElement>
  ) => {
    if (input.trim() || selectedFile) {
      const activity: Activity = {
        from: { id: "user", name: "User" },
        type: "message",
        text: input
      };

      // Handle file attachment if present
      if (selectedFile) {
        const reader = new FileReader();
        reader.onload = () => {
          const base64File = (reader.result as string).split(",")[1]; // Extract base64 data
          activity.attachments = [
            {
              contentType: selectedFile.type,
              contentUrl: `data:${selectedFile.type};base64,${base64File}`,
              name: selectedFile.name
            }
          ];

          // Send the activity with the file attachment
          directLine.current?.postActivity(activity).subscribe(
            (id) => console.log("Message sent with attachment, ID:", id),
            (error) => console.error("Failed to send message with attachment", error)
          );
        };
        reader.readAsDataURL(selectedFile);
      } else {
        // Send the activity without an attachment
        directLine.current?.postActivity(activity).subscribe(
          (id) => console.log("Message sent, ID:", id),
          (error) => console.error("Failed to send message", error)
        );
      }

      // Clear the file input and preview after sending
      setSelectedFile(null);
      setFilePreview("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleActionSubmit = (data:any) => {
    directLine.current?.postActivity({
      from: { id: "user", name: "" },
      type: "message",
      value: data, // Send the action data to the bot
    }).subscribe();
  };

  const handleThumbUp = (message: Message) => {
    directLine.current?.postActivity({
      from: { id: "user", name: "User" },
      type: "event",
      name: "feedback",
      value: {
        messageId: message.id,
        feedback: "like"
      }
    }).subscribe(
      () => console.log("Thumbs up clicked for message:", message),
      (error) => console.error("Failed to send feedback", error)
    );
  };

  const handleThumbDown = (message: Message) => {
    directLine.current?.postActivity({
      from: { id: "user", name: "User" },
      type: "event",
      name: "feedback",
      value: {
        messageId: message.id,
        feedback: "dislike"
      }
    }).subscribe(
      () => console.log("Thumbs down clicked for message:", message),
      (error) => console.error("Failed to send feedback", error)
    );
  };

  return { messages, isTyping, sendMessage, handleActionSubmit, handleThumbUp, handleThumbDown };
};

export default useDirectLine;
