import React from 'react'

const CommandSpeech = (resetTranscript) => {
  return (
    [
      {
        command: "open *",
        callback: (website) => {
          resetTranscript();
          window.open("http://" + website.split(" ").join(""));
        }
      },
      {
        command: "change background colour to *",
        callback: (color) => {
          document.body.style.background = color;
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
        },
      },
    ]
  )
}

export default CommandSpeech