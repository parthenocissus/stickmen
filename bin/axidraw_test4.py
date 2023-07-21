from pyaxidraw import axidraw
from svgpathtools import svg2paths
import time

# svg_file = "static/media/final_svgs/arrows_002_random_order_test2.svg"
svg_file = "static/media/final_svgs/arrowtest2.svg"

ad = axidraw.AxiDraw()
ad.interactive()
if not ad.connect():
    quit()

# ad.plot_setup(svg_file)
# ad.options.units = 1
ad.update()
paths, attributes = svg2paths(svg_file)
ad.moveto(1, 1)

threads = []
points = []

def draw_and_wait(path):
    # ad.line(path[0].start.real, path[0].start.real)
    points.append({
        "x": path[0].start.real,
        "y": path[0].start.imag
    })
    # ad.pendown()
    for seg in path:
        # ad.line(seg.end.real, seg.end.imag)
        points.append({
            "x": seg.end.real,
            "y": seg.end.imag
        })
    # ad.penup()
    # time.sleep(3)


for i, j in enumerate(paths):

    for path in paths:
        draw_and_wait(path)


for p in points:
    ad.line(p["x"], p["y"])
    ad.penup()
    time.sleep(2)


svg_final = draw_and_wait(paths)
ad.plot_setup(svg_final)
ad.update()
ad.moveto(0, 0)
ad.plot_run(True)
ad.disconnect()

