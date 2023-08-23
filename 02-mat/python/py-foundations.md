plugins a instalar
```bash
pip3 install seaborn matplot lib pandas numpy plotly
```


```python
import seaborn as sns
import matplotlib.pyplot as plt
sns.set_style("darkgrid")
iris = sns.load_dataset('iris')
sns.FacetGrid(iris, hue ="species",
    height = 5).map(plt.scatter,
    'sepal_length',
    'petal_length').add_legend()

plt.show()

```


```python
def hello(name):
    print("Hello", name)

if __name__ == "__main__":
	hello('Eve')
```

## plotly

```python
import pandas as pd

df = pd.DataFrame({
  "Fruit": ["Apples", "Oranges", "Bananas", "Apples", "Oranges", "Bananas"],
  "Contestant": ["Alex", "Alex", "Alex", "Jordan", "Jordan", "Jordan"],
  "Number Eaten": [2, 1, 3, 1, 3, 2],
})

import plotly.express as px

fig = px.bar(df, x="Fruit", y="Number Eaten", color="Contestant", barmode="group")
fig.show()
```

```python
import plotly.graph_objects as go

import pandas as pd

# Read data from a csv
z_data = pd.read_csv('https://raw.githubusercontent.com/plotly/datasets/master/api_docs/mt_bruno_elevation.csv')

fig = go.Figure(data=[go.Surface(z=z_data.values)])

fig.update_layout(title='Mt Bruno Elevation', autosize=False,
                  width=500, height=500,
                  margin=dict(l=65, r=50, b=65, t=90))

fig.show()

```


```python
import sys
# install.packages("tidyverse")
import panda as pd
import numpy as np
import plotly.express as px

```

```python
import plotly.graph_objects as go
import plotly.express as px
import pandas as pd
data = pd.read_csv('/Users/zztt/Library/Mobile Documents/iCloud~md~obsidian/Documents/cym/02-mat/python/ds/composers.csv')
fig = px.line (data, x = 'Composer_x', y = "Composer_y" , title ('Composers DOB'))
fig.show()

```