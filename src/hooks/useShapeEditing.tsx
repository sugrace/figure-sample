import { ShapeModel } from "@/types/Shape";
import {
  isOpenEditorAtom,
  selectedShapeElementAtom,
  shapeActionTypeAtom,
  shapesAtom,
  useCommitAtom,
} from "@atoms";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useRef } from "react";
import { SHAPE_ACTION_TYPE } from "@constants/shape";
import { getOriginRect } from "@utils";

interface Rect {
  width: number;
  height: number;
  left: number;
  top: number;
  bottom: number;
}

const useShapeEditing = () => {
  const [shapes, setShapes] = useAtom(shapesAtom);
  const [shapeActionType, setShapeActionType] = useAtom(shapeActionTypeAtom);
  const selectedShapeElement: HTMLElement | null = useAtomValue(
    selectedShapeElementAtom
  );

  const tempRect = useRef<Rect | null>(null);

  const setIsOpenEditor = useSetAtom(isOpenEditorAtom);
  const { commitShapes } = useCommitAtom();

  useEffect(() => {
    if (!selectedShapeElement) return;
    const selectedElement = selectedShapeElement as HTMLElement;
    const { left, top, width, height, bottom } = getOriginRect(selectedElement);
    const rect = { left, top, width, height, bottom };

    tempRect.current = rect;

    const onMouseMove = (event: MouseEvent) => {
      if (!tempRect.current) return;

      const newRect = {
        newLeft: tempRect.current.left + event.movementX,
        newTop: tempRect.current.top + event.movementY,
      };
      if (shapeActionType === SHAPE_ACTION_TYPE.MOVING) {
        selectedElement.style.left = `${newRect.newLeft}px`;
        selectedElement.style.top = `${newRect.newTop}px`;
      }

      tempRect.current = {
        ...rect,
        left: newRect.newLeft,
        top: newRect.newTop,
      };
    };

    const onMouseUp = () => {
      if (!selectedShapeElement) return;
      setShapeActionType(SHAPE_ACTION_TYPE.NONE);
      setIsOpenEditor(true);

      const selectedElement = selectedShapeElement as HTMLElement;

      const { left, top, width, height } = getOriginRect(selectedElement);

      selectedElement.style.cursor = "grab";

      const updatedShapes: ShapeModel[] = shapes.map((shape: ShapeModel) =>
        shape.selected
          ? {
              ...shape,
              left,
              top,
              width,
              height,
              selected: true,
            }
          : shape
      );

      commitShapes(updatedShapes);
    };

    if (
      shapeActionType !== SHAPE_ACTION_TYPE.DRAWING &&
      shapeActionType === SHAPE_ACTION_TYPE.MOVING
    ) {
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [
    selectedShapeElement,
    shapeActionType,
    setShapes,
    setShapeActionType,
    setIsOpenEditor,
    shapes,
    commitShapes,
  ]);
};

export default useShapeEditing;
