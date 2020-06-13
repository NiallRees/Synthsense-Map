import React from 'react'
import { CanvasOverlay } from 'react-map-gl'

// From https://stackoverflow.com/questions/808826/draw-arrow-on-canvas-tag
function addArrow(ctx, fromx, fromy, tox, toy) {
  var headlen = 12; // length of head in pixels
  var dx = tox - fromx;
  var dy = toy - fromy;
  var midx = (fromx + tox) / 2
  var midy = (fromy + toy) / 2
  var angle = Math.atan2(dy, dx);
  ctx.moveTo(midx, midy);
  ctx.lineTo(midx - headlen * Math.cos(angle - Math.PI / 6), midy - headlen * Math.sin(angle - Math.PI / 6));
  ctx.moveTo(midx, midy);
  ctx.lineTo(midx - headlen * Math.cos(angle + Math.PI / 6), midy - headlen * Math.sin(angle + Math.PI / 6));
  ctx.moveTo(tox, toy);
}

// Inspired by https://github.com/uber/react-map-gl/issues/591#issuecomment-454307294
export default function PolylineOverlay (props) {
  const redraw = ({ width, height, ctx, isDragging, project }) => {
    const { points, color = 'red', lineWidth = 2, renderWhileDragging = true } = props
    var lastPixel = null
    ctx.clearRect(0, 0, width, height)
    ctx.globalCompositeOperation = 'lighter'

    if ((renderWhileDragging || !isDragging) && points) {
      ctx.lineWidth = lineWidth
      ctx.strokeStyle = color
      ctx.beginPath()
      points.forEach(point => {
        const pixel = project([point[0], point[1]])
        ctx.lineTo(pixel[0], pixel[1])
        if(lastPixel) {
          addArrow(ctx, lastPixel[0], lastPixel[1], pixel[0], pixel[1])
        }
        lastPixel = pixel
      })
      ctx.stroke()
    }
  }

  return <CanvasOverlay redraw={redraw} />
}