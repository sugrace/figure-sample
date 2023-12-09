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
    if (!selectedShapeElement) return;

    const onMouseMove = (event: MouseEvent) => {
      if (shapeActionType === SHAPE_ACTION_TYPE.MOVING) {
        const selectedElement = selectedShapeElement as HTMLElement;

        const { width, height, right, bottom, left, top } =
          selectedElement.getBoundingClientRect();

        selectedElement.style.left = `${left + event.movementX}px`;
        selectedElement.style.top = `${top + event.movementY}px`;

        const updatedRect = {
          width,
          height,
          right,
          bottom,
          left: left + event.movementX,
          top: top + event.movementY,
        };

        setShapes((prevShapes: ShapeModel[]) =>
          prevShapes.map((shape: ShapeModel) =>
            shape.selected
              ? { ...shape, ...updatedRect, selected: true }
              : shape
          )
        );
      }
    };

    const onMouseUp = () => {
      if (!selectedShapeElement) return;
      setShapeActionType("none");
      setIsOpenEditor(true);

      const selectedElement = selectedShapeElement as HTMLElement;

      const { width, height, left, top } =
        selectedElement.getBoundingClientRect();

      selectedElement.style.cursor = "grab";

      const updatedShapes: ShapeModel[] = shapes.map((shape: ShapeModel) =>
        shape.selected
          ? { ...shape, left, top, width, height, selected: true }
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
