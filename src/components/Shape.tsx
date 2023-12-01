import { shapesAtom, shapeTypeAtom } from "@atoms";
import { useAtom } from "jotai";
import React, { useState, useMemo } from "react";

interface ShapeStyle {
  borderRadius: string | number;
}

interface ShapeStyleMap {
  [shape: string]: ShapeStyle;
}

const shapeStyleMap: ShapeStyleMap = {
  Circle: {
    borderRadius: "50%",
  },
  Box: {
    borderRadius: 0,
  },
};

const Shape = () => {
  const [shapeType, setShapeType] = useAtom(shapeTypeAtom);

  const [drawing, setDrawing] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [endPosition, setEndPosition] = useState({ x: 0, y: 0 });
  const [shapes, setShapes] = useAtom(shapesAtom);
  const onMouseDown = (e) => {
    setDrawing(true);
    setStartPosition({ x: e.clientX, y: e.clientY });
    setEndPosition({ x: e.clientX, y: e.clientY });
  };

  const onMouseMove = (e) => {
    if (drawing) {
      setEndPosition({ x: e.clientX, y: e.clientY });
    }
  };

  const onMouseUp = () => {
    if (drawing) {
      setDrawing(false);
      const newShape = {
        left: Math.min(startPosition.x, endPosition.x),
        top: Math.min(startPosition.y, endPosition.y),
        width: Math.abs(endPosition.x - startPosition.x),
        height: Math.abs(endPosition.y - startPosition.y),
        borderRadius: shapeStyleMap[shapeType].borderRadius,
      };
      setShapes((prevShapes) => [...prevShapes, newShape]);
    }
  };

  return (
    <div
      style={{ width: "100%", height: "100%" }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      {shapes.map((shape, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            left: shape.left,
            top: shape.top,
            width: shape.width,
            height: shape.height,
            border: "2px solid gray",
            borderRadius: shape.borderRadius,
            // background: "rgba(0, 0, 255, 0.3)",
          }}
        ></div>
      ))}
      {drawing && (
        <div
          style={{
            position: "absolute",
            left: Math.min(startPosition.x, endPosition.x),
            top: Math.min(startPosition.y, endPosition.y),
            width: Math.abs(endPosition.x - startPosition.x),
            height: Math.abs(endPosition.y - startPosition.y),
            border: "2px solid gray",
            borderRadius: shapeStyleMap[shapeType].borderRadius,
            // background: "rgba(0, 0, 255, 0.1)",
          }}
        ></div>
      )}
    </div>
  );
};

export default Shape;
