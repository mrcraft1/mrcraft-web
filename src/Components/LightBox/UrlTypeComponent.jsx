import React, { useState } from "react";
import Modal from "react-modal";
import CustomVideoModal from "./CustomVideoModal";
import { UrlType, getUrlType } from "../../util/Helper";
import Lightbox from "react-spring-lightbox";
import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";
Modal.setAppElement("#root"); // Important for accessibility

const UrlTypeComponent = ({ urls }) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  const handleClick = (url, type, index) => {
    try {
      if (type === UrlType.IMAGE) {
        setLightboxIndex(index);
        setIsLightboxOpen(true);
      } else if (type === UrlType.VIDEO) {
        setVideoUrl(url);
        setIsVideoModalOpen(true);
      }
    } catch (error) {
      console.error("Error handling click:", error);
    }
  };

  const renderUrls = () => {
    try {
      return urls.map((url, index) => {
        const type = getUrlType(url);
        return (
          <div key={index} onClick={() => handleClick(url, type, index)} className="parent_div">
            {type === UrlType.IMAGE ? (
              <img
                src={url}
                alt="work evidence"
              />
            ) : (
              <video className="video_data" src={url} />
            )}
          </div>
        );
      });
    } catch (error) {
      console.error("Error rendering URLs:", error);
      return null;
    }
  };

  const images = urls
    ?.filter((url) => getUrlType(url) === UrlType.IMAGE)
    ?.map((url) => ({ src: url }));

  const gotoPrevious = () => {
    // Calculate the previous index
    const newIndex = (lightboxIndex + images?.length - 1) % images?.length;
    setLightboxIndex(newIndex);
  };

  const gotoNext = () =>
    setLightboxIndex((prevIndex) => (prevIndex + 1) % images?.length);

  return (
    <div className="main-lightbox">
      <div className="all-images">{renderUrls()}</div>
      <Lightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={images}
        currentIndex={lightboxIndex}
        onPrev={gotoPrevious}
        onNext={gotoNext}
        renderPrevButton={({ canPrev, onPrev }) => (
          <button
            onClick={gotoPrevious}
            disabled={!canPrev}
            className="gallarybox_prevButton"
          >
            <FaChevronLeft />
          </button>
        )}
        renderNextButton={({ canNext, onNext }) => (
          <button
            onClick={gotoNext}
            disabled={!canNext}
            className="gallarybox_nextButton"
          >
            <FaChevronRight />
          </button>
        )}
        renderHeader={() => (
          <div className="lightbox_header">
            <p className="lightbox_pagination">
              {lightboxIndex + 1} / {images?.length}
            </p>

            <button
              onClick={() => setIsLightboxOpen(false)}
              className="lightbox_closeButton"
              aria-label="Close"
            >
              <FaTimes />
            </button>
          </div>
        )}
        className="cool-class"
        style={{ background: "#000000b3" }}
        singleClickToZoom={true}
        pageTransitionConfig={{
          // Custom react-spring config for open/close animation
          from: { opacity: 0, transform: "scale(0.5)" },
          enter: { opacity: 1, transform: "scale(1)" },
          leave: { opacity: 0, transform: "scale(0.5)" },
        }}
      />
      {isVideoModalOpen && (
        <CustomVideoModal
          isOpen={isVideoModalOpen}
          videoUrl={videoUrl}
          onClose={() => setIsVideoModalOpen(false)}
        />
      )}
    </div>
  );
};

export default UrlTypeComponent;
