import 'react-native-get-random-values';
import JSBI from 'jsbi';

if (typeof global.BigInt === 'undefined') {
  global.BigInt = JSBI.BigInt;
}