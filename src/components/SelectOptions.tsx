import { useSetAtom } from "jotai";
import { shapeTypeAtom, useCommitAtom } from "@atoms";

const SelectOptions: React.FC = () => {
  const setShapeType = useSetAtom(shapeTypeAtom);
  const { commitShapes } = useCommitAtom();

  const clearAllShapes = () => {
    commitShapes([]);
  };
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
      <button onClick={clearAllShapes}>Clear</button>
    </div>
  );
};

export default SelectOptions;
