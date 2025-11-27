```python
import random
from javax.swing import JFrame

colors = ((0, 0, 0), (255,0,0), (255,128,0), (255,255,0), (0,255,0), (0,0,255), (127,0,255), (255,102,178))

def setup():
    size(800, 800, P2D)
    smooth(8)

    cols = rows =  16
    step = int(width / cols)
    grid = [[[] for y in range(rows)] for x in range(cols)]
    xy = ((-1, -1), (1, -1), (1, 1), (-1, 1))
    
    for x in xrange(cols):
        for y in xrange(rows):
            i = x + y * cols
            switch = 0 if y%2 else 1
            grid[x][y] = random.choice(colors) if i%2 == switch else None #If tile is "not white" -> stores a color randomly selected from the list into a 2D array list
    
    
    #Second Pass
    for x in xrange(cols):
        for y in xrange(rows):
            
            #Only focusing on non-white tiles
            if grid[x][y] != None:
                
                nColors = []
                
                #Convolution 
                for loc in xy:

                    #Constraining the checking process to the edges of the grid
                    x_ = constrain(x + loc[0], 0, cols - 1) 
                    y_ = constrain(y + loc[1], 0, rows - 1)
                    nColors.append(grid[x_][y_]) #Stores neighboring colors
                    
                    #If neighbor (only diagonals) has same color values -> pick another color
                    if grid[x][y] == grid[x_][y_]:
                        
                        #Make sure to pick a new color that is not in the neighboring colors
                        colors_ = [c for c in colors if c not in nColors and c != grid[x_][y_]]
                        grid[x][y] = random.choice(colors_)
                        
                a, b, c = grid[x][y] #Values of the new color
                  
            fill(a, b, c) if grid[x][y] != None else fill(255)
            rect(x * step, y * step, step, step)
```