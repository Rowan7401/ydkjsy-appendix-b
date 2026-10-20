(function highlightJavaScript() {
  const KEYWORDS = new Set([
    "break",
    "case",
    "catch",
    "class",
    "const",
    "continue",
    "debugger",
    "default",
    "delete",
    "do",
    "else",
    "export",
    "extends",
    "finally",
    "for",
    "function",
    "if",
    "import",
    "in",
    "instanceof",
    "let",
    "new",
    "return",
    "super",
    "switch",
    "this",
    "throw",
    "try",
    "typeof",
    "var",
    "void",
    "while",
    "with",
    "yield",
    "async",
    "await",
    "of",
    "from",
    "as",
    "static",
    "get",
    "set",
  ]);

  const LITERALS = new Set([
    "true",
    "false",
    "null",
    "undefined",
    "NaN",
    "Infinity",
  ]);

  const TOKEN =
    /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|(`(?:\\.|[^`\\])*`|'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*")|(\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b)|(\b[A-Za-z_$][\w$]*\b)|([(){}[\];,.:=+\-*/%<>!?|&^~]+)|(\s+)|(.)/g;

  function escapeHtml(value) {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function wrap(kind, value) {
    return `<span class="tok-${kind}">${escapeHtml(value)}</span>`;
  }

  function highlight(source) {
    let out = "";
    let match;

    TOKEN.lastIndex = 0;
    while ((match = TOKEN.exec(source))) {
      const [full, comment, string, number, ident, punct, space, other] = match;

      if (comment) {
        out += wrap("comment", comment);
        continue;
      }
      if (string) {
        out += wrap("string", string);
        continue;
      }
      if (number) {
        out += wrap("number", number);
        continue;
      }
      if (ident) {
        if (KEYWORDS.has(ident)) {
          out += wrap("keyword", ident);
        } else if (LITERALS.has(ident)) {
          out += wrap("literal", ident);
        } else {
          const after = source.slice(TOKEN.lastIndex);
          const next = after.match(/^\s*(\()?/);
          if (next && next[1]) {
            out += wrap("function", ident);
          } else {
            out += wrap("property", ident);
          }
        }
        continue;
      }
      if (punct) {
        out += wrap("punct", punct);
        continue;
      }
      if (space) {
        out += space;
        continue;
      }
      out += escapeHtml(other || full);
    }

    return out;
  }

  document.querySelectorAll(".code-frame code").forEach((block) => {
    block.innerHTML = highlight(block.textContent);
  });
})();
