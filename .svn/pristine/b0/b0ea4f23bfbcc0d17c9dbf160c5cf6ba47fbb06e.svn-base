( function ( $, window, undefined ) {
  $.extend( true, window, {
    "iui": {
      "util": {}
    }
  } );

  var simbols = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

  function utf8_encode( i ) {
    i = i.replace( /\r\n/g, "\n" );
    var o = [],
      c, l = 0;
    // BOM
    //    o[l++] = String.fromCharCode(239);
    //    o[l++] = String.fromCharCode(191);
    //    o[l++] = String.fromCharCode(187);
    for ( var idx = 0, len = i.length; idx < len; idx++ ) {
      c = i.charCodeAt( idx );
      if ( c < 128 ) {
        o[ l++ ] = String.fromCharCode( c );
      } else if ( ( c > 127 ) && ( c < 2048 ) ) {
        o[ l++ ] = String.fromCharCode( ( c >> 6 ) | 192 );
        o[ l++ ] = String.fromCharCode( ( c & 63 ) | 128 );
      } else {
        o[ l++ ] = String.fromCharCode( ( c >> 12 ) | 224 );
        o[ l++ ] = String.fromCharCode( ( ( c >> 6 ) & 63 ) | 128 );
        o[ l++ ] = String.fromCharCode( ( c & 63 ) | 128 );
      }
    }
    return o.join( "" );
  }

  function utf8_decode( i ) {
    var o = [],
      l = 0,
      idx = 0,
      c = 0,
      c1 = 0,
      c2 = 0,
      len = i.length;
    while ( idx < len ) {
      c = i.charCodeAt( idx++ );
      if ( c < 128 ) {
        o[ l++ ] = String.fromCharCode( c );
      } else if ( ( c > 191 ) && ( c < 224 ) ) {
        c2 = i.charCodeAt( idx++ );
        o[ l++ ] = String.fromCharCode( ( ( c & 31 ) << 6 ) | ( c2 & 63 ) );
      } else {
        c2 = i.charCodeAt( idx++ );
        c3 = i.charCodeAt( idx++ );
        o[ l++ ] = String.fromCharCode( ( ( c & 15 ) << 12 ) | ( ( c2 & 63 ) << 6 ) | ( c3 & 63 ) );
      }
    }
    return o.join( "" );
  }


  /**
   * Public Static Classes
   *
   */
  iui.util.Base64 = {
    encode: function ( i ) {
      i = utf8_encode( i );
      var o = [],
        l = 0,
        c1, c2, c3,
        e1, e2, e3, e4,
        idx = 0,
        len = i.length;
      while ( idx < len ) {
        c1 = i.charCodeAt( idx++ );
        c2 = i.charCodeAt( idx++ );
        c3 = i.charCodeAt( idx++ );
        e1 = c1 >> 2;
        e2 = ( ( c1 & 3 ) << 4 ) | ( c2 >> 4 );
        e3 = ( ( c2 & 15 ) << 2 ) | ( c3 >> 6 );
        e4 = c3 & 63;
        if ( isNaN( c2 ) ) {
          e3 = e4 = 64;
        } else if ( isNaN( c3 ) ) {
          e4 = 64;
        }
        o[ l++ ] = simbols.charAt( e1 );
        o[ l++ ] = simbols.charAt( e2 );
        o[ l++ ] = simbols.charAt( e3 );
        o[ l++ ] = simbols.charAt( e4 );
      }
      return o.join( "" );
    },

    decode: function ( i ) {
      i = i.replace( /[^A-Za-z0-9\+\/\=]/g, "" );
      var o = [],
        c1, c2, c3,
        e1, e2, e3, e4,
        idx = 0,
        l = 0,
        len = i.length;
      while ( idx < len ) {
        e1 = simbols.indexOf( i.charAt( idx++ ) );
        e2 = simbols.indexOf( i.charAt( idx++ ) );
        e3 = simbols.indexOf( i.charAt( idx++ ) );
        e4 = simbols.indexOf( i.charAt( idx++ ) );
        c1 = ( e1 << 2 ) | ( e2 >> 4 );
        c2 = ( ( e2 & 15 ) << 4 ) | ( e3 >> 2 );
        c3 = ( ( e3 & 3 ) << 6 ) | e4;
        o[ l++ ] = String.fromCharCode( c1 );
        if ( e3 !== 64 ) {
          o[ l++ ] = String.fromCharCode( c2 );
        }
        if ( e4 !== 64 ) {
          o[ l++ ] = String.fromCharCode( c3 );
        }
      }
      return utf8_decode( o.join( "" ) );
    },

  };

}( jQuery, window ) );
