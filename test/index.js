const assert = require('assert');
const {expect} = require('chai');
const {comparators, composeComparators} = require('../src/index.js');

const NUMBERS = [7, -1, 12, 12, 80, 15624, -100, 0];
const STRINGS = ['This', 'is', 'an', 'array', 'of', '9', 'various', 'supercalifragilisticexpialodocious', 'words'];
const DATES = [new Date('January 1, 1970 00:00:00'), new Date('December 10, 1815, 03:03:03'), new Date('1930-05-11'), new Date('2015-10-21T07:28')];
const PEOPLE = [
    {lastName: 'Doe', firstName: 'John', age: 42},
    {lastName: 'Boole', firstName: 'George', age: 67},
    {lastName: 'Lovelace', firstName: 'Ada', age: 2},
    {lastName: 'Doe', firstName: 'Jane', age: 42},
    {lastName: 'Hamilton', firstName: 'Margaret', age: 100},
];

describe('comparators()', function() {
    context('when toComparable is not given', function() {
        it('throws an error', function() {
            expect(() => {comparators()}).to.throw(Error, 'toComparable is required');
        });
    });

    context('when toComparable is not a function', function() {
        it('throws a TypeError', function() {
            expect(() => {comparators(42)}).to.throw(TypeError, 'toComparable is not a function');
        });
    });

    context('when passed the identity function', function() {
        const byIdentity = comparators(a => a);

        it('returns an object', function() {
            assert(byIdentity && typeof byIdentity === 'object');
        });

        describe('#asc()', function() {
            it('exists', function() {
                assert(byIdentity.asc && typeof byIdentity.asc === 'function');
            });

            it('sorts an array of numbers least to greatest', function() {
                const SORTED_NUMBERS = [-100, -1, 0, 7, 12, 12, 80, 15624];
                let testableArray = [...NUMBERS];
                testableArray.sort(byIdentity.asc);
                let flag = true;
                for(let i = 0; i < testableArray.length; i++) {
                    assert(testableArray[i] === SORTED_NUMBERS[i]);
                }
            });

            it('sorts an array of strings alphabetically', function() {
                const SORTED_STRINGS = ['9', 'This', 'an', 'array', 'is', 'of', 'supercalifragilisticexpialodocious', 'various', 'words'];
                let testableArray = [...STRINGS];
                testableArray.sort(byIdentity.asc);
                for(let i = 0; i < testableArray.length; i++) {
                    assert(testableArray[i] === SORTED_STRINGS[i]);
                }
            });

            it('sorts an array of dates chronologically', function() {
                const SORTED_DATES = [new Date('December 10, 1815, 03:03:03'), new Date('1930-05-11'), new Date('January 1, 1970 00:00:00'), new Date('2015-10-21T07:28')];
                let testableArray = [...DATES];
                testableArray.sort(byIdentity.asc);
                for(let i = 0; i < testableArray.length; i++) {
                    assert(testableArray[i].getTime() === SORTED_DATES[i].getTime());
                }
            });
        });

        describe('#desc()', function() {
            it('exists', function() {
                assert(byIdentity.desc && typeof byIdentity.desc === 'function');
            });

            it('sorts an array of numbers greatest to least', function() {
                const SORTED_NUMBERS = [15624, 80, 12, 12, 7, 0, -1, -100];
                let testableArray = [...NUMBERS];
                testableArray.sort(byIdentity.desc);
                for(let i = 0; i < testableArray.length; i++) {
                    assert(testableArray[i] === SORTED_NUMBERS[i]);
                }
            });

            it('sorts an array of strings in reverse alphabetical order', function() {
                const SORTED_STRINGS = ['words', 'various', 'supercalifragilisticexpialodocious', 'of', 'is', 'array', 'an', 'This', '9'];
                let testableArray = [...STRINGS];
                testableArray.sort(byIdentity.desc);
                for(let i = 0; i < testableArray.length; i++) {
                    assert(testableArray[i] === SORTED_STRINGS[i]);
                }
            });

            it('sorts an array of dates in reverse chronological order', function() {
                const SORTED_DATES = [new Date('2015-10-21T07:28'), new Date('January 1, 1970 00:00:00'), new Date('1930-05-11'), new Date('December 10, 1815, 03:03:03')];
                let testableArray = [...DATES];
                testableArray.sort(byIdentity.desc);
                for(let i = 0; i < testableArray.length; i++) {
                    assert(testableArray[i].getTime() === SORTED_DATES[i].getTime());
                }
            });
        });
    });

    context('when toComparable returns a number property', function() {
        const byAge = comparators(a => a.age);

        describe('#asc()', function() {
            it('sorts an array of objects by the number property from least to greatest', function() {
                const SORTED_PEOPLE = [
                    {lastName: 'Lovelace', firstName: 'Ada', age: 2},
                    {lastName: 'Doe', firstName: 'John', age: 42},
                    {lastName: 'Doe', firstName: 'Jane', age: 42},
                    {lastName: 'Boole', firstName: 'George', age: 67},
                    {lastName: 'Hamilton', firstName: 'Margaret', age: 100}
                ];

                let testableArray = [...PEOPLE];
                testableArray.sort(byAge.asc);
                for(let i = 0; i < testableArray.length; i++) {
                    assert.deepEqual(testableArray[i], SORTED_PEOPLE[i]);
                }
            });
        });

        describe('#desc()', function() {
            it('sorts an array of objects by the number property from greatest to least', function() {
                const SORTED_PEOPLE = [
                    {lastName: 'Hamilton', firstName: 'Margaret', age: 100},
                    {lastName: 'Boole', firstName: 'George', age: 67},
                    {lastName: 'Doe', firstName: 'John', age: 42},
                    {lastName: 'Doe', firstName: 'Jane', age: 42},
                    {lastName: 'Lovelace', firstName: 'Ada', age: 2}
                ];

                let testableArray = [...PEOPLE];
                testableArray.sort(byAge.desc);
                for(let i = 0; i < testableArray.length; i++) {
                    assert.deepEqual(testableArray[i], SORTED_PEOPLE[i]);
                }
            });
        });
    });

    context('when toComparable returns a string property', function() {
        const byLastName = comparators(a => a.lastName);

        describe('#asc()', function() {
            it('sorts an array of objects by the string property alphabetically', function() {
                const SORTED_PEOPLE = [
                    {lastName: 'Boole', firstName: 'George', age: 67},
                    {lastName: 'Doe', firstName: 'John', age: 42},
                    {lastName: 'Doe', firstName: 'Jane', age: 42},
                    {lastName: 'Hamilton', firstName: 'Margaret', age: 100},
                    {lastName: 'Lovelace', firstName: 'Ada', age: 2}
                ];

                let testableArray = [...PEOPLE];
                testableArray.sort(byLastName.asc);
                for(let i = 0; i < testableArray.length; i++) {
                    assert.deepEqual(testableArray[i], SORTED_PEOPLE[i]);
                }
            });
        });

        describe('#desc()', function() {
            it('sorts an array of objects by the string property in reverse alphabetical order', function() {
                const SORTED_PEOPLE = [
                    {lastName: 'Lovelace', firstName: 'Ada', age: 2},
                    {lastName: 'Hamilton', firstName: 'Margaret', age: 100},
                    {lastName: 'Doe', firstName: 'John', age: 42},
                    {lastName: 'Doe', firstName: 'Jane', age: 42},
                    {lastName: 'Boole', firstName: 'George', age: 67}
                ];

                let testableArray = [...PEOPLE];
                testableArray.sort(byLastName.desc);
                for(let i = 0; i < testableArray.length; i++) {
                    assert.deepEqual(testableArray[i], SORTED_PEOPLE[i]);
                }
            });
        });
    });
});

