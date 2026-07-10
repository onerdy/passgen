// Cryptographically secure password/passphrase generation.

/**
 * Returns a uniformly-distributed random integer in [0, max) using
 * rejection sampling over crypto.getRandomValues to avoid modulo bias.
 */
function secureRandomInt(max) {
    if (max <= 0) throw new RangeError("max must be positive");
    const range = 4294967296; // 2^32
    const limit = range - (range % max);
    const buf = new Uint32Array(1);
    let value;
    do {
        crypto.getRandomValues(buf);
        value = buf[0];
    } while (value >= limit);
    return value % max;
}

function secureRandomChar(charSet) {
    return charSet[secureRandomInt(charSet.length)];
}

/** Fisher-Yates shuffle using secureRandomInt, returns a new array. */
function secureShuffle(array) {
    const result = array.slice();
    for (let i = result.length - 1; i > 0; i--) {
        const j = secureRandomInt(i + 1);
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

const UPPER_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER_CHARS = "abcdefghijklmnopqrstuvwxyz";
const NUMBER_CHARS = "0123456789";
const SYMBOL_CHARS = "!@#$%^&*";

/**
 * @param {{passLength:number, useUpperChars:boolean, useLowerChars:boolean,
 *          useNumberChars:boolean, useSymbolChars:boolean}} options
 */
function generatePassword(options) {
    let charSet = "";
    if (options.useUpperChars) charSet += UPPER_CHARS;
    if (options.useLowerChars) charSet += LOWER_CHARS;
    if (options.useNumberChars) charSet += NUMBER_CHARS;
    if (options.useSymbolChars) charSet += SYMBOL_CHARS;

    if (charSet === "") return "";

    let password = "";
    for (let i = 0; i < options.passLength; i++) {
        password += secureRandomChar(charSet);
    }
    return password;
}

function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

/**
 * @param {string[]} wordList
 * @param {{numberOfWords:number, capitalize:boolean, separatorChar:string,
 *          addNumber:boolean}} options
 */
function generatePassphrase(wordList, options) {
    let seedWords = secureShuffle(wordList).slice(0, options.numberOfWords);

    if (options.capitalize) {
        seedWords = seedWords.map(capitalize);
    }

    let passphrase = seedWords.join(options.separatorChar);

    if (options.addNumber) {
        passphrase += secureRandomInt(10);
    }

    return passphrase;
}
