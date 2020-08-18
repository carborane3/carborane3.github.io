"use strict";

!function () {

var editor;

var flmml = new FlMMLonHTML5();
flmml.oncompilecomplete = function () {
	$("#warnings").text(flmml.getWarnings());
};
flmml.onsyncinfo = function () {
	$("#disp").text(flmml.getNowTimeStr() + "/" + flmml.getTotalTimeStr());
};
flmml.onbuffering = function (e) {
	$("#disp").text("バッファリング: " + e.progress + "%");
};
flmml.setInfoInterval(200);

var tFade = 250;
var tIDStatus, tIDAutoSave;
var config, defaultConfig;

function status(text) {
	if (text) {
		error();
		$("#status").text(text);
		$("#statusbar").fadeIn(tFade);
		clearTimeout(tIDStatus);
		tIDStatus = setTimeout(function () {
			status();
		}, 3500);
	} else {
		$("#statusbar").fadeOut(tFade);
	}
}

function error(text) {
	if (text) {
		status();
		$("#error").text(text);
		$("#errorbar").fadeIn("fast");
		clearTimeout(tIDStatus);
		tIDStatus = setTimeout(function () {
			error();
		}, 3500);
	} else {
		$("#errorbar").fadeOut("fast");
	}
}

function play() {
	if (flmml.isPlaying()) {
		flmml.stop();
	}
	flmml.play(editor.getValue());
}

function pause() {
	if (flmml.isPlaying()) {
		flmml.pause();
	}
}

function stop() {
	if (flmml.isPlaying() || flmml.isPaused()) {
		flmml.stop();
	}
}

function open() {
	$("#dialog-open").dialog("open");
}

function openFile(file) {
	if (!file) {
		error("ファイルを読み込めませんでした。");
		return false;
	}
    if (file.size > 1024 * 1024) {
		error("ファイルが大きすぎます。読み込むファイルは1MB以下としてください。");
		return false;
    }
    var reader = new FileReader();
    reader.onload = function (e) {
		editor.setValue(e.target.result);
		editor.selection.moveCursorFileStart();
		editor.focus();
		status(file.name + " を読み込みました。");
		if (config.openSave) {
			localStorage.mml = e.target.result;
		}
    };
    reader.readAsText(file);
    $("#dialog-open").dialog("close");
    return true;
}

function save() {
	localStorage.mml = editor.getValue();
	status("ローカルストレージにMMLを保存しました。");
}

function download() {
	$("#filename").val(localStorage.fileName || "mml.txt");
	$("#dialog-download").dialog("open");
}

function downloadMML() {
	var fileName = $("#filename").val() || "mml.txt";
	var anchor = $("<a>").attr({
		href: URL.createObjectURL(new Blob([editor.getValue()])),
		download: fileName
	}).text(fileName)[0];
	var e = document.createEvent("MouseEvents");
	e.initEvent("click", false, false);
	anchor.dispatchEvent(e);
	localStorage.fileName = fileName;
}

function setConfigForm(cfg) {
	$("#cfg-opensave").prop("checked", cfg.openSave);
	$("#cfg-autosave").prop("checked", cfg.autoSave);
	$("#cfg-autosave-interval").val(cfg.autoSaveInterval);
	$("#cfg-font-family").val(cfg.fontFamily);
	$("#cfg-font-size").val(cfg.fontSize);
	if (cfg.wrap === "off") {
		$("#cfg-wrap-off").prop("checked", true);
	} else if (cfg.wrap === "free") {
		$("#cfg-wrap-free").prop("checked", true);
	} else {
		$("#cfg-wrap-num").prop("checked", true);
		$("#cfg-wrap-len").val(cfg.wrap);
	}
	$("#cfg-tabsize").val(cfg.tabSize);
	$("#cfg-softtab").prop("checked", cfg.softTab);
	$("#cfg-show-invisibles").prop("checked", cfg.showInvisibles);
}

function applyConfig() {
	var session = editor.getSession();

	for (var i in defaultConfig) {
		if (config[i] === undefined) {
			config[i] = defaultConfig[i];
		}
	}
	clearInterval(tIDAutoSave);
	if (config.autoSave) {
		tIDAutoSave = setInterval(save, config.autoSaveInterval * 1000);
	}
	$("#editor").css("font-family", config.fontFamily);
	$("#editor").css("font-size", config.fontSize);
	session.setOption("wrap", config.wrap);
	session.setTabSize(config.tabSize);
	session.setUseSoftTabs(config.softTab);
	editor.setShowInvisibles(config.showInvisibles);
}

$(window).on("load resize", function () {
	//var w = $(window).width();
    var h = $(window).height();
    var th = $("#toolbar").outerHeight();
    var wh = $("#warnings").outerHeight();
    $("#editor-wrapper").css("height", (h - th - wh) + "px");
    editor.resize();
});

$(window).on("dragover", function (e) {
    e.preventDefault();
    e.stopPropagation();
    e.originalEvent.dataTransfer.dropEffect = "copy";
});

$(window).on("drop", function (e) {
    e.preventDefault();
    e.stopPropagation();

	var files = e.originalEvent.dataTransfer.files;
	if (files && files[0]) {
	    openFile(e.originalEvent.dataTransfer.files[0]);
    }
});

$(window).keydown(function (e) {
	// F5
	if (e.keyCode === 116) {
		play();
		return false;
	}

	// F6
	if (e.keyCode === 117) {
		pause();
		return false;
	}

	// F7
	if (e.keyCode === 118) {
		stop();
		return false;
	}

	if (e.ctrlKey || e.metaKey) {
		// Ctrl+O or Command+O
		if (e.keyCode === 79) {
			open();
			return false;
		}

		// Ctrl+P or Command+P
		if (e.keyCode === 80) {
			play();
			return false;
		}

		// Ctrl+R or Command+R
		if (e.keyCode === 82) {
			return false;
		}

		// Ctrl+S or Command+S
		if (e.keyCode === 83) {
			if (e.shiftKey) {
				download();
			} else {
				save();
			}
			return false;
		}

		// Ctrl+T or Command+T
		if (e.keyCode === 80) {
			stop();
			return false;
		}
	}

	if (e.metaKey) {
		
	}
});

$(function () {
	editor = ace.edit("editor");
	var session = editor.getSession();
	editor.setTheme("ace/theme/flmml");
	session.setMode("ace/mode/flmml");
	editor.setShowPrintMargin(false);
	session.setUseSoftTabs(false);
	session.setOptions({
		wrap: "free",
		indentedSoftWrap: false
	});
	editor.$blockScrolling = Infinity;
	editor.commands.addCommand({
		name: "test",
		bindKey: {win: "Ctrl-P",  mac: 'Command-P'},
		exec: function() {
			play();
		}
	});

	$("#toolbar").tooltip({
		show: tFade,
		hide: tFade,
		content: function () {
			return $(this).attr("title");
		}
	});
	$("#open").button({
		icons: { primary: "ui-icon-folder-open" },
		text: false
	});
	$("#save").button({
		icons: { primary: "ui-icon-disk" },
		text: false
	});
	$("#download").button({
		icons: { primary: "ui-icon-arrowthickstop-1-s" },
		text: false
	});
	$("#undo").button({
		icons: { primary: "ui-icon-arrowreturnthick-1-w" },
		text: false
	});
	$("#redo").button({
		icons: { primary: "ui-icon-arrowreturnthick-1-e" },
		text: false
	});
	$("#find").button({
		icons: { primary: "ui-icon-search" },
		text: false
	});
	$("#findprev").button({
		icons: { primary: "ui-icon-arrowthick-1-n" },
		text: false
	});
	$("#findnext").button({
		icons: { primary: "ui-icon-arrowthick-1-s" },
		text: false
	});
	$("#play").button({
		icons: { primary: "ui-icon-play" },
		text: false
	});
	$("#pause").button({
		icons: { primary: "ui-icon-pause" },
		text: false
	});
	$("#stop").button({
		icons: { primary: "ui-icon-stop" },
		text: false
	});
	$("#config").button({
		icons: { primary: "ui-icon-gear" },
		text: false
	});
	$("#about").button({
		icons: { primary: "ui-icon-info" },
		text: false
	});
	$("#volume").slider({
		min: 0,
		max: 127,
		step: 1,
		value: 100
	});
	$(".group").buttonset();

	$("#statusbar").hide();
	$("#errorbar").hide();

	$("#toolbar,#statusbar,#errorbar,#warnings").on("mousedown touchstart", function () {
		return false;
	});

	$("#open").click(open);
	$("#save").click(save);
	$("#download").click(download);
	$("#undo").click(function () {
		editor.undo();
	});
	$("#redo").click(function () {
		editor.redo();
	});
	$("#find").click(function () {
		require("ace/config").loadModule("ace/ext/searchbox", function (e) {
			e.Search(editor, true);
		});
	});
	$("#findprev").click(function () {
		editor.findPrevious();
	});
	$("#findnext").click(function () {
		editor.findNext(); 
	});
	$("#play").click(play);
	$("#pause").click(pause);
	$("#stop").click(stop);
	$("#volume").on("slide", function () {
		var vol = $("#volume").slider("value");
		flmml.setMasterVolume(parseInt(vol));
		localStorage.volume = vol;
	});
	$("#config").click(function () {
		setConfigForm(config);
		$("#dialog-config").dialog("open");
	});
	$("#about").click(function () {
		$("#dialog-about").dialog("open");
	});
	$("#file").on("change", function (e) {
		var fFile = e.originalEvent.srcElement;
		if (!fFile.value || !fFile.files || !fFile.files[0]) {
			return;
		}
		openFile(fFile.files[0]);
	});
	$("#filename").on("keydown", function (e) {
		if (e.keyCode === $.ui.keyCode.ENTER) {
			setTimeout(function () {
				$("#download-download").click();
			}, 0);
		}
	});

	if (localStorage.volume >= 0) {
		flmml.setMasterVolume(localStorage.volume);
		$("#volume").slider("value", localStorage.volume);
	}

	$("#tabs-config").tabs();
	$("#dialog-open").dialog({
		autoOpen: false,
		resizable: false,
		width: "300px",
		buttons: [
			{
				text: "キャンセル",
				click: function () {
					$(this).dialog("close");
				}
			}
		]
	});

	$("#dialog-download").dialog({
		autoOpen: false,
		resizable: false,
		width: "250px",
		buttons: [
			{
				id: "download-download",
				text: "ダウンロード",
				click: function () {
					downloadMML();
					$(this).dialog("close");
				}
			}, {
				text: "キャンセル",
				click: function () {
					$(this).dialog("close");
				}
			}
		]
	});

	$("#dialog-config").dialog({
		autoOpen: false,
		resizable: false,
		width: "400px",
		buttons: [
			{
				id: "config-change",
				text: "変更",
				click: function () {
					var asItv = Math.ceil(parseFloat($("#cfg-autosave-interval").val()) * 1000) / 1000;
					var tabSize = parseInt($("#cfg-tabsize").val());
					var wrap;
					if ($("#cfg-wrap-off").prop("checked")) {
						wrap = "off";
					} else if ($("#cfg-wrap-num").prop("checked")) {
						var wrapLen = parseInt($("#cfg-wrap-len").val());
						wrap = wrapLen > 0 ? wrapLen : "free";
					} else {
						wrap = "free";
					}
					config = {
						openSave: $("#cfg-opensave").prop("checked"),
						autoSave: $("#cfg-autosave").prop("checked"),
						autoSaveInterval: asItv > 0 ? asItv : defaultConfig.autoSaveInterval,
						fontFamily: $("#cfg-font-family").val(),
						fontSize: $("#cfg-font-size").val(),
						wrap: wrap,
						tabSize: tabSize > 0 ? tabSize : defaultConfig.tabSize,
						softTab: $("#cfg-softtab").prop("checked"),
						showInvisibles: $("#cfg-show-invisibles").prop("checked")
					};
					applyConfig();
					localStorage.setItem("config", JSON.stringify(config));
					$(this).dialog("close");
					status("設定を変更しました。");
				}
			}, {
				text: "初期値に戻す",
				click: function () {
					setConfigForm(defaultConfig);
					$("#cfg-wrap").val(defaultConfig.wrap);
				}
			}, {
				text: "キャンセル",
				click: function () {
					$(this).dialog("close");
				}
			}
		]
	});
	$("#dialog-config input").on("keydown", function (e) {
		if (e.keyCode === $.ui.keyCode.ENTER) {
			setTimeout(function () {
				$("#config-change").click();
			}, 0);
		}
	});

	$("#dialog-about").dialog({
		autoOpen: false,
		resizable: false,
		width: "260px",
		buttons: [
			{
				text: "OK",
				click: function () {
					$(this).dialog("close");
				}
			}
		]
	});

	defaultConfig = {
		openSave: false,
		autoSave: true,
		autoSaveInterval: 60,
		fontFamily: $("#editor").css("font-family"),
		fontSize: "12pt",
		wrap: session.getOption("wrap"),
		tabSize: session.getTabSize(),
		softTab: session.getUseSoftTabs(),
		showInvisibles: editor.getShowInvisibles()
	};

	if (localStorage.config) {
		config = JSON.parse(localStorage.config)
	} else {
		config = defaultConfig;
	}
	applyConfig();

	if (localStorage.mml) {
		editor.setValue(localStorage.mml);
		editor.selection.moveCursorFileStart();
	}
	editor.focus();
});

}();
