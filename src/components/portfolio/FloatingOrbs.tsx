import { motion, useScroll, useTransform } from "framer-motion";
import { useMousePosition } from "./motion";

export function FloatingOrbs() {
  const { scrollY } = useScroll();
  const { x: mx, y: my } = useMousePosition();

  const y1 = useTransform(scrollY, [0, 2000], [0, -200]);
  const y2 = useTransform(scrollY, [0, 2000], [0, 300]);
  const y3 = useTransform(scrollY, [0, 2000], [0, -400]);

  const px1 = useTransform(mx, [-1, 1], [-20, 20]);
  const py1 = useTransform(my, [-1, 1], [-20, 20]);
  const px2 = useTransform(mx, [-1, 1], [25, -25]);
  const py2 = useTransform(my, [-1, 1], [25, -25]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
      <div className="absolute inset-0 bg-grid opacity-[0.35]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(34,224,199,0.10),transparent_55%)]" />
      <motion.div
        style={{ y: y1, x: px1, translateY: py1 }}
        className="absolute -top-20 -left-32 h-[420px] w-[420px] rounded-full blur-[120px] opacity-50"
      >
        <div className="h-full w-full rounded-full bg-[#22E0C7]/40" />
      </motion.div>
      <motion.div
        style={{ y: y2, x: px2, translateY: py2 }}
        className="absolute top-[40%] -right-40 h-[480px] w-[480px] rounded-full blur-[140px] opacity-40"
      >
        <div className="h-full w-full rounded-full bg-[#F2A65A]/30" />
      </motion.div>
      <motion.div
        style={{ y: y3 }}
        className="absolute bottom-0 left-1/3 h-[360px] w-[360px] rounded-full blur-[120px] opacity-30"
      >
        <div className="h-full w-full rounded-full bg-[#22E0C7]/25" />
      </motion.div>
    </div>
  );
}
