/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-case-declarations */
/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

/**
 * Custom hook for applying scroll-based GSAP animations
 * @param {Object} options - Configuration options for animations
 * @returns {Object} Ref to be attached to the component
 */
export const useScrollAnimations = (options = {}) => {
  const {
    // Default animation options
    revealType = "fade-slide", // Options: 'fade-slide', 'scale', 'rotate'
    direction = "up", // For slide animations: 'up', 'down', 'left', 'right'
    triggerPosition = "70%", // When to start the animation
    stagger = 0.2, // Stagger delay between child elements
    duration = 1, // Animation duration
    ease = "power3.out", // GSAP easing function
  } = options;

  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Determine initial and animation properties based on revealType
    const getAnimationProps = () => {
      switch (revealType) {
        case "fade-slide":
          const slideDirections = {
            up: { y: 50, x: 0 },
            down: { y: -50, x: 0 },
            left: { x: 50, y: 0 },
            right: { x: -50, y: 0 },
          };
          return {
            from: {
              opacity: 0,
              ...slideDirections[direction],
              scale: 0.9,
            },
            to: {
              opacity: 1,
              y: 0,
              x: 0,
              scale: 1,
            },
          };

        case "scale":
          return {
            from: {
              opacity: 0,
              scale: 0.5,
            },
            to: {
              opacity: 1,
              scale: 1,
            },
          };

        case "rotate":
          return {
            from: {
              opacity: 0,
              rotation: -15,
              scale: 0.9,
            },
            to: {
              opacity: 1,
              rotation: 0,
              scale: 1,
            },
          };

        default:
          return {
            from: { opacity: 0 },
            to: { opacity: 1 },
          };
      }
    };

    const { from, to } = getAnimationProps();

    // Check if container has children to apply stagger animation
    const children = container.children;
    const hasMultipleChildren = children.length > 1;

    // Prepare animation configuration
    const animationConfig = hasMultipleChildren
      ? {
          targets: children,
          ...from,
          opacity: to.opacity,
          y: to.y,
          x: to.x,
          scale: to.scale,
          duration,
          stagger,
          ease,
          scrollTrigger: {
            trigger: container,
            start: `top ${triggerPosition}`,
            toggleActions: "play none none reverse",
          },
        }
      : {
          targets: container,
          ...from,
          ...to,
          duration,
          ease,
          scrollTrigger: {
            trigger: container,
            start: `top ${triggerPosition}`,
            toggleActions: "play none none reverse",
          },
        };

    // Create the GSAP animation
    gsap.fromTo(
      animationConfig.targets,
      {
        opacity: animationConfig.from.opacity,
        y: animationConfig.from.y,
        x: animationConfig.from.x,
        scale: animationConfig.from.scale,
      },
      {
        opacity: animationConfig.opacity,
        y: animationConfig.y,
        x: animationConfig.x,
        scale: animationConfig.scale,
        duration: animationConfig.duration,
        stagger: animationConfig.stagger,
        ease: animationConfig.ease,
        scrollTrigger: animationConfig.scrollTrigger,
      }
    );

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return containerRef;
};

// Wrapper component for easy animation application
export const ScrollAnimationWrapper = ({
  children,
  revealType = "fade-slide",
  direction = "up",
  className = "",
  ...rest
}) => {
  const ref = useScrollAnimations({
    revealType,
    direction,
    ...rest,
  });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};
