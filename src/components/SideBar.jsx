import React, { useCallback } from "react";
import "../styles/SideBar.css";
import { useCropDim, useImage, useSetCropDim } from "../store";

const SideBar = () => {
  const cropDim = useCropDim();
  const setCropDim = useSetCropDim();
  const image = useImage();

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

  return (
    <div className="side-bar">
      <div className="crop-dim-container">
        {["x1", "x2", "y1", "y2"].map((key) => (
          <input
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
      <div className="save-btn-container">
        <button className="save-btn">save</button>
      </div>
    </div>
  );
};

export default SideBar;
