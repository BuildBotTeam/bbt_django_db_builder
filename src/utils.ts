import {Point} from "./models/IDjangoModels";

function distance(start: Point, end: Point) {
    const dx = start.x - end.x
    const dy = start.y - end.y

    return Math.sqrt(dx * dx + dy * dy)
}

function getControlPoint(start: Point, end: Point) {
    return {
        x: start.x + Math.min(
            distance(start, end),
            Math.abs(end.y - start.y) / 2,
            20
        ) * (end.x - start.x) / Math.abs(start.x - end.x),
        y: start.y,
    }
}

export function calculatePath(in_start: Point, in_end: Point) {
    const start = {...in_start}
    const end = {...in_end}

    const center = {
        x: (start.x + end.x) / 2,
        y: (start.y + end.y) / 2,
    }



    if (start.x + start.width < end.x) {
        start.x += start.width
        center.x += start.width / 2
    } else if (start.x > end.x + end.width) {
        end.x += end.width
        center.x += end.width / 2
    } else {
        center.x -= (start.width / 2) + Math.abs(start.x - end.x) * 0.5
        center.y -= (start.x - end.x) * 0.25 * (end.y - start.y) / Math.abs(start.y - end.y)
        return `
      M ${Math.round(start.x)},${Math.round(start.y)} 
      Q ${Math.round(center.x)}, ${Math.round(center.y)} ${Math.round(end.x)},${Math.round(end.y)} 
    `;
    }
    const controlPoint = getControlPoint(start, end)
    return `
      M ${Math.round(start.x)},${Math.round(start.y)} 
      Q ${Math.round(controlPoint.x)}, ${Math.round(controlPoint.y)} ${Math.round(center.x)},${Math.round(center.y)} 
      T ${Math.round(end.x)},${Math.round(end.y)}
    `;
}

export function capFirstLetter(str: string){
        return str.charAt(0).toUpperCase() + str.slice(1);
    }