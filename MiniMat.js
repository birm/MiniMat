/**
 *  @fileoverview Matrix algebra library for javascript.
 *  @author birm@rbirm.us (Ryan Birmingham)
 *  @license Copyright 2017 Ryan Birmingham.
 *  Licensed under GPL-3.
 */

/** a sum reduce function needed many places */
function radd(x,y){
    return x+y;
}
/**
 *A Matrix Object
 *@constructor
 *@param {Object[]} data - an array containing all data, column major (column major order is like Octave and R)
 *@param {int} x_len - the number of columns.
 *@param {int} [y_len] - the number of rows, default 1.
 */
class MiniMat {
    constructor(data, x_len, y_len=1) {
        // validate the input
        // define an inline function to pass to Array.proto.every
        function isNumberType(element, index, array) {
            return typeof(element) === "number";
        }
        if ((typeof(x_len) !== 'number') && (typeof(y_len) !== 'number')) {
            // types don't allign, and we'll try to cast; warn
            console.warn("[TypeWarning] Your x_len and y_len arguments to MiniMat should be Numbers. Since they are not, they will be cast as Numbers via parseInt().");
        } else if (!(data.constructor === Array) && !data.every(isNumberType)) {
            // the data is the wrong type; error
            throw new Error("[Data Error] Data is not an array.");
        }
        data.map(parseFloat);
        x_len = parseInt(x_len, 10);
        y_len = parseInt(y_len, 10);
        // error if wrong amount of data
        if (!(x_len * y_len === parseInt(data.length, 10))){
            throw new Error("[Data Error] Data length should be " + parseInt(x_len * y_len, 10) + " and instead is " + parseInt(data.length, 10) + ".");
        }
        this.x_len = x_len; // number rows
        this.y_len = y_len; // number cols
        this.data = data;
    }


    /** Give a string value for either human or machine inspection
     *@param {bool} [machine] - Whether or not to return a test comparision string.
     */
    toString(machine=false) {
        if (machine === false) {
            var outstr = this.x_len + " by " + this.y_len + " MiniMat: \n";
            for (var x = 0; x < this.x_len; x++){
                outstr = outstr + "[" + this.data.slice(x * this.y_len, (x+1) * this.y_len).toString() + "]\n";
            }
            return outstr;
        }else {
            return "MiniMat{(" + this.data.toString() + ")" + this.x_len + "," + this.y_len + "}";
        }
    }
    /** Get a JSON string from a matrix
    */
    json(){
      var json = {"type":"minimat","data":
      this.data, "x_len": + parseInt(this.x_len,10)
      ,"y_len":parseInt(this.y_len,10)};
      return json;
    }

    /** Get a row or rows by index.
    * @param {int} index - the first row index of the desired selection
    * @param {int} [to_index] - the last row index of the desired selection. if to_index is unset or -1, only the index row is returned
     */
    row(index, to_index=-1) {
        //if to_index is unset or -1, only the index row is returned
        if (to_index === -1) {
            to_index=index;
        }
        // sanitize all we use
        var x_len = parseInt(this.x_len, 10);
        var y_len = parseInt(this.y_len, 10);
        index = parseInt(index, 10);
        to_index = parseInt(to_index, 10);

        // assure all in range are accessible
        if (to_index >= x_len || index >= x_len){
            throw new Error("[Row Index Error] Rows between " + index + " and " + to_index + " are not all within the " + x_len + " rows in the matrix.");
        }
        var first_data_pos = Math.min(index, to_index) * y_len;
        var last_data_pos = ((Math.max(index, to_index)+1) * (y_len));
        return new MiniMat(this.data.slice(first_data_pos, last_data_pos), Math.abs(to_index-index)+1, y_len);
    }

    /** Get rows as a generator
     */
    * rows(){
      var ind = 0;
      while (ind < this.y_len){
        yield this.row(ind);
        ind ++;
      }
    }

    /** Set a row's data in place.
    * @param {int} index - which row to change
    * @param {Object[]} data - the data to change the row to
    * @param {int} to_index - the last row to change, if changing multiple rows.
    */
    row_set(index, data=[], to_index=-1) {
        if (to_index === -1) {
            to_index=index;
        }
        // sanitize all we use
        var x_len = parseInt(this.x_len, 10);
        var y_len = parseInt(this.y_len, 10);
        index = parseInt(index, 10);
        to_index = parseInt(to_index, 10);
        var first_data_pos = Math.min(index, to_index) * y_len;
        var last_data_pos = ((Math.max(index, to_index)+1) * (y_len));
        for (var x = 0; x < last_data_pos-first_data_pos; x++){
            this.data[x+first_data_pos]=data[x];
        }
        return this
    }

