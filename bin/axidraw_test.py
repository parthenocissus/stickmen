from pyaxidraw import axidraw
import time
from svgpathtools import svg2paths, svg2paths2


svg_name = "arrows_002"
# svg_file = f"static/media/final_svgs/{svg_name}_random_order_.svg"
svg_file = "static/media/final_svgs/arrows_002_random_order_.svg"


def draw_svg(ax, svg_file, delay=2):
    # Convert SVG file to paths
    paths, attributes = svg2paths(svg_file)

    # Set up the pen settings
    # ax.options.pen_rate_raise = 100
    # ax.options.pen_rate_lower = 100

    # Connect to the AxiDraw plotter
    ax.connect()

    # Move the pen to the home position
    ax.penup()

    # Start the drawing
    ax.plot_setup()

    # Iterate over each path in the SVG
    for path in paths:
        # Move the pen to the starting position of the path
        ax.moveto(path[0].start.real, path[0].start.imag)

        # Put the pen down
        ax.pendown()

        # Iterate over each segment in the path
        for segment in path:
            # Draw the segment
            ax.goto(segment.end.real, segment.end.imag)

        # Lift the pen up
        ax.penup()

        # Wait for the specified delay (in seconds)
        time.sleep(delay)

    # Disconnect from the plotter
    ax.disconnect()

# Initialize the AxiDraw plotter
ax = axidraw.AxiDraw()
ax.interactive()                # Enter interactive context
if not ax.connect():
    print("quitting...")
    quit()

# Draw the SVG file with a delay of 1 second between groups
draw_svg(ax, svg_file, delay=2)