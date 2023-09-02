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


import xml.etree.ElementTree as ET
import random

# svg_name = "arrows_002"
# input_svg = f"static/media/final_svgs/{svg_name}.svg"
# output_svg = f"static/media/final_svgs/{svg_name}_random_order.svg"

input_svg = f"static/media/Exhibition/svgs/centaur_a3_001.svg"
output_svg = f"static/media/Exhibition/svgs/centaur_a3_001_.svg"


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
