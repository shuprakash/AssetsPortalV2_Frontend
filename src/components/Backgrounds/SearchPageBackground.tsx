import * as React from 'react';
import { useEffect, useRef } from 'react';
import { Box, useTheme } from '@mui/material';
import { getModeTokens } from '../../theme/etpTheme';

interface ISearchPageBackgroundProps {
  children: React.ReactNode;
}

interface IPoint {
  x: number;
  y: number;
}

interface IPad extends IPoint {
  r: number;
  ph: number;
  lit: number;
}

interface ITrace {
  pts: IPoint[];
  segs: number[];
  len: number;
  a: IPad;
  b: IPad;
}

interface IPulse {
  tr: ITrace;
  p: number;
  sp: number;
}

interface IChip {
  x: number;
  y: number;
  w: number;
  h: number;
  ph: number;
}

const TWO_PI = Math.PI * 2;

const roundedRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) => {
  const r = Math.min(radius, width / 2, height / 2);

  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
};

const SearchPageBackground = React.forwardRef<HTMLDivElement, ISearchPageBackgroundProps>(({ children }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = useTheme();

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;

    const ctx = cv.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let pads: IPad[] = [];
    let traces: ITrace[] = [];
    let pulses: IPulse[] = [];
    let chips: IChip[] = [];
    let pointerX = -9e9;
    let pointerY = -9e9;
    const startTime = performance.now();
    let animationFrame = 0;
    let resizeTimeout: ReturnType<typeof setTimeout>;

    const isLight = theme.palette.mode === 'light';
    const circuitColor = (alpha: number) => isLight ? `rgba(60,110,20,${alpha})` : `rgba(134,188,37,${alpha})`;
    const glowColor = (alpha: number) => isLight ? `rgba(90,150,30,${alpha})` : `rgba(163,230,53,${alpha})`;

    const makeTrace = (a: IPad, b: IPad): ITrace => {
      const horizontalFirst = Math.random() < 0.5;
      const channel = Math.min(Math.abs(a.x - b.x), Math.abs(a.y - b.y)) * 0.5;
      const points: IPoint[] = [{ x: a.x, y: a.y }];
      const sx = Math.sign(b.x - a.x);
      const sy = Math.sign(b.y - a.y);

      if (horizontalFirst) {
        points.push({ x: b.x - sx * channel, y: a.y }, { x: b.x, y: a.y + sy * channel });
      } else {
        points.push({ x: a.x, y: b.y - sy * channel }, { x: a.x + sx * channel, y: b.y });
      }

      points.push({ x: b.x, y: b.y });

      let len = 0;
      const segments: number[] = [];
      for (let i = 1; i < points.length; i += 1) {
        const distance = Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
        segments.push(distance);
        len += distance;
      }

      return { pts: points, segs: segments, len, a, b };
    };

    const build = () => {
      const gap = Math.max(64, Math.min(104, width / 15));
      pads = [];

      for (let y = gap * 0.55; y < height; y += gap) {
        for (let x = gap * 0.55; x < width; x += gap) {
          if (Math.random() < 0.34) continue;
          pads.push({
            x: x + (Math.random() - 0.5) * gap * 0.3,
            y: y + (Math.random() - 0.5) * gap * 0.3,
            r: Math.random() < 0.16 ? 3.1 : 1.7,
            ph: Math.random() * TWO_PI,
            lit: 0,
          });
        }
      }

      traces = [];
      for (let i = 0; i < pads.length; i += 1) {
        const a = pads[i];
        let made = 0;
        for (let j = i + 1; j < pads.length && made < 2; j += 1) {
          const b = pads[j];
          const distance = Math.hypot(a.x - b.x, a.y - b.y);
          if (distance < gap * 1.5 && Math.random() < 0.62) {
            traces.push(makeTrace(a, b));
            made += 1;
          }
        }
      }

      pulses = [];
      traces.forEach((trace) => {
        if (Math.random() < 0.14) {
          pulses.push({ tr: trace, p: Math.random(), sp: 0.0022 + Math.random() * 0.0038 });
        }
      });

      chips = [];
      const chipCount = width > 1200 ? 3 : 2;
      for (let i = 0; i < chipCount; i += 1) {
        const chipWidth = 70 + Math.random() * 70;
        const chipHeight = 52 + Math.random() * 46;
        chips.push({
          x: Math.random() * (width - chipWidth - 60) + 30,
          y: Math.random() * (height - chipHeight - 60) + 30,
          w: chipWidth,
          h: chipHeight,
          ph: Math.random() * TWO_PI,
        });
      }
    };

    const pointAtTrace = (trace: ITrace, progress: number): IPoint => {
      let distance = progress * trace.len;
      for (let i = 0; i < trace.segs.length; i += 1) {
        if (distance <= trace.segs[i] || i === trace.segs.length - 1) {
          const segmentProgress = trace.segs[i] ? distance / trace.segs[i] : 0;
          const pointA = trace.pts[i];
          const pointB = trace.pts[i + 1];
          return {
            x: pointA.x + (pointB.x - pointA.x) * segmentProgress,
            y: pointA.y + (pointB.y - pointA.y) * segmentProgress,
          };
        }
        distance -= trace.segs[i];
      }
      return trace.pts[trace.pts.length - 1];
    };

    const size = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = cv.clientWidth;
      height = cv.clientHeight;
      cv.width = Math.max(1, width * dpr);
      cv.height = Math.max(1, height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    };

    const draw = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      ctx.clearRect(0, 0, width, height);

      ctx.lineWidth = 1;
      chips.forEach((chip) => {
        ctx.strokeStyle = circuitColor(0.16);
        ctx.fillStyle = circuitColor(0.05);
        ctx.beginPath();
        roundedRect(ctx, chip.x, chip.y, chip.w, chip.h, 6);
        ctx.fill();
        ctx.stroke();

        ctx.strokeStyle = circuitColor(0.13);
        for (let i = 1; i < 6; i += 1) {
          const gridY = chip.y + chip.h * i / 6;
          ctx.beginPath();
          ctx.moveTo(chip.x - 9, gridY);
          ctx.lineTo(chip.x, gridY);
          ctx.moveTo(chip.x + chip.w, gridY);
          ctx.lineTo(chip.x + chip.w + 9, gridY);
          ctx.stroke();
        }

        ctx.strokeStyle = circuitColor(0.1);
        ctx.beginPath();
        roundedRect(ctx, chip.x + 7, chip.y + 7, chip.w - 14, chip.h - 14, 4);
        ctx.stroke();

        const blink = (Math.sin(elapsed * 1.6 + chip.ph) + 1) / 2;
        ctx.fillStyle = glowColor(0.18 + blink * 0.5);
        ctx.beginPath();
        ctx.arc(chip.x + chip.w - 12, chip.y + 11, 2.1, 0, TWO_PI);
        ctx.fill();
      });

      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 1;
      ctx.strokeStyle = circuitColor(0.13);
      ctx.beginPath();
      traces.forEach((trace) => {
        ctx.moveTo(trace.pts[0].x, trace.pts[0].y);
        for (let i = 1; i < trace.pts.length; i += 1) {
          ctx.lineTo(trace.pts[i].x, trace.pts[i].y);
        }
      });
      ctx.stroke();

      pads.forEach((pad) => {
        const pointerDistance = Math.hypot(pad.x - pointerX, pad.y - pointerY);
        const near = pointerDistance < 150 ? 1 - pointerDistance / 150 : 0;
        pad.lit += (near * near - pad.lit) * 0.09;
        const brightness = 0.18 + 0.14 * (Math.sin(elapsed * 1.3 + pad.ph) + 1) / 2 + pad.lit * 0.62;
        ctx.fillStyle = glowColor(brightness);
        ctx.beginPath();
        ctx.arc(pad.x, pad.y, pad.r, 0, TWO_PI);
        ctx.fill();

        if (pad.r > 2.4 || pad.lit > 0.25) {
          ctx.strokeStyle = circuitColor(0.14 + pad.lit * 0.45);
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(pad.x, pad.y, pad.r + 3.4, 0, TWO_PI);
          ctx.stroke();
        }
      });

      pulses.forEach((pulse) => {
        pulse.p += pulse.sp;
        if (pulse.p > 1) {
          pulse.p = 0;
          pulse.tr = traces[(Math.random() * traces.length) | 0] || pulse.tr;
        }

        const head = pointAtTrace(pulse.tr, pulse.p);
        const tail = pointAtTrace(pulse.tr, Math.max(0, pulse.p - 0.16));
        const gradient = ctx.createLinearGradient(tail.x, tail.y, head.x, head.y);
        gradient.addColorStop(0, circuitColor(0));
        gradient.addColorStop(1, glowColor(0.75));
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.7;
        ctx.beginPath();
        ctx.moveTo(tail.x, tail.y);
        ctx.lineTo(head.x, head.y);
        ctx.stroke();

        ctx.fillStyle = glowColor(0.95);
        ctx.beginPath();
        ctx.arc(head.x, head.y, 1.9, 0, TWO_PI);
        ctx.fill();
      });

      animationFrame = requestAnimationFrame(draw);
    };

    const handleMove = (event: PointerEvent) => {
      const rect = cv.getBoundingClientRect();
      pointerX = event.clientX - rect.left;
      pointerY = event.clientY - rect.top;
    };

    const handleLeave = () => {
      pointerX = -9e9;
      pointerY = -9e9;
    };

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(size, 160);
    };

    const parent = cv.parentElement;
    if (parent) {
      parent.addEventListener('pointermove', handleMove);
      parent.addEventListener('pointerleave', handleLeave);
    }
    window.addEventListener('resize', handleResize);

    size();
    animationFrame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrame);
      clearTimeout(resizeTimeout);
      if (parent) {
        parent.removeEventListener('pointermove', handleMove);
        parent.removeEventListener('pointerleave', handleLeave);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [theme.palette.mode]);

  return (
    <Box
      ref={ref}
      sx={(theme) => {
        const tokens = getModeTokens(theme.palette.mode);
        return {
          position: 'relative',
          width: '100%',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3.75,
          px: 3,
          py: 4,
          textAlign: 'center',
          overflow: 'hidden',
          color: tokens.text,
          background: theme.palette.mode === 'light'
            ? 'radial-gradient(60% 45% at 50% 108%, rgba(134,188,37,.3), transparent 70%), linear-gradient(180deg,#f4f7ee 0%,#eaf1e0 55%,#dceac9 100%)'
            : 'radial-gradient(60% 45% at 50% 108%, rgba(134,188,37,.34), transparent 70%), linear-gradient(180deg,#04060a 0%,#060b06 42%,#0a1608 74%,#0f2510 100%)',
          '&:before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            opacity: theme.palette.mode === 'light' ? 0.18 : 0.28,
            backgroundImage: `
              linear-gradient(90deg, rgba(134,188,37,.22) 1px, transparent 1px),
              linear-gradient(0deg, rgba(134,188,37,.18) 1px, transparent 1px),
              radial-gradient(circle at 22% 28%, rgba(163,230,53,.32) 0 2px, transparent 3px),
              radial-gradient(circle at 68% 38%, rgba(134,188,37,.3) 0 2px, transparent 3px),
              radial-gradient(circle at 45% 72%, rgba(18,163,160,.22) 0 2px, transparent 3px)
            `,
            backgroundSize: '96px 96px, 96px 96px, 180px 180px, 220px 220px, 260px 260px',
            maskImage: 'radial-gradient(circle at 50% 46%, black 0%, transparent 78%)',
          },
        };
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          width: '100%',
          height: '100%',
          display: 'block',
          pointerEvents: 'none',
        }}
      />
      {children}
    </Box>
  );
});

SearchPageBackground.displayName = 'SearchPageBackground';

export default SearchPageBackground;
