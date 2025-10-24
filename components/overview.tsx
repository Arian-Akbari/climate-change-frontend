import { motion } from 'framer-motion';

export const Overview = () => {
  // Simple and subtle animations
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 10, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        ease: [0.22, 1, 0.36, 1],
        duration: 0.7,
      },
    },
  };

  const fade = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        duration: 0.8,
      },
    },
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex-1 flex flex-col justify-center">
      {/* Main content */}
      <motion.div
        className="flex flex-col space-y-6 px-4 text-right rtl items-center justify-center"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Header */}
        <motion.div
          className="space-y-2 flex flex-col items-center justify-center"
          variants={item}
        >
          <motion.h2
            className="text-2xl md:text-3xl font-light"
            variants={item}
          >
            به دنیای ارتباطات هوشمند خوش آمدید
          </motion.h2>

          <motion.p
            className="text-sm text-black/60 dark:text-white/60"
            variants={item}
          >
            تمام مکالمات شما خصوصی و محرمانه باقی می‌مانند
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
};
