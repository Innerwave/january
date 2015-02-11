( function ( $, window, undefined ) {
  $.extend( true, window, {
    "iui": {
      "sheet": {
        "renderer": {}
      }
    }
  } );

  // ------------------------------------
  // Private
  // ------------------------------------    

  var Renderer = iui.sheet.renderer.Link = function ( cell ) {
    cell = cell || {};

    if ( !( this instanceof Renderer ) ) {
      return new Renderer( cell );
    }

    var div = $( '<div>' ).attr( 'title', cell.value );
    var span = $( '<a>' ).wrap( '<span>' ).text( cell.value )
      .attr( 'title', 'http://www.innerwave.co.kr' )
      .attr( 'href', 'http://www.innerwave.co.kr' )
      .appendTo( div );

    return div;
  };


}( jQuery, window ) );
