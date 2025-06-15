import { v4 as uuidv4 } from 'uuid';

let code = "";

function generateCode() {
  code = uuidv4().split('-')[0];
  return code;
}

function getCode() {
  return code;
}

function resetCode() {
  code = "";
  return code;
}

export { getCode, generateCode, resetCode };
