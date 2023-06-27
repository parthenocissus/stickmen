# Uros Krcadinac 2023
# Main App

import sys
import json
from flask import Flask, render_template, send_file, redirect, request
import utils

app = Flask(__name__)


@app.route('/variation-maker/')
def variation_maker():
    return render_template("variation-maker.html")


@app.route('/pictomatrix/')
def pictomatrix():
    return render_template("pictomatrix.html")


if __name__ == "__main__":
    app.run(host='127.0.0.1', debug=True)
