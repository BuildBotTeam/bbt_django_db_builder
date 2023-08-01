import {Point} from "./models/IDjangoModels";

function distance(start: Point, end: Point) {
    const dx = start.x - end.x
    const dy = start.y - end.y

    return Math.sqrt(dx * dx + dy * dy)
}

export function calculatePath(start: Point, end: Point) {
    const center = {
        x: (start.x + end.x) / 2,
        y: (start.y + end.y) / 2,
    }

    if (start.x + start.width < end.x) {
        start.x += start.width
        center.x += start.width / 2
        let controlPoint = {
            x: start.x + Math.min(
                distance(start, end),
                Math.abs(end.y - start.y) / 2,
                20
            ) * (end.x - start.x) / Math.abs(start.x - end.x),
            y: start.y,
        };
        console.log(1)
        return `
      M ${Math.round(start.x)},${Math.round(start.y)} 
      Q ${Math.round(controlPoint.x)}, ${Math.round(controlPoint.y)} ${Math.round(center.x)},${Math.round(center.y)} 
      T ${Math.round(end.x)},${Math.round(end.y)}
    `;
    } else if (start.x > end.x + end.width) {
        end.x += end.width + 20
        start.x -= 20
        center.x += start.width / 2
        console.log(2)
         let controlPoint = {
            x: start.x + Math.min(
                distance(start, end),
                Math.abs(end.y - start.y) / 2,
                20
            ) * (end.x - start.x) / Math.abs(start.x - end.x),
            y: start.y,
        };
        return `
      M ${Math.round(start.x)},${Math.round(start.y)} 
      Q ${Math.round(controlPoint.x)}, ${Math.round(controlPoint.y)} ${Math.round(center.x)},${Math.round(center.y)} 
      T ${Math.round(end.x)},${Math.round(end.y)}
    `;
    } else if (start.x > end.x || end.x + end.width > start.x + start.width) {
        start.x -= 20
        center.x -= start.width / 2
        console.log(3,Math.abs( start.y - end.y) * 0.5)
        return `
      M ${Math.round(start.x)},${Math.round(start.y)} 
      Q ${Math.round(center.x * 0.5)}, ${Math.round(center.y + Math.abs(start.y - end.y) * 0.25)} ${Math.round(end.x)},${Math.round(end.y)} 
    `;
    }
}