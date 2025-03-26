/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const AnimatedKnowledgeGlobe = ({
  className = "",
  particleCount = 12000,
  interactive = true,
}) => {
  const containerRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === "undefined" || !containerRef.current) return;

    const container = containerRef.current;

    // Responsive size calculation
    const getSize = () => {
      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;
      return { width, height };
    };

    // Three.js scene setup
    const scene = new THREE.Scene();
    const { width, height } = getSize();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // Adjust globe complexity based on device capabilities
    const adjustedParticleCount =
      window.innerWidth < 768 ? particleCount / 2 : particleCount;

    // Create educational-themed background
    const knowledgeGeometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(adjustedParticleCount * 3);
    const originalPosArray = new Float32Array(adjustedParticleCount * 3);
    const colorArray = new Float32Array(adjustedParticleCount * 3);
    const velocityArray = new Float32Array(adjustedParticleCount * 3);

    // Create a more dynamic knowledge globe
    for (let i = 0; i < adjustedParticleCount * 3; i += 3) {
      // Enhanced spherical distribution
      const radius = 10 + Math.random() * 0.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      posArray[i] = x;
      posArray[i + 1] = y;
      posArray[i + 2] = z;

      // Store original positions for reset
      originalPosArray[i] = x;
      originalPosArray[i + 1] = y;
      originalPosArray[i + 2] = z;

      // More dynamic color coding
      const colorType = Math.random();
      if (colorType < 0.3) {
        colorArray[i] = 0.1;
        colorArray[i + 1] = 0.4;
        colorArray[i + 2] = 0.9;
      } else if (colorType < 0.6) {
        colorArray[i] = 0.2;
        colorArray[i + 1] = 0.7;
        colorArray[i + 2] = 0.3;
      } else {
        colorArray[i] = 0.5;
        colorArray[i + 1] = 0.2;
        colorArray[i + 2] = 0.7;
      }

      // Add subtle velocity for interactive movement
      velocityArray[i] = (Math.random() - 0.5) * 0.01;
      velocityArray[i + 1] = (Math.random() - 0.5) * 0.01;
      velocityArray[i + 2] = (Math.random() - 0.5) * 0.01;
    }

    knowledgeGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(posArray, 3)
    );
    knowledgeGeometry.setAttribute(
      "originalPosition",
      new THREE.BufferAttribute(originalPosArray, 3)
    );
    knowledgeGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(colorArray, 3)
    );
    knowledgeGeometry.setAttribute(
      "velocity",
      new THREE.BufferAttribute(velocityArray, 3)
    );

    // Enhanced particle material
    const knowledgeMaterial = new THREE.PointsMaterial({
      size: window.innerWidth < 768 ? 0.03 : 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const knowledgeMesh = new THREE.Points(
      knowledgeGeometry,
      knowledgeMaterial
    );
    scene.add(knowledgeMesh);

    // Advanced wireframe globe
    const wireframeGeometry = new THREE.SphereGeometry(10.2, 40, 40);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x3498db,
      wireframe: true,
      transparent: true,
      opacity: 0.1,
    });
    const wireframeMesh = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
    scene.add(wireframeMesh);

    camera.position.z = 15;

    // Cursor movement interaction
    const handleMouseMove = (event) => {
      if (!interactive) return;

      // Get container's bounding rectangle
      const rect = container.getBoundingClientRect();

      // Normalize mouse coordinates
      const mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // Store mouse position for use in animation
      mouseRef.current = { x: mouseX, y: mouseY };
    };

    // Animate particles and globe
    const animate = () => {
      if (!container) return;

      requestAnimationFrame(animate);

      // Get current positions, original positions, and velocities
      const positions = knowledgeGeometry.getAttribute("position");
      const originalPositions =
        knowledgeGeometry.getAttribute("originalPosition");
      const velocities = knowledgeGeometry.getAttribute("velocity");

      // Interactive particle movement
      for (let i = 0; i < adjustedParticleCount; i++) {
        // Subtle displacement based on mouse movement
        const displacementFactor = 0.2;
        const offsetX = mouseRef.current.x * displacementFactor;
        const offsetY = mouseRef.current.y * displacementFactor;

        // Lerp between original and displaced position
        positions.array[i * 3] = THREE.MathUtils.lerp(
          originalPositions.array[i * 3],
          originalPositions.array[i * 3] + offsetX,
          0.1
        );
        positions.array[i * 3 + 1] = THREE.MathUtils.lerp(
          originalPositions.array[i * 3 + 1],
          originalPositions.array[i * 3 + 1] + offsetY,
          0.1
        );

        // Subtle rotation and pulsing
        positions.array[i * 3 + 2] += Math.sin(Date.now() * 0.001 + i) * 0.01;
      }

      positions.needsUpdate = true;

      // Rotate the entire mesh subtly
      knowledgeMesh.rotation.y += 0.001;
      wireframeMesh.rotation.y += 0.001;

      renderer.render(scene, camera);
    };

    // Event listeners
    if (interactive) {
      container.addEventListener("mousemove", handleMouseMove);
    }

    animate();

    // Responsive handling
    const handleResize = () => {
      if (!container) return;

      const { width, height } = getSize();

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);

      // Adjust particle size for different screen sizes
      knowledgeMaterial.size = window.innerWidth < 768 ? 0.03 : 0.04;
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (interactive) {
        container?.removeEventListener("mousemove", handleMouseMove);
      }
      container?.removeChild(renderer.domElement);
    };
  }, [particleCount, interactive]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full min-h-[300px] sm:min-h-[400px] md:min-h-[500px] ${className}`}
    />
  );
};

export default AnimatedKnowledgeGlobe;
