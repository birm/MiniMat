/**
 *  @fileoverview Matrix algebra library for javascript.
 *  @author birm@rbirm.us (Ryan Birmingham)
 *  @license Copyright 2017 Ryan Birmingham.
 *  Licensed under GPL-3.
 */

// need a sum reduce function many places
function radd(x,y){
    return x+y;
}

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
            throw new Error("[Data Error] Data is not an array.");
        }
        data.map(parseFloat);
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
    row_set(index, data=[], to_index=-1) {
        if (to_index == -1) {
            to_index=index;
        }
        // sanitize all we use
        var x_len = parseInt(this.x_len);
        var y_len = parseInt(this.y_len);
        var index = parseInt(index);
        var to_index = parseInt(to_index);
        var first_data_pos = Math.min(index, to_index) * y_len;
        var last_data_pos = ((Math.max(index, to_index)+1) * (y_len));
        for (var x = 0; x < last_data_pos-first_data_pos; x++){
            this.data[x+first_data_pos]=data[x];
        }
        return this
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
    col_set(index, data=[], to_index=-1) {
        if (to_index == -1) {
            to_index=index;
        }
        // sanitize all we use
        var x_len = parseInt(this.x_len);
        var y_len = parseInt(this.y_len);
        var index = parseInt(index);
        var to_index = parseInt(to_index);
        // for each col to change
        for (var x=0; x <= to_index-index; x++){
            for (var y = 0; y < y_len; y++){
                // position in new data to get
                var new_pos = parseInt(x*y_len+y)
                // position in old data to replace
                var old_pos = parseInt(index+x+(y_len*y));
                this.data[old_pos]=data[new_pos]
            }
        }
        return this
    }

    // get diag
    diag(){
        var x_len = parseInt(this.x_len);
        var y_len = parseInt(this.y_len);
        var outlen = parseInt(Math.min(x_len,y_len));
        var outvec = [];
        for (var x = 0; x < outlen; x++) {
            outvec[x] = parseFloat(this.data[(x_len*x)+x]);
        }
        return new MiniMat(outvec, 1, outlen);
    }

    // get trace
    trace(){
        return parseFloat((this.data.reduce(radd,0)));
    }
    // elementwise operations

    // check that the sizes are the same for these
    same_dims(mat){
      return ((this.x_len == mat.x_len) && (this.y_len == mat.y_len));
    }

    // elementwise operation on the matrix
    elementwise(mat, operation){
      // take in a matrix of the same dimensions
      // this is an in place operation, so the object is changed.

      // make sure they're the same dimensions
      if (!(this.same_dims(mat))){
        throw new Error("[Data Error] Matrices must be the same dimensionality to add elementwise.");
      }
      var tdat=0;
      for (var x=0; x < this.data.length; x++){
        tdat = operation(parseFloat(this.data[x]), parseFloat(mat.data[x]));
        this.data[x]=tdat;
      }
      return this;
    }
    // in place elementwise addition
    add(mat){
      function ipadd(a,b) {return a+b;}
      return elementwise(mat, ipadd);
    }

    // in place schur product
    schur(mat){
      function ipmult(a,b) {return a*b;}
      return elementwise(mat, ipadd);
    }

    // applies a function to each element, replacing the value with the function's return value
    apply(fcn){
        // input should be a function with one input and one output
        if (!(fcn instanceof Function)){
            // return an error since it's not a function
            throw new Error("[Input Error] A function is required to apply to each element.");
        }
        var tdat=0;
        for (var x=0; x < this.data.length; x++){
          tdat = fcn(parseFloat(this.data[x]));
          this.data[x]=tdat;
        }
        return this;
    }

    // normalize by vectors
    normalize(rowvecs=false){
        // run with false for column vectors, true for row vectors
        var x_len = parseFloat(this.x_len);
        var y_len = parseFloat(this.y_len);
        if (rowvecs){
            for (var x=0; x < y_len; x++){
                var vec = this.row(x).data;
                var vecsum = vec.reduce(radd,0);
                var div_vecsum = function(val){
                    return val/vecsum;
                }
                this.row_set(x, vec.map(div_vecsum));
            }
        } else {
            for (var x=0; x < y_len; x++){
                var vec = this.col(x).data;
                var vecsum = vec.reduce(radd,0);
                var div_vecsum = function(val){
                    return val/vecsum;
                }
                this.col_set(x, vec.map(div_vecsum));
            }
        }
        return this;
    }
    // returns the elementwise inverse
    elem_inv(){
        var inv_fcn = function (a) {
            return parseFloat(1./a);
        }
        return this.apply(inv_fcn);
    }
    // get the matrix norm of a level passed in, default 2
    norm(l=2){
        // sanitize numerical from this
        var x_len = parseInt(this.x_len);

        // some special norms
        if (l==1./0 || l=="inf"){
            // infinity norm
            // get the max value for inf vec norm for this vec
            return parseFloat(Math.max.apply(null, this.data));
        } else if (l=="fro") {
            // frobenius norm
            // root of sum of absolute squared
            var abs_sq = function (val) {
                return Math.abs(Math.pow(val,2));
            }
            return parseFloat(Math.sqrt(this.data.map(abs_sq).reduce(radd,0)));
        } else {
            // l-? norm
            l = parseInt(l);
            // lth root of sum of lth power
            var lpow = function (val) {
                return (Math.pow(val,l));
            }
            return parseFloat(Math.pow(this.data.map(lpow).reduce(radd,0),1./l));
        }
    }

    // emult means elementwise multiplication, so alias it
    emult(mat){
      return this.schur(mat);
    }
    // hadamard is also schur
    hadamard(mat){
      return this.schur(mat);
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
            var pos = x*len + x;
            data[pos] = 1
        }
        return new this(data, len, len)
    }
}

module.exports = MiniMat;
