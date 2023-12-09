import Shape from "./components/Shape";
import SelectOptions from "./components/SelectOptions";
import Canvas from "./components/Canvas";
import { isOpenEditorAtom, shapesAtom } from "./atoms";
import { useAtomValue } from "jotai";
import { useShapeEditing } from "./hooks";
import ShapeEditor from "./components/ShapeEditor";
import { ShapeModel } from "./types/ShapeModel";

const App: React.FC = () => {
  const shapes = useAtomValue(shapesAtom);
  const isOpenEditor = useAtomValue(isOpenEditorAtom);
  useShapeEditing();

  return (
    <>
      <SelectOptions />
      {isOpenEditor ? <ShapeEditor /> : null}
      <Canvas>
        {shapes.map((shape: ShapeModel) => (
          <Shape {...shape} key={shape.id} />
        ))}
      </Canvas>
    </>
  );
};

export default App;
