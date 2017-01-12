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
            console.warn("[TypeWarning] Your x_len and y_len arguments to MiniMat should be Numbers. Since they are not, they will be cast as Numbers via parseInt().");
        } else if (typeof(data) != 'Array' && !data.every(isNumberType)) {
            // the data is the wrong type; error
            throw new Error("[Data Error] Data is either not an array, or has non-numeric elements.");
        }
        x_len = parseInt(x_len);
        y_len = parseInt(y_len);
        // error if wrong amount of data
        if (!(x_len * y_len == data.length)){
            throw new Error("[Data Error] Data length should be " + parseInt(x_len * y_len) + " and instead is " + parseInt(data.length) + ".");
        }
        this.x_len = x_len; // number rows
        this.y_len = y_len; // number cols
        this.data = data;
    }


    // give a string value for either human or machine inspection
    toString(machine=false) {
        if (machine == false) {
            var outstr = this.x_len + " by " + this.y_len + " MiniMat: \n";
            for (var x = 0; x < this.x_len; x++){
                outstr = outstr + "[" + this.data.slice(x * this.y_len, (x+1) * this.y_len).toString() + "]\n";
            }
            return outstr;
        }else {
            return "MiniMat{(" + this.data.toString() + ")" + this.x_len + "," + this.y_len + "}";
        }
    }

    // get a row or rows by index; easy because column major
    row(index, to_index=-1) {
        // index should be the first row index
        // to_index (optional) should be the last row index

        // if to_index is unset or -1, only the index row is returned
        if (to_index == -1) {
            to_index=index;
        }
        // sanitize all we use
        var x_len = parseInt(this.x_len);
        var y_len = parseInt(this.y_len);
        var index = parseInt(index);
        var to_index = parseInt(to_index);

        // assure all in range are accessible
        if (to_index >= x_len || index >= x_len){
            throw new Error("[Row Index Error] Rows between " + index + " and " + to_index + " are not all within the " + x_len + " rows in the matrix.");
        }
        var first_data_pos = Math.min(index, to_index) * y_len;
        var last_data_pos = ((Math.max(index, to_index)+1) * (y_len));
        return new MiniMat(this.data.slice(first_data_pos, last_data_pos), Math.abs(to_index-index)+1, y_len);
    }

    // does nothing but warn now, but set row.
    row_set(index, to_index=0, data=[]) {
        console.warn("[Not Implemented Error] Setting rows in place is not yet supported. Make a new matrix with the changes.");
    }

    // get a column or columns by index; hard because column major
    col(index, to_index=-1) {
        // index should be the first row index
        // to_index (optional) should be the last row index

        // if to_index is unset or -1, only the index row is returned
        if (to_index == -1) {
            to_index=index;
        }

        // sanitize all we use
        var x_len = parseInt(this.x_len);
        var y_len = parseInt(this.y_len);
        var index = Math.min(parseInt(index), parseInt(to_index));
        var to_index = Math.max(parseInt(index), parseInt(to_index));

        // assure all in range are accessible
        if (to_index >= y_len || index < 0){
            throw new Error("[Row Index Error] Columns between " + index + " and " + to_index + " are not all within the " + y_len + " columns in the matrix.");
        }

        // now we need to actually get the fields in data
        var out_data = [];
        // for each col to evaluate
        for (var x=0; x < x_len; x++){
            // for each data position
            out_data = out_data.concat(this.data.slice((y_len * x) + index, (y_len * x) + to_index + 1));
        }

        return new MiniMat(out_data, x_len, Math.abs(to_index-index)+1);
    }

    // does nothing but warn now, but set row.
    col_set(index, to_index=0, data=[]) {
        console.warn("[Not Implemented Error] Setting columns in place is not yet supported. Make a new matrix with the changes.");
    }

    // elementwise operations

    // check that the sizes are the same for these
    same_dims(mat){
      return ((this.x_len == mat.x_len) && (this.y_len == mat.y_len));
    }
    // in place elementwise addition
    add(mat){
      // take in a matrix of the same dimensions
      // this is an in place operation, so the object is changed.

      // make sure they're the same dimensions
      if (!(this.same_dims(mat))){
        throw new Error("[Data Error] Matrices must be the same dimensionality to add elementwise.");
      }
      var tdat=0;
      for (var x=0; x < this.data.length; x++){
        tdat = parseFloat(this.data[x]) + parseFloat(mat.data[x]);
        this.data[x]=tdat;
      }
      return this;
    }

    // in place schur product
    schur(mat){
      // take in a matrix of the same dimensions
      // this is an in place operation, so the object is changed.

      // make sure they're the same dimensions
      if (!(this.same_dims(mat))){
        throw new Error("[Data Error] Matrices must be the same dimensionality for schur product.");
      }
      var tdat=0;
      for (var x=0; x < this.data.length; x++){
        tdat = parseFloat(this.data[x]) * parseFloat(mat.data[x]);
        this.data[x]=tdat;
      }
      return this;
    }

    // emult means elementwise multiplication, so alias it
    emult(mat){
      this.schur(mat);
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
    t.plan(12);


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
    t.equal( MiniMat.Ones(3,4).row(0).toString(true), new MiniMat([1,1,1,1],1,4).toString(true), "Get a row of four ones");

    // while we're at it, test the human representation equality too.
    t.equal( MiniMat.Ones(3,4).row(0).toString(), new MiniMat([1,1,1,1],1,4).toString(), "Get a row of four ones");

    // take a filled mat and try getting two rows
    t.equal( MiniMat.FilledMat(3, 2, 4).row(0,1).toString(true), new MiniMat([4,4,4,4],2,2).toString(true), "Get two rows of two fours");

    // take a ones mat and try getting a column
    t.equal( MiniMat.Ones(3,4).col(0).toString(true), new MiniMat([1,1,1],3,1).toString(true), "Get a col of three ones");

    // take a filled mat and try getting two rows
    t.equal( MiniMat.FilledMat(3, 2, 4).col(0,1).toString(true), new MiniMat([4,4,4,4,4,4],3,2).toString(true), "Get two rows of two fours");

    // test in place add
    t.equal( MiniMat.FilledMat(3, 2, 4).add(MiniMat.FilledMat(3, 2, 4)).toString(true), MiniMat.FilledMat(3, 2, 8).toString(true), "Test matrix sums")

    // test in place schur
    t.equal( MiniMat.FilledMat(3, 2, 4).add(MiniMat.FilledMat(3, 2, 4)).toString(true), MiniMat.FilledMat(3, 2, 16).toString(true), "Test matrix schur product")
});

//TODO add some expected failures
