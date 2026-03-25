import { useEffect } from "react";

const CustomCursor = () => {
  useEffect(() => {
    // Create cursor elements
    const cursor = document.createElement("div");
    cursor.id = "cursor";

    const dot = document.createElement("div");
    dot.id = "cursor-dot";

    const ring = document.createElement("div");
    ring.id = "cursor-ring";

    cursor.appendChild(dot);
    cursor.appendChild(ring);
    document.body.appendChild(cursor);

    // Handle mouse move
    const onMouseMove = (e) => {
      const { clientX, clientY } = e;

      // Update dot position
      dot.style.left = clientX + "px";
      dot.style.top = clientY + "px";

      // Update ring position
      ring.style.left = clientX + "px";
      ring.style.top = clientY + "px";
    };

    // Add hover effect for interactive elements
    const onMouseOver = (e) => {
      const target = e.target;
      if (target.matches('a, button, .interactive, [role="button"]')) {
        ring.style.width = "48px";
        ring.style.height = "48px";
        ring.style.borderColor = "var(--gold)";
        ring.style.backgroundColor = "rgba(255, 34, 51, 0.1)";
        ring.style.transition =
          "width 0.2s, height 0.2s, border-color 0.2s, background-color 0.2s";
      }
    };

    const onMouseOut = (e) => {
      const target = e.target;
      if (target.matches('a, button, .interactive, [role="button"]')) {
        ring.style.width = "36px";
        ring.style.height = "36px";
        ring.style.borderColor = "rgba(255, 34, 51, 0.6)";
        ring.style.backgroundColor = "transparent";
      }
    };

    // Add click effect
    const onMouseDown = () => {
      ring.style.transform = "translate(-50%, -50%) scale(0.8)";
    };

    const onMouseUp = () => {
      ring.style.transform = "translate(-50%, -50%) scale(1)";
    };

    // Add event listeners
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);

    // Hide default cursor
    document.body.style.cursor = "none";

    // Cleanup function
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);

      document.body.style.cursor = "auto";
      cursor.remove();
    };
  }, []);

  return null;
};

export default CustomCursor;
