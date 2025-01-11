let code = "";

function generateCode() {
  let temp = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 6; i++) {
    temp += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  code = temp;
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
