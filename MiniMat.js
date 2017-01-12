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
            throw new Error("Data length should be " + parseInt(x_len * y_len) + " and instead is " + parseInt(data.length) + ".");
        }
        this.x_len = x_len;
        this.y_len = y_len;
        this.data = data;
    }

    // get a row or rows by index; easy because column major
    row(index, to_index=0) {
        // index should be the first row index
        // to_index (optional) should be the last row index

        // sanitize all we use
        var x_len = parseInt(this.x_len);
        var y_len = parseInt(this.y_len);
        var index = parseInt(index);
        var to_index = parseInt(index);
        // to_index==0 means we just want one row
        if (to_index == 0) {
            last_ind=index;
        }
        // assure all in range are accessible
        if (to_index >= x_len || index >= x_len){
            throw new Error("Rows between " + index + " and " + to_index + " are not all within the " + x_len + " rows in the matrix.");
        }
        var first_data_pos = Math.min(index, to_index)*x_len;
        var last_data_pos = ((Math.max(index, to_index)+1)*(x_len))-1;
        return new MiniMat(Math.abs(to_index-index)+1, y_len, this.data);
    }

    // does nothing but warn now, but set row.
    row_set(index, to_index=0, data=[]) {
        console.warn("Setting rows in place is not yet supported.");
    }

    // get a column by index, a bit harder

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
    t.plan(7);


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

    // take a ones mat and try getting a row
    t.equal( MiniMat.Ones(3,4).row(0), new MiniMat([1,1,1,1],1,4), "Get a row of four ones")

    // take a filled mat and try getting two rows
    t.equal( MiniMat.FilledMat(3, 2, 4).row(0,1), new MiniMat([4,4,4,4],2,2), "Get two rows of two fours")
});

//TODO add some expected failures
