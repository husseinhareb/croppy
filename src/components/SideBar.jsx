import React, { useCallback } from "react";
import "../styles/SideBar.css";
import { useCropDim, useSetCropDim } from "../store";

const SideBar = () => {
  const cropDim = useCropDim();
  const setCropDim = useSetCropDim();

  const validateValue = (value) => {
    const raw = Math.abs(parseInt(value));
    return raw ? raw : 0;
  };

  // Memoized event handler for scrolling on input
  const handleScroll = useCallback((e, key) => {
    e.preventDefault();
    const delta = Math.sign(e.deltaY) * -1;
    setCropDim({
      ...cropDim,
      [key]: Math.abs(parseInt(cropDim[key]) + delta),
    });
  }, [cropDim, setCropDim]);

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
              setCropDim({ ...cropDim, [key]: validateValue(e.target.value) })
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
