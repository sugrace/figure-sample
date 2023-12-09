import Shape from "@components/shape/Shape";
import SelectOptions from "@components/SelectOptions";
import Canvas from "@components/Canvas";
import { isOpenEditorAtom, shapesAtom } from "@atoms";
import { useAtomValue } from "jotai";
import { useShapeEditing } from "@hooks";
import ShapeEditor from "@components/shape/ShapeEditor";
import { ShapeModel } from "@/types/Shape";

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
