class MiniMat {
    constructor(data, x_len, y_len=1) {
        // data should be an array containing all data, column major
        //     (column major order is like Octave and R)
        // x_len should be the number of columns.
        // y_len should be the number of rows.

        // validate the input
        // define an inline function to pass to Array.proto.every
        function isNumberType(element, index, array) {
            return typeof(element) == "number";
        }
        if ((typeof(x_len) != 'number') && (typeof(y_len) != 'number')) {
            // types don't allign, and we'll try to cast; warn
            console.warn("Your x_len and y_len arguments to MiniMat should be Numbers. Since they are not, they will be cast as Numbers via parseInt().");
        } else if (typeof(data) != 'Array' && !data.every(isNumberType)) {
            // the data is the wrong type; error
            throw new Error("Data is either not an array, or has non-numeric elements.");
        }
        x_len = parseInt(x_len);
        y_len = parseInt(y_len);
        // error if wrong amount of data
        if (!(x_len * y_len == data.length)){
            throw new Error("MiniMat data length should be " + parseInt(x_len * y_len) + " and instead is " + parseInt(data.length) + ".");
        }
        this.x_len = x_len;
        this.y_len = y_len;
        this.data = data;
    }

    // make a matrix filled with one value
    static FilledMat(x_len, y_len, value=1) {
        x_len = parseInt(x_len);
        y_len = parseInt(y_len);
        var data = new Array(parseInt(x_len*y_len));
        data.fill(value);
        return new this(data, x_len, y_len)
    }

    // make a matrix filled with ones
    static Ones(x_len, y_len){
        return this.FilledMat(x_len, y_len, 1)
    }

    // make a matrix filled with zeroes
    static Zeroes(x_len, y_len){
        return this.FilledMat(x_len, y_len, 0)
    }

    static Eye(len){
        len = parseInt(len);
        var data = new Array(parseInt(Math.pow(len,2)));
        data.fill(0);
        for (var x = 0; x < len; x ++) {
            var pos = x*len - x;
            data[pos] = 1
        }
        return new this(data, len, len)
    }
}

// Now it's time for some tests

var test = require('tape')

// just start with the simplest ones

// manually make a 2x2 with [1,2,3,4]
test( 'default inits test', function(t) {
    t.plan(5);


    t.doesNotThrow( function() {
        onetwothreefour = new MiniMat([1,2,3,4], 2, 2);
    }, '*', "new MiniMat() construction");

    // make an identity of size 3
    t.doesNotThrow( function() {
        eye3 = MiniMat.Eye(3);
    }, '*', "Eye construction");

    // Make a 4x4 matrix of all 4.18 values
    t.doesNotThrow( function() {
        constmat = MiniMat.FilledMat(4, 4, 4.18);
    }, '*', "FilledMat construction");

    // make a 5x5 zerores matrix
    t.doesNotThrow( function() {
        zeromat = MiniMat.Zeroes(5,5);
    }, '*', "Zeroes construction");

    // make a 6x7 of all ones
    t.doesNotThrow( function() {
        onesmat = MiniMat.Ones(6,7);
    }, '*', "Ones construction");
});

//TODO add some expected failures
