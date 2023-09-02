"""
Centaur Drawings || 2023.

#Authors:
    Uroš Krčadinac | krcadinac.com 
    Andrej Alfirevic | xladn0.rf.gd 
    Zeljko Petrovic | instagram@just.blue.dot

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see https://www.gnu.org/licenses.
"""

from pyaxidraw import axidraw
from svgpathtools import svg2paths

svg_file = "static/media/Exhibition/svgs/centaur_a3_000_final.svg"

points = []
arrows = []

ax = axidraw.AxiDraw()

points_to_cm_ratio = 0.0352778
points_to_inches_ratio = 0.0138889


def get_points_from_svg(path):
    p = {"x1": path[0].start.real, "y1": path[0].start.imag}
    for seg in path:
        p["x2"] = seg.end.real
        p["y2"] = seg.end.imag
    points.append(p)


def parse_arrows(svg_file):
    counter = 0
    paths, attributes = svg2paths(svg_file)

    for path in paths:
        get_points_from_svg(path)

    arrow_points = []

    for p in points:

        # convert from points to inches
        counter += 1
        r = points_to_inches_ratio
        shift = 0

        x1 = p['x1'] * r + shift
        y1 = p['y1'] * r + shift
        x2 = p['x2'] * r + shift
        y2 = p['y2'] * r + shift

        new_point = {
            "x1": x1, "y1": y1, "x2": x2, "y2": y2
        }
        arrow_points.append(new_point)

        if (counter % 3) == 0:
            arrows.append(arrow_points)
            arrow_points = []


def draw_an_arrow(points):
    print("Drawing an arrow...")
    for p in points:
        x1 = p['x1']
        y1 = p['y1']
        x2 = p['x2']
        y2 = p['y2']
        print(f"Inches: ({x1}), ({y1}) -> ({x2}), ({y2})")

        ax.penup()
        ax.moveto(x1, y1)
        ax.pendown()
        ax.goto(x2, y2)
        ax.penup()
    print("Arrow done.")


def finish():
    ax.moveto(0, 0)
    ax.disconnect()


if __name__ == "__main__":

    ax.interactive()
    if not ax.connect():
        quit()
    # ax.options.units = 1  # set working units to cm.
    ax.options.model = 5
    ax.options.pen_pos_up = 60
    ax.options.pen_pos_down = 20
    ax.update()
    ax.penup()

    parse_arrows(svg_file)
    print("All arrows:")
    print(arrows)
    print(f"There are {len(arrows)} arrows in the flow field visualization.")

    counter = 0

    while True:
        user_input = input("\nPress ENTER to draw the next arrow or 's' to stop: \n")

        if user_input == '':
            draw_an_arrow(arrows[counter])
            n_arrows_left = len(arrows) - counter - 1
            print(f"{n_arrows_left} arrows left to be drawn.")
            counter += 1
            if counter >= len(arrows):
                finish()
                break
        elif user_input == 's':
            finish()
            break
        else:
            print("Invalid input. Press 'g' to move the plotter or 's' to stop.")
