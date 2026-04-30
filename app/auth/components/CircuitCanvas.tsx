"use client";

import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  size: number;
  pulse: number;
  speed: number;
  bright: boolean;
}

interface Line {
  a: number;
  b: number;
  delay: number;
}

interface Signal {
  line: Line;
  t: number;
  speed: number;
}

export function CircuitCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let nodes: Node[] = [];
    let lines: Line[] = [];
    let signals: Signal[] = [];

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
      init();
    }

    function init() {
      nodes = [];
      lines = [];
      signals = [];
      const W = canvas!.width;
      const H = canvas!.height;
      const cols = Math.floor(W / 90);
      const rows = Math.floor(H / 90);

      for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
          if (Math.random() > 0.45) continue;
          nodes.push({
            x: c * 90 + (Math.random() - 0.5) * 20,
            y: r * 90 + (Math.random() - 0.5) * 20,
            size: Math.random() * 2 + 0.5,
            pulse: Math.random() * Math.PI * 2,
            speed: 0.008 + Math.random() * 0.01,
            bright: Math.random() > 0.85,
          });
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x;
          const dy = nodes[j].y - nodes[i].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 140 && Math.random() > 0.4) {
            lines.push({ a: i, b: j, delay: Math.random() * 8000 });
          }
        }
      }
    }

    function maybeSpawnSignal() {
      if (!lines.length) return;
      if (signals.length < 6 && Math.random() < 0.02) {
        const line = lines[Math.floor(Math.random() * lines.length)];
        signals.push({ line, t: 0, speed: 0.004 + Math.random() * 0.006 });
      }
    }

    function draw(ts: number) {
      const W = canvas!.width;
      const H = canvas!.height;
      ctx!.clearRect(0, 0, W, H);

      // Lines
      for (const ln of lines) {
        const a = nodes[ln.a];
        const b = nodes[ln.b];
        const opacity = 0.06 + 0.04 * Math.sin(ts * 0.0005 + ln.delay);
        ctx!.beginPath();
        ctx!.moveTo(a.x, a.y);
        ctx!.lineTo(b.x, b.y);
        ctx!.strokeStyle = `rgba(0,229,255,${opacity})`;
        ctx!.lineWidth = 0.5;
        ctx!.stroke();
      }

      // Signals
      maybeSpawnSignal();
      signals = signals.filter((s) => {
        const a = nodes[s.line.a];
        const b = nodes[s.line.b];
        const x = a.x + (b.x - a.x) * s.t;
        const y = a.y + (b.y - a.y) * s.t;
        const grad = ctx!.createRadialGradient(x, y, 0, x, y, 5);
        grad.addColorStop(0, "rgba(0,229,255,0.9)");
        grad.addColorStop(1, "rgba(0,229,255,0)");
        ctx!.beginPath();
        ctx!.arc(x, y, 5, 0, Math.PI * 2);
        ctx!.fillStyle = grad;
        ctx!.fill();
        s.t += s.speed;
        return s.t <= 1;
      });

      // Nodes
      for (const n of nodes) {
        n.pulse += n.speed;
        const glow = 0.3 + 0.7 * Math.abs(Math.sin(n.pulse));
        const size = n.size * (n.bright ? 1.5 : 1);
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, size, 0, Math.PI * 2);
        ctx!.fillStyle = n.bright
          ? `rgba(0,229,255,${glow * 0.9})`
          : `rgba(0,229,255,${glow * 0.3})`;
        ctx!.fill();

        if (n.bright && glow > 0.7) {
          const g = ctx!.createRadialGradient(n.x, n.y, 0, n.x, n.y, 12);
          g.addColorStop(0, "rgba(0,229,255,0.2)");
          g.addColorStop(1, "rgba(0,229,255,0)");
          ctx!.beginPath();
          ctx!.arc(n.x, n.y, 12, 0, Math.PI * 2);
          ctx!.fillStyle = g;
          ctx!.fill();
        }
      }

      animId = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}