(function ($, window, undefined) {
  $.extend(true, window, {
    "iui": {
      "util": {}
    }
  });

  /**
   * 주어진 문자열의 32비트 해시를 계산한다.
   * Found hear: https://gist.github.com/vaiorabbit/5657561
   *
   * 32 bit FNV-1a hash
   * Ref.: http://isthe.com/chongo/tech/comp/fnv/
   *
   * @param {string} str 해시 값을 구할 문자열
   * @return {integer}
   */
  iui.util.fnv32a = function (str) {
    var FNV1_32A_INIT = 0x811c9dc5,
      hval = FNV1_32A_INIT,
      i = 0,
      l = str.length;
    for (; i < l; i++) {
      hval ^= str.charCodeAt(i);
      hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
    }
    return hval >>> 0;
  };

  iui.util.hash = function (obj) {
    return iui.util.fnv32a(iui.util.Base64.encode(obj));
  };

}(jQuery, window));
