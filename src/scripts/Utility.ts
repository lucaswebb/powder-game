// Simple type for a tuple of numbers
type Vec2D = {x: number, y: number};

function getMouseCoords(event: MouseEvent): Vec2D {
    return {x: event.offsetX, y: event.offsetY}
}