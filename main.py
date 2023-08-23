# Uros Krcadinac 2023
# Main App

from flask import Flask, render_template

app = Flask(__name__)


@app.route('/')
def homepage():
    return render_template("index.html")

@app.route('/pictomatrix-NEURO/')
def pictomatrix_NEURO():
    return render_template("pictomatrix-NEURO.html")

@app.route('/webgen/')
def picking():
    return render_template("webgen.html")

@app.route('/morphing/')
def morphing():
    return render_template("morphing.html")

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
