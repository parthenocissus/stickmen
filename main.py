# Uros Krcadinac 2023
# Main App

import sys
import json
from flask import Flask, render_template, send_file, redirect, request
import utils

app = Flask(__name__)

@app.route('/')
def homepage():
    return render_template("index.html")

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


@app.route('/mitchell/')
def mitchell():
    return render_template("mitchell.html")


if __name__ == "__main__":
    app.run(host='127.0.0.1', debug=True)
