
Librerias a instalar
```bash

pip3 install MIDIutil mingus mido
```

```python
from mingus.core import chords  
  
result = chords.from_shorthand("Cmaj7")  
  
print(result)
```

```python
from mingus.core import chords
from midiutil import MIDIFile

progDeAcordes = ["Cmaj7", "Cmaj7", "Fmaj7", "Gdom7"]

array_of_notes = []
for chord in progDeAcordes:
	array_of_notes.extend(chords.from_shorthand(chord))

print(array_of_notes)


for i, pitch in enumerate (array_of_notes):
	print(i, pitch)
```




