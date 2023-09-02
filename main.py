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

from flask import Flask, render_template

app = Flask(__name__)


@app.route('/')
def homepage():
    return render_template("index.html")

@app.route('/drawing-panel/')
def drawing_panel():
    return render_template("drawing_panel.html")

@app.route('/variation-maker/')
def variation_maker():
    return render_template("variation-maker.html")

@app.route('/pictomatrix/')
def pictomatrix():
    return render_template("pictomatrix.html")


@app.route('/pictomatrix-wide/')
def pictomatrix_wide():
    return render_template("pictomatrix_wide.html")

@app.route('/pictomatrix-nn/')
def pictomatrix_nn():
    return render_template("pictomatrix_nn.html")

@app.route('/nearest-neighbor/')
def nearest_neighbor():
    return render_template("nearest_neighbor.html")

@app.route('/flow-field/')
def flow_field():
    return render_template("flow_field.html")


if __name__ == "__main__":
    app.run(host='127.0.0.1', debug=True)
