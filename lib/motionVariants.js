/** Shared Framer Motion presets for the marketing homepage */

export const easeSmooth = [0.22, 1, 0.36, 1];

export const sectionVariants = {
  fadeUp: {
    hidden: { opacity: 0, y: 48, filter: "blur(6px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.72, ease: easeSmooth }
    }
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.65, ease: easeSmooth }
    }
  },
  slideUp: {
    hidden: { opacity: 0, y: 64 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.68, ease: easeSmooth }
    }
  },
  slideInLeft: {
    hidden: { opacity: 0, x: -48 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.62, ease: easeSmooth }
    }
  },
  slideInRight: {
    hidden: { opacity: 0, x: 48 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.62, ease: easeSmooth }
    }
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.94 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: easeSmooth }
    }
  }
};

export function staggerContainer(stagger = 0.08, delayChildren = 0.06) {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren }
    }
  };
}

export const staggerItem = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.52, ease: easeSmooth }
  }
};

export const staggerItemWide = {
  hidden: { opacity: 0, y: 32, x: -8 },
  visible: {
    opacity: 1,
    y: 0,
    x: 0,
    transition: { duration: 0.55, ease: easeSmooth }
  }
};

export const heroStagger = staggerContainer(0.11, 0.08);
