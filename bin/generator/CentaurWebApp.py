# -*- coding: utf-8 -*-
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

CentaurWebApp.ipynb

Automatically generated by GoogleColaboratory.
"""

import sys
!pip install flask
!pip install aiohttp
!pip install pyngrok
!pip install svgwrite
!pip install nest_asyncio
!pip install svgpathtools
!pip install aiohttp-jinja2
!git clone https://github.com/parthenocissus/stickmen.git
!{sys.executable} -m pip install keras-mdn-layer
import keras
import tensorflow as tf
import mdn
import glob
import json
import numpy as np
import random
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
# %matplotlib inline

import os
os.environ["TOKEN"] = "[REDACTED NGROK TOKEN]" #run locally without this code or put ur own ngrok token here

# Commented out IPython magic to ensure Python compatibility.
# vars
# modelfile = 'CLEANTestmodel_10epoch60seq65batch100hidden.h5'
# genpath = '/content/stickmen/static/media/Models/30kModels/'

modelfile = '4kmodel_100epoch60seq65batch512hidden.h5'
genpath = '/content/stickmen/static/media/Models/'

#MODEL PARAMATERS MUST MATCH FOR SHAPING TO WORK!!!
SEQ_LEN = 60
BATCH_SIZE = 65
HIDDEN_UNITS = 512

EPOCHS = 100
SEED = 2345
random.seed(SEED)
np.random.seed(SEED)
OUTPUT_DIMENSION = 3
NUMBER_MIXTURES = 10

# layers
model = keras.Sequential()
model.add(keras.layers.LSTM(HIDDEN_UNITS, batch_input_shape=(None, SEQ_LEN, OUTPUT_DIMENSION), return_sequences=True))
model.add(keras.layers.LSTM(HIDDEN_UNITS))
model.add(mdn.MDN(OUTPUT_DIMENSION, NUMBER_MIXTURES))
model.load_weights(genpath + modelfile)
model.compile(loss=mdn.get_mixture_loss_func(OUTPUT_DIMENSION,NUMBER_MIXTURES), optimizer=tf.keras.optimizers.Adam())
model.summary()

# decode
decoder = keras.Sequential()
decoder.add(keras.layers.LSTM(HIDDEN_UNITS, batch_input_shape=(1,1,OUTPUT_DIMENSION), return_sequences=True, stateful=True))
decoder.add(keras.layers.LSTM(HIDDEN_UNITS, stateful=True))
decoder.add(mdn.MDN(OUTPUT_DIMENSION, NUMBER_MIXTURES))
decoder.compile(loss=mdn.get_mixture_loss_func(OUTPUT_DIMENSION,NUMBER_MIXTURES), optimizer=tf.keras.optimizers.Adam())
decoder.summary()
decoder.set_weights(model.get_weights()) #set newgen model

# gen
# Generating new drawings...
import pandas as pd
import matplotlib.pyplot as plt
# %matplotlib inline

def zero_start_position():
    # A zeroed out start position with pen down
    out = np.zeros((1, 1, 3), dtype=np.float32)
    out[0, 0, 2] = 1 # set pen down. originaly 1
    return out

def generate_sketch(model, start_pos, num_points=100):
     return None

def cutoff_stroke(x):
    return np.greater(x,0.5) * 1.0 #0.5

def plot_sketch(sketch_array):

    # Plot a sketch quickly to see what it looks like.
    sketch_df = pd.DataFrame({'x':sketch_array.T[0],'y':sketch_array.T[1],'z':sketch_array.T[2]})
    sketch_df.x = sketch_df.x.cumsum()
    sketch_df.y = -1 * sketch_df.y.cumsum()

    fig = plt.figure(figsize=(8, 8))
    ax1 = fig.add_subplot(111)

    ax1.plot(sketch_df.x,sketch_df.y,'r-')
    plt.show()
# Generating SVGs
# Via Hardmaru's Drawing Functions from write-rnn-tensorflow
# https://github.com/hardmaru/write-rnn-tensorflow/blob/master/utils.py

import svgwrite
from IPython.display import SVG, display

def get_bounds(data, factor):
    min_x = 0
    max_x = 0
    min_y = 0
    max_y = 0

    abs_x = 0
    abs_y = 0
    for i in range(len(data)):
        x = float(data[i, 0]) / factor
        y = float(data[i, 1]) / factor
        abs_x += x
        abs_y += y
        min_x = min(min_x, abs_x)
        min_y = min(min_y, abs_y)
        max_x = max(max_x, abs_x)
        max_y = max(max_y, abs_y)

    return (min_x, max_x, min_y, max_y)

def draw_strokes(data, factor=1, svg_filename='sample.svg'):
    min_x, max_x, min_y, max_y = get_bounds(data, factor)
    dims = (50 + max_x - min_x, 50 + max_y - min_y)

    dwg = svgwrite.Drawing(svg_filename, size=dims)
    dwg.add(dwg.rect(insert=(0, 0), size=dims, fill='white'))

    lift_pen = 1

    abs_x = 25 - min_x
    abs_y = 25 - min_y
    p = "M%s,%s " % (abs_x, abs_y)

    command = "m"

    for i in range(len(data)):
        if (lift_pen == 1):
            command = "m"
        elif (command != "l"):
            command = "l"
        else:
            command = ""
        x = float(data[i, 0]) / factor
        y = float(data[i, 1]) / factor
        lift_pen = data[i, 2]
        p += command + str(x) + "," + str(y) + " "

    the_color = "black"
    stroke_width = 1

    dwg.add(dwg.path(p).stroke(the_color, stroke_width).fill("none"))

    dwg.save()
    dwg.saveas(svg_filename)
    display(SVG(dwg.tostring()))

global c
c = 0

from flask import Flask, render_template, send_file, render_template_string, request, make_response
from concurrent.futures import ThreadPoolExecutor
from pyngrok import ngrok
import os
import re

ngrok_auth_token = os.environ.get("TOKEN")

if ngrok_auth_token:
    ngrok.set_auth_token(ngrok_auth_token)

port = 5000
public_url = ngrok.connect(port)
print("Public URL:", public_url)


app = Flask(__name__)

def generate_single_image(temperature, sigma_temp, c):
    p = zero_start_position()
    sketch = [p.reshape(3,)]

    for i in range(42):  # vertex iteration   32,55,75
        params = decoder.predict(p.reshape(1, 1, 3))
        p = mdn.sample_from_output(params[0], OUTPUT_DIMENSION, NUMBER_MIXTURES, temp=temperature, sigma_temp=sigma_temp)
        sketch.append(p.reshape((3,)))

    sketch = np.array(sketch)
    decoder.reset_states()
    global filename
    filename = 'output_plot' + str(c) + '.svg'
    sketch.T[2] = cutoff_stroke(sketch.T[2])
    draw_strokes(sketch, factor=0.2, svg_filename=filename)
    print(filename)

    with open(filename, 'r') as f:
        svg_data = f.read()
        return {
            'content': svg_data,
            'filename': filename
        }

@app.route('/')
def webrender():
    print('''
    ██     ██     ██
   ██     ██     ██
  ██     ██     ██
 ██     ██     ██
██     ██     ██


██    ██████  ███████ ███    ██ ███████ ██████   █████  ████████ ██ ███    ██  ██████
 ██  ██       ██      ████   ██ ██      ██   ██ ██   ██    ██    ██ ████   ██ ██
  ██ ██   ███ █████   ██ ██  ██ █████   ██████  ███████    ██    ██ ██ ██  ██ ██   ███
 ██  ██    ██ ██      ██  ██ ██ ██      ██   ██ ██   ██    ██    ██ ██  ██ ██ ██    ██
██    ██████  ███████ ██   ████ ███████ ██   ██ ██   ██    ██    ██ ██   ████  ██████


    ██     ██     ██
   ██     ██     ██
  ██     ██     ██
 ██     ██     ██
██     ██     ██


    ''')
    global c
    num_images_to_generate = 19 # 19
    generated_images = []

    with ThreadPoolExecutor() as executor:
        futures = []

        for _ in range(num_images_to_generate):
            temperature = 0.01 # 0.01 0.1 1 10
            sigma_temp = -1 # -1 0.01 1
            future = executor.submit(generate_single_image, temperature, sigma_temp, c)
            futures.append(future)
            c += 1

        for future in futures:
            generated_images.append(future.result())

        # append img data to list
        with open(filename, 'r') as f:
            svg_data = f.read()
            generated_images.append({
                'content': svg_data,
                'filename': filename
            })

    rendered_template = render_template_string('''
        <!DOCTYPE html>
        <html>
        <head>
            <link rel="icon" href="https://img.icons8.com/?size=512&id=oWCb-azOA-qo&format=png">
            <title>SVG Curation App</title>
        </head>
        <style>
            body{
              font-family: monospace;
              margin-top: 40px;
              background-color: #e0ddd7;
              display: flex;
              flex-wrap: wrap;
              justify-content: center;
              gap: 2px;
            }
            .column{
              display: flex;
              flex-direction: column;
              align-itmes: center;
              width: 9%;
              gap: 20px;
            }
            a{
              transition:0.3s
              margin: 0 10px;
              opacity: 40%;
            }
            a:hover{
              opacity: 100%;
            }
            #refreshButton {
              height: 50px;
              z-index: 2;
              position: absolute;
              left: 415px;
              background-color: #555555;
              border: none;
              color: #e0ddd7;
              text-decoration: none;
              cursor: pointer;
              transition: 0.3s;
              width: 100px;
            }
            #refreshButton:hover {
              background-color: #8c8989;
            }
            #refreshButton:active {
              background-color: #4CAF50;
            }
        </style>
        <body>
                <button id="refreshButton" onclick="refreshPage()">Generate new</button>
                {% set column_count = 4 %}
                {% set rows = range(0, generated_images|length, column_count) %}
                {% for row in rows %}
                    <div class="column">
                        {% for svg_data in generated_images[row:row + column_count] %}
                            <a href="data:image/svg+xml;charset=utf-8,{{ svg_data['content'] }}" download="{{ svg_data['filename'] }}">
                                <img width="150px" height="200px" src="data:image/svg+xml;charset=utf-8,{{ svg_data['content'] }}" alt="{{ svg_data['filename'] }}">
                            </a>
                        {% endfor %}
                    </div>
                {% endfor %}
        </body>
        <script>
            function refreshPage() {
                var confirmation = confirm('Generate new pictograms?');
                if (confirmation) {
                    document.getElementById('refreshButton').textContent = 'Generating...';
                    refreshButton.style.backgroundColor = '#f44336';
                    window.location.reload();
                }
            }
        </script>
        </html>
    ''', generated_images=generated_images)
    response = make_response(rendered_template)

    if request.cookies.get('show_alert') != 'false':
        response.set_cookie('show_alert', 'false')

    return response

if __name__ == '__main__':
    app.run()

from google.colab import files
file_path = "/content/output_plot1253.svg"
files.download(file_path)