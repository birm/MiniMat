require('MiniMat.js');

// just start with the simplest ones

// manually make a 2x2 with [1,2,3,4]
onetwothreefour = new MiniMat([1,2,3,4], 2, 2);

// make an identity of size 3
eye3 = MiniMat.Eye(3);

// Make a 4x4 matrix of all 4.18 values
pimat = MiniMat.FilledMat(4, 4, 4.18);

// make a 5x5 zerores matrix
zeromat = MiniMat.Zeroes(5,5);

// make a 6x7 of all ones
onesmat = MiniMat.Ones(6,7);

//TODO add some expected failures