    /** Get a column or columns by index.
    * @param {int} index - the first column index of the desired selection
    * @param {int} [to_index] - the last column index of the desired selection. if to_index is unset or -1, only the index column is returned
     */
    col(index, to_index=-1) {
        // index should be the first row index
        // to_index (optional) should be the last row index

        // if to_index is unset or -1, only the index row is returned
        if (to_index === -1) {
            to_index=index;
        }

        // sanitize all we use
        var x_len = parseInt(this.x_len, 10);
        var y_len = parseInt(this.y_len, 10);
        index = Math.min(parseInt(index, 10), parseInt(to_index, 10));
        to_index = Math.max(parseInt(index, 10), parseInt(to_index, 10));

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

    /** Get columns as a generator
     */
    * cols(){
      var ind = 0;
      while (ind < this.y_len){
        yield this.col(ind);
        ind ++;
      }
    }
    /** Set a columns data in place.
    * @param {int} index - which column to change
    * @param {Object[]} data - the data to change the column to
    * @param {int} to_index - the last column to change, if changing multiple columns.
    */
    col_set(index, data=[], to_index=-1) {
        if (to_index === -1) {
            to_index=index;
        }
        // sanitize all we use
        var x_len = parseInt(this.x_len, 10);
        var y_len = parseInt(this.y_len, 10);
        index = parseInt(index, 10);
        to_index = parseInt(to_index, 10);
        // for each col to change
        for (var x=0; x <= to_index-index; x++){
            for (var y = 0; y < y_len; y++){
                // position in new data to get
                var new_pos = parseInt(x*y_len+y, 10)
                // position in old data to replace
                var old_pos = parseInt(index+x+(y_len*y), 10);
                this.data[old_pos]=data[new_pos]
            }
        }
        return this
    }

    /** Get the diagonal of the matrix */
    diag(){
        var x_len = parseInt(this.x_len, 10);
        var y_len = parseInt(this.y_len, 10);
        var outlen = parseInt(Math.min(x_len,y_len), 10);
        var outvec = [];
        for (var x = 0; x < outlen; x++) {
            outvec[x] = parseFloat(this.data[(x_len*x)+x]);
        }
        return new MiniMat(outvec, 1, outlen);
    }

    /** Get the trace of the matrix */
    trace(){
        return parseFloat((this.data.reduce(radd,0)));
    }

    /** Check that the sizes are the same for these */
    same_dims(mat){
      return ((this.x_len === mat.x_len) && (this.y_len === mat.y_len));
    }

    /** Perform an in-place elementwise operation on the matrix. This is an in place operation, so the object reference is changed, but the one passed is not.
    * @param {MiniMat} mat - Another matrix to use for values for the operation
    * @param {function} operation - a function which returns one value given two
    */
    elementwise(mat, operation){
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

    /** Perform a matrix product, NOT in place; returns new mat.
    * @param {MiniMat} mat - Another matrix to use for values for the operation
    */
    product(mat, operation){
      // make sure they're compatible
      if (!(this.y_len === mat.x_len)){
        throw new Error("[Data Error] Matrices must share inner dimension size.");
      }
      // make a new minimat of the appropriate size
      var res = MiniMat.Zeroes(this.x_len, mat.y_len);
      // for each row of this,
      //  calculate partial products on new one, adding to existing one
      // return the new matrix
    }

    // in place elementwise addition
    add(mat){
      var ipadd =function(a,b) {return a+b;}
      return this.elementwise(mat, ipadd);
    }

    // in place schur product
    schur(mat){
      var ipmult = function(a,b) {return a*b;}
      return this.elementwise(mat, ipmult);
    }

    /** applies a function to each element
    * @param {function} fcn - a function which replaces values of its input to its output.
    */
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

    /** normalize by vectors
    @param {bool} [rowvecs] - true to normalize on rows
    */
    normalize(rowvecs=false){
        // run with false for column vectors, true for row vectors
        var x_len = parseFloat(this.x_len);
        var y_len = parseFloat(this.y_len);
        var itlen;
        if (rowvecs){
          itlen = x_len;
        } else {
          itlen = y_len;
        }
        var div_vecsum = function(val){
            return val/vecsum;
        }
        for (var x=0; x < itlen; x++){
          var vec;
          if (rowvecs){
            vec = this.row(x).data;
          } else {
            vec = this.col(x).data;
          }
          var vecsum = vec.reduce(radd,0);
          this.row_set(x, vec.map(div_vecsum));
        }
        return this;
    }

    /** returns the elementwise inverse in place */
    elem_inv(){
        var inv_fcn = function (a) {
            return parseFloat(1./a);
        }
        return this.apply(inv_fcn);
    }

    /** Return the matrix norm of a level passed in
    * @param {int} [l] - the matrix norm level to take, default 2. Can be inf or fro also.
    */
    norm(l=2){
        // sanitize numerical from this
        var x_len = parseInt(this.x_len, 10);

        // some special norms
        if (l === 1./0 || l === "inf"){
            // infinity norm
            // get the max value for inf vec norm for this vec
            return parseFloat(Math.max.apply(null, this.data));
        } else if (l === "fro") {
            // frobenius norm
            // root of sum of absolute squared
            var abs_sq = function (val) {
                return Math.abs(Math.pow(val,2));
            }
            return parseFloat(Math.sqrt(this.data.map(abs_sq).reduce(radd,0)));
        } else {
            // l-? norm
            l = parseInt(l, 10);
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

    /** Make a matrix filled with one value
    * @constructor
    * @param {int} x_len - the number of columns.
    * @param {int} y_len - the number of rows
    * @param {int} [value] - the value to fill the matrix with, default 1
    */
    static FilledMat(x_len, y_len, value=1) {
        x_len = parseInt(x_len, 10);
        y_len = parseInt(y_len, 10);
        var data = new Array(parseInt(x_len*y_len, 10));
        data.fill(value);
        return new this(data, x_len, y_len)
    }

    /** make a matrix from a text file content
    * @constructor
    * @param {string} content - The contents of a file to load, with "?" as "missing values"
    * @param {int} x_len - the number of columns.
    * @param {int} y_len - the number of rows
    */
    static FromFile(data, x_len, y_len){
      // convert to array, 1d
      data = data.replace(/\n/g,',')
      // replace missing (denoted ?) with infinity
      data = data.replace(/\?/g,"Infinity")
      data = data.split(","); // TODO add other delimiters?
      // map to float
      data = data.map(parseFloat);
      // remove nan from data format issues
      data = data.filter(function(v) { return (!!v || v==0); });
      // turn infinity back into NaN
      data = data.map(function(x){
        if (x==Infinity){
          return NaN;
        } else {
          return x;
        }
      });
      return new this(data, x_len, y_len)
    }

    /** Generate a matrix from data passed in the browser
    * assign to window.onload to use
    * @constructor
    * @param {str} [file_tag] - the element id of a text input, to contain number of columns, default 'fileInput'.
    * @param {str} [x_tag] - the element id of a text input, to contain number of columns, default 'x_len'.
    * @param {str} [y_tag] - the element id of a text input, to contain number of rows, default 'y_len'.
    * @param {str} [preview_tag] - the element id in which to display the string representation of the loaded matrix or any error, default 'preview'.
    */
    static OnLoad(file_tag='fileInput', x_tag='x_len', y_tag='y_len', preview_tag='preview'){
      var fileInput = document.getElementById(file_tag);
      var fileDisplayArea = document.getElementById(preview_tag);

      fileInput.addEventListener('change', function(e) {
          var file = fileInput.files[0];
          var textType = /text.*/;

          if (file.type.match(textType)) {
              var reader = new FileReader();

              var datamat;
              reader.onload = function(e) {
                  // catch erorrs in matrix creation
                  try {
                      // get x and y sizes
                      var x_len = document.getElementById(x_tag);
                      var y_len = document.getElementById('y_tag');
                      // make sure x and y are ints
                      x_len = parseInt(x_len.value, 10);
                      y_len = parseInt(y_len.value, 10);
                      // create matrix
                      datamat = MiniMat.FromFile(reader.result, x_len, y_len);
                      // display matrix out
                      fileDisplayArea.innerText = datamat.toString();
                  }
                  catch (err) {
                      // print erorrs in matrix creation
                      fileDisplayArea.innerText = "ERROR LOADING: " + err.message;
                  }
              }

              reader.readAsText(file);
          } else {
              fileDisplayArea.innerText = "File not supported!"
          }
      });
      return datamat;
    }

    /** make a matrix from a json
    * @constructor
    * @param {JSON} object - the number of columns.
    */
    static FromJson(object){
        if (object['type'] !== "minimat"){
          console.warn("[Data Error] This json does not appear to be a MiniMat json.");
        }
        return new this(object['data'], object['x_len'], object['y_len']);
    }

    /** make a matrix filled with ones
    * @constructor
    * @param {int} x_len - the number of columns.
    * @param {int} y_len - the number of rows
    */
    static Ones(x_len, y_len){
        return this.FilledMat(x_len, y_len, 1)
    }

    /** make a matrix filled with zeroes
    * @constructor
    * @param {int} x_len - the number of columns.
    * @param {int} y_len - the number of rows
    */
    static Zeroes(x_len, y_len){
        return this.FilledMat(x_len, y_len, 0)
    }

    /** make a square identity matrix
    * @constructor
    * @param {int} len - the number of columns and rows.
    */
    static Eye(len){
        len = parseInt(len, 10);
        var data = new Array(parseInt(Math.pow(len,2), 10));
        data.fill(0);
        for (var x = 0; x < len; x ++) {
            var pos = x*len + x;
            data[pos] = 1
        }
        return new this(data, len, len)
    }
}

module.exports = MiniMat;
