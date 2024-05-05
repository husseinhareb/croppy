import React, { useState, useEffect } from 'react';
import "../styles/Box.css"

const Box = () => {
    const [width, setWidth] = useState(100);
    const [height, setHeight] = useState(100);
    const [left, setLeft] = useState(100);
    const [top, setTop] = useState(100);
    const [dragging, setDragging] = useState(false);
    const [originalX, setOriginalX] = useState(0);
    const [originalY, setOriginalY] = useState(0);
    const [resizingCorner, setResizingCorner] = useState(null);

    const minimumSize = 20;

    useEffect(() => {
        if (dragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [dragging]);

    const handleMouseDown = (e) => {
        e.preventDefault();
        setDragging(true);
        setOriginalX(e.pageX);
        setOriginalY(e.pageY);
        if (e.target.classList.contains('resizer')) {
            setResizingCorner(e.target.classList[1]);
        }
    };

    const handleMouseMove = (e) => {
        if (dragging) {
            if (!resizingCorner) {
                const newLeft = left + (e.pageX - originalX);
                const newTop = top + (e.pageY - originalY);
                setLeft(newLeft);
                setTop(newTop);
                setOriginalX(e.pageX);
                setOriginalY(e.pageY);
            } else {
                const deltaX = e.pageX - originalX;
                const deltaY = e.pageY - originalY;

                let newWidth = width;
                let newHeight = height;
                let newLeft = left;
                let newTop = top;

                if (resizingCorner.includes('right')) {
                    newWidth += deltaX;
                } else {
                    newWidth -= deltaX;
                    newLeft += deltaX;
                }

                if (resizingCorner.includes('bottom')) {
                    newHeight += deltaY;
                } else {
                    newHeight -= deltaY;
                    newTop += deltaY;
                }

                if (newWidth > minimumSize) {
                    setWidth(newWidth);
                }

                if (newHeight > minimumSize) {
                    setHeight(newHeight);
                }

                setLeft(newLeft);
                setTop(newTop);
                setOriginalX(e.pageX);
                setOriginalY(e.pageY);
            }
        }
    };

    const handleMouseUp = () => {
        setDragging(false);
        setResizingCorner(null);
    };

    return (
        <div className='box'>
            <div
                className="resizable"
                style={{ width: `${width}px`, height: `${height}px`, position: 'absolute', left: `${left}px`, top: `${top}px`, cursor: dragging ? 'grabbing' : 'grab' }}
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
    );
};

export default Box;
