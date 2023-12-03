import { ShapeModel } from "@/types/ShapeModel";
import {
  isOpenEditorAtom,
  selectedShapeElementAtom,
  shapeActionTypeAtom,
  shapesAtom,
  useCommitAtom,
} from "@atoms";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import { SHAPE_ACTION_TYPE } from "@constants/shape";

const useShapeEditing = () => {
  const [shapes, setShapes] = useAtom(shapesAtom);
  const [shapeActionType, setShapeActionType] = useAtom(shapeActionTypeAtom);
  const selectedShapeElement: HTMLElement | null = useAtomValue(
    selectedShapeElementAtom
  );

  const setIsOpenEditor = useSetAtom(isOpenEditorAtom);

  const { commitShapes } = useCommitAtom();

  useEffect(() => {
    const onDrag = (event: MouseEvent) => {
      if (selectedShapeElement) {
        const { left, top } = (
          selectedShapeElement as HTMLElement
        ).getBoundingClientRect();

        (selectedShapeElement as HTMLElement).style.left = `${
          left + event.movementX
        }px`;
        (selectedShapeElement as HTMLElement).style.top = `${
          top + event.movementY
        }px`;
      }
    };

    const onMouseUp = () => {
      if (!selectedShapeElement) return;
      setShapeActionType("none");
      setIsOpenEditor(true);

      const { left, top } = (
        selectedShapeElement as HTMLElement
      ).getBoundingClientRect();

      shapes.forEach((shape: ShapeModel) => {
        if (shape.selected) {
          shape.left = left;
          shape.top = top;
        }
      });

      const updatedShapes: ShapeModel[] = [...shapes];

      commitShapes(updatedShapes);
    };

    if (
      shapeActionType !== SHAPE_ACTION_TYPE.DRAWING &&
      shapeActionType === SHAPE_ACTION_TYPE.MOVING
    ) {
      document.addEventListener("mousemove", onDrag);
      document.addEventListener("mouseup", onMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", onDrag);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [
    shapeActionType,
    selectedShapeElement,
    setShapeActionType,
    setIsOpenEditor,
    shapes,
    setShapes,
    commitShapes,
  ]);
};

export default useShapeEditing;
