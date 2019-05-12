# `generate-comparators`

**Create complex comparators, tersely and beautifully.**

***

## What Are Comparators, and Why Do I Need This Library?

A *comparator* is a function that looks at two elements and decides which should go before the other in a sort. In practice, they're what you would pass to the array `sort` function–

```js
myArray.sort(myComparator);
```

–to tell `sort` how to determine the elements' order.

A comparator receives two elements, `a` and `b`, and returns

* A negative number, conventionally `-1`, if `a` should go *before* `b`.

* A positive number, conventionally `1`, if `a` should go *after* `b`.

* `0` if the two elements are equivalent.

In other words, a boilerplate comparator would look like

```js
function(a, b) {
    if(/* LOGIC DETERMINING THAT `a` GOES BEFORE `b` */) {
        return -1;
    }
    else if(/* LOGIC DETERMINING THAT `a` GOES AFTER `b` */) {
        return 1;
    }
    else {
        return 0;
    }
}
```

This boilerplate is not terse, and it doesn't scale well if you need to sort by multiple attributes.

`generate-comparators` lets you define new comparators in just one line and combine them in another.

***

## Getting Started

Install the package on the terminal using either npm or Yarn:

```bash
# With npm
npm install generate-comparators

# Or with Yarn
yarn add generate-comparators
```

Import the package's two functions into your Node project using either `require` or, if you're using Babel, `import`:

```js
// With `require`
const {comparators, composeComparators} = require('generate-comparators');

// Or with `import`
import {comparators, composeComparators} from 'generate-comparators';
```

***

## Usage

### `comparators(toComparable)`

Generates ascending and descending comparator functions given a function that converts array elements into easily comparable forms.

Returns an object with two properties, `asc` and `desc`.

* `asc : function`: a comparator for sorting an array in ascending order

* `desc : function`: a comparator for sorting an array in descending order

    * **NOTE:** This is not necessarily the same as a reversed ascending order. `sort` sorts an array left-to-right, so when two equivalent elements are compared, the leftmost one will stay to the left.

> **NOTE:** I recommend naming this object `byX`, where *X* is the property or attribute the comparators check on. This has the advantage of being both terse and legible.

#### `toComparable : function`

`toComparable` must be a function that takes an element of an array and converts it into a form that can be more easily compared to other elements of the array. For instance, to create a comparator that would sort an array of elements by their lengths, use

```js
(element) => element.length
```

for `toComparable`.

`toComparable` can be any function that performs any complex logic on the given element, so long as it returns a value in a comparable data type such as `Number`, `String`, or `Date`.

#### Example Uses

* Sorting arrays of primitives using the identity function `element => element` (default behavior for `array.sort()`):

```js
import {comparators} from 'generate-comparators';

const numbers = [5, 2, 7, -3, 0];
const strings = ['the', 'quick', 'brown', 'fox', 'jumped', 'over', 'the', 'lazy', 'dog'];

const byIdentity = comparators(element => element);

// Ascending
numbers.sort(byIdentity.asc); // [-3, 0, 2, 5, 7]
strings.sort(byIdentity.asc); // ['brown', 'dog', 'fox', 'jumped', 'lazy', 'over', 'quick', 'the', 'the']

// Descending
numbers.sort(byIdentity.desc); // [7, 5, 2, 0, -3]
strings.sort(byIdentity.desc); // ['the', 'the', 'quick', 'over', 'lazy', 'jumped', 'fox', 'dog', 'brown']
```

* Sorting an array of strings by length:

```js
import {comparators} from 'generate-comparators';

const strings = ['the', 'quick', 'brown', 'fox', 'jumped', 'over', 'the', 'lazy', 'dog'];

const byLength = comparators(element => element.length);

// Ascending
strings.sort(byLength.asc); // ['the', 'fox', 'the', 'dog', 'over', 'lazy', 'quick', 'brown', 'jumped']

// Descending
strings.sort(byLength.desc); // ['jumped', 'quick', 'brown', 'lazy', 'over', 'the', 'fox', 'the', 'dog']
```

* Sorting an array of person objects by the number of vowels in their first and last name:

```js
import {comparators} from 'generate-comparators';

const people = [
    {lastName: 'Lovelace', firstName: 'Ada', birthYear: 1815},
    {lastName: 'Turing', firstName: 'Alan', birthYear: 1936},
    {lastName: 'Boole', firstName: 'George', birthYear: 1860},
    {lastName: 'Babbage', firstName: 'Charles', birthYear: 1930}
];

const byVowelsInName = comparators(element => getVowelCount(element.firstName + element.lastName));

// Ascending

/*  {lastName: 'Turing', firstName: 'Alan', birthYear: 1936},
 *  {lastName: 'Babbage', firstName: 'Charles', birthYear: 1930}
 *  {lastName: 'Lovelace', firstName: 'Ada', birthYear: 1815},
 *  {lastName: 'Boole', firstName: 'George', birthYear: 1860},
*/
people.sort(byVowelsInName.asc);

// Descending

/*  {lastName: 'Lovelace', firstName: 'Ada', birthYear: 1815},
 *  {lastName: 'Boole', firstName: 'George', birthYear: 1860},
 *  {lastName: 'Babbage', firstName: 'Charles', birthYear: 1930}
 *  {lastName: 'Turing', firstName: 'Alan', birthYear: 1936},
*/
people.sort(byVowelsInName.desc);
```

### `composeComparators(...comparators)`

Receives >0 comparators and combines them into new ascending and descending comparators.

The new comparators will first compare the two elements using `comparators[0]`. If they are equivalent, they will be compared with `comparators[1]` and so forth until all comparators have compared the elements. If they elements are still equivalent, the composed comparator will return `0`. Because the composed comparator iterates over the given comparators from left to right, the position of each comparator matters.

Returns an object with two properties, `asc` and `desc`.

* `asc : function`: a comparator for sorting an array in ascending order, using all given comparators

* `desc : function`: a comparator for sorting an array in descending order, using all given comparators

    * **NOTE:** This is not necessarily the same as a reversed ascending order. `sort` sorts an array left-to-right, so when two equivalent elements are compared, the leftmost one will stay to the left.

#### Examples

* Sorting an array of person objects first by age (descending), then by last name (ascending), then by first name (descending)

```js
import {comparators, composeComparators} from 'generate-comparators';

const people = [
    {lastName: 'Doe', firstName: 'John', age: 42},
    {lastName: 'Boole', firstName: 'George', age: 67},
    {lastName: 'Lovelace', firstName: 'Ada', age: 2},
    {lastName: 'Doe', firstName: 'Jane', age: 42},
    {lastName: 'Hamilton', firstName: 'Margaret', age: 100},
];

const byAge = comparators(element => element.age);
const byLastName = comparators(element => element.lastName);
const byFirstName = comparators(element => element.firstName);
const composed = composeComparators(byAge.desc, byLastName.asc, byFirstName.desc);

// Ascending
/* {lastName: 'Hamilton', firstName: 'Margaret', age: 100},
 * {lastName: 'Boole', firstName: 'George', age: 67},
 * {lastName: 'Doe', firstName: 'John', age: 42},
 * {lastName: 'Doe', firstName: 'Jane', age: 42},
 * {lastName: 'Lovelace', firstName: 'Ada', age: 2}
 */
people.sort(composed.asc);

// Descending
/* {lastName: 'Lovelace', firstName: 'Ada', age: 2},
 * {lastName: 'Doe', firstName: 'John', age: 42},
 * {lastName: 'Doe', firstName: 'Jane', age: 42},
 * {lastName: 'Boole', firstName: 'George', age: 67},
 * {lastName: 'Hamilton', firstName: 'Margaret', age: 100}
 */
people.sort(composed.desc);
```