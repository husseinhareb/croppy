import React from "react";
import "../styles/SideBar.css";
import { useCropDim, useSetCropDim } from "../store";

const SideBar = () => {
  const cropDim = useCropDim();
  const setCropDim = useSetCropDim();
  const validateValue = (value) => {
    const raw = Math.abs(parseInt(value));
    return raw ? raw : 0;
  };
  // Function to handle scrolling on input
  const handleScroll = (e, key) => {
    // Prevent default scrolling behavior
    e.preventDefault();
    // Calculate the change based on scroll direction
    const delta = Math.sign(e.deltaY) * -1; // You can adjust the scroll sensitivity by changing the multiplier
    // Update the corresponding crop dimension value
    console.log(delta);
    setCropDim({
      ...cropDim,
      [key]: Math.abs(parseInt(cropDim[key]) + delta), // Convert value to integer and add the change
    });
  };

  return (
    <div className="side-bar">
      <div className="crop-dim-container">
        <input
          placeholder="X1"
          maxLength={4}
          value={cropDim.x1}
          onChange={(e) => {
            setCropDim({ ...cropDim, x1: validateValue(e.target.value) });
          }}
          onWheel={(e) => handleScroll(e, "x1")} // Add onWheel event listener
        />
        <input
          placeholder="X2"
          maxLength={4}
          value={cropDim.x2}
          onChange={(e) => {
            setCropDim({ ...cropDim, x2: validateValue(e.target.value) });
          }}
          onWheel={(e) => handleScroll(e, "x2")} // Add onWheel event listener
        />
        <input
          placeholder="Y1"
          maxLength={4}
          value={cropDim.y1}
          onChange={(e) => {
            setCropDim({ ...cropDim, y1: validateValue(e.target.value) });
          }}
          onWheel={(e) => handleScroll(e, "y1")} // Add onWheel event listener
        />
        <input
          placeholder="Y2"
          maxLength={4}
          value={cropDim.y2}
          onChange={(e) => {
            setCropDim({ ...cropDim, y2: validateValue(e.target.value) });
          }}
          onWheel={(e) => handleScroll(e, "y2")} // Add onWheel event listener
        />
      </div>
      <div className="save-btn-container">
        <button className="save-btn">save</button>
      </div>
    </div>
  );
};

export default SideBar;
