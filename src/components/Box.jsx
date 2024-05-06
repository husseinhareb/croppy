import React, { useState, useEffect, useRef } from "react";
import "../styles/Box.css";
import { useCropDim, useImage, useSetCropDim, useSetImage } from "../store";

const extractNumber = (str) => {
  const matches = str.match(/\d+/); // Match one or more digits
  return matches ? parseInt(matches[0]) : 0; // Convert matched digits to integer
};

function fitImageInsideSquare(imageWidth, imageHeight, squareSize) {
  // Calculate aspect ratio of the image
  squareSize = squareSize - squareSize*0.03
  const imageAspectRatio = imageWidth / imageHeight;

  // Check if the image is landscape or portrait
  const isLandscape = imageWidth > imageHeight;

  // Calculate the dimensions to fit the image inside the square container
  let newWidth, newHeight;
  if (isLandscape) {
    newWidth = squareSize;
    newHeight = squareSize / imageAspectRatio;
  } else {
    newHeight = squareSize;
    newWidth = squareSize * imageAspectRatio;
  }

  return { width: newWidth, height: newHeight };
}

const Box = () => {
  const [width, setWidth] = useState();
  const [height, setHeight] = useState();
  const [left, setLeft] = useState();
  const [top, setTop] = useState();
  const [dragging, setDragging] = useState(false);
  const [originalX, setOriginalX] = useState(0);
  const [originalY, setOriginalY] = useState(0);
  const [resizingCorner, setResizingCorner] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const imgContRef = useRef();
  const boxRef = useRef();
  const cropDim = useCropDim();
  const setCropDim = useSetCropDim();
  const image = useImage();
  const setImage = useSetImage();
  const [sqWidth, setSqWidth] = useState(100);
  const [sqHeight, setSqHeight] = useState(100);
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
  const ptpi = (p, v) => parseInt((p / 100) * v);
  const pitp = (pi, v) => (pi / v) * 100;
  useEffect(() => {
    setWidth(pitp(cropDim.x2 - cropDim.x1, image.width));
    setHeight(pitp(cropDim.y2 - cropDim.y1, image.height));
    setLeft(pitp(cropDim.x1, image.width));
    setTop(pitp(cropDim.y1, image.height));
  }, [cropDim]);

  const handleMouseMove = (e) => {
    if (dragging) {
      // const sqWidth = extractNumber(imgContRef.current.style.width);
      // const sqHeight = extractNumber(imgContRef.current.style.height);

      if (!resizingCorner) {
        let newLeft = Math.min(
          Math.max(left + ((e.pageX - originalX) / sqWidth) * 100, 0),
          100 - width
        );
        let newTop = Math.min(
          Math.max(top + ((e.pageY - originalY) / sqHeight) * 100, 0),
          100 - height
        );
        let newWidth = width;
        let newHeight = height;
        if (newLeft + width >= 100) {
          newWidth -= newLeft + width - 100;
        }
        if (newTop + height >= 100) {
          newHeight -= newTop + height - 100;
        }
        setLeft(newLeft);
        setTop(newTop);
        setWidth(newWidth);
        setHeight(newHeight);
        setOriginalX(e.pageX);
        setOriginalY(e.pageY);

        // Update crop dimensions in the store
        const newCropDim = {
          ...cropDim,
          x1: ptpi(newLeft, image.width),
          y1: ptpi(newTop, image.height),
          x2: ptpi(newLeft + newWidth, image.width),
          y2: ptpi(newTop + newHeight, image.height),
        };
        setCropDim(newCropDim);
      } else {
        const deltaX = ((e.pageX - originalX) / sqWidth) * 100;
        const deltaY = ((e.pageY - originalY) / sqHeight) * 100;

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

        newLeft = Math.min(Math.max(newLeft, 0), left + width - 5);
        newTop = Math.min(Math.max(newTop, 0), top + height - 5)
        newWidth = Math.max(newWidth, 5);
        if (newWidth + newLeft >= 100) {
          newWidth -= newWidth + newLeft - 100;
        }
        newHeight = Math.max(newHeight, 5);
        if (newHeight + newTop >= 100) {
          newHeight -= newHeight + newTop - 100;
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
          x1: ptpi(newLeft, image.width),
          y1: ptpi(newTop, image.height),
          x2: ptpi(newLeft + newWidth, image.width),
          y2: ptpi(newTop + newHeight, image.height),
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
        const img = new Image();
        img.onload = () => {
          setImage(img);
        };
        img.src = event.target.result;
        setImageSrc(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  useEffect(() => {
    if (boxRef.current && image) {
      const handleResize = () => {
        const squareSize = Math.min(
          boxRef.current.clientWidth,
          boxRef.current.clientHeight
        );
        const { width, height } = fitImageInsideSquare(
          image.width,
          image.height,
          squareSize
        );

        setSqWidth(width);
        setSqHeight(height);
      };
      setCropDim({
        x1: parseInt(image.width / 3),
        x2: parseInt((2 * image.width) / 3),
        y1: parseInt(image.height / 3),
        y2: parseInt((2 * image.height) / 3),
      });
      handleResize(); // Initial resizing

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [image]);

  return (
    <div className="box" ref={boxRef}>
      {!imageSrc && (
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      )}

      {imageSrc && (
        <div
          ref={imgContRef}
          className="square"
          style={{
            width: `${sqWidth}px`,
            height: `${sqHeight}px`,
            background: `url(${imageSrc})`,
            backgroundSize: "cover",
            position: "relative",
          }}
        >
          <div
            className="resizable"
            style={{
              width: `${width}%`,
              height: `${height}%`,
              position: "absolute",
              left: `${left}%`,
              top: `${top}%`,
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
      )}
    </div>
  );
};

export default Box;