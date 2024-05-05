import "../styles/Box.css"
import React, { useState } from 'react';

function ImageCropper() {
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [cropX, setCropX] = useState(0);
  const [cropY, setCropY] = useState(0);
  const [cropWidth, setCropWidth] = useState(200);
  const [cropHeight, setCropHeight] = useState(200);

  // Function to handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setImage(img);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Function to crop the image
  const cropImage = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = cropWidth;
    canvas.height = cropHeight;
    ctx.drawImage(image, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
    const croppedImageUrl = canvas.toDataURL();
    setCroppedImage(croppedImageUrl);
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <br />
      <button onClick={cropImage}>Crop Image</button>
      <br />
      {image && (
        <div>
          <h3>Original Image</h3>
          <img src={image.src} alt="Original" width={610} height={367} style={{backgroundSize:"cover"}}/>
        </div>
      )}
      {croppedImage && (
        <div>
          <h3>Cropped Image</h3>
          <img src={croppedImage} alt="Cropped" />
        </div>
      )}
    </div>
  );
}


const Box = () => {
  return (
    <div className='box'><ImageCropper /></div>
  )
}

export default Box