from pyaxidraw import axidraw
from svgparse import *
import time

svg_file = "static/media/final_svgs/arrowtest2.svg"

ax = axidraw.AxiDraw()
ax.interactive()
if not ax.connect():
    quit()
ax.options.units = 1
ax.update()
ax.moveto(1, 1)

def draw_svg(svg):
    print
    c = 0
    ax.line(svg.x[c], svg.y[c])
    time.sleep(2)
    c += 1

# ax.plot(
ax.moveto(-1, -1)
ax.disconnect()
