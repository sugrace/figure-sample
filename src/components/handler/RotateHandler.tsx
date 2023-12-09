import { useEffect, useRef } from "react";
import {
  shapeActionTypeAtom,
  selectedShapeElementAtom,
  isOpenEditorAtom,
  useCommitAtom,
  shapesAtom,
} from "@atoms";
import { useSetAtom, useAtomValue, useAtom } from "jotai";
import { ShapeModel } from "@/types/Shape";
import { SHAPE_ACTION_TYPE } from "@constants/shape";
import { getOriginRect } from "@utils";

const RotateHandler: React.FC = () => {
  const [shapeActionType, setShapeActionType] = useAtom(shapeActionTypeAtom);
  const shapes = useAtomValue(shapesAtom);
  const setIsOpenEditor = useSetAtom(isOpenEditorAtom);
  const selectedShapeElement = useAtomValue(selectedShapeElementAtom);

  const { commitShapes } = useCommitAtom();

  const tempAngle = useRef<number>(0);

  const onMouseDown = (event: React.MouseEvent) => {
    event.stopPropagation();
    setShapeActionType(SHAPE_ACTION_TYPE.ROTATING);
    setIsOpenEditor(false);
    tempAngle.current = 0;
  };

  useEffect(() => {
    if (!selectedShapeElement) return;

    const selectedElement = selectedShapeElement as HTMLElement;

    const { left, top, width, height } = getOriginRect(selectedElement);

    const rect = { left, top, width, height };

    const onMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = clientX - centerX;
      const deltaY = clientY - centerY;

      const angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;
      const rotation = angle + 90;

      selectedElement.style.transform = `rotate(${
        tempAngle.current + rotation
      }deg)`;
    };

    const onMouseUp = () => {
      if (!selectedShapeElement) return;
      setShapeActionType(SHAPE_ACTION_TYPE.NONE);
      setIsOpenEditor(true);

      const selectedElement = selectedShapeElement as HTMLElement;

      const currentRotateAngle =
        tempAngle.current +
        parseFloat(
          selectedElement.style.transform
            .replace("rotate(", "")
            .replace("deg)", "")
        );

      tempAngle.current = currentRotateAngle;

      const updatedShapes: ShapeModel[] = shapes.map((shape: ShapeModel) =>
        shape.selected
          ? { ...shape, rotateAngle: currentRotateAngle, selected: true }
          : shape
      );

      commitShapes(updatedShapes);
    };

    if (shapeActionType === SHAPE_ACTION_TYPE.ROTATING) {
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [
    commitShapes,
    selectedShapeElement,
    setIsOpenEditor,
    setShapeActionType,
    shapeActionType,
    shapes,
  ]);

  return (
    <div
      style={{
        position: "absolute",
        width: 20,
        height: 20,
        top: -50,
        left: "50%",
        background: "gray",
        transform: "translateX(-50%)",
        zIndex: 1,
      }}
      onMouseDown={onMouseDown}
    />
  );
};

export default RotateHandler;
