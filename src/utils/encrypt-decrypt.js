/**
 * @summary Decrypt encoded text
 * @param {string} encoded
 * @param {string} [salt='12']
 * @returns {string}
 * */
const decrypt = (encoded, salt = '12') => {
    const textToChars = (text) => text.split('').map((c) => c.charCodeAt(0));
    const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code);
    return encoded
        ?.match(/.{1,2}/g)
        ?.map((hex) => parseInt(hex, 16))
        .map(applySaltToChar)
        .map((charCode) => String.fromCharCode(charCode))
        .join('');
};

/**
 * @summary Encrypt encoded text
 * @param {string} text
 * @param {string} [salt='12']
 * @returns {string}
 * */
const encrypt = (text, salt = '12') => {
    const textToChars = (text) => text.split('').map((c) => c.charCodeAt(0));
    const byteHex = (n) => ('0' + Number(n).toString(16)).substr(-2);
    const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code);

    return text.split('').map(textToChars).map(applySaltToChar).map(byteHex).join('');
};

module.exports = {
    decrypt,
    encrypt
}

