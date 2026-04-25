 // Polyfills for crypto and BigInt support
// Note: react-native-get-random-values and jsbi should be installed for full support
// import 'react-native-get-random-values';
// import JSBI from 'jsbi';
// if (typeof global.BigInt === 'undefined') {
//   global.BigInt = JSBI.BigInt;
// }

// Basic polyfill for BigInt if not available
if (typeof global.BigInt === 'undefined') {
  global.BigInt = function(value) {
    return BigInt(value);
  };
}