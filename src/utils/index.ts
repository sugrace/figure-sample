import { Delta } from "@/types/Shape";

const getOriginRect = (selectedElement: HTMLElement) => {
  const width = selectedElement.offsetWidth;
  const height = selectedElement.offsetHeight;
  const left = selectedElement.offsetLeft;
  const right = left + width;
  const top = selectedElement.offsetTop;
  const bottom = top - height;

  return { left, right, top, bottom, width, height };
};

const getRotatedDelta = (angle: number, { deltaX, deltaY }: Delta) => {
  const radian = angle * (Math.PI / 180);
  const rotatedX = Math.cos(radian) * deltaX + Math.sin(radian) * deltaY;
  const rotatedY = Math.cos(radian) * deltaY - Math.sin(radian) * deltaX;
  return { deltaX: rotatedX, deltaY: rotatedY };
};

export { getOriginRect, getRotatedDelta };
