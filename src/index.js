import {fromEvent} from 'rxjs';
import {map} from 'rxjs/operators'

const canvas = document.querySelector('canvas');
const rect = canvas.getBoundingClientRect();
const ctx = canvas.getContext('2d');
const scale = window.devicePixelRatio;

canvas.width = rect.width * scale;
canvas.height = rect.height * scale;

const mouseMove$ = fromEvent(canvas, 'mousemove')
  .pipe(
      map(e => ({
          x: e.offsetX,
          y: e.offsetY
      }))
  );

mouseMove$
  .subscribe(coords => {
      ctx.fillRect(coords.x, coords.y, 2, 2)
  });