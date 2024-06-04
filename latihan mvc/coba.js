const path = require('path');
a = '1997-04-02'
b = 'abcd'
c = '20-20-2000'

dateRegex = /(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[0-1])/;
console.log(dateRegex.test(a))
console.log(dateRegex.test(b))
console.log(typeof path.join(__dirname, 'connect'))
