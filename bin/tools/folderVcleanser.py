import os
import random

folder_path = './testFile/'

for filename in os.listdir(folder_path):
    if 'v' not in filename:
        file_path = os.path.join(folder_path, filename)
        if os.path.isfile(file_path):
            os.remove(file_path)
            print(f"Deleted: {filename}")


file_list = os.listdir(folder_path)
random.shuffle(file_list)

for i, filename in enumerate(file_list):
    file_path = os.path.join(folder_path, filename)
    new_filename = f"{i}.json"
    new_file_path = os.path.join(folder_path, new_filename)
    os.rename(file_path, new_file_path)
    print(f"Renamed: {filename} -> {new_filename}")

print("Done!")
