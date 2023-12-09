import { useRef } from "react";
import {
  shapeActionTypeAtom,
  shapesAtom,
  selectedShapeElementAtom,
  isOpenEditorAtom,
  useCommitAtom,
} from "@atoms";
import { useSetAtom, useAtomValue } from "jotai";
import { ShapeModel } from "@/types/ShapeModel";
import { SHAPE_ACTION_TYPE } from "@constants/shape";
import ResizeHandler from "./ResizeHandler";

interface IPropsShape extends ShapeModel {}

const Shape: React.FC<IPropsShape> = ({
  id,
  left,
  top,
  width,
  height,
  selected,
  borderRadius,
  zIndex,
}) => {
  const shapes = useAtomValue(shapesAtom);

  const setShapeActionType = useSetAtom(shapeActionTypeAtom);
  const setIsOpenEditor = useSetAtom(isOpenEditorAtom);
  const setSelectedShapeElement = useSetAtom(selectedShapeElementAtom);

  const { commitShapes } = useCommitAtom();

  const shapeRef = useRef(null);

  const doSelect = (id: string) => {
    const updatedShapes: ShapeModel[] = shapes.map((shape: ShapeModel) => {
      return {
        ...shape,
        selected: shape.id === id,
      };
    });
    commitShapes(updatedShapes);
  };

  const onShapeMouseDown = (event: React.MouseEvent, id: string) => {
    event.stopPropagation();

    setShapeActionType(SHAPE_ACTION_TYPE.MOVING);
    setIsOpenEditor(false);
    setSelectedShapeElement(shapeRef.current);

    if (shapeRef.current && typeof shapeRef.current !== "undefined") {
      (shapeRef.current as HTMLElement).style.cursor = "grabbing";
      (shapeRef.current as HTMLElement).style.background = "black";
    }

    doSelect(id);
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
        boxSizing: "border-box",
        border: "2px solid gray",
        borderRadius,
        background: selected ? "black" : "",
        cursor: "grab",
        zIndex,
      }}
      onMouseDown={(event: React.MouseEvent) => {
        onShapeMouseDown(event, id);
      }}
    >
      {selected ? <ResizeHandler /> : null}
    </div>
  );
};

export default Shape;
