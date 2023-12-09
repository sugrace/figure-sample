import { useCommitAtom } from "@atoms";

const ShapeEditor: React.FC = () => {
  const { clearShape, upShape, downShape } = useCommitAtom();

  return (
    <div
      style={{
        position: "absolute",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        top: "50px",
        width: "80%",
      }}
    >
      <button onClick={upShape}>Up</button>
      <button onClick={clearShape}>Clear</button>
      <button onClick={downShape}>Down</button>
    </div>
  );
};

export default ShapeEditor;
