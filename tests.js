/**
 *  @fileoverview MiniMat (Matrix algebra library) library tests.
 *  @author birm@rbirm.us (Ryan Birmingham)
 *  @license Copyright 2017 Ryan Birmingham.
 *  Licensed under GPL-3.
 */

var test = require('tape');
var MiniMat = require("./MiniMat");

// just start with the simplest ones

// manually make a 2x2 with [1,2,3,4]
test( 'default inits test', function(t) {
    t.plan(19);


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
    t.equal( MiniMat.FilledMat(3, 2, 4).add(MiniMat.FilledMat(3, 2, 4)).toString(true), MiniMat.FilledMat(3, 2, 8).toString(true), "Test matrix sums");

    // test in place schur
    t.equal( MiniMat.FilledMat(3, 2, 4).schur(MiniMat.FilledMat(3, 2, 4)).toString(true), MiniMat.FilledMat(3, 2, 16).toString(true), "Test matrix schur product");

    // test apply via inverse
    t.equal( MiniMat.FilledMat(2, 2, 4).elem_inv().toString(true), MiniMat.FilledMat(2, 2, 0.25).toString(true), "Test apply and inverse");

    // test norms
    // l-2 norm
    t.equal(MiniMat.FilledMat(2, 2, 4).norm() , 8, "Test l-2 norm");
    // fro norm
    t.equal(MiniMat.FilledMat(2, 2, 4).norm("fro") , 8, "Test fro norm");
    // inf norm
    t.equal(MiniMat.FilledMat(2, 2, 4).norm(1./0) , 4, "Test inf norm");

    // test diag
    t.equal(MiniMat.Eye(4).diag().toString(true) , MiniMat.Ones(1,4).toString(true), "Test diag");

    // test trace
    t.equal(MiniMat.Eye(4).trace() , 4, "Test trace");

    // test norms
    t.equal(MiniMat.FilledMat(2, 2, 4).normalize(false).toString(true), MiniMat.FilledMat(2, 2, 4).normalize(true).toString(true), "Test normalization");
});

//TODO add some expected failures
