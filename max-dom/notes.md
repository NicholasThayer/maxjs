##Included Libraries

## Execution Order

max executes javascript files from bottom up.  This is good! The automatic DOM builder will work as expected when placed in the topmost patcher.

## jsextensions 
max doesn't recursively search through jsextensions! So make sure browserify concats everything in the right order, and that any "module.exports" are properly eliminated before dropping them in.  I'm not sure there's a good way to seperate out dependencies and prevent load errors other than the concatonation order.  

## js Version
all the documentation (the little bit that's out there) states that the js version that runs in max is 1.6 but this just wrong.  the language spec is mostly es3 there's a bit of es5 mixed in.  No idea what interpreter is being used but in the tests I've run it's at least 5x slower at basic operations than code run in node.

"...rest" syntax... which would be super handy
const, let
generator functions
I'm sure there are more... 

but more importantly object and array destructuring seems to be working. Object, array and function are up to 1.8.5 in the mozilla reference and lodash works so that's good

##Speed!
push is much faster than unshift, to the point where it's faster to build an array and then reverse it than it is to build the same array with unshift.  

arrays are much faster than objects in general but insert by index is about the same, almost within margin of error with objects having a slight upper hand.

lookup by index is pretty close but arrays are still faster.  array.indexOf is so slow it should never be used in the context of a performance critical search.

lodash is pretty fast, not as fast as native, but still...

##Lodash 
Lodash can not read inherited props 