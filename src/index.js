const COEFFICIENTS = [1, -1];

/**
 * Generates ascending and descending comparators based on some given attribute.
 * @param {function} toComparable - a function that converts an array element into a more easily comparable data type
 * @return {{asc: function, desc: function}} - an object with an `asc` property of an ascending comparator and a `desc` property of a descending comparator
 */
const comparators = (toComparable) => {
    if(!toComparable) {
        throw new Error('toComparable is required');
    } else if(typeof toComparable !== 'function') {
        throw new TypeError('toComparable is not a function');
    }

    const [asc, desc] = COEFFICIENTS.map((coefficient) => {
        return (a, b) => {
            const aComparable = toComparable(a);
            const bComparable = toComparable(b);
            if(aComparable === bComparable) {
                return 0;
            } else {
                let comparison = (aComparable > bComparable) ? 1 : -1;
                return (coefficient * comparison);
            }
        };
    });

    return {asc, desc};
};

/**
 * Combines multiple comparators into new ascending and descending comparators.
 * @param {...function} rest - all comparators, in order of precedence
 * @return {{asc: function, desc: function}} - an object with an `asc` property of an ascending comparator and a `desc` property of a descending comparator
 */
const composeComparators = (...rest) => {
    if(!rest.length) {
        throw new Error('No comparators to compose');
    } else if(rest.some(comparator => typeof comparator !== 'function')) {
        throw new TypeError('All arguments must be functions');
    }

    const [asc, desc] = COEFFICIENTS.map((coefficient) => {
        return (a, b) => {
            for(let i = 0, len = rest.length; i < len; i++) {
                const comparison = rest[i](a, b);
                if(comparison) {
                    return coefficient * comparison;
                }
                else if(i === len - 1) {
                    return 0;
                }
            }
        };
    });

    return {asc, desc};
};

module.exports = {
    comparators,
    composeComparators
};