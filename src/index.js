import {fromEvent} from 'rxjs';
import {map, pairwise, switchMap, takeUntil} from 'rxjs/operators'

const canvas = document.querySelector('canvas');
const rect = canvas.getBoundingClientRect();
const ctx = canvas.getContext('2d');
const scale = window.devicePixelRatio;

canvas.width = rect.width * scale;
canvas.height = rect.height * scale;

const mouseMove$ = fromEvent(canvas, 'mousemove');
const mouseDown$ = fromEvent(canvas, 'mousedown');
const mouseUp$ = fromEvent(canvas, 'mouseup');

const stream$ = mouseDown$
    .pipe(
        switchMap(() => {
            return mouseMove$
                .pipe(
                    map(e => ({
                        x: e.offsetX,
                        y: e.offsetY
                    })),
                    pairwise(),
                    takeUntil(mouseUp$)
                )
            }
        )
    );

stream$
    .subscribe(([from, to]) => {
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
    });