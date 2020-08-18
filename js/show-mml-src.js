"use strict";

const ShowMMLSrc = class {
  constructor() {
    this.workerURL = null;
    this.editorHeight = ShowMMLSrc.DEFAULT_HEIGHT;
    this.playerOption = null;
  }

  setEditorHeight (height) {
    this.editorHeight = height;
    return this;
  }

  setWorkerURL (workerURL) {
    this.workerURL = workerURL;
    return this;
  }

  setPlayerOption (option) {
    this.playerOption = option;
    return this;
  }

  show(mml) {
    const divEditor = document.createElement("div");
    divEditor.style.setProperty("height", this.editorHeight);
    const scripts = document.getElementsByTagName("script");
    scripts.item(scripts.length - 1).insertAdjacentElement("afterEnd", divEditor);

    document.addEventListener("DOMContentLoaded", e => {
      const editor = ace.edit(divEditor);
      editor.setTheme("ace/theme/flmml");
      editor.setReadOnly(true);
      editor.setShowPrintMargin(false);
      editor.$blockScrolling = Infinity;
      const session = editor.getSession();
      session.setMode("ace/mode/flmml");
      session.setOption("indentedSoftWrap", false);
      session.setOption("wrap", "free");

      editor.setValue(mml);
      editor.selection.moveCursorToPosition({ row: 0, column: 0 });

      const player = new FlMMLPlayer(Object.assign({
        workerURL: this.workerURL,
        mml,
        underground: true
      }, this.playerOption));
      divEditor.insertAdjacentElement("afterEnd", player.getElement());
    }, false);
  }
};

ShowMMLSrc.ID_PREFIX = "mml";
ShowMMLSrc.DEFAULT_HEIGHT = "10em";
