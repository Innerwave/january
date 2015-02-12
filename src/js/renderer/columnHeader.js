( function ( $, window, undefined ) {
  $.extend( true, window, {
    "iui": {
      "sheet": {
        "renderer": {}
      }
    }
  } );

  // ------------------------------------
  // Private Area by Closure
  // ------------------------------------

  var Renderer = iui.sheet.renderer.ColumnHeader = function ( column ) {
    column = column || {};

    if ( !( this instanceof Renderer ) ) {
      return new Renderer( column );
    }

    var renderer = $( '<div style="padding:0;margin:0;height:100%;width:100%">' )
      .append(
        $( '<span>' ).text(
          column.label !== undefined ? column.label : column.visualId
        )
      )
      .append( '<div class="indicator">' )
      //        .data( 'column', column )
      .button()
      .removeClass( 'ui-corner-all' );

    return renderer;
  };


}( jQuery, window ) );
