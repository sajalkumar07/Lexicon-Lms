/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [clickPosition, setClickPosition] = useState(null);

  useEffect(() => {
    const addEventListeners = () => {
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mousedown", onMouseDown);
      document.addEventListener("mouseup", onMouseUp);

      const hoverElements = document.querySelectorAll(
        'button, a, [data-cursor-hover="true"]'
      );
      hoverElements.forEach((el) => {
        el.addEventListener("mouseenter", () => setIsHovering(true));
        el.addEventListener("mouseleave", () => setIsHovering(false));
      });
    };

    const removeEventListeners = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
    };

    const onMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const onMouseDown = (e) => {
      setClickPosition({ x: e.clientX, y: e.clientY });
    };

    const onMouseUp = () => {
      setClickPosition(null);
    };

    addEventListeners();
    return () => removeEventListeners();
  }, []);

  return (
    <>
      <style>{`
        body {
          cursor: none;
          user-select: none;
        }
      `}</style>
      <motion.div
        className="fixed pointer-events-none z-[9999] flex justify-center items-center"
        style={{
          left: position.x,
          top: position.y,
          transform: "translate(-50%, -50%)",
        }}
      >
        {/* Outer Ring */}
        <motion.div
          className="absolute w-16 h-16 border-2 border-orange-500 rounded-full"
          animate={{
            scale: isHovering ? 2 : 1,
            opacity: isHovering ? 0.7 : 0.3,
            borderColor: isHovering ? "rgb(234, 88, 12)" : "rgb(249, 115, 22)",
            borderWidth: isHovering ? 3 : 2,
          }}
          transition={{
            type: "spring",
            stiffness: 250,
            damping: 20,
          }}
        />

        {/* Inner Dot */}
        <motion.div
          className="w-3 h-3 bg-orange-500 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          animate={{
            backgroundColor: isHovering
              ? "rgb(234, 88, 12)"
              : "rgb(249, 115, 22)",
            scale: clickPosition ? 0.5 : 1,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
        />

        {/* Click Effect */}
        {clickPosition && (
          <motion.div
            className="absolute bg-orange-500/30 rounded-full"
            initial={{ scale: 0, opacity: 1 }}
            animate={{
              scale: 4,
              opacity: 0,
            }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
            }}
            style={{
              width: "2rem",
              height: "2rem",
              left: "-1rem",
              top: "-1rem",
            }}
          />
        )}

        {/* Subtle Glow Effect */}
        <motion.div
          className="absolute w-24 h-24 bg-orange-500/10 rounded-full blur-xl"
          animate={{
            scale: isHovering ? 1.5 : 1,
            opacity: isHovering ? 0.4 : 0.1,
          }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 30,
          }}
        />
      </motion.div>
    </>
  );
};

export default CustomCursor;
