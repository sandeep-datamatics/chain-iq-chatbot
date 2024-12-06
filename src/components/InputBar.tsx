import React, { useCallback, useEffect, useRef, useState } from "react";
import './css/InputBar.scss';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone, faMicrophoneSlash, faPaperclip, faPaperPlane, faCircleXmark, faFile } from '@fortawesome/free-solid-svg-icons';
import detectCountryLanguage from "../services/detectCountryLanguage";
import { useTranslation } from 'react-i18next';
import i18n from "../utils/languages/i18n";

// Define the props type
interface InputBarProps {
  sendMessage: (input: string, selectedFile: File | null, setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>, setFilePreview: React.Dispatch<React.SetStateAction<string>>, fileInputRef: React.RefObject<HTMLInputElement>) => void;
  isTyping: boolean;
}

// Define the command type for speech recognition
interface Command {
  command: string;
  callback: (value: string) => void;
}

const InputBar: React.FC<InputBarProps> = ({ sendMessage, isTyping }) => {
  const { t } = useTranslation();
  const [language, setLanguage] = useState<string>(i18n.language || 'en');
  const [input, setInput] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null); // Reference to text input

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition({
    commands: [
      {
        command: "open *",
        callback: (website: string) => {
          resetTranscript();
          window.open("http://" + website.split(" ").join(""));
        }
      },
      {
        command: "change background colour to *",
        callback: (color: string) => {
          document.body.style.background = color;
          resetTranscript();
        }
      },
      {
        command: "reset",
        callback: () => {
          resetTranscript();
        }
      },
      {
        command: "reset background colour",
        callback: () => {
          document.body.style.background = `rgba(0, 0, 0, 0.8)`;
          resetTranscript();
        }
      }
    ] as Command[]
  });

  useEffect(() => {
    detectCountryLanguage(setLanguage);
  }, []);

  const handleChangeLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);
    i18n.changeLanguage(selectedLanguage);
  };

  useEffect(() => {
    if (!listening && transcript?.trim()) {
      handleSendMessage(); // Trigger sendMessage when user stops listening
    }
  }, [listening, transcript]);

  useEffect(() => {
    setInput(transcript); // Update the input field with the voice transcription
  }, [transcript]);

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      alert("Your browser does not support speech recognition.");
    }
  }, [browserSupportsSpeechRecognition]);

  const handleSendMessage = useCallback(() => {
    if (input.trim() || selectedFile) {
      sendMessage(input, selectedFile, setSelectedFile, setFilePreview, fileInputRef);
      setInput(""); // Clear input field after sending
      resetTranscript(); // Reset the transcript after sending
    }
  }, [input, sendMessage, selectedFile, resetTranscript]);

  const toggleListening = useCallback(() => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ continuous: false });
    }
  }, [listening]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        e.preventDefault();
        setInput(prevText => prevText + '\n');
      } else {
        e.preventDefault();
        handleSendMessage();
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);

      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result as string); // Show image preview
        };
        reader.readAsDataURL(file);
      } else if (file.type.startsWith("video/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result as string); // Show video preview
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(file.name); // Show file name for non-image files
      }
    }
    inputRef.current?.focus();
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFilePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    inputRef.current?.focus();
  };

  return (
    <div className="inputboxwrap">
      {isTyping && <div className="bottyping">{t('bot_typing')}</div>}

      <div className="inputbox_container">
        <div className="input_textarea" onClick={() => inputRef.current?.focus()}>
          {filePreview && (
            <div className="file_preview">
              {selectedFile?.type.startsWith("image/") ? (
                <img className="file_preview_image" src={filePreview} alt="ImagePreview" />
              ) : selectedFile?.type.startsWith("video/") ? (
                <video autoPlay muted className="file_preview_video" src={filePreview} />
              ) : (
                <div className="file_preview_attachment">
                  <FontAwesomeIcon icon={faFile} /> <span>{filePreview}</span>
                </div>
              )}
              <div className="remove_attach_file" onClick={removeFile}>
                <FontAwesomeIcon icon={faCircleXmark} />
              </div>
            </div>
          )}
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="chat_input_search"
            placeholder={t('input_placeholder')}
            lang={language}
          />
        </div>

        <div className="inputbottom_controls">
          <div className="language_selector">
            <select value={language} onChange={handleChangeLanguage}>
              <option value="en">English</option>
              <option value="de">German</option>
              <option value="it">Italian</option>
              <option value="fr">French</option>
            </select>
          </div>

          <div className="input_attach">
            <input ref={fileInputRef} type="file" onChange={handleFileChange} />
            <button className="commoncontrolbtn">
              <FontAwesomeIcon icon={faPaperclip} />
            </button>
          </div>

          <button title="Microphone" className="commoncontrolbtn voice_microphone" onClick={toggleListening}>
            {listening ? <FontAwesomeIcon icon={faMicrophoneSlash} /> : <FontAwesomeIcon icon={faMicrophone} />}
          </button>

          <button title="Send" className="commoncontrolbtn sendbutton" onClick={handleSendMessage}>
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputBar;
