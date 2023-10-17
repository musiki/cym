---
tags:
  - class
unit: 2
date: 231002
theme: moon
---

| ![\|50](https://i.imgur.com/N8z2xP4.png) |                |                        |
| ---------------------------------------- |:-------------- | ----------------------:|
| **class 02**                             | Sep 29th, 2023 | *internet music 23/24* |

---

### github and obsidian

course materials are hosted on https://github.com/zzigo/internetmusic/tree/im24 to update run `git pull`

---

### Class Plan

|     |                            |
| --- | -------------------------- |
| 1   | Internet Culture           |
| 2   | Introduction To JavaScript |
| 3    | Code practice             |

---

### Introduction To JavaScript

---

###  The Basics

```js
const note = 440;

function playNote(n) {
  if (note > 20) {
    dummyPlay(note)
  } else {
    return;
  }
}

playNote(note + 20);
```

---

- a program consists of some text
- a programming language defines a valid syntax
- a programming language has special symbols that have predefined behaviors

---

### Expressions / Statements

we will distinguish between two concepts: expression vs statement

---

### Expressions / Statements

- expressions
  - everything that resolves to a value
- statements
  - basically everything else
  - assignments
  - conditionals
  - loops

---

### Operators

another ubiquitous concept are operators, such as:
- `=`
- `+`, `-`, `*`, `/`, `%`
- `&&`, `||`, `===`

... and many more

they are used to build statements and expressions.

---

#### Expression Or Statement?

```js
const note = 440;

function playNote(n) {
  if (note > 20) {
    dummyPlay(note)
  } else {
    return;
  }
}

playNote(note + 20);
```

---

### Expressions

Since expressions resolve to values, let's look at what kind of values exist in JavaScript.

---

### Types

There are 8 possible data types in JavaScript:
- primitive types:
  - Undefined
  - Null
  - Number
  - ~~Bigint~~
  - String
  - ~~Symbol~~
  - Boolean
- Object

---

#### Undefined

the type Undefined has one possible value `undefined` and represents the lack of a value:

```js
let note;

console.log(note) // undefined
```

---

#### Null

the type Null has one possible value `null` and is used to explicitly set a "non-existent" value:

```js
let nextNote = null;

console.log(x) // null
```

---

### Number

The type Number is basically the only number type and represents 64-bit floating point numbers:

```js
const x = 400;
const y = 400.0; // is the same 
```

---

### Number

There are two special number values:
- `NaN`
- `Infinity` / `-Infinity`

```js
const x = 1/0; // Infinity
const y = Math.sqrt(-10) // NaN
```

---

### String

The type String represents strings encoded in UTF-16:

```js
const composer = "Xenakis" 
```

---

### Boolean

The Boolean type represents two possible values:
- `true`
- `false`

most often are they derived from boolean operators like:
- `!` ➡ NOT
- `&&` ➡ AND
- `||` ➡ OR
- `===` ➡ EQUALS
- `!==` ➡ NOT EQUALS
- `>` ➡ GREATER THAN
- `<` ➡ LESS THAN
- `>=` ➡ GREATER THAN OR EQUAL
- `<=` ➡ LESS THAN OR EQUAL

---

### Boolean

```js
const check = 0.5 > 0.7 // false
const truth = true || false // true
```

---

### Boolean

|a|b|a && b|a \|\| b|a === b|
|:---:|:---:|:---:|:---:|:---:|
|F|F|F|F|T|
|T|F|F|T|F|
|F|T|F|T|F|
|T|T|T|T|T|

---

### Primitive Types

All of these primitive types provide some wrapper objects, with some useful functionality.

---

### Object

In JavaScript the object is the only non-primitive type. They are used to create more complex data structures.

---

### Object

- a collection of properties
- a limited set of properties are initialized
- properties can be added and removed
- object properties are equivalent to key-value pairs

---

### Object

```js
const note = {
  pitch: 440,
  duration: 1.5,
  velocity: 0.8,
}
```

---

### Object

properties can then be accessed in two ways:

```js
note.pitch; // 440

note["pitch"]; // 440
```

---

### Object

All other data structures and abstractions we know from other languages are actually just wrappers around objects in JavaScript, such as arrays, functions etc.

➡ This knowledge is usually not important for us as programmers

---

### Functions

Functions are reusable bits of code. They can take input parameters and return values:

```js
// declare function
function sum(a,b) {  // function signature
  return a + b;      // function body
}

// call function
sum(3,5);
```

---

### Functions

- functions in JavaScript are "first-class citizens"
  - functions can be assigned to variables
  - can be arguments to other functions
  - can return functions
  - can be closures ➡ advanced

---

###  Functions

There are two ways to define functions:

```js
// function statement
function sum(a,b) {
  return a + b;
}

// arrow function
const sum = (a,b) => {
  return a + b;
}

// short-hand for functions with only return expression
const sum = (a,b) => a + b;
```

---

### Functions

As we will see, _callback_ functions will often be used as arguments to event listeners:

```js
button.addEventListener("click", () => {console.log("I have been clicked")})
```

This is an important concept that you will often use.

---

### Functions

Functions can define default parameters:

```js
function square(n = 2) {
  return n * n;
}

square(); // we can call without arguments and it will default to use n=2
// result will be 4
```

---

### Functions

Functions can call themselves, this is called recursion:

```js
function countToZero(n) {
  if (n === 0) {
    console.log("done"); 
    return; // we must make sure the function stops at some point
  } else if (n > 0) {
    console.log("current count: ", n);
    countToZero(n - 1);
  }
}
```

---

### Array

An array is similar to an object but it stores a collection of ordered values:

```js
const notes = [440, 580, 320, 460];
```

---

### Array

- JavaScript arrays are resizable
- can contain a mix of different data types
- JavaScript arrays are zero-indexed: the first element of an array is at index `0`

---

### Array

We access items by their indices:

```js
notes[0] // 440
notes[1] // 580
```

---

### Array

Arrays provide some useful methods to manipulate them:

```js
const notes = [440, 580, 320, 460]

notes.reverse();

notes // [460, 320, 580, 440]
```

---

### Array

Some array methods use callback functions to manipulate arrays:

```js

const notes = [440, 580, 320, 460]

const filteredNotes = notes.filter((n) => n > 450) // function must evaluate to a boolean
```

filter:
- takes a function
- iterates over the array
- runs the function with the current element as an argument
- returns a new array with all elements for which the function returns true

---

### Statements

Statements are language constructs which handle assignment, control flow, loops etc.

---

### Assignment

There are two ways to define variables:

```js
// define a variable that can't be reassigned
const tuning = 440;
// define a variable that can be reassigned
let note = 20;
```

---

### If, if-else

The if statement takes a boolean expression, evaluates it and then either executes its body or not:

```js
if (nextNote !== currentNote) {
  console.log("the notes are different");
}
```

---

### If, if-else

We can also define an else case:

```js
if (nextNote !== currentNote) {
  console.log("the notes are different");
} else {
  console.log("the notes are the same");
}
```

---

### If, if-else

We can even define multiple conditions:

```js
if (nextNote === currentNote) {
  console.log("the notes are the same");
} else if (nextNote > currentNote) {
  console.log("pitch goes up");
} else if (nextNote < currentNote) {
  console.log("pitch goes down");
}
```

---

### For-loop

For-loops allow us to run bits of code multiple times:

```js
for (let i = 0; i < 5; i++) {
  // runs 5 times, with values of i from 0 through 4.
  console.log("repeat this");
}
```

---

### For-of-loop

Often we want to loop over a collection, for this we can use the for-of loop:

```js
const chord = ['A', 'B', 'C#'];

for (const note of chord) {
  play(note);
}
```

---

### While

The while loops takes a condition and loops as long as the condition resolves to true:

```js
let playing = true;

while (playing) {
  // do some stuff
  if (end === true) {
    playing = false; // this would terminate the loop at the next iteration
    break; // break terminates the loop immediately
  }
}
```

---

### Import, export

with import and export statements we can split our code into different files:

```js
// inside e.g. utils.js
export const referencePitch = 440;
```

```js
// inside index.js
import {referencePitch} from "./path/to/utils.js"

console.log(referencePitch);
```

---

### Statements

There are more, however these are the most important ones.

---

### Dynamic Typing

JavaScript is dynamically typed, which means that a variable can be assigned values of different types:

```js
let note = 440;

note = "A#";
```

In other languages this isn't possible.

Ideally you never do this.

---

### Weak Typing

JavaScript can transform types into each other, for example:

```js
const number = 3;
const numberAsString = number.toString();

console.log(numberAsString) // "3"

const numberAgain = parseInt(numberAsString);
```

---

### Weak Typing

Weak typing means that if you try an operation where the types don't match, JavaScript will try to coerce the types so that they match:

```js
const number = 1
const string = "3"

console.log(number + string) // "13"
```

Ideally you never do this.

---

### Quiz

What will the following code print to the console

---

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

### Quiz 8: Explanation

- the binary system can't accurately represent 1/5
- it is the same as 1/3 in decimal

since in music/sound we work a lot with numbers, this is good to know.

---

### Let's practice

Download the exercises from git with `git clone https://github.com/laurens-in/WebAudioIntro-Exercises` 

---

### DOM API

The DOM API is important to interact with the `html` on our page. We will need this to create interactive experiences.

---

### DOM API

We can grab elements using selectors:

```html
<button id="some-button" class="mute-buttons"></button>
```

```js
// grabs the first element of type button
let button = document.querySelector("button");

// grabs the first button of class mute-buttons
let button = document.querySelector(".mute-buttons");

// grabs the button with the id some-button
let button = document.querySelector("#some-button");

// grab all elements of type button
let buttons = document.querySelectorAll("button");

// grab all elements of class mute-buttons
let buttons = document.querySelectorAll(".mute-buttons");
```

---

### DOM API

We can listen to events on elements and react using callback functions:

```js
const button = document.querySelector("button");

button.addEventListener("click", () => {
  console.log("click")
  }
)
```

--- 

### DOM API

The `eventListener` will hand over the `Event` object to our callback function:

```js
const input = document.querySelector("input");

input.addEventListener("click", (e) => {
  console.log(e.target.value)
  }
)
```

The `Event` object has many properties:
- `e.target` is the html element emitting the event
- `e.target.value` returns the current value (if it has one)
- ... there are many more

---

### DOM API

We can also set properties of elements:

```js
const input = document.querySelector("input");

input.value = 0.5;
```

---

### Let's practice

You can do `exercise 2` now.

