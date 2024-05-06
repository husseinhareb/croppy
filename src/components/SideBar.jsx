import React, { useCallback, useEffect } from "react";
import "../styles/SideBar.css";
import { useCropDim, useImage, useSetCropDim } from "../store";

const SideBar = () => {
  const cropDim = useCropDim();
  const setCropDim = useSetCropDim();
  const image = useImage();

  const validateValue = (value, key) => {
    const raw = Math.abs(parseInt(value));
    if(raw) {
      if(["x1","x2"].includes(key)) {
         return raw /1
      } else {

      }
    } else return 0
  };

  // Memoized event handler for scrolling on input
  const handleScroll = useCallback(
    (e, key) => {
      e.preventDefault();
      const delta = Math.sign(e.deltaY) * -10;
      setCropDim({
        ...cropDim,
        [key]:
          parseInt(cropDim[key]) + delta >= 0
            ? parseInt(cropDim[key]) + delta
            : 0,
      });
    },
    [cropDim, setCropDim]
  );

  // Reusable input component
  const CropInput = ({ placeholder, value, onChange, onWheel }) => (
    <input
      placeholder={placeholder}
      maxLength={4}
      value={value}
      onChange={onChange}
      onWheel={onWheel}
    />
  );

  return (
    <div className="side-bar">
      <div className="crop-dim-container">
        {["x1", "x2", "y1", "y2"].map((key) => (
          <CropInput
            key={key}
            placeholder={key.toUpperCase()}
            value={cropDim[key]}
            onChange={(e) =>
              setCropDim({
                ...cropDim,
                [key]: validateValue(e.target.value, key),
              })
            }
            onWheel={(e) => handleScroll(e, key)}
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
