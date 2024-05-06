import React, { useCallback, useRef, useState } from "react";
import "../styles/SideBar.css";
import { useCropDim, useImage, useSetCropDim, useSetImage } from "../store";
import { FaExchangeAlt } from "react-icons/fa";

const SideBar = () => {
  const cropDim = useCropDim();
  const setCropDim = useSetCropDim();
  const image = useImage();
  const setImage = useSetImage()
  const [showMessage, setShowMessage] = useState(false);
  const validateValue = (value) => {
    const parsedValue = Math.abs(parseInt(value));
    return isNaN(parsedValue) ? 0 : parsedValue;
  };

  const handleScroll = useCallback(
    (e, key) => {
      e.preventDefault();
      const delta = Math.sign(e.deltaY) * -10;
      const newValue = Math.max(0, parseInt(cropDim[key]) + delta);
      const x1 = key === "x1" ? newValue : cropDim.x1;
      const x2 = key === "x2" ? newValue : cropDim.x2;
      const y1 = key === "y1" ? newValue : cropDim.y1;
      const y2 = key === "y2" ? newValue : cropDim.y2;
      if (x1 < x2 - 1 && y1 < y2 && x2 <= image.width && y2 <= image.height) {
        setCropDim({ x1, x2, y1, y2 });
      }
    },
    [cropDim, image.width, image.height, setCropDim]
  );

  const handleChange = (e, key) => {
    const newValue = validateValue(e.target.value);
    const x1 = key === "x1" ? newValue : cropDim.x1;
    const x2 = key === "x2" ? newValue : cropDim.x2;
    const y1 = key === "y1" ? newValue : cropDim.y1;
    const y2 = key === "y2" ? newValue : cropDim.y2;
    if (x1 < x2 - 1 && y1 < y2 && x2 <= image.width && y2 <= image.height) {
      setCropDim({ x1, x2, y1, y2 });
    }
  };

  const cropImage = () => {
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 3000);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const { x1, x2, y1, y2 } = cropDim;

    canvas.width = x2 - x1;
    canvas.height = y2 - y1;

    ctx.drawImage(
      image,
      x1,
      y1,
      x2 - x1,
      y2 - y1, // source rectangle
      0,
      0,
      x2 - x1,
      y2 - y1 // destination rectangle
    );

    const croppedImageData = canvas.toDataURL();

    const downloadLink = document.createElement("a");
    downloadLink.href = croppedImageData;
    downloadLink.download =
      "croppy-" +
      new Date().toISOString().slice(0, 10).replaceAll("-", "") +
      "_" +
      new Date()
        .toLocaleTimeString("en-US", { hour12: false })
        .replaceAll(":", "") +
      ".png";
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };
  return (
    <div className="side-bar">
      <div className="crop-dim-container">
        {["x1", "x2", "y1", "y2"].map((key) => (
          <input
          title={key.toUpperCase()}
            key={key}
            placeholder={key.toUpperCase()}
            value={cropDim[key]}
            onChange={(e) => handleChange(e, key)}
            onWheel={(e) => handleScroll(e, key)}
            min={0}
            max={key.startsWith("x") ? image.width : image.height}
          />
        ))}
      </div>
      {showMessage && (
        <div className="message">Cropped Image Saved Successfully!</div>
      )}
      <div className="save-btn-container">
        <button className="save-btn" onClick={cropImage} title="Save Cropped Image">
          save
        </button>
      </div>
      <button className="change" title="change picture" onClick={() => {
        document.getElementById("container").classList.add("fadeOut")
        setTimeout(() => {
          document.getElementById("container").classList.remove("fadeOut")
          window.location.reload()
        }, 1000);
       
        
        }}>
        <FaExchangeAlt color="#e9e9e9" id="change-icon"/>
      </button>
    </div>
  );
};

export default SideBar;
