import { useEffect, useRef } from 'react';

export default function AnimatedBackground() {
  const pointerGlowRef = useRef(null);
  const gridMaskRef = useRef(null);

  useEffect(() => {
    // We use requestAnimationFrame to optimize the transform update
    let animationFrameId;
    let currentX = window.innerWidth / 2;
    let currentY = window.innerHeight / 2;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;

    const lerp = (start, end, factor) => start + (end - start) * factor;

    const animate = () => {
      // Extremely smooth interpolation tracking with slight delay for the giant light
      currentX = lerp(currentX, targetX, 0.05);
      currentY = lerp(currentY, targetY, 0.05);

      if (pointerGlowRef.current) {
        // Offset by half the width/height (350px) to center the huge 700px glow
        pointerGlowRef.current.style.transform = `translate(${currentX - 350}px, ${currentY - 350}px)`;
      }

      // The dot enlarger strictly follows the mouse closely for tactile response
      if (gridMaskRef.current) {
        gridMaskRef.current.style.maskImage = `radial-gradient(circle 120px at ${targetX}px ${targetY}px, black 40%, transparent 100%)`;
        gridMaskRef.current.style.WebkitMaskImage = `radial-gradient(circle 120px at ${targetX}px ${targetY}px, black 40%, transparent 100%)`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#000000]">
      
      {/* 1. Interactive Pointer Aurora (Huge glowing orb trailing cursor behind grid) */}
      <div 
        ref={pointerGlowRef}
        className="fixed top-0 left-0 w-[700px] h-[700px] rounded-[100%] bg-gradient-to-tr from-[#7c3aed]/50 to-[#2563eb]/40 blur-[150px] opacity-[0.15] will-change-transform z-10 pointer-events-none"
      />

      {/* 2. Continuous Bottom Aurora Animation (Purple and Blue) */}
      <div className="absolute bottom-[-20%] left-[-10%] w-[60vw] h-[60vh] rounded-[100%] bg-[#7c3aed] blur-[150px] opacity-[0.10] animate-aurora-purple z-0 pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vh] rounded-[100%] bg-[#2563eb] blur-[150px] opacity-[0.10] animate-aurora-blue z-0 pointer-events-none" />

      {/* 3. Base Seamlessly Scrolling Dotted Grid Layer (Faint, tiny dots) */}
      <div className="absolute inset-[-100px] w-[calc(100vw+200px)] h-[calc(100vh+200px)] z-20 opacity-[0.15]">
        <div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ffffff_1px,transparent_1px)] bg-[size:36px_36px] animate-grid-drift"
          style={{
            maskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, #000 40%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, #000 40%, transparent 100%)'
          }}
        ></div>
      </div>

      {/* 4. Interactive Highlighted Grid Layer (Larger dots revealed exactly where the cursor is) */}
      <div className="absolute inset-[-100px] w-[calc(100vw+200px)] h-[calc(100vh+200px)] z-30 opacity-[0.5]">
        <div 
          ref={gridMaskRef}
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ffffff_2px,transparent_2px)] bg-[size:36px_36px] animate-grid-drift transition-opacity duration-300"
          style={{
            // Mask is dynamically updated in JS to follow cursor
            maskImage: 'radial-gradient(circle 120px at 50% 50%, black 40%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(circle 120px at 50% 50%, black 40%, transparent 100%)'
          }}
        ></div>
      </div>

    </div>
  );
}
