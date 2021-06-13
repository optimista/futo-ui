import { keys } from '@futo-ui/utils'

class ReservedWordError extends Error {
  constructor(message = "", ...args) {
    super(message, ...args);
    this.message = message;
  }
}

const reservedWordsCheck = (values, hookName, reservedWords) => {
  let ks = keys(values);
  for (let i = 0; i < ks.length; i++) {
    if (reservedWords.indexOf(ks[i]) != -1) {
      let message = "@futo-ui/"+hookName+": \""+ks[i]+"\" is RESERVED WORD. Use different name for your key.";
      throw new ReservedWordError(message);
    }
  }
}

export default reservedWordsCheck;
