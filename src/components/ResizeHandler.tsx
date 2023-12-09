import { SHAPE_ACTION_TYPE } from "@constants/shape";
import {
  isOpenEditorAtom,
  selectedShapeElementAtom,
  shapeActionTypeAtom,
  shapesAtom,
  useCommitAtom,
} from "@atoms";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useState, useEffect, useRef } from "react";
import * as React from "react";
import { ShapeModel } from "@/types/ShapeModel";

interface Delta {
  deltaX: number;
  deltaY: number;
}
const ResizeHandler: React.FC = () => {
  const [shapeActionType, setShapeActionType] = useAtom(shapeActionTypeAtom);
  const shapes = useAtomValue(shapesAtom);
  const setIsOpenEditor = useSetAtom(isOpenEditorAtom);

  const [resizeDirection, setResizeDirection] = useState("");

  const { commitShapes } = useCommitAtom();

  const tempRect = useRef<DOMRect | null>(null);
  const tempDelta = useRef<Delta | null>(null);

  const selectedShapeElement: HTMLElement | null = useAtomValue(
    selectedShapeElementAtom
  );

  const onMouseDown = (direction: string) => {
    setShapeActionType(SHAPE_ACTION_TYPE.RESIZING);
    setResizeDirection(direction);
  };

  useEffect(() => {
    if (!selectedShapeElement) return;
    const selectedElement = selectedShapeElement as HTMLElement;
    const rect = selectedElement.getBoundingClientRect();
    tempRect.current = rect;

    const onMouseMove = (event: MouseEvent) => {
      if (shapeActionType === SHAPE_ACTION_TYPE.RESIZING) {
        if (!tempRect.current) return;
        if (!tempDelta.current) {
          tempDelta.current = { deltaX: event.clientX, deltaY: event.clientY };
        }

        const newRect = {
          newWidth: tempRect.current.width,
          newHeight: tempRect.current.height,
          newLeft: tempRect.current.left,
          newTop: tempRect.current.top,
          newBottom: tempRect.current.bottom,
        };

        switch (resizeDirection) {
          case "right":
            newRect.newWidth = tempRect.current.width + event.movementX;
            break;
          case "left":
            newRect.newWidth = tempRect.current.width - event.movementX;
            newRect.newLeft = tempRect.current.left + event.movementX;
            break;
          case "top":
            newRect.newHeight = tempRect.current.height - event.movementY;
            newRect.newTop = tempRect.current.top + event.movementY;
            break;
          case "bottom":
            newRect.newHeight = tempRect.current.height + event.movementY;
            newRect.newBottom = tempRect.current.bottom - event.movementY;
            break;
          case "topRight":
            newRect.newWidth = tempRect.current.width + event.movementX;
            newRect.newHeight = tempRect.current.height - event.movementY;
            newRect.newTop = tempRect.current.top + event.movementY;
            break;
          case "bottomRight":
            newRect.newWidth = tempRect.current.width + event.movementX;
            newRect.newHeight = tempRect.current.height + event.movementY;
            newRect.newBottom = tempRect.current.bottom - event.movementY;
            break;
          case "bottomLeft":
            newRect.newWidth = tempRect.current.width - event.movementX;
            newRect.newHeight = tempRect.current.height + event.movementY;
            newRect.newBottom = tempRect.current.bottom - event.movementY;
            newRect.newLeft = tempRect.current.left + event.movementX;
            break;
          case "topLeft":
            newRect.newWidth = tempRect.current.width - event.movementX;
            newRect.newLeft = tempRect.current.left + event.movementX;
            newRect.newHeight = tempRect.current.height - event.movementY;
            newRect.newTop = tempRect.current.top + event.movementY;
            break;
        }

        selectedElement.style.width = `${newRect.newWidth}px`;
        selectedElement.style.left = `${newRect.newLeft}px`;
        selectedElement.style.height = `${newRect.newHeight}px`;
        selectedElement.style.top = `${newRect.newTop}px`;

        tempRect.current = {
          ...rect,
          width: newRect.newWidth,
          height: newRect.newHeight,
          left: newRect.newLeft,
          top: newRect.newTop,
          bottom: newRect.newBottom,
        };
        tempDelta.current = { deltaX: event.clientX, deltaY: event.clientY };
      }
    };

    const onMouseUp = () => {
      if (!selectedShapeElement) return;
      setShapeActionType("none");
      setIsOpenEditor(true);
      const selectedElement = selectedShapeElement as HTMLElement;

      const { left, top, width, height } =
        selectedElement.getBoundingClientRect();

      const updatedShapes: ShapeModel[] = shapes.map((shape: ShapeModel) =>
        shape.selected
          ? { ...shape, left, top, width, height, selected: true }
          : shape
      );

      commitShapes(updatedShapes);
    };

    if (shapeActionType === SHAPE_ACTION_TYPE.RESIZING) {
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [
    commitShapes,
    resizeDirection,
    selectedShapeElement,
    setIsOpenEditor,
    setShapeActionType,
    shapeActionType,
    shapes,
  ]);

  return (
    <>
      <div
        style={{
          position: "absolute",
          width: 7,
          height: 7,
          top: 0,
          left: 0,
          cursor: "nwse-resize",
          background: "gray",
        }}
        onMouseDown={(event) => {
          event.stopPropagation();
          onMouseDown("topLeft");
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 7,
          height: 7,
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          cursor: "ns-resize",
          background: "gray",
        }}
        onMouseDown={(event) => {
          event.stopPropagation();
          onMouseDown("top");
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 7,
          height: 7,
          top: 0,
          right: 0,
          cursor: "nesw-resize",
          background: "gray",
        }}
        onMouseDown={(event) => {
          event.stopPropagation();
          onMouseDown("topRight");
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 7,
          height: 7,
          top: "50%",
          left: 0,
          transform: "translateY(-50%)",
          cursor: "ew-resize",
          background: "gray",
        }}
        onMouseDown={(event) => {
          event.stopPropagation();
          onMouseDown("left");
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 7,
          height: 7,
          top: "50%",
          right: 0,
          transform: "translateY(-50%)",
          cursor: "ew-resize",
          background: "gray",
        }}
        onMouseDown={(event) => {
          event.stopPropagation();
          onMouseDown("right");
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 7,
          height: 7,
          bottom: 0,
          left: 0,
          cursor: "nesw-resize",
          background: "gray",
        }}
        onMouseDown={(event) => {
          event.stopPropagation();
          onMouseDown("bottomLeft");
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 7,
          height: 7,
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          cursor: "ns-resize",
          background: "gray",
        }}
        onMouseDown={(event) => {
          event.stopPropagation();
          onMouseDown("bottom");
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 7,
          height: 7,
          bottom: 0,
          right: 0,
          cursor: "nwse-resize",
          background: "gray",
        }}
        onMouseDown={(event) => {
          event.stopPropagation();
          onMouseDown("bottomRight");
        }}
      />
    </>
  );
};

export default ResizeHandler;
