import glob, os, random

names = []
dir = "static/media/DRAFTS_FOR_PLOT/izabrani_piktogrami/"
g = glob.glob(dir + "*")

for i, _ in enumerate(g):
    names.append(str(i + 1).zfill(3))

random.shuffle(names)

# for file_name in glob.iglob("media/selected_flags/single_/*"):
for file_name in g:
    new_name = dir + names.pop() + ".svg"
    print(file_name)
    print(new_name)
    os.rename(file_name, new_name)