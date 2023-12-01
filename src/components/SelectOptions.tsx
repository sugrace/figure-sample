import { useSetAtom } from "jotai";
import { shapesAtom, shapeTypeAtom } from "@atoms";

function SelectOptions() {
  const setShapes = useSetAtom(shapesAtom);
  const setShapeType = useSetAtom(shapeTypeAtom);

  return (
    <div>
      <button
        onClick={() => {
          setShapeType("Box");
        }}
      >
        Box
      </button>
      <button
        onClick={() => {
          setShapeType("Circle");
        }}
      >
        Circle
      </button>
      <button
        onClick={() => {
          setShapes([]);
        }}
      >
        Clear
      </button>
    </div>
  );
}

export default SelectOptions;