describe('composeComparators()', function() {
    context('when no arguments are given', function() {
        it('throws an error', function() {
            expect(() => {composeComparators()}).to.throw(Error, 'No comparators to compose');
        });
    });

    context('when a given argument is not a function', function() {
        it('throws a TypeError', function() {
            expect(() => {composeComparators(() => {}, 42)}).to.throw(TypeError, 'All arguments must be functions');
        });
    });

    context('when passed a single comparator', function() {
        const byLength = comparators(a => a.length);
        const composed = composeComparators(byLength.asc);

        it('returns an object', function() {
            assert(composed && typeof composed === 'object', true);
        });

        describe('#asc()', function() {
            it('exists', function() {
                assert(composed.asc && typeof composed.asc === 'function', true);
            });

            it('successfully sorts an array in ascending order', function() {
                const SORTED_STRINGS = ['9', 'is', 'an', 'of', 'This', 'array', 'words', 'various', 'supercalifragilisticexpialodocious'];
                let testableArray = [...STRINGS];
                testableArray.sort(composed.asc);
                for(let i = 0; i < testableArray.length; i++) {
                    assert(testableArray[i] === SORTED_STRINGS[i]);
                }
            });
        });

        describe('#desc()', function() {
            it('exists', function() {
                assert(composed.desc && typeof composed.desc === 'function', true);
            });

            it('successfully sorts an array in descending order', function() {
                const SORTED_STRINGS = ['supercalifragilisticexpialodocious', 'various', 'array', 'words', 'This', 'is', 'an', 'of', '9'];
                let testableArray = [...STRINGS];
                testableArray.sort(composed.desc);
                for(let i = 0; i < testableArray.length; i++) {
                    assert(testableArray[i] === SORTED_STRINGS[i]);
                }
            });
        });
    });

    context('when passed multiple comparators', function() {
        const byAge = comparators(a => a.age);
        const byLastName = comparators(a => a.lastName);
        const byFirstName = comparators(a => a.firstName);
        const composed = composeComparators(byAge.desc, byLastName.asc, byFirstName.desc);

        it('returns an object', function() {
            assert(composed && typeof composed === 'object', true);
        });

        describe('#asc()', function() {
            it('exists', function() {
                assert(composed.asc && typeof composed.asc === 'function', true);
            });

            it('successfully sorts an array in ascending order', function() {
                const SORTED_PEOPLE = [
                    {lastName: 'Hamilton', firstName: 'Margaret', age: 100},
                    {lastName: 'Boole', firstName: 'George', age: 67},
                    {lastName: 'Doe', firstName: 'John', age: 42},
                    {lastName: 'Doe', firstName: 'Jane', age: 42},
                    {lastName: 'Lovelace', firstName: 'Ada', age: 2}
                ];
                let testableArray = [...PEOPLE];
                testableArray.sort(composed.asc);
                for(let i = 0; i < testableArray.length; i++) {
                    assert.deepEqual(testableArray[i], SORTED_PEOPLE[i]);
                }
            });
        });

        describe('#desc()', function() {
            it('exists', function() {
                assert(composed.desc && typeof composed.desc === 'function', true);
            });

            it('successfully sorts an array in descending order', function() {
                const SORTED_PEOPLE = [
                    {lastName: 'Lovelace', firstName: 'Ada', age: 2},
                    {lastName: 'Doe', firstName: 'Jane', age: 42},
                    {lastName: 'Doe', firstName: 'John', age: 42},
                    {lastName: 'Boole', firstName: 'George', age: 67},
                    {lastName: 'Hamilton', firstName: 'Margaret', age: 100}
                ];
                let testableArray = [...PEOPLE];
                testableArray.sort(composed.desc);
                for(let i = 0; i < testableArray.length; i++) {
                    assert.deepEqual(testableArray[i], SORTED_PEOPLE[i]);
                }
            });
        });
    });
});