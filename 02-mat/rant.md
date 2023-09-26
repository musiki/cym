---
type: code
url: 
year:
tags: generative, generativeliterature, cym, process, generative tools
---

```rant

[rep:10]{Cabezas |Pies |Manos } 

```


What's happening here is that the `[rep:10]` call affects the number of times the block after it will run. Each times the block runs, Rant treats it like a completely new block, selecting a random branch each time!

\n se usa como escapa de una nueva linea (coomo apretar enter)

Otra opción sería:

```rant
[rep:10][sep:\n]{Cabezas|Troncos}
```



# spaces
```rant
# Space normalization
One space\n
Two  spaces\n
Three   spaces\n
\n

# Indentation
Non-indented text\n
    Indented text\n
\n

# Multiple lines
Water
melon


```

# expliciting hinting
```rant
# Implicitly hinted (block contains fragments)
The coin landed on {Heads|Tails}.

# Explicitly hint the function call so the compiler knows it's part of the text
Your lucky number is `[rand:1;100].


```

```rant
# Evaluates to (A; B; C) or (A; D; E)
{ (A;) { (B; C) | (D; E) } }


```

```rant
# Evaluates to (1; 2; 3; 4; 5; 6; 7; 8; 9; 10)
[rep: 10] { ([step]) }


```


