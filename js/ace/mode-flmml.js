define(
	"ace/mode/flmml_highlight_rules",
	["require", "exports", "module", "ace/lib/oop", "ace/mode/text_highlight_rules"],
	function (require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var FlMMLHighlightRules = function() {
   this.$rules = {
        "start": [
            {
                token: "meta",
                regex: "^#.*{",
                next : "meta-multiline"
            }, {
                token: "comment",
                regex: "\\/\\*",
                next : "comment"
            }, {
                token: "meta",
                regex: "^#.*\\n?"
            }, {
                token: "dollar",
                regex: "\\$"
            }, {
                token: "atmark",
                regex: "@"
            }, {
                token: "comma",
                regex: ","
            }, {
                token: "semicolon",
                regex: ";|="
            }, {
                token: "plus",
                regex: "\\+|#"
            }, {
                token: "minus",
                regex: "-"
            }, {
                token: "brace",
                regex: "[{}']"
            }, {
                token: "octvol",
                regex: "[<>()]"
            }, {
                token: "amp",
                regex: "&|\\*"
            }, {
                token: "perc",
                regex: "%"
            }, {
                token: "repeat",
                regex: "\\/:(\\d*)?"
            }, {
                token: "repeat",
                regex: ":\\/|/"
            }, {
                token: "poly",
                regex: "\\[|\\]"
            }
        ],
        "comment": [
            {
                token: "comment",
                regex: "\\*\\/",
                next: "start"
            },
            {defaultToken: "comment"}
        ],
        "meta-multiline": [
        	{
                token: "comment",
                regex: "\\/\\*",
                next : "meta-multiline-comment"
            }, {
                token: "meta",
                regex: "}",
                next: "start"
            },
            {defaultToken: "meta"}
        ],
        "meta-multiline-comment": [
            {
                token: "comment",
                regex: "\\*\\/",
                next: "meta-multiline"
            },
            {defaultToken: "comment"}
        ]
    };
};
oop.inherits(FlMMLHighlightRules, TextHighlightRules);
exports.FlMMLHighlightRules = FlMMLHighlightRules;
});

define(
	"ace/mode/flmml",
	[
		"require", "exports", "module",
		"ace/lib/oop", "ace/mode/text",
		"ace/mode/flmml_highlight_rules",
		"ace/mode/matching_brace_outdent",
		"ace/range",
		"ace/worker/worker_client"
	],
	function (require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;

var FlMMLHighlightRules = require("./flmml_highlight_rules").FlMMLHighlightRules;
var Range = require("../range").Range;
var WorkerClient = require("../worker/worker_client").WorkerClient;

var Mode = function() {
    this.HighlightRules = FlMMLHighlightRules;
};
oop.inherits(Mode, TextMode);
exports.Mode = Mode;
});