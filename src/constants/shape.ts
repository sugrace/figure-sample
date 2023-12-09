import { ShapeStyleMap } from "@/types/ShapeModel";

const SHAPE_TYPE = {
  BOX: "Box",
  CIRCLE: "Circle",
};

const SHAPE_ACTION_TYPE = {
  DRAWING: "drawing",
  MOVING: "moving",
  RESIZING: "resizing",
};

const SHAPE_TYPE_MAP: ShapeStyleMap = {
  Circle: {
    borderRadius: "50%",
    background: "",
  },
  Box: {
    borderRadius: "0",
    background: "",
  },
};

export { SHAPE_TYPE, SHAPE_ACTION_TYPE, SHAPE_TYPE_MAP };
