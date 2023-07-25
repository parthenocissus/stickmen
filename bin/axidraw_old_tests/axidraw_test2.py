from pyaxidraw import axidraw
from svgpathtools import svg2paths
import time
import threading

# svg_file = "static/media/final_svgs/arrows_002_random_order_test2.svg"
svg_file = "static/media/final_svgs/arrowtest2.svg"

ad = axidraw.AxiDraw()
ad.interactive()
if not ad.connect():
    quit()

# ad.plot_setup(svg_file)
paths, attributes = svg2paths(svg_file)
# ad.options.units = 1
# ad.update()
ad.moveto(0, 0) # refresh pos u slucaju da je prosli run chrashovao u sred crtanja
# ad.moveto(1, 1)

threads = []

def draw_and_wait(path):
    ad.line(path[0].start.real, path[0].start.real)
    # ad.pendown()
    for point in paths:
        ad.line(point.end.real, point.end.imag)
    ad.penup()
    time.sleep(2)
    i = 0
    i=+1
    print("function completed " + i )


for i, j in enumerate(paths):
    for path in paths:
        thread = threading.Thread(target=draw_and_wait, args=(path,))
        thread.start()
        threads.append(thread)

for t in threads:
    t.join()


svg_final = draw_and_wait(paths)
ad.plot_setup(svg_final)
ad.update()
ad.moveto(0, 0)
ad.plot_run(True)
ad.disconnect()

