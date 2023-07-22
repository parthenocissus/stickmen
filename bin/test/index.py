from pyaxidraw import axidraw
from svgparse import *
import time

svg_file = "static/media/final_svgs/arrowtest2.svg"

svg_split_paths = []

ax = axidraw.AxiDraw()
ax.interactive()
if not ax.connect():
    quit()
# ax.options.units = 1
ax.update()

counter = 0

def divide_conq(svg_split_paths):
    for path in svg_split_paths:
        ax.plot_setup(svg_split_paths[path])
        ax.moveto(1, 1)
        ax.plot_run(True)
        counter = counter + 1
        time.sleep(2)
        print(counter + " paths plotted")
        ax.moveto(1, 1) # if the cords remain relative when split then comment this out


divide_conq(svg_split_paths)
ax.moveto(-1, -1)
ax.disconnect()
