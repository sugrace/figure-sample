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
import { ShapeModel, Rect, Delta } from "@/types/Shape";
import { getOriginRect, getRotatedDelta } from "@utils";

interface IPropsResizeHandler {
  rotateAngle: number;
}
const ResizeHandler: React.FC<IPropsResizeHandler> = ({ rotateAngle }) => {
  const [shapeActionType, setShapeActionType] = useAtom(shapeActionTypeAtom);
  const shapes = useAtomValue(shapesAtom);
  const setIsOpenEditor = useSetAtom(isOpenEditorAtom);

  const [resizeDirection, setResizeDirection] = useState("");

  const { commitShapes } = useCommitAtom();

  const tempRect = useRef<Rect | null>(null);
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
    const { left, top, width, right, height, bottom } =
      getOriginRect(selectedElement);
    const rect = { left, top, right, width, height, bottom };

    tempRect.current = rect;

    let a = 0;
    let b = 0;
    let aa = 0;
    let bb = 0;
    let da = 0;
    let db = 0;
    let dw = 0;
    let degree = 0;
    let radius = 0;
    let A, B, C, A_new, B_new, C_new;
    let alpha, beta, theta, newAlpha, newBeta, newTheta;
    let baseLine, newBaseLine;
    let diagonal, newDiagonal;

    const onMouseMove = (event: MouseEvent) => {
      if (shapeActionType === SHAPE_ACTION_TYPE.RESIZING) {
        if (!tempRect.current) return;
        if (!tempDelta.current) {
          tempDelta.current = {
            deltaX: event.movementX,
            deltaY: event.movementY,
          };
        }
        tempDelta.current = getRotatedDelta(rotateAngle, {
          deltaX: event.movementX,
          deltaY: event.movementY,
        });

        const newRect = {
          newWidth: tempRect.current.width,
          newHeight: tempRect.current.height,
          newLeft: tempRect.current.left,
          newRight: tempRect.current.right,
          newTop: tempRect.current.top,
          newBottom: tempRect.current.bottom,
        };

        switch (resizeDirection) {
          case "right":
            newRect.newWidth =
              tempRect.current.width + tempDelta.current.deltaX;

            degree = (180 - rotateAngle) / 2;
            radius = (Math.PI / 180) * degree;
            baseLine = 2 * ((width / 2) * Math.cos(radius));
            newBaseLine = 2 * ((newRect.newWidth / 2) * Math.cos(radius));
            a = Math.cos(radius) * baseLine;
            aa = Math.cos(radius) * newBaseLine;
            b = Math.sin(radius) * baseLine;
            bb = Math.sin(radius) * newBaseLine;
            da = aa - a;
            db = bb - b;
            newRect.newLeft = left - da;
            newRect.newTop = top + db;

            break;
          case "left":
            newRect.newWidth =
              tempRect.current.width - tempDelta.current.deltaX;
            newRect.newLeft = tempRect.current.left + tempDelta.current.deltaX;

            degree = (180 - rotateAngle) / 2;
            radius = (Math.PI / 180) * degree;
            baseLine = 2 * ((width / 2) * Math.cos(radius));
            newBaseLine = 2 * ((newRect.newWidth / 2) * Math.cos(radius));
            a = Math.cos(radius) * baseLine;
            aa = Math.cos(radius) * newBaseLine;
            b = Math.sin(radius) * baseLine;
            bb = Math.sin(radius) * newBaseLine;
            dw = newRect.newWidth - width;
            da = dw - (aa - a);
            db = bb - b;
            newRect.newLeft = left - da;
            newRect.newTop = top - db;
            break;
          case "top":
            newRect.newHeight =
              tempRect.current.height - tempDelta.current.deltaY;
            newRect.newTop = tempRect.current.top + tempDelta.current.deltaY;

            degree = (180 - Math.abs(rotateAngle)) / 2;
            radius = (Math.PI / 180) * degree;
            baseLine = 2 * ((height / 2) * Math.cos(radius));
            newBaseLine = 2 * ((newRect.newHeight / 2) * Math.cos(radius));

            if (rotateAngle < 0) {
              radius *= -1;
            }
            a = Math.cos(radius) * baseLine;
            aa = Math.cos(radius) * newBaseLine;
            b = Math.sin(radius) * baseLine;
            bb = Math.sin(radius) * newBaseLine;

            da = newRect.newHeight - height - (aa - a);
            db = bb - b;
            newRect.newLeft = left + db;
            newRect.newTop = top - da;

            break;
          case "bottom":
            newRect.newHeight =
              tempRect.current.height + tempDelta.current.deltaY;
            newRect.newBottom =
              tempRect.current.bottom - tempDelta.current.deltaY;

            degree = (180 - Math.abs(rotateAngle)) / 2;
            radius = (Math.PI / 180) * degree;

            baseLine = 2 * ((height / 2) * Math.cos(radius));
            newBaseLine = 2 * ((newRect.newHeight / 2) * Math.cos(radius));

            if (rotateAngle < 0) {
              radius *= -1;
            }
            a = Math.cos(radius) * baseLine;
            aa = Math.cos(radius) * newBaseLine;
            b = Math.sin(radius) * baseLine;
            bb = Math.sin(radius) * newBaseLine;

            da = aa - a;
            db = bb - b;
            newRect.newLeft = left - db;
            newRect.newTop = top - da;
            break;
          case "topRight":
            newRect.newWidth =
              tempRect.current.width + tempDelta.current.deltaX;
            newRect.newHeight =
              tempRect.current.height - tempDelta.current.deltaY;
            newRect.newTop = tempRect.current.top + tempDelta.current.deltaY;

            diagonal = Math.sqrt(
              Math.pow(height / 2, 2) + Math.pow(width / 2, 2)
            );
            newDiagonal = Math.sqrt(
              Math.pow(newRect.newHeight / 2, 2) +
                Math.pow(newRect.newWidth / 2, 2)
            );

            radius = (Math.PI / 180) * Math.abs(rotateAngle);

            A = Math.asin(width / 2 / diagonal) * 2;
            A_new = Math.asin(newRect.newWidth / 2 / newDiagonal) * 2;

            B = Math.PI - (radius + A);
            B_new = Math.PI - (radius + A_new);

            C = (Math.PI - B) / 2;
            C_new = (Math.PI - B_new) / 2;

            beta = Math.acos(width / 2 / diagonal);
            newBeta = Math.acos(newRect.newWidth / 2 / newDiagonal);

            alpha = (Math.PI / 180) * 90 - beta;
            newAlpha = (Math.PI / 180) * 90 - newBeta;

            if (rotateAngle < 0) {
              theta = -1 * ((Math.PI - (2 * radius + B)) / 2 + beta);
              baseLine =
                2 * diagonal * Math.cos((Math.PI - (2 * radius + B)) / 2);
            } else {
              theta = -1 * ((Math.PI / 180) * 90 + (C - alpha));
              baseLine = 2 * diagonal * Math.cos(C);
            }

            a = Math.cos(theta) * baseLine;
            b = Math.sin(theta) * baseLine;

            if (rotateAngle < 0) {
              newTheta = -1 * ((Math.PI - (2 * radius + B_new)) / 2 + newBeta);
              newBaseLine =
                2 *
                newDiagonal *
                Math.cos((Math.PI - (2 * radius + B_new)) / 2);
            } else {
              newTheta = -1 * ((Math.PI / 180) * 90 + (C_new - newAlpha));
              newBaseLine = 2 * newDiagonal * Math.cos(C_new);
            }
            if (rotateAngle < 0) {
              newTheta = -1 * ((Math.PI - (2 * radius + B_new)) / 2 + newBeta);
              newBaseLine =
                2 *
                newDiagonal *
                Math.cos((Math.PI - (2 * radius + B_new)) / 2);
            } else {
              newTheta = -1 * ((Math.PI / 180) * 90 + (C_new - newAlpha));
              newBaseLine = 2 * newDiagonal * Math.cos(C_new);
            }

            aa = Math.cos(newTheta) * newBaseLine;
            bb = Math.sin(newTheta) * newBaseLine;

            da = aa - a;
            db = bb - b;

            newRect.newLeft = left - da;
            newRect.newTop = top + db;
            break;
          case "bottomRight":
            newRect.newWidth =
              tempRect.current.width + tempDelta.current.deltaX;
            newRect.newHeight =
              tempRect.current.height + tempDelta.current.deltaY;
            newRect.newBottom =
              tempRect.current.bottom - tempDelta.current.deltaY;
            diagonal = Math.sqrt(
              Math.pow(height / 2, 2) + Math.pow(width / 2, 2)
            );
            newDiagonal = Math.sqrt(
              Math.pow(newRect.newHeight / 2, 2) +
                Math.pow(newRect.newWidth / 2, 2)
            );
            degree = (180 - Math.abs(rotateAngle)) / 2;
            radius = (Math.PI / 180) * degree;

            if (rotateAngle < 0) {
              radius *= -1;
            }

            baseLine = 2 * diagonal * Math.cos(radius);
            newBaseLine = 2 * newDiagonal * Math.cos(radius);
            a = Math.cos(radius - Math.acos(width / 2 / diagonal)) * baseLine;
            b = Math.sin(radius - Math.acos(width / 2 / diagonal)) * baseLine;
            aa =
              Math.cos(radius - Math.acos(newRect.newWidth / 2 / newDiagonal)) *
              newBaseLine;
            bb =
              Math.sin(radius - Math.acos(newRect.newWidth / 2 / newDiagonal)) *
              newBaseLine;
            da = aa - a;
            db = bb - b;
            newRect.newLeft = left - da;
            newRect.newTop = top + db;

            break;
          case "bottomLeft":
            newRect.newWidth =
              tempRect.current.width - tempDelta.current.deltaX;
            newRect.newHeight =
              tempRect.current.height + tempDelta.current.deltaY;
            newRect.newBottom =
              tempRect.current.bottom - tempDelta.current.deltaY;
            newRect.newLeft = tempRect.current.left + tempDelta.current.deltaX;

            diagonal = Math.sqrt(
              Math.pow(height / 2, 2) + Math.pow(width / 2, 2)
            );
            newDiagonal = Math.sqrt(
              Math.pow(newRect.newHeight / 2, 2) +
                Math.pow(newRect.newWidth / 2, 2)
            );

            radius = (Math.PI / 180) * Math.abs(rotateAngle);

            A = Math.asin(width / 2 / diagonal) * 2;
            A_new = Math.asin(newRect.newWidth / 2 / newDiagonal) * 2;
            B = Math.PI - (radius + A);
            B_new = Math.PI - (radius + A_new);

            beta = Math.acos(width / 2 / diagonal);
            newBeta = Math.acos(newRect.newWidth / 2 / newDiagonal);

            if (rotateAngle < 0) {
              theta = (Math.PI - (A - radius)) / 2 - beta;
              newTheta = (Math.PI - (A_new - radius)) / 2 - newBeta;
              baseLine = 2 * diagonal * Math.cos((Math.PI - (A - radius)) / 2);
              newBaseLine =
                2 * newDiagonal * Math.cos((Math.PI - (A_new - radius)) / 2);
            } else {
              theta = (Math.PI - (A + radius)) / 2 - beta;
              newTheta = (Math.PI - (A_new + radius)) / 2 - newBeta;
              baseLine = 2 * diagonal * Math.cos((Math.PI - (A + radius)) / 2);
              newBaseLine =
                2 * newDiagonal * Math.cos((Math.PI - (A_new + radius)) / 2);
            }

            a = Math.cos(theta) * baseLine;
            b = Math.sin(theta) * baseLine;
            aa = Math.cos(theta) * newBaseLine;
            bb = Math.sin(theta) * newBaseLine;

            da = aa - a;
            db = bb - b;

            newRect.newLeft = left - da;
            newRect.newTop = top + db;
            break;
          case "topLeft":
            newRect.newWidth =
              tempRect.current.width - tempDelta.current.deltaX;
            newRect.newLeft = tempRect.current.left + tempDelta.current.deltaX;
            newRect.newHeight =
              tempRect.current.height - tempDelta.current.deltaY;
            newRect.newTop = tempRect.current.top + tempDelta.current.deltaY;

            diagonal = Math.sqrt(
              Math.pow(height / 2, 2) + Math.pow(width / 2, 2)
            );
            newDiagonal = Math.sqrt(
              Math.pow(newRect.newHeight / 2, 2) +
                Math.pow(newRect.newWidth / 2, 2)
            );

            radius = (Math.PI / 180) * Math.abs(rotateAngle);

            A = Math.asin(width / 2 / diagonal) * 2;
            A_new = Math.asin(newRect.newWidth / 2 / newDiagonal) * 2;

            B = Math.PI - (radius + A);
            B_new = Math.PI - (radius + A_new);

            beta = Math.acos(width / 2 / diagonal);
            newBeta = Math.acos(newRect.newWidth / 2 / newDiagonal);

            if (rotateAngle < 0) {
              theta = -1 * (beta - (Math.PI - (A + B)) / 2);
              baseLine = 2 * diagonal * Math.cos((Math.PI - (A + B)) / 2);
            } else {
              theta = -1 * (beta + (Math.PI - (A + B)) / 2);
              baseLine = 2 * diagonal * Math.cos((Math.PI - (A + B)) / 2);
            }
            a = Math.cos(theta) * baseLine;
            b = Math.sin(theta) * baseLine;

            if (rotateAngle < 0) {
              newTheta = -1 * (newBeta - (Math.PI - (A_new + B_new)) / 2);
              newBaseLine =
                2 * newDiagonal * Math.cos((Math.PI - (A_new + B_new)) / 2);
            } else {
              newTheta = -1 * (newBeta + (Math.PI - (A_new + B_new)) / 2);
              newBaseLine =
                2 * newDiagonal * Math.cos((Math.PI - (A_new + B_new)) / 2);
            }
            aa = Math.cos(newTheta) * newBaseLine;
            bb = Math.sin(newTheta) * newBaseLine;

            da = aa - a;
            db = bb - b;
            newRect.newLeft = left - da;
            newRect.newTop = top + db;

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
          right: newRect.newRight,
          top: newRect.newTop,
          bottom: newRect.newBottom,
        };
        tempDelta.current = { deltaX: event.clientX, deltaY: event.clientY };
      }
    };

    const onMouseUp = () => {
      if (!selectedShapeElement) return;
      setShapeActionType(SHAPE_ACTION_TYPE.NONE);
      setIsOpenEditor(true);
      const selectedElement = selectedShapeElement as HTMLElement;

      const { left, top, width, height } = getOriginRect(selectedElement);

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
    rotateAngle,
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
