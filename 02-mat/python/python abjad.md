#code 

```bash
pip3 install abjad numpy scipy tensorflow
```


> [!hint] >  la instalación de Tensorflow
> puede tardar alrededor de 10-20 minutos dependiendo la conexión de red. 

>[!tip] > tambien es necesario instalar [lilypond](https://lilypond.org/doc/v2.23/Documentation/web/windows)


```python
import abjad
note  = abjad.Note("c'3, c'2")
abjad.show(note)
```

```python
import abjad
string = "c'16 f' g' a' d' g' a' b' e' a' b' c'' f' f' b' c'' d''16"
voice_1 = abjad.Voice(string, name="string 1")
staff_1 = abjad.Staff([voice_1], name="string 2")
abjad.show(staff_1)
```