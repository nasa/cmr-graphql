/**
 * Returns true if the app is running in offline mode and the token is 'ABC-1'
 * @param {String} token User token to check
 * @returns Boolean
 */
export const isOfflineMMT = (token) => process.env.IS_OFFLINE && token === 'ABC-1'
