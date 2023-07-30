import {Point} from "./models/IDjangoModels";

function distance(start: Point, end: Point)
{
  const dx = start.x - end.x
  const dy = start.y - end.y

  return Math.sqrt(dx * dx + dy * dy)
}

export function calculatePath(start: Point, end: Point) {
	const center = {
      x: (start.x + end.x) / 2,
      y: (start.y + end.y) / 2,
	}

	const controlPoint = {
      x: start.x + Math.min(
          distance(start, end),
          Math.abs(end.y - start.y) / 2,
          150
      ),
      y: start.y,
	};

	return `
      M ${start.x},${start.y} 
      Q ${controlPoint.x}, ${controlPoint.y} ${center.x},${center.y} 
      T ${end.x},${end.y}
    `;
}