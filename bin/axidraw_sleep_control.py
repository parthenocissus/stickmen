from pyaxidraw import axidraw
from svgpathtools import svg2paths
import time

svg_file = "../static/media/Databases/tests/final_svgs/arrowtest2.svg"

points = []

ax = axidraw.AxiDraw()

points_to_cm_ratio = 0.0352778
points_to_inches_ratio = 0.0138889


def get_points_from_svg(path):
    p = {"x1": path[0].start.real, "y1": path[0].start.imag}
    for seg in path:
        p["x2"] = seg.end.real
        p["y2"] = seg.end.imag
    points.append(p)


def go(svg_file, sleep=3):
    counter = 0
    paths, attributes = svg2paths(svg_file)

    for path in paths:
        get_points_from_svg(path)

    for p in points:

        counter += 1
        r = points_to_inches_ratio
        shift = 0
        print(f"points: ({p['x1']}), ({p['y1']}) -> ({p['x2']}), ({p['y2']})")

        x1 = p['x1'] * r + shift
        y1 = p['y1'] * r + shift
        x2 = p['x2'] * r + shift
        y2 = p['y2'] * r + shift
        # relative, line() requires relative coordinates
        # x2 = (p['x2'] - p['x1']) * r
        # y2 = (p['y2'] - p['y1']) * r
        print(f"inches: ({x1}), ({y1}) -> ({x2}), ({y2})")

        ax.penup()
        ax.moveto(x1, y1)
        ax.pendown()
        ax.goto(x2, y2)
        ax.penup()

        if (counter % 3) == 0:
            print("...")
            time.sleep(sleep)


if __name__ == "__main__":

    sleep = 5

    ax.interactive()
    if not ax.connect():
        quit()
    # ax.options.units = 1  # set working units to cm.
    ax.options.pen_pos_up = 60
    ax.options.pen_pos_down = 20
    ax.update()
    ax.penup()

    go(svg_file, sleep)

    ax.moveto(0, 0)
    ax.disconnect()
