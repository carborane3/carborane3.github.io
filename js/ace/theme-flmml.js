define("ace/theme/flmml",["require","exports","module","ace/lib/dom"], function(require, exports, module) {

exports.isDark = false;
exports.cssClass = "ace-flmml";
exports.cssText = ".ace-flmml .ace_gutter {\
background: #ebebeb;\
color: #333;\
overflow : hidden;\
}\
.ace-flmml .ace_print-margin {\
width: 1px;\
background: #e8e8e8;\
}\
.ace-flmml {\
background-color: #FFFFFF;\
color: black;\
}\
.ace-flmml .ace_cursor {\
color: black;\
}\
.ace-flmml .ace_invisible {\
color: rgb(191, 191, 191);\
}\
.ace-flmml .ace_comment {\
color: #208020;\
}\
.ace-flmml .ace_meta {\
color: #ff40a0;\
}\
.ace-flmml .ace_dollar {\
color: #e00000;\
}\
.ace-flmml .ace_atmark {\
color: #7800f0;\
}\
.ace-flmml .ace_comma {\
color: #606060;\
}\
.ace-flmml .ace_semicolon {\
color: #e000ff;\
}\
.ace-flmml .ace_plus {\
color: #c06000;\
}\
.ace-flmml .ace_minus {\
color: #0000b0;\
}\
.ace-flmml .ace_repeat {\
color: #0000ff;\
}\
.ace-flmml .ace_brace {\
color: #00a0a0;\
}\
.ace-flmml .ace_octvol {\
color: #0080d0;\
}\
.ace-flmml .ace_amp {\
color: #70a000;\
}\
.ace-flmml .ace_perc {\
color: #808080;\
}\
.ace-flmml .ace_poly {\
color: #7070e0;\
}\
.ace-flmml .ace_marker-layer .ace_selection {\
background: rgb(181, 213, 255);\
}\
.ace-flmml .ace_marker-layer .ace_step {\
background: rgb(252, 255, 0);\
}\
.ace-flmml .ace_marker-layer .ace_stack {\
background: rgb(164, 229, 101);\
}\
.ace-flmml .ace_marker-layer .ace_bracket {\
margin: -1px 0 0 -1px;\
border: 1px solid rgb(192, 192, 192);\
}\
.ace-flmml .ace_marker-layer .ace_active-line {\
background: rgba(0, 0, 0, 0.05);\
}\
.ace-flmml .ace_gutter-active-line {\
background-color : #dcdcdc;\
}\
.ace-flmml .ace_marker-layer .ace_selected-word {\
background: rgb(250, 250, 255);\
border: 1px solid rgb(200, 200, 250);\
}\
.ace-flmml .ace_indent-guide {\
background: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAE0lEQVQImWP4////f4bLly//BwAmVgd1/w11/gAAAABJRU5ErkJggg==\") right repeat-y;\
}\
";

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
});
