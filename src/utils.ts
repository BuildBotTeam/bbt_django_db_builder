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
    const border = 20

    if (start.x + start.width + border < end.x) {
        start.x += start.width
        center.x += start.width / 2
        console.log(1)
    } else if (start.x > end.x + end.width + border) {
        console.log(3)
    } else if (start.x > end.x || end.x + end.width > start.x + start.width) {
        start.x -= 20
        center.x -= start.width / 2
        center.y = 400
        // start.x += start.width
        console.log(start.height, end.height, center)
    }

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
}