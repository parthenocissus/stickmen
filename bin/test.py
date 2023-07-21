import time
from svgpathtools import svg2paths

from pyaxidraw import axidraw
ad = axidraw.AxiDraw()
ad.interactive()
if not ad.connect():
    quit()
ad.moveto(1, 1)
ad.options.units = 1
ad.update()
for i in range(5):
    print(i)
    time.sleep(2)
# ad.line(i, 5.08)
# time.sleep(3)
# ad.line(20.08, 7.08)
ad.moveto(0,0)
ad.disconnect()

# ax = axidraw.AxiDraw()
# ax.interactive()
# ax.options.pen_pos_down = 20