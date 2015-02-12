( function ( $, window, undefined ) {
  $.extend( true, window, {
    "iui": {
      "sheet": {
        "renderer": {}
      }
    }
  } );

  var Renderer = iui.sheet.renderer.RowHeader = function ( row ) {
    var renderer = $( '<span>' ).text( row.label || i + 1 )
      .wrap( '<div>' ).parent()
      .css( {
        border: '0px',
        margin: '0px',
        padding: '0px',
        width: '100%',
        height: '100%'
      } )
      .append( '<div class="indicator">' );
    return renderer;
  };

  $.extend( Renderer.prototype, {

  } );
}( jQuery, window ) );
