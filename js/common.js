"use strict";

(() => {
  const CONTAINER_CLASSNAME = "container";

  const TOC_CLASSNAME = "toc";
  const TOC_HEADER_MIN_LEVEL = 2;
  const TOC_HEADER_MAX_LEVEL = 3;

  const EXPANDER_CLASSNAME = "expander";
  const EXPANDER_CAPTION_CLASSNAME = "expander-caption";
  const EXPANDER_CONTENTS_CLASSNAME = "expander-contents";
  const EXPANDER_CAPTION_ICON_CLASSNAME = "expander-caption-icon";
  const EXPANDER_CAPTION_ICON_PLUS = "+";
  const EXPANDER_CAPTION_ICON_MINUS = "-";

  const REF_CLASSNAME = "ref";
  const REF_ID_PREFIX = "ref";
  const NOTES_CLASSNAME = "notes";
  const NOTE_ID_PREFIX = "note";
  const NOTE_NUM_PREFIX = "*";
  const NOTE_HIGHLIGHTED_CLASSNAME = "highlighted";

  const FOOTER = "<p class=\"footer\">&copy;Ag 2015";

  // 雑な自動目次生成
  const generateTOC = () => {
    const divTOCList = document.querySelectorAll("div." + TOC_CLASSNAME);
    if (divTOCList.length <= 0) return;

    const headerTree = createHeaderTree(TOC_HEADER_MIN_LEVEL, TOC_HEADER_MAX_LEVEL);
    divTOCList.forEach(divTOC => appendTOCToDOMNode(headerTree, divTOC));
  };

  // ヘッダーツリー生成
  const createHeaderTree = (min, max) => {
    if (!(min <= max) || min % 1 || max % 1) {
      throw new Error("Invalid arguments (min=" + min + ", max=" + max + ")")
    }

    const headerTree = { children: [] };
    let lastLevel = 0;
    let lastNode = headerTree;
    const selector = [...Array(max - min + 1).keys()]
        .map(x => "h" + (x + min).toString() + ":not(." + TOC_CLASSNAME + ")").join(",");
    document.querySelectorAll(selector).forEach(hx => {
      const level = parseInt(hx.tagName.charAt(1));
      let parent;
      if (level > lastLevel) {
        parent = lastNode;
      } else if (level <= lastLevel) {
        parent = lastNode.parent;
        [...Array(lastLevel - level)].forEach(() => parent = parent.parent);
      }
      parent.children.push(lastNode = { hx, parent, children: [] });

      lastLevel = level;
    });

    return headerTree;
  };

  // ヘッダーツリーから目次生成 & DOM要素に追加 ※再帰
  const appendTOCToDOMNode = (hNode, domNode) => {
    if (hNode.hx) {
      const text = hNode.hx.textContent;
      hNode.hx.id = text;
      domNode.insertAdjacentHTML("beforeEnd", `<li><a href="#${text}">${text}</a>`);
    }
    if (hNode.children.length > 0) {
      const ul = document.createElement("ul");
      hNode.children.forEach(child => appendTOCToDOMNode(child, ul));
      domNode.appendChild(ul);
    }
  };

  // 共通フッター追加
  const addFooter = () => {
    document.getElementsByClassName(CONTAINER_CLASSNAME)[0].insertAdjacentHTML("beforeEnd", FOOTER);
  };

  // 雑なExpander
  const setExpanders = () => {
    document.querySelectorAll("." + EXPANDER_CLASSNAME).forEach(expander => {
      const caption = expander.getElementsByClassName(EXPANDER_CAPTION_CLASSNAME)[0];
      const contents = expander.getElementsByClassName(EXPANDER_CONTENTS_CLASSNAME)[0];
      if (!caption || !contents) return;

      caption.insertAdjacentHTML("afterBegin",
          `<span class="${EXPANDER_CAPTION_ICON_CLASSNAME}">${EXPANDER_CAPTION_ICON_PLUS}</span>`);
      const captionIcon = caption.getElementsByClassName(EXPANDER_CAPTION_ICON_CLASSNAME)[0];
      caption.addEventListener("click", e => {
        if (contents.style.getPropertyValue("display") !== "none") {
          contents.style.setProperty("display", "none");
          captionIcon.textContent = EXPANDER_CAPTION_ICON_PLUS;
        } else {
          contents.style.setProperty("display", "");
          captionIcon.textContent = EXPANDER_CAPTION_ICON_MINUS;
        }
      }, false);
      contents.style.setProperty("display", "none");
    });
  };

  // 雑な脚注アンカー設定
  const setNoteAnchor = () => {
    document.querySelectorAll("." + REF_CLASSNAME).forEach(ref => {
      const num = ref.id.match(/\d+$/)[0];
      ref.textContent = NOTE_NUM_PREFIX + num;
      ref.href = "#" + NOTE_ID_PREFIX + num;
      ref.addEventListener("click", e => {
        window[NOTE_ID_PREFIX + num].classList.add(NOTE_HIGHLIGHTED_CLASSNAME);
        requestAnimationFrame(() =>
            window[NOTE_ID_PREFIX + num].classList.remove(NOTE_HIGHLIGHTED_CLASSNAME));
      }, false);
    });
    Array.from(document.querySelectorAll("." + NOTES_CLASSNAME + " p"))
        .filter(note => note.id.match("^" + NOTE_ID_PREFIX))
        .forEach(note => {
      const num = note.id.match(/\d+$/)[0];
      note.insertAdjacentHTML("afterBegin", `<a href="#${REF_ID_PREFIX + num}">${NOTE_NUM_PREFIX + num}</a> `)
    });
  };

  document.addEventListener("DOMContentLoaded", e => {
    generateTOC();
    addFooter();
    setExpanders();
    setNoteAnchor();
  }, false);
})();
