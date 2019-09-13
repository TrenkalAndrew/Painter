import {fromEvent} from 'rxjs';
import {map, pairwise, switchMap, takeUntil, startWith, withLatestFrom} from 'rxjs/operators'

const canvas = document.querySelector('canvas');
const rect = canvas.getBoundingClientRect();
const ctx = canvas.getContext('2d');
const scale = window.devicePixelRatio;

canvas.width = rect.width * scale;
canvas.height = rect.height * scale;

const range = document.getElementById('range');
const color = document.getElementById('color');

const mouseMove$ = fromEvent(canvas, 'mousemove');
const mouseDown$ = fromEvent(canvas, 'mousedown');
const mouseUp$ = fromEvent(canvas, 'mouseup');
const mouseOut$ = fromEvent(canvas, 'mouseout');
const range$ = fromEvent(range, 'input')
    .pipe(
        map(e => e.target.value),
        startWith(range.value)
    );

const color$ = fromEvent(color, 'input')
    .pipe(
        map(e => e.target.value),
        startWith(color.value)
    );

const stream$ = mouseDown$
    .pipe(
        withLatestFrom(range$, color$, (_, lineWidth, color) => ({
            lineWidth,
            color
        })),
        switchMap(({lineWidth, color}) => {
            return mouseMove$
                .pipe(
                    map(e => ({
                        x: e.offsetX,
                        y: e.offsetY,
                        lineWidth,
                        color
                    })),
                    pairwise(),
                    takeUntil(mouseUp$),
                    takeUntil(mouseOut$)
                )
            }
        )
    );

stream$
    .subscribe(([from, to]) => {
        const {lineWidth, color} = from;

        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
    });