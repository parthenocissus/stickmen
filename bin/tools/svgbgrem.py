import os
import xml.etree.ElementTree as ET

input_folder = "static\media\rnntest"
output_folder = "static\media\rnntestOut"

if not os.path.exists(output_folder):
    os.makedirs(output_folder)

def remove_element(svg_path, output_path):
    tree = ET.parse(svg_path)
    root = tree.getroot()
    
    namespace = {'ns0': 'http://www.w3.org/2000/svg'}
    rect_element = root.find('.//ns0:rect', namespaces=namespace)
    if rect_element is not None:
        root.remove(rect_element)
    
    tree.write(output_path, encoding='utf-8', xml_declaration=True)

def main():
    input_files = os.listdir(input_folder)
    
    for idx, filename in enumerate(input_files):
        if filename.lower().endswith(".svg"):
            input_path = os.path.join(input_folder, filename)
            output_path = os.path.join(output_folder, f"{idx}.svg")
            
            remove_element(input_path, output_path)
            print(f"Processed '{filename}' and saved as '{idx}.svg'")
    
    print("Element removal and saving complete.")

if __name__ == "__main__":
    main()
