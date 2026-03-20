import { useEffect, useRef } from 'react'
import './Cursor.css'

export default function Cursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const mx = useRef(0)
  const my = useRef(0)
  const rx = useRef(0)
  const ry = useRef(0)

  useEffect(() => {
    const onMove = (e) => {
      mx.current = e.clientX
      my.current = e.clientY
    }
    document.addEventListener('mousemove', onMove)

    let raf
    const animate = () => {
      if (dotRef.current) {
        dotRef.current.style.left = mx.current + 'px'
        dotRef.current.style.top = my.current + 'px'
      }
      rx.current += (mx.current - rx.current) * 0.12
      ry.current += (my.current - ry.current) * 0.12
      if (ringRef.current) {
        ringRef.current.style.left = rx.current + 'px'
        ringRef.current.style.top = ry.current + 'px'
      }
      raf = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      document.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div id="cursor">
      <div id="cursor-ring" ref={ringRef}></div>
      <div id="cursor-dot" ref={dotRef}></div>
    </div>
  )
}
