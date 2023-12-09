interface ShapeStyle {
  background: string | number;
  borderRadius: string | number;
}

interface ShapeStyleMap {
  [shape: string]: ShapeStyle;
}

interface ShapeModel {
  id: string;
  selected: boolean;
  element: HTMLElement | null;
  left: number;
  top: number;
  width: number;
  height: number;
  borderRadius: string | number;
  background: string;
  zIndex: number;
  rotateAngle: number;
}

interface Delta {
  deltaX: number;
  deltaY: number;
}

interface Rect {
  right: number;
  width: number;
  height: number;
  left: number;
  top: number;
  bottom: number;
}

export type { ShapeStyleMap, ShapeModel, Delta, Rect };
