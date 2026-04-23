import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-gradient-to-b from-white via-blue-50 to-white overflow-hidden">

      <motion.div
        className="absolute top-20 left-20 w-[300px] h-[300px] bg-blue-200 rounded-full blur-[140px]"
        animate={{ x:[0,120,0], y:[0,-80,0] }}
        transition={{ duration:18, repeat:Infinity }}
      />

      <motion.div
        className="absolute bottom-20 right-20 w-[260px] h-[260px] bg-indigo-200 rounded-full blur-[120px]"
        animate={{ x:[0,-100,0], y:[0,120,0] }}
        transition={{ duration:20, repeat:Infinity }}
      />

    </div>
  );
}