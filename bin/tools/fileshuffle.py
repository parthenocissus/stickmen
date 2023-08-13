import os
import random

def shuffle_and_rename_files(folder_path):
    if not os.path.isdir(folder_path):
        print("Invalid folder path.")
        return

    file_list = os.listdir(folder_path)
    random.shuffle(file_list)

    for index, filename in enumerate(file_list):
        old_path = os.path.join(folder_path, filename)
        new_filename = f"{index}.json"
        new_path = os.path.join(folder_path, new_filename)
        count = 1
        while os.path.exists(new_path):
            new_filename = f"{index}_{count}.json"
            new_path = os.path.join(folder_path, new_filename)
            count += 1

        os.rename(old_path, new_path)

if __name__ == "__main__":
    folder_path = r".\TestFolder"  
    shuffle_and_rename_files(folder_path)
    print("Files shuffled and renamed.")
