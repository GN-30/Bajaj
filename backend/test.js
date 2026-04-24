const { processData } = require('./src/services/bfhlService');

const data = ["A->B", "A->C", "B->D", "D->E", "E->F", "X->X", "Y->", "1->2", "A->B", "M->N", "N->O", "O->M"];

console.log(JSON.stringify(processData(data), null, 2));
