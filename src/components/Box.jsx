import React, { useState, useEffect, useRef } from "react";
import "../styles/Box.css";
import { useCropDim, useSetCropDim } from "../store";

const extractNumber = (str) => {
    const matches = str.match(/\d+/); // Match one or more digits
    return matches ? parseInt(matches[0]) : 0; // Convert matched digits to integer
  };

const Box = () => {

    const [width, setWidth] = useState(100);
    const [height, setHeight] = useState(100);
    const [left, setLeft] = useState(100);
    const [top, setTop] = useState(100);
    const [dragging, setDragging] = useState(false);
    const [originalX, setOriginalX] = useState(0);
    const [originalY, setOriginalY] = useState(0);
    const [resizingCorner, setResizingCorner] = useState(null);
    const [imageSrc, setImageSrc] = useState(null);
    const imgContRef = useRef()
    const cropDim = useCropDim(); 
    const setCropDim = useSetCropDim(); 

    const minimumSize = 20;

    useEffect(() => {
        if (dragging) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
        }
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [dragging]);

    const handleMouseDown = (e) => {
        e.preventDefault();
        setDragging(true);
        setOriginalX(e.pageX);
        setOriginalY(e.pageY);
        if (e.target.classList.contains("resizer")) {
            setResizingCorner(e.target.classList[1]);
        }
    };

    useEffect(() => {
        setWidth(cropDim.x2 - cropDim.x1);
        setHeight(cropDim.y2 - cropDim.y1);
        setLeft(cropDim.x1);
        setTop(cropDim.y1);
    }, [cropDim]);
    


    const handleMouseMove = (e) => {
        if (dragging) {
            const maxwidth = extractNumber(imgContRef.current.style.width)
            const maxheight = extractNumber(imgContRef.current.style.height)
          if (!resizingCorner) {
            let newLeft = Math.min(Math.max(left + (e.pageX - originalX),0), maxwidth-width) 
            let newTop = Math.min(Math.max(top + (e.pageY - originalY),0), maxheight-height)
            let newWidth = width
            let newHeight = height
            if(newLeft + width > maxwidth) {
                newWidth -= newLeft + width - maxwidth
            }
            if(newTop + height > maxheight) {
                newHeight -= newTop + height - maxheight
            }
            setLeft(newLeft);
            setTop(newTop);
            setOriginalX(e.pageX);
            setOriginalY(e.pageY);
      
            // Update crop dimensions in the store
            const newCropDim = {
              ...cropDim,
              x1: newLeft,
              y1: newTop,
              x2: newLeft + newWidth,
              y2: newTop + newHeight,
            };
            setCropDim(newCropDim);
          } else {
            const deltaX = e.pageX - originalX;
            const deltaY = e.pageY - originalY;
      
            let newWidth = width;
            let newHeight = height;
            let newLeft = left;
            let newTop = top;
      
            if (resizingCorner.includes("right")) {
              newWidth += deltaX;
            } else {
              newWidth -= deltaX;
              newLeft += deltaX;
            }
      
            if (resizingCorner.includes("bottom")) {
              newHeight += deltaY;
            } else {
              newHeight -= deltaY;
              newTop += deltaY;
            }
      
            // Ensure dimensions are not negative
            
            newLeft = Math.max(newLeft, 0);
            newTop = Math.max(newTop, 0);
            newWidth = Math.max(newWidth, minimumSize)
            if(newWidth + newLeft > maxwidth) {
                newWidth -= newWidth + newLeft - maxwidth  
            }
            newHeight = Math.max(newHeight, minimumSize)
            if(newHeight + newTop > maxheight) {
                newHeight -= newHeight + newTop - maxheight
            }
        
            
            setWidth(newWidth);
            setHeight(newHeight);
            setLeft(newLeft);
            setTop(newTop);
            setOriginalX(e.pageX);
            setOriginalY(e.pageY);
      
            // Update crop dimensions in the store
            const newCropDim = {
              ...cropDim,
              x1: newLeft,
              y1: newTop,
              x2: newLeft + newWidth,
              y2: newTop + newHeight,
            };
            setCropDim(newCropDim);
          }
        }
      };
      
    

    const handleMouseUp = () => {
        setDragging(false);
        setResizingCorner(null);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setImageSrc(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="box">
            {!imageSrc && (
                <input type="file" accept="image/*" onChange={handleImageUpload} />
            )}

            {imageSrc && (
                <div className="box2" style={{ position: "relative" }}>
                    <div
                    ref={imgContRef}
                        style={{
                            width: "610px",
                            height: "310px",
                            background: `url(${imageSrc})`,
                            backgroundSize: "cover",
                        }}
                    >
                        <div
                            className="resizable"
                            style={{
                                width: `${width}px`,
                                height: `${height}px`,
                                position: "absolute",
                                left: `${left}px`,
                                top: `${top}px`,
                                cursor: dragging ? "grabbing" : "grab",
                            }}
                            onMouseDown={handleMouseDown}
                        >
                            <div className="resizers">
                                <div className="resizer top-left"></div>
                                <div className="resizer top-right"></div>
                                <div className="resizer bottom-left"></div>
                                <div className="resizer bottom-right"></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Box;
