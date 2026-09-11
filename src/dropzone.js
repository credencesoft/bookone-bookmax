
ngOnInit()
  if (!isPlatformBrowser(this.platformId)) {
      return;
  }
  import('dropzone').then(module => {
    const Dropzone = module.default;
    Dropzone.autoDiscover = false;
   // all remaining code of ngOninit
  }),


 (function webpackUniversalModuleDefinition(root, factory) {
  if (!root) return;
 	if(typeof exports === 'object' && typeof module === 'object')
 		module.exports = factory();
 	else if(typeof define === 'function' && define.amd)

 		var a = factory();
 		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
 	}
)(self, function() {
})(typeof self !== 'undefined' && self, function() {
 return /******/ (function() { // webpackBootstrap
 /******/ 	var __webpack_modules__ = ({
 })})})
