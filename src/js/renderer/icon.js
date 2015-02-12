  ( function ( $, window, undefined ) {
    $.extend( true, window, {
      "iui": {
        "sheet": {
          "renderer": {}
        }
      }
    } );


    var Renderer = iui.sheet.renderer.Icon = function ( cell ) {
      cell = cell || {};

      if ( !( this instanceof Renderer ) ) {
        return new Renderer( cell );
      }


      var div = $( '<div>' )
        .attr( 'title', cell.value );

      var icon = $( '<span>' )
        .html( '&nbsp' )
        .addClass( 'icon-' + cell.value )
        .appendTo( div );


      return div;
    };

  }( jQuery, window ) );
