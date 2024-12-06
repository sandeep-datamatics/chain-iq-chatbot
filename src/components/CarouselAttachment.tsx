import React, { useState } from 'react';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import './css/CarouselAttachment.scss';

// Define interfaces for the expected props and message structure
interface Action {
  type: string;
  title?: string;
  selectAction?: { data: any };
  card?: {
    body: { type: string; size?: string; text?: string }[];
  };
}

interface Attachment {
  content: {
    body: { type: string; url?: string; selectAction?: { data: any }; size?: string; text?: string }[];
    actions?: Action[];
  };
}

interface Message {
  attachments?: Attachment[];
}

interface CarouselAttachmentProps {
  message?: Message;
  handleActionSubmit: (data: any) => void;
}

// Define breakpoints for responsiveness
const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    slidesToSlide: 3
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    slidesToSlide: 2
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1
  }
};

const CarouselAttachment: React.FC<CarouselAttachmentProps> = ({ message, handleActionSubmit }) => {
  const [openCards, setOpenCards] = useState<number[]>([]); // Array of open card indices

  const toggleShowCard = (idx: number) => {
    if (openCards.includes(idx)) {
      // Close card
      setOpenCards(openCards.filter((cardIdx) => cardIdx !== idx));
    } else {
      // Open card
      setOpenCards([...openCards, idx]);
    }
  };

  return (
    <Carousel
      swipeable={true}
      showDots={false}
      responsive={responsive}
      ssr={true}
      infinite={false}
      autoPlaySpeed={1000}
      keyBoardControl={true}
      customTransition="all .5"
      transitionDuration={500}
      containerClass="carousel-container"
      removeArrowOnDeviceType={["tablet", "mobile"]}
      dotListClass="custom-dot-list-style"
      itemClass="carousel-item-padding-40-px"
    >
      {message?.attachments?.map((attachment, index) => (
        <div className='slider__item__list' id={`attachment-${index}`} key={`attachment-${index}`}>
          <div className='slider__item__info'>
            {attachment?.content?.body?.map((element, elIndex) => {
              switch (element.type) {
                case "Image":
                  return (
                    <div key={`image-${index}-${elIndex}`} className='slider__item__image'>
                      <img
                        id={`image-${index}-${elIndex}`}
                        src={element.url}
                        alt="Product"
                        style={{ maxWidth: "100%", objectFit: "contain", height: "150px" }}
                        onClick={() => handleActionSubmit(element.selectAction?.data)}
                      />
                    </div>
                  );
                case "TextBlock":
                  return (
                    <div
                      className='slider__item__data'
                      id={`text-${index}-${elIndex}`}
                      key={`text-${index}-${elIndex}`}
                      style={{ fontSize: element.size }}
                    >
                      {element.text}
                    </div>
                  );
                default:
                  return null;
              }
            })}
          </div>
          {attachment?.content?.actions?.map((action, actIndex) => {
            if (action.type === "Action.ShowCard") {
              return (
                <div id={`action-${index}-${actIndex}`} key={`action-${index}-${actIndex}`}>
                  <button className='ac-pushButton' onClick={() => toggleShowCard(index)}>
                    {action.title}
                  </button>
                  {openCards.includes(index) && (
                    <div className='slider__item__showcardwrap' style={{ marginTop: 10 }}>
                      {action?.card?.body?.map((cardElement, cardIdx) => (
                        <div key={`card-${index}-${cardIdx}`} style={{ fontSize: cardElement.size }}>
                          {cardElement.text}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
            return null;
          })}
        </div>
      ))}
    </Carousel>
  );
};

export default CarouselAttachment;
