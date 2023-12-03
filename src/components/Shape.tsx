import { useRef } from "react";
import {
  shapeActionTypeAtom,
  shapesAtom,
  selectedShapeElementAtom,
  isOpenEditorAtom,
} from "@atoms";
import { useSetAtom, useAtomValue } from "jotai";
import { ShapeModel } from "@/types/ShapeModel";
import { SHAPE_ACTION_TYPE } from "@constants/shape";

interface IShapeProps extends ShapeModel {
  index: number;
}

const Shape: React.FC<IShapeProps> = (props) => {
  const { index, left, top, width, height, borderRadius, background, zIndex } =
    props;
  const shapes = useAtomValue(shapesAtom);

  const setShapeActionType = useSetAtom(shapeActionTypeAtom);
  const setIsOpenEditor = useSetAtom(isOpenEditorAtom);
  const setSelectedShapeElement = useSetAtom(selectedShapeElementAtom);

  const shapeRef = useRef(null);

  const onShapeMouseDown = (event: React.MouseEvent, index: number) => {
    event.stopPropagation();

    shapes.forEach((shape: ShapeModel) => {
      if (shape.selected) {
        shape.background = "";
        shape.selected = false;
      }
    });
    shapes[index].background = "black";
    shapes[index].selected = true;
    if (shapeRef.current && typeof shapeRef.current !== "undefined") {
      (shapeRef.current as HTMLElement).style.cursor = "grabbing";
    }
    setShapeActionType(SHAPE_ACTION_TYPE.MOVING);
    setIsOpenEditor(false);
    setSelectedShapeElement(shapeRef.current);
  };

  return (
    <div
      ref={shapeRef}
      style={{
        position: "absolute",
        left: left,
        top: top,
        width,
        height,
        border: "2px solid gray",
        borderRadius,
        background,
        cursor: "grab",
        zIndex,
      }}
      onMouseDown={(event: React.MouseEvent) => {
        onShapeMouseDown(event, index);
      }}
    />
  );
};

export default Shape;
