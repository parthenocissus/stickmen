from pyaxidraw import axidraw

svg_name = "arrows_002"
svg_file = f"static/media/final_svgs/{svg_name}_random_order_.svg"
# svg_file = f"{svg_name}_random_order_.svg"

ad = axidraw.AxiDraw()
ad.plot_setup(svg_file)
# ad.options.pen_pos_up = 70      # set pen-up position
ad.plot_run()