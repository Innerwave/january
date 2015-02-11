/*! Innerwave Spreadsheet - v0.2.515-SNAPSHOT - 2015-02-11
* Copyright (c) 2015 innerwave.co.kr; Licensed  */
( function ( factory ) {
  if ( typeof define === 'function' && define.amd ) {
    define( [
      'jquery'
    ], factory );
  } else {
    factory( jQuery );
  }
}( function ( $ ) {

  function getIntVal( value ) {
    var result = parseInt( value );
    return isNaN( result ) ? 0 : result;
  }

  return $.widget( 'iui.scroller', $.ui.slider, {
    version: '0.2.515-SNAPSHOT',
    widgetEventPrefix: 'iwscroll',

    options: {
      animate: false,
      distance: 0,
      max: 100,
      min: 0,
      orientation: "horizontal",
      range: false,
      step: 1,
      value: 0,
      values: null,

      // callbacks 
      change: null,
      slide: null,
      start: null,
      stop: null
    },

    numPages: 10,
    size: 200,

    _create: function () {
      this._super();

      var that = this;

      setTimeout( function () {
        var parent = that.element.parent();
        if ( that.orientation === 'horizontal' ) {
          that.element.width( parent.width() - that.handle.outerWidth() )
            .css( 'left', that.handle.outerWidth() / 2 + 'px' );
          that.handle.css( 'margin-left', -that.handle.outerWidth() / 2 );
        } else {
          that.element.height( parent.height() - that.handle.outerHeight() )
            .css( 'top', that.handle.outerHeight() / 2 + 'px' );
          that.handle.css( 'margin-top', -that.handle.outerHeight() / 2 );
        }
      }, 10 );
    },

    _setupEvents: function () {
      this._off( this.handles );
      this._on( this.handles, this._handleEvents );
      // this._hoverable(this.handles);
      this._focusable( this.handles );
    },

    _createRange: function () {},

    _normValueFromMouse: function ( position ) {
      var pixelTotal,
        pixelMouse,
        percentMouse,
        valueTotal,
        valueMouse;

      if ( this.orientation === "horizontal" ) {
        pixelTotal = this.elementSize.width;
        pixelMouse = position.x - this.elementOffset.left - ( this._clickOffset ? this._clickOffset.left : 0 );
      } else {
        pixelTotal = this.elementSize.height;
        pixelMouse = position.y - this.elementOffset.top - ( this._clickOffset ? this._clickOffset.top : 0 );
      }

      percentMouse = ( pixelMouse / pixelTotal );
      if ( percentMouse > 1 ) {
        percentMouse = 1;
      }
      if ( percentMouse < 0 ) {
        percentMouse = 0;
      }

      valueTotal = this._valueMax() - this._valueMin();
      valueMouse = this._valueMin() + percentMouse * valueTotal;

      return this._trimAlignValue( valueMouse );
    },

    _setOption: function ( key, value ) {
      var i,
        valsLength = 0;

      if ( $.isArray( this.options.values ) ) {
        valsLength = this.options.values.length;
      }

      if ( key === "disabled" ) {
        this.element.toggleClass( "ui-state-disabled", !!value );
      }

      this._super( key, value );

      switch ( key ) {
      case "orientation":
        this._detectOrientation();
        this.element
          .removeClass( "ui-slider-horizontal ui-slider-vertical" )
          .addClass( "ui-slider-" + this.orientation );
        this._refreshValue();

        // Reset positioning from previous orientation
        this.handles.css( value === "horizontal" ? "top" : "left", "" );
        break;
      case "value":
        this._animateOff = true;
        this._refreshValue();
        this._change( null, 0 );
        this._animateOff = false;
        break;
      case "values":
        this._animateOff = true;
        this._refreshValue();
        for ( i = 0; i < valsLength; i += 1 ) {
          this._change( null, i );
        }
        this._animateOff = false;
        break;
      case "step":
      case "min":
      case "max":
        this._animateOff = true;
        this._calculateNewMax();
        this._refreshValue();
        this._animateOff = false;
        break;
      }
    },

    _mouseCapture: function ( event ) {
      var position, normValue, distance, closestHandle, index, allowed, offset, mouseOverHandle,
        that = this,
        o = this.options;

      if ( o.disabled ) {
        return false;
      }

      this.elementSize = {
        width: this.element.outerWidth(),
        height: this.element.outerHeight()
      };

      this.elementOffset = this.element.offset();

      position = {
        x: event.pageX,
        y: event.pageY
      };
      normValue = this._normValueFromMouse( position );
      distance = this._valueMax() - this._valueMin() + 1;
      this.handles.each( function ( i ) {
        var thisDistance = Math.abs( normValue - that.values( i ) );
        if ( ( distance > thisDistance ) ||
          ( distance === thisDistance &&
            ( i === that._lastChangedValue || that.values( i ) === o.min ) ) ) {
          distance = thisDistance;
          closestHandle = $( this );
          index = i;
        }
      } );

      allowed = this._start( event, index );
      if ( allowed === false ) {
        return false;
      }
      this._mouseSliding = true;
      this._handleIndex = index;

      closestHandle
        .addClass( "ui-state-active" )
        .focus();

      offset = closestHandle.offset();
      mouseOverHandle = !$( event.target ).parents().addBack().is( ".ui-slider-handle" );
      this._clickOffset = mouseOverHandle ? {
        left: 0,
        top: 0
      } : {
        left: event.pageX - offset.left - ( closestHandle.width() / 2 ),
        top: event.pageY - offset.top -
          ( closestHandle.height() / 2 ) -
          ( parseInt( closestHandle.css( "borderTopWidth" ), 10 ) || 0 ) -
          ( parseInt( closestHandle.css( "borderBottomWidth" ), 10 ) || 0 ) +
          ( parseInt( closestHandle.css( "marginTop" ), 10 ) || 0 )
      };

      if ( !this.handles.hasClass( "ui-state-hover" ) ) {
        this._slide( event, index, normValue );
      }
      this._animateOff = true;
      return true;
    },

    _refreshValue: function () {
      var lastValPercent, valPercent, value, valueMin, valueMax,
        o = this.options,
        that = this,
        animate = ( !this._animateOff ) ? o.animate : false,
        _set = {};

      if ( this.options.values && this.options.values.length ) {
        this.handles.each( function ( i ) {
          valPercent = ( that.values( i ) - that._valueMin() ) / ( that._valueMax() - that._valueMin() ) * 100;
          _set[ that.orientation === "horizontal" ? "left" : "top" ] = valPercent + "%";
          $( this ).stop( 1, 1 )[ animate ? "animate" : "css" ]( _set, o.animate );
          lastValPercent = valPercent;
        } );
      } else {
        value = this.value();
        valueMin = this._valueMin();
        valueMax = this._valueMax();
        valPercent = ( valueMax !== valueMin ) ? ( value - valueMin ) / ( valueMax - valueMin ) * 100 : 0;
        _set[ this.orientation === "horizontal" ? "left" : "top" ] = valPercent + "%";
        this.handle.stop( 1, 1 )[ animate ? "animate" : "css" ]( _set, o.animate );
      }
    },

    _hoverable: function ( element ) {
      var that = this;
      this.hoverable = this.hoverable.add( element );
      this._on( element, {
        mouseenter: function ( event ) {
          $( event.currentTarget )
            .attr( 'title', that._value() )
            .addClass( "ui-state-hover" );
        },
        mouseleave: function ( event ) {
          $( event.currentTarget )
            .attr( 'title', '' )
            .removeClass( "ui-state-hover" );
        }
      } );
    },

    _handleEvents: {
      keydown: function ( event ) {
        var allowed, curVal, newVal, tmpVal, step,
          index = $( event.target ).data( "ui-slider-handle-index" );

        switch ( event.keyCode ) {
        case $.ui.keyCode.HOME:
        case $.ui.keyCode.END:
        case $.ui.keyCode.PAGE_UP:
        case $.ui.keyCode.PAGE_DOWN:
        case $.ui.keyCode.UP:
        case $.ui.keyCode.RIGHT:
        case $.ui.keyCode.DOWN:
        case $.ui.keyCode.LEFT:
          event.preventDefault();
          if ( !this._keySliding ) {
            this._keySliding = true;
            $( event.target ).addClass( "ui-state-active" );
            allowed = this._start( event, index );
            if ( allowed === false ) {
              return;
            }
          }
          break;
        }

        step = this.options.step;
        if ( this.options.values && this.options.values.length ) {
          curVal = newVal = this.values( index );
        } else {
          curVal = newVal = this.value();
        }

        switch ( event.keyCode ) {
        case $.ui.keyCode.HOME:
          newVal = this._valueMin();
          break;
        case $.ui.keyCode.END:
          newVal = this._valueMax();
          break;
        case $.ui.keyCode.PAGE_UP:
          tmpVal = ( ( this._valueMax() - this._valueMin() ) / this.numPages );
          newVal = this._trimAlignValue(
            curVal + ( this.orientation === "horizontal" ? tmpVal : -tmpVal )
          );
          break;
        case $.ui.keyCode.PAGE_DOWN:
          tmpVal = ( ( this._valueMax() - this._valueMin() ) / this.numPages );
          newVal = this._trimAlignValue(
            curVal + ( this.orientation === "horizontal" ? -tmpVal : tmpVal )
          );
          break;
        case $.ui.keyCode.UP:
        case $.ui.keyCode.RIGHT:
          if ( this.orientation === "horizontal" ) {
            if ( curVal === this._valueMax() ) {
              return;
            }
          } else {
            if ( curVal === this._valueMin() ) {
              return;
            }
          }
          newVal = this._trimAlignValue( curVal + ( this.orientation === "horizontal" ? step : -step ) );
          break;
        case $.ui.keyCode.DOWN:
        case $.ui.keyCode.LEFT:
          if ( this.orientation === "horizontal" ) {
            if ( curVal === this._valueMin() ) {
              return;
            }
          } else {
            if ( curVal === this._valueMax() ) {
              return;
            }
          }
          newVal = this._trimAlignValue( curVal + ( this.orientation === "horizontal" ? -step : step ) );
          break;
        }
        this._slide( event, index, newVal );
      },
      keyup: function ( event ) {
        var index = $( event.target ).data( "ui-slider-handle-index" );
        if ( this._keySliding ) {
          this._keySliding = false;
          this._stop( event, index );
          this._change( event, index );
          $( event.target ).removeClass( "ui-state-active" );
        }
      }
    }

  } );

} ) );
