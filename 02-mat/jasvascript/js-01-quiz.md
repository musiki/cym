
### Quiz

para imprimir en la consola


### Quiz 1

```js
let note;

console.log(note);
```

---

### Quiz 2

```js
const note = 10;

console.log(note + "3");
```

---

### Quiz 3

```js
const note = 10;

if (note > 10) {
  console.log("hello")
}
```

---

### Quiz 4

```js
const notes = ["A", "C", "F"];

function reverseNotes(noteArray) {
  return noteArray.reverse();
}

console.log(reverseNotes(notes));
console.log(notes);
```

---

### Quiz 4: Explanation

some array methods mutate the original array, others create a copy

```js
const notes = ["A", "C", "F"];

notes.reverse(); // will mutate original array
const new = notes.toReversed() // original array stays the same, returns a new array
```

---

### Quiz 5

```js
const notes = ["A", "C", "F"];

for (note in notes) {
  console.log(note);
}
```

---

### Quiz 6

```js
const notes = ["A", "C", "F"];

for (note in notes) {
  console.log(note);
}
```

---

### Quiz 7 

```js
if (true || false) {
  console.log("i run");
}

if (true && false) {
  console.log("i run too");
}
```

---

### Quiz 8

```js
if (0.2 + 0.3 === 0.5) {
  console.log("i run");
}
```

---
