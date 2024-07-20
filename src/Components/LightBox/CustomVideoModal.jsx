// CustomVideoModal.js
import Hls from "hls.js";
import { t } from "i18next";
import React, { useEffect, useRef } from "react";
import { FaTimes } from "react-icons/fa";
import Modal from "react-modal";

const CustomVideoModal = ({ isOpen, videoUrl, onClose }) => {
  const videoRef = useRef(null);
  useEffect(() => {
    if (isOpen && videoRef.current) {
      const video = videoRef.current;

      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(videoUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play();
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // For browsers that support HLS natively (like Safari)
        video.src = videoUrl;
        video.addEventListener('loadedmetadata', () => {
          video.play();
        });
      }
    }
  }, [isOpen, videoUrl]);

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} contentLabel="Video Modal">
      <div className="video_parent">
        <video ref={videoRef} controls className="video_controls">
          <source src={videoUrl} type="video/mp4" />
          <source src={videoUrl} type="video/webm" />
          <source src={videoUrl} type="video/ogg" />
          <source src={videoUrl} type="video/3gpp" />
          <source src={videoUrl} type="video/x-msvideo" />
          <source src={videoUrl} type="video/x-matroska" />
          <source src={videoUrl} type="video/quicktime" />
          <source src={videoUrl} type="video/x-flv" />
          {t("browser_not_support_tag")}
        </video>
        <button onClick={onClose} className="close_button">
          {" "}
          <FaTimes />
        </button>
      </div>
    </Modal>
  );
};

export default CustomVideoModal;
