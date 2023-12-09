import { SHAPE_TYPE } from "@constants/shape";
import { ShapeModel } from "@/types/Shape";
import { atom, useAtom } from "jotai";
import { useMemo } from "react";

const shapesAtom = atom(
  JSON.parse(localStorage.getItem("shapes") || "[]").map(
    (shape: ShapeModel) => {
      if (shape.selected) {
        shape.selected = false;
        shape.background = "";
      }
      return shape;
    }
  )
);

const shapeTypeAtom = atom(SHAPE_TYPE.BOX);

const shapeActionTypeAtom = atom("");

const selectedShapeElementAtom = atom(null);

const isOpenEditorAtom = atom(false);

const useCommitAtom = () => {
  const [shapes, setShapes] = useAtom(shapesAtom);

  const maxZIndex = useMemo(() => {
    return shapes.reduce(
      (max: number, shape: ShapeModel) =>
        shape.zIndex > max ? shape.zIndex : max,
      0
    );
  }, [shapes]);

  const minZIndex = useMemo(() => {
    return shapes.reduce(
      (min: number, shape: ShapeModel) =>
        shape.zIndex < min ? shape.zIndex : min,
      Infinity
    );
  }, [shapes]);

  const commitShapes = (updatedShapes: ShapeModel[]) => {
    setShapes(updatedShapes);
    localStorage.setItem("shapes", JSON.stringify(updatedShapes));
  };

  const clearShape = (event: React.MouseEvent) => {
    event.stopPropagation();

    const updatedShapes = shapes.filter((shape: ShapeModel) => !shape.selected);
    commitShapes(updatedShapes);
  };

  const upShape = (event: React.MouseEvent) => {
    event.stopPropagation();
    const updatedShapes = shapes.map((shape: ShapeModel) =>
      shape.selected ? { ...shape, zIndex: maxZIndex + 1 } : shape
    );
    commitShapes(updatedShapes);
  };

  const downShape = (event: React.MouseEvent) => {
    event.stopPropagation();
    const updatedShapes = shapes.map((shape: ShapeModel) =>
      shape.selected ? { ...shape, zIndex: minZIndex - 1 } : shape
    );
    commitShapes(updatedShapes);
  };

  return { commitShapes, clearShape, upShape, downShape };
};

export {
  useCommitAtom,
  shapesAtom,
  shapeTypeAtom,
  shapeActionTypeAtom,
  selectedShapeElementAtom,
  isOpenEditorAtom,
};
