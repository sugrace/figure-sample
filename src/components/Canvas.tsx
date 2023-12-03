import {
  shapeActionTypeAtom,
  shapesAtom,
  shapeTypeAtom,
  useCommitAtom,
} from "@atoms";
import { useAtom, useAtomValue } from "jotai";
import { useState, useEffect, useRef, useCallback } from "react";
import { ShapeModel } from "@/types/ShapeModel";
import { v4 as uuidv4 } from "uuid";
import { SHAPE_ACTION_TYPE, SHAPE_TYPE_MAP } from "@constants/shape";

const Canvas: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const shapeType = useAtomValue(shapeTypeAtom);
  const shapes = useAtomValue(shapesAtom);
  const [shapeActionType, setShapeActionType] = useAtom(shapeActionTypeAtom);
  const { commitShapes } = useCommitAtom();

  const canvasRef = useRef<HTMLDivElement | null>(null);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [endPosition, setEndPosition] = useState({ x: 0, y: 0 });

  const onMouseDown: React.MouseEventHandler<HTMLDivElement> = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    setStartPosition({ x: event.clientX, y: event.clientY });
    setEndPosition({ x: event.clientX, y: event.clientY });
    setShapeActionType(SHAPE_ACTION_TYPE.DRAWING);
  };

  const onMouseUp: React.MouseEventHandler<HTMLDivElement> = () => {
    if (shapeActionType === SHAPE_ACTION_TYPE.DRAWING) {
      setShapeActionType("none");

      const newShape: ShapeModel = {
        id: uuidv4(),
        selected: false,
        left: Math.min(startPosition.x, endPosition.x),
        top: Math.min(startPosition.y, endPosition.y),
        width: Math.abs(endPosition.x - startPosition.x),
        height: Math.abs(endPosition.y - startPosition.y),
        borderRadius: SHAPE_TYPE_MAP[shapeType].borderRadius,
        background: "",
        element: null,
        zIndex: 5000,
      };

      if (newShape.width < 10 || newShape.height < 10) {
        return;
      }
      const updatedShapes: ShapeModel[] = [...shapes, newShape];

      commitShapes(updatedShapes);
    }
  };

  const onMouseMove = useCallback((event: MouseEvent) => {
    event.stopPropagation();
    setEndPosition({ x: event.clientX, y: event.clientY });
  }, []);

  useEffect(() => {
    const canvasElement = canvasRef.current;
    if (shapeActionType === SHAPE_ACTION_TYPE.DRAWING && canvasElement) {
      canvasElement.addEventListener("mousemove", onMouseMove);
    }
    return () => {
      if (canvasElement) {
        canvasElement.removeEventListener("mousemove", onMouseMove);
      }
    };
  }, [shapeActionType, onMouseMove, canvasRef]);

  return (
    <div
      ref={canvasRef}
      style={{
        height: "600px",
        border: "1px solid #ccc",
        cursor: "crosshair",
      }}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    >
      {children}
      {shapeActionType === SHAPE_ACTION_TYPE.DRAWING && (
        <div
          style={{
            position: "absolute",
            left: Math.min(startPosition.x, endPosition.x),
            top: Math.min(startPosition.y, endPosition.y),
            width: Math.abs(endPosition.x - startPosition.x),
            height: Math.abs(endPosition.y - startPosition.y),
            border: "2px solid gray",
            borderRadius: SHAPE_TYPE_MAP[shapeType].borderRadius,
            background: SHAPE_TYPE_MAP[shapeType].background,
          }}
        ></div>
      )}
    </div>
  );
};

export default Canvas;
