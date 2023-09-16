# Generating your own glyphs

To generate your own glyphs with our model there are few different ways. First you need to decide whether you want to run on ```local``` or  ```colab```. 

```local``` — Running on your GPU.

```colab``` — Running on the clouds GPU.


```bash
!git clone https://github.com/parthenocissus/stickmen.git
```

Clone the repository and navigate to ```/bin/generator/``` where we left three files from which you can choose the way you want to set up your generator ( .py or .ipynb ). Using the CentaurWebApp  you can generate several glyphs at once ( Default setting is 20 ). You can also train a new model using the Generator.ipynb code. 

Run the first cell and wait for the imports and installs.
```python
import os
os.environ["TOKEN"] = "<TOKEN STRING HERE>"
```

If you're running locally you wont need an ngrok token, but if you're running on colab I advise you to make a free ngrok account and add your token between the " ". After you have added your token run the cell.

In the next cell you define what model you want to use. If you want to use your own model you need to upload it to the colab. If you're running locally then simply point to your model path.
```python
modelfile = '4kmodel_100epoch60seq65batch512hidden.h5'
genpath = '/content/stickmen/static/media/Models/'
```
In the code we made it easier to navigate through our already existing models. To see the correct file names and paths check out the/static/media/Models/ section of our github. Its important for your model to have the same hyperparamaters as the decoder. So if the decoder has different hyperparamaters then the model you chose, simply configure the values in these lines of code. We put all the hyperparameters in the names of our models for easier use.
```python
SEQ_LEN = 60
BATCH_SIZE = 65
HIDDEN_UNITS = 512
```
//Default hyperparamaters of our models ( snippet above ^ )

After you've configured the hyperparamaters simply run that cell.

The last cell is simply calling the web-app you can run that cell instantly after the decoder cell and it will start loading your web app. If you ran locally use localhost if you ran on colab use the ngrok tunnel link. Once you click the link it will load for about 5 minutes. Don't worry your glyphs are being generated. The page just doesn't load untill all the GET requests have been fulfilled. And WOALAH you should have 20 glyphs now. Good job! You can save a glyph as an SVG by clicking on it or generate new glyphs by pressing the button. The button is red while generating and goes back to gray after the generation is done so you know when your fresh new batch of glyphs have been baked. 

### Happy generating ! 🥳🎉

-- [xladn0](http://xladn0.rf.gd/codework.html)
