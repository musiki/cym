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