YUI.add("scrollview-scrollbars",function(C){var B=C.ScrollView.CLASS_NAMES;function A(){}A.SCROLLBAR_TEMPLATE=["<div>",'<b class="'+B.child+" "+B.b+'"></b>','<span class="'+B.child+" "+B.middle+'"></span>','<b class="'+B.child+" "+B.b+'"></b>',"</div>"].join("");C.ScrollViewScrollbars=C.mix(A,{prototype:{renderUI:function(){if(this.get("scrollbarsEnabled")){this._renderScrollbars();C.later(500,this,"flashScrollbars",true);}},_uiSizeCB:function(){C.ScrollViewBase.prototype._uiSizeCB.apply(this,arguments);this._renderScrollbars();},_uiScrollY:function(E,D,F){C.ScrollViewBase.prototype._uiScrollY.apply(this,arguments);this.updateScrollbars(D,F);},_uiScrollX:function(E,D,F){C.ScrollViewBase.prototype._uiScrollX.apply(this,arguments);this.updateScrollbars(D,F);},_renderScrollbars:function(D){var F=this.get("boundingBox"),E=this.get("verticalScrollbarNode"),H=this.get("horizontalScrollbarNode"),G=true;if(this._scrollsVertical&&!E.inDoc()){F.append(E);G=false;}if(this._scrollsHorizontal&&!H.inDoc()){F.append(H);G=false;}if(!G){this.updateScrollbars();}},updateScrollbars:function(K,M){var J=this.get("contentBox"),D=0,G=1,I,P=this.get("height"),E=this.get("width"),Q=J.get("scrollHeight"),L=J.get("scrollWidth"),N=this.get("verticalScrollbarNode"),O=this.get("horizontalScrollbarNode"),H=this.get("scrollX")*-1,F=this.get("scrollY")*-1;if(!this._showingScrollBars){this.showScrollbars();}if(O&&Q<=P){this.hideScrollbars();return;}if(N){D=Math.floor(P*(P/Q));G=Math.floor((F/(Q-P))*(P-D))*-1;if(D>P){D=1;}I="translate3d(0, "+G+"px, 0)";if(G>(P-D)){D=D-(G-(P-D));}if(G<0){I="translate3d(0,0,0)";D=D+G;}K=K||0;if(this.verticalScrollSize!=(D-8)){this.verticalScrollSize=(D-8);N.get("children").item(1).setStyles({"-webkit-transition-property":(K>0?"-webkit-transform":null),"-webkit-transform":"translate3d(0,0,0) scaleY("+(D-8)+")","-webkit-transition-duration":(K>0?K+"ms":null)});}N.setStyles({"-webkit-transition-property":(K>0?"-webkit-transform":null),"-webkit-transform":I,"-webkit-transition-duration":(K>0?K+"ms":null)});N.get("children").item(2).setStyles({"-webkit-transition-property":(K>0?"-webkit-transform":null),"-webkit-transform":"translate3d(0,"+(D-10)+"px,0)","-webkit-transition-duration":(K>0?K+"ms":null)});}if(O){D=Math.floor(E*(E/L));G=Math.floor((H/(L-E))*(E-D))*-1;if(D>E){D=1;}I="translate3d("+G+"px, 0, 0)";if(G>(E-D)){D=D-(G-(E-D));}if(G<0){I="translate3d(0,0,0)";D=D+G;}K=K||0;if(this.horizontalScrollSize!=(D-16)){this.horizontalScrollSize=(D-16);O.get("children").item(1).setStyles({"-webkit-transition-property":(K>0?"-webkit-transform":null),"-webkit-transform":"translate3d(0,0,0) scaleX("+this.horizontalScrollSize+")","-webkit-transition-duration":(K>0?K+"ms":null)});}O.setStyles({"-webkit-transition-property":(K>0?"-webkit-transform":null),"-webkit-transform":I,"-webkit-transition-duration":K+"ms"});O.get("children").item(2).setStyles({"-webkit-transition-property":(K>0?"-webkit-transform":null),"-webkit-transform":"translate3d("+(D-12)+"px,0,0)","-webkit-transition-duration":(K>0?K+"ms":null)});}},showScrollbars:function(E){var D=this.get("verticalScrollbarNode"),F=this.get("horizontalScrollbarNode");this._showingScrollBars=true;if(this._flashTimer){this._flashTimer.cancel();}if(E){if(D){D.setStyle("-webkit-transition","opacity .6s");}if(F){F.setStyle("-webkit-transition","opacity .6s");}}if(D){D.addClass(B.showing);}if(F){F.addClass(B.showing);}},hideScrollbars:function(E){var D=this.get("verticalScrollbarNode"),F=this.get("horizontalScrollbarNode");this._showingScrollBars=false;if(this._flashTimer){this._flashTimer.cancel();}if(E){if(D){D.setStyle("-webkit-transition","opacity .6s");}if(F){F.setStyle("-webkit-transition","opacity .6s");}}if(D){D.removeClass(B.showing);}if(F){F.removeClass(B.showing);}},flashScrollbars:function(){var D=false;if(this._scrollsVertical&&this.get("contentBox").get("scrollHeight")>this.get("height")){D=true;}if(this._scrollsHorizontal&&this.get("contentBox").get("scrollWidth")>this.get("width")){D=true;}if(D){this.showScrollbars(true);this._flashTimer=C.later(800,this,"hideScrollbars",true);}},_defScrollEndFn:function(D){this.flashScrollbars();}},ATTRS:{scrollbarsEnabled:{value:true,validator:C.Lang.isBoolean},verticalScrollbarNode:{setter:function(D){D=C.one(D);if(D){D.addClass(B.scrollbar);D.addClass(B.vertical);}return D;},value:C.Node.create(A.SCROLLBAR_TEMPLATE)},horizontalScrollbarNode:{setter:function(D){D=C.one(D);if(D){D.addClass(B.scrollbar);D.addClass(B.horizontal);}return D;},value:C.Node.create(A.SCROLLBAR_TEMPLATE)}}},true);},"@VERSION@",{requires:["scrollview-base"]});