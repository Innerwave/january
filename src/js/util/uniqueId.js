( function ( $, window, undefined ) {
  $.extend( true, window, {
    "iui": {
      "util": {}
    }
  } );

  iui.util.uniqueId = ( function () {
    var guid = 0;
    return function ( prefix ) {
      return prefix + guid++;
    };
  }() );

}( jQuery, window ) );
