import xml.etree.ElementTree as ET
import random

svg_name = "arrows_002"
input_svg = f"static/media/final_svgs/{svg_name}.svg"
output_svg = f"static/media/final_svgs/{svg_name}_random_order.svg"


def randomize_svg(svg_file, output_file):
    # Parse the SVG file
    tree = ET.parse(svg_file)
    root = tree.getroot()

    # Find all <g> elements
    groups = root.findall(".//{http://www.w3.org/2000/svg}g")

    for g in groups:
        print(g)

    # Shuffle the order of groups
    random.shuffle(groups)

    # Remove existing groups from the root
    for group in groups:
        root.remove(group)

    # Re-add the groups in the shuffled order
    for group in groups:
        root.append(group)

    # Save the modified SVG as a new file
    tree.write(output_file, encoding="utf-8", xml_declaration=True)


if __name__ == "__main__":
    randomize_svg(input_svg, output_svg)
