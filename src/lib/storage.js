import core from 'crypto-js';
import aes  from 'crypto-js/aes';

/**
 * Provides methods for storing data.
 *
 * @requires AureliaConfiguration
 */
export class Storage {

  /**
   * @var {String} secretKey
   */
  secretKey = null;

  /**
   * @var {String} prefix
   */
  prefix = null;

  /**
   * Create a new instance of Storage.
   *
   * @param {String} secretKey
   *   Crypto secret key.
   *
   * @param {String} prefix
   *   Storage name prefix (optional).
   */
  constructor(secretKey, prefix) {
    this.secretKey = secretKey;
    this.prefix    = prefix || '';
  }

  /**
   * Return values for a given key.
   *
   * @memberof Storage
   * @method getItem
   *
   * @param {String} key
   *   Storage key name.
   *
   * @return {*|undefined}
   */
  getItem(key) {
    if (typeof key === 'string') {
      let val = sessionStorage.getItem(this.getKeyName(key));
      if (val) {
        val = (aes.decrypt(val, this.secretKey)).toString(core.enc.Utf8);

        if (Storage.isValidJson(val)) {
          return JSON.parse(val);
        }
      }
    }
  }

  /**
   * Store values for a given key.
   *
   * @memberof Storage
   * @method setItem
   *
   * @param {String} key
   *   Storage item key name.
   *
   * @param {*} data
   *   sessionStorage data.
   *
   * @return {Boolean|void}
   */
  setItem(key, data) {
    if (typeof key === 'string') {
      data = aes.encrypt(
        JSON.stringify(data), this.secretKey
      ).toString();

      return sessionStorage.setItem(this.getKeyName(key), data);
    }
  }

  /**
   * Remove values for a given key.
   *
   * @memberof Storage
   * @method removeItem
   *
   * @param {String} key
   *   Storage item key name.
   *
   * @return {Boolean|void}
   */
  removeItem(key) {
    if (typeof key === 'string') {
      return sessionStorage.removeItem(this.getKeyName(key));
    }
  }

  /**
   * Return prefixed key name.
   *
   * @memberof Storage
   * @method getKeyName
   *
   * @param {String} str
   *   Storage key name.
   *
   * @return {String}
   */
  getKeyName(str) {
    return this.prefix + str;
  }

  /**
   * Check string is valid JSON format.
   *
   * @memberof Storage
   * @method isValidJson
   * @static
   *
   * @param {String} str
   *   JSON as string.
   *
   * @return {Boolean|undefined}
   */
  static isValidJson(str) {
    if (typeof str === 'string') {
      try {
        JSON.parse(str);
      } catch (err) {
        return false;
      }

      return true;
    }
  }
}