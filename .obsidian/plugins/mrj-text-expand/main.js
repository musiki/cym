'use strict';

var obsidian = require('obsidian');
var fs = require('fs');
var path = require('path');

function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n["default"] = e;
    return Object.freeze(n);
}

var path__namespace = /*#__PURE__*/_interopNamespace(path);

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

function getAllExpandersQuery(content) {
    let accum = [];
    for (var i = 0; i < content.length; i++) {
        const line = content[i];
        if (line === '```expander') {
            for (var e = 0; e < content.length - i; e++) {
                const nextline = content[i + e];
                if (nextline === '```') {
                    accum.push({
                        start: i,
                        end: i + e,
                        query: content[i + 1],
                        template: e > 2 ? content.slice(i + 2, i + e).join('\n') : ''
                    });
                    break;
                }
            }
        }
    }
    return accum;
}
function getClosestQuery(queries, lineNumber) {
    if (queries.length === 0) {
        return undefined;
    }
    return queries.reduce((a, b) => {
        return Math.abs(b.start - lineNumber) < Math.abs(a.start - lineNumber) ? b : a;
    });
}
function getLastLineToReplace(content, query, endline) {
    const lineFrom = query.end;
    for (var i = lineFrom + 1; i < content.length; i++) {
        if (content[i] === endline) {
            return i;
        }
    }
    return lineFrom + 1;
}
const pick = (obj, arr) => arr.reduce((acc, curr) => {
    return (curr in obj)
        ? Object.assign({}, acc, { [curr]: obj[curr] })
        : acc;
}, {});

// Functions for string processing
function splitByLines(content) {
    return content.split('\n');
}
function removeEmptyLines(s) {
    const lines = s.split('\n').map(e => e.trim());
    if (lines.length < 2) {
        return s;
    }
    else if (lines.indexOf('') === 0) {
        return removeEmptyLines(lines.slice(1).join('\n'));
    }
    return s;
}
function removeFrontMatter(s, lookEnding = false) {
    const lines = s.split('\n');
    if (lookEnding && lines.indexOf('---') === 0) {
        return lines.slice(1).join('\n');
    }
    else if (lookEnding) {
        return removeFrontMatter(lines.slice(1).join('\n'), true);
    }
    else if (lines.indexOf('---') === 0) {
        return removeFrontMatter(lines.slice(1).join('\n'), true);
    }
    return s;
}
function trimContent(content) {
    return removeFrontMatter(removeEmptyLines(content));
}

function getFrontMatter(file, plugin, s) {
    const { frontmatter = null } = plugin.app.metadataCache.getCache(file.path);
    if (frontmatter) {
        return frontmatter[s.split(':')[1]] || '';
    }
    return '';
}
function getFileInfo(plugin, file) {
    return __awaiter(this, void 0, void 0, function* () {
        const info = Object.assign({}, file, {
            content: file.extension === 'md' ? yield plugin.app.vault.cachedRead(file) : '',
            link: plugin.app.fileManager.generateMarkdownLink(file, file.name).replace(/^!/, '')
        }, plugin.app.metadataCache.getFileCache(file));
        return pick(info, [
            'basename',
            'content',
            'extension',
            'headings',
            'link', 'name',
            'path', 'sections', 'stat',
            'frontmatter',
            'links',
            'listItems'
        ]);
    });
}

function highlight(lineStart, lineEnd, matchStart, matchEnd, lineContent) {
    return [
        ...lineContent.slice(0, matchStart - lineStart),
        '==',
        ...lineContent.slice(matchStart - lineStart, (matchStart - lineStart) + (matchEnd - matchStart)),
        '==',
        ...lineContent.slice((matchStart - lineStart) + (matchEnd - matchStart)),
    ].join('');
}
const sequences = [
    {
        name: '\\$count',
        loop: true,
        format: (_p, _s, _content, _file, _d, index) => index ? String(index + 1) : String(1),
        desc: 'add index number to each produced file'
    },
    {
        name: '\\$filename',
        loop: true,
        format: (_p, _s, _content, file) => file.basename,
        desc: 'name of the founded file'
    },
    {
        name: '\\$link',
        loop: true,
        format: (p, _s, _content, file) => p.app.fileManager.generateMarkdownLink(file, file.path).replace('![[', '[['),
        desc: 'link based on Obsidian settings'
    },
    {
        name: '\\$lines:\\d+',
        loop: true,
        readContent: true,
        format: (p, s, content, _file) => {
            const digits = Number(s.split(':')[1]);
            return trimContent(content)
                .split('\n')
                .filter((_, i) => i < digits)
                .join('\n')
                .replace(new RegExp(p.config.lineEnding, 'g'), '');
        },
        desc: 'specified count of lines from the found file'
    },
    {
        name: '\\$characters:\\d+',
        loop: true,
        readContent: true,
        format: (p, s, content, _file) => {
            const digits = Number(s.split(':')[1]);
            return trimContent(content)
                .split('')
                .filter((_, i) => i < digits)
                .join('')
                .replace(new RegExp(p.config.lineEnding, 'g'), '');
        },
        desc: 'specified count of lines from the found file'
    },
    {
        name: '\\$frontmatter:[\\p\{L\}_-]+',
        loop: true,
        format: (p, s, _content, file) => getFrontMatter(file, p, s),
        desc: 'value from the frontmatter key in the found file'
    },
    {
        name: '\\$lines+',
        loop: true,
        readContent: true,
        format: (p, s, content, _file) => content.replace(new RegExp(p.config.lineEnding, 'g'), ''),
        desc: 'all content from the found file'
    },
    {
        name: '\\$ext',
        loop: true,
        format: (_p, s, content, file) => file.extension,
        desc: 'return file extension'
    },
    {
        name: '\\$created:format:date',
        loop: true,
        format: (_p, s, content, file) => String(new Date(file.stat.ctime).toISOString()).split('T')[0],
        desc: 'created time formatted'
    },
    {
        name: '\\$created:format:time',
        loop: true,
        format: (_p, s, content, file) => String(new Date(file.stat.ctime).toISOString()).split(/([.T])/)[2],
        desc: 'created time formatted'
    },
    {
        name: '\\$created:format',
        loop: true,
        format: (_p, s, content, file) => String(new Date(file.stat.ctime).toISOString()),
        desc: 'created time formatted'
    },
    {
        name: '\\$created',
        loop: true,
        format: (_p, s, content, file) => String(file.stat.ctime),
        desc: 'created time'
    },
    {
        name: '\\$size',
        loop: true,
        format: (_p, s, content, file) => String(file.stat.size),
        desc: 'size of the file'
    },
    {
        name: '\\$path',
        loop: true,
        format: (_p, s, content, file) => file.path,
        desc: 'path to the found file'
    },
    {
        name: '\\$parent',
        loop: true,
        format: (_p, s, content, file) => file.parent.name,
        desc: 'parent folder name'
    },
    {
        name: '^(.+|)\\$header:.+',
        loop: true,
        format: (p, s, content, file) => {
            var _a;
            const prefix = s.slice(0, s.indexOf('$'));
            const header = s.slice(s.indexOf('$')).replace('$header:', '').replace(/"/g, '');
            const neededLevel = header.split("#").length - 1;
            const neededTitle = header.replace(/^#+/g, '').trim();
            const metadata = p.app.metadataCache.getFileCache(file);
            return ((_a = metadata.headings) === null || _a === void 0 ? void 0 : _a.filter(e => {
                const tests = [
                    [neededTitle, e.heading.includes(neededTitle)],
                    [neededLevel, e.level === neededLevel]
                ].filter(e => e[0]);
                if (tests.length) {
                    return tests.map(e => e[1]).every(e => e === true);
                }
                return true;
            }).map(h => p.app.fileManager.generateMarkdownLink(file, file.basename, '#' + h.heading)).map(link => prefix + link).join('\n')) || '';
        },
        desc: 'headings from founded files. $header:## - return all level 2 headings. $header:Title - return all heading which match the string. Can be prepended like: - !$header:## to transclude the headings.'
    },
    {
        name: '^(.+|)\\$blocks',
        readContent: true,
        loop: true,
        format: (p, s, content, file) => {
            const prefix = s.slice(0, s.indexOf('$'));
            return content
                .split('\n')
                .filter(e => /\^\w+$/.test(e))
                .map(e => prefix + p.app.fileManager.generateMarkdownLink(file, file.basename, '#' + e.replace(/^.+?(\^\w+$)/, '$1')))
                .join('\n');
        },
        desc: 'block ids from the found files. Can be prepended.'
    },
    {
        name: '^(.+|)\\$match:header', loop: true, format: (p, s, content, file, results) => {
            var _a;
            const prefix = s.slice(0, s.indexOf('$'));
            const metadata = p.app.metadataCache.getFileCache(file);
            const headings = (_a = metadata.headings) === null || _a === void 0 ? void 0 : _a.filter(h => results.result.content.filter(c => h.position.end.offset < c[0]).some(e => e)).slice(-1);
            return headings
                .map(h => p.app.fileManager.generateMarkdownLink(file, file.basename, '#' + h.heading))
                .map(link => prefix + link)
                .join('\n') || '';
        }, desc: 'extract found selections'
    },
    {
        name: '^(.+|)\\$matchline(:(\\+|-|)\\d+:\\d+|:(\\+|-|)\\d+|)',
        loop: true,
        format: (_p, s, content, file, results) => {
            const prefix = s.slice(0, s.indexOf('$matchline'));
            const [keyword, context, limit] = s.slice(s.indexOf('$matchline')).split(':');
            const value = context || '';
            const limitValue = Number(limit);
            const isPlus = value.contains('+');
            const isMinus = value.contains('-');
            const isContext = !isPlus && !isMinus;
            const offset = Number(value.replace(/[+-]/, ''));
            const lines = results.content.split('\n');
            // Grab info about line content, index, text length and start/end character position
            const lineInfos = [];
            for (let i = 0; i < lines.length; i++) {
                const text = lines[i];
                if (i === 0) {
                    lineInfos.push({
                        num: 0,
                        start: 0,
                        end: text.length,
                        text
                    });
                    continue;
                }
                const start = lineInfos[i - 1].end + 1;
                lineInfos.push({
                    num: i,
                    start,
                    text,
                    end: text.length + start
                });
            }
            return results.result.content.map(([from, to]) => {
                const matchedLines = lineInfos
                    .filter(({ start, end }) => start <= from && end >= to)
                    .map((line) => {
                    return Object.assign(Object.assign({}, line), { text: highlight(line.start, line.end, from, to, line.text) });
                });
                const resultLines = [];
                for (const matchedLine of matchedLines) {
                    const prevLines = isMinus || isContext
                        ? lineInfos.filter(l => matchedLine.num - l.num > 0 && matchedLine.num - l.num < offset)
                        : [];
                    const nextLines = isPlus || isContext
                        ? lineInfos.filter(l => l.num - matchedLine.num > 0 && l.num - matchedLine.num < offset)
                        : [];
                    resultLines.push(...prevLines, matchedLine, ...nextLines);
                }
                return prefix + resultLines.map(e => e.text).join('\n');
            }).map(line => limitValue ? line.slice(0, limitValue) : line).join('\n');
        }, desc: 'extract line with matches'
    },
    {
        name: '^(.+|)\\$searchresult',
        loop: true,
        desc: '',
        format: (_p, s, content, file, results) => {
            const prefix = s.slice(0, s.indexOf('$searchresult'));
            return results.vChildren.children.map(matchedFile => {
                return prefix + matchedFile.el.innerText;
            }).join('\n');
        }
    },
    {
        name: '^(.+|)\\$match', loop: true, format: (_p, s, content, file, results) => {
            if (!results.result.content) {
                console.warn('There is no content in results');
                return '';
            }
            function appendPrefix(prefix, line) {
                return prefix + line;
            }
            const prefixContent = s.slice(0, s.indexOf('$'));
            return results.result.content
                .map(([from, to]) => results.content.slice(from, to))
                .map(line => appendPrefix(prefixContent, line))
                .join('\n');
        }, desc: 'extract found selections'
    },
];

function extractFilesFromSearchResults(searchResults, currentFileName, excludeCurrent = true) {
    const files = Array.from(searchResults.keys());
    return excludeCurrent
        ? files.filter(file => file.basename !== currentFileName)
        : files;
}

function setPrototypeOf(obj, proto) {
  // eslint-disable-line @typescript-eslint/no-explicit-any
  if (Object.setPrototypeOf) {
    Object.setPrototypeOf(obj, proto);
  } else {
    obj.__proto__ = proto;
  }
}
// This is pretty much the only way to get nice, extended Errors
// without using ES6
/**
 * This returns a new Error with a custom prototype. Note that it's _not_ a constructor
 *
 * @param message Error message
 *
 * **Example**
 *
 * ```js
 * throw EtaErr("template not found")
 * ```
 */
function EtaErr(message) {
  const err = new Error(message);
  setPrototypeOf(err, EtaErr.prototype);
  return err;
}
EtaErr.prototype = Object.create(Error.prototype, {
  name: {
    value: "Eta Error",
    enumerable: false
  }
});
/**
 * Throws an EtaErr with a nicely formatted error and message showing where in the template the error occurred.
 */
function ParseErr(message, str, indx) {
  const whitespace = str.slice(0, indx).split(/\n/);
  const lineNo = whitespace.length;
  const colNo = whitespace[lineNo - 1].length + 1;
  message += " at line " + lineNo + " col " + colNo + ":\n\n" + "  " + str.split(/\n/)[lineNo - 1] + "\n" + "  " + Array(colNo).join(" ") + "^";
  throw EtaErr(message);
}

/**
 * @returns The global Promise function
 */
const promiseImpl = new Function("return this")().Promise;
/**
 * @returns A new AsyncFunction constuctor
 */
function getAsyncFunctionConstructor() {
  try {
    return new Function("return (async function(){}).constructor")();
  } catch (e) {
    if (e instanceof SyntaxError) {
      throw EtaErr("This environment doesn't support async/await");
    } else {
      throw e;
    }
  }
}
/**
 * str.trimLeft polyfill
 *
 * @param str - Input string
 * @returns The string with left whitespace removed
 *
 */
function trimLeft(str) {
  // eslint-disable-next-line no-extra-boolean-cast
  if (!!String.prototype.trimLeft) {
    return str.trimLeft();
  } else {
    return str.replace(/^\s+/, "");
  }
}
/**
 * str.trimRight polyfill
 *
 * @param str - Input string
 * @returns The string with right whitespace removed
 *
 */
function trimRight(str) {
  // eslint-disable-next-line no-extra-boolean-cast
  if (!!String.prototype.trimRight) {
    return str.trimRight();
  } else {
    return str.replace(/\s+$/, ""); // TODO: do we really need to replace BOM's?
  }
}

// TODO: allow '-' to trim up until newline. Use [^\S\n\r] instead of \s
/* END TYPES */
function hasOwnProp(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
function copyProps(toObj, fromObj) {
  for (const key in fromObj) {
    if (hasOwnProp(fromObj, key)) {
      toObj[key] = fromObj[key];
    }
  }
  return toObj;
}
/**
 * Takes a string within a template and trims it, based on the preceding tag's whitespace control and `config.autoTrim`
 */
function trimWS(str, config, wsLeft, wsRight) {
  let leftTrim;
  let rightTrim;
  if (Array.isArray(config.autoTrim)) {
    // kinda confusing
    // but _}} will trim the left side of the following string
    leftTrim = config.autoTrim[1];
    rightTrim = config.autoTrim[0];
  } else {
    leftTrim = rightTrim = config.autoTrim;
  }
  if (wsLeft || wsLeft === false) {
    leftTrim = wsLeft;
  }
  if (wsRight || wsRight === false) {
    rightTrim = wsRight;
  }
  if (!rightTrim && !leftTrim) {
    return str;
  }
  if (leftTrim === "slurp" && rightTrim === "slurp") {
    return str.trim();
  }
  if (leftTrim === "_" || leftTrim === "slurp") {
    // console.log('trimming left' + leftTrim)
    // full slurp
    str = trimLeft(str);
  } else if (leftTrim === "-" || leftTrim === "nl") {
    // nl trim
    str = str.replace(/^(?:\r\n|\n|\r)/, "");
  }
  if (rightTrim === "_" || rightTrim === "slurp") {
    // full slurp
    str = trimRight(str);
  } else if (rightTrim === "-" || rightTrim === "nl") {
    // nl trim
    str = str.replace(/(?:\r\n|\n|\r)$/, ""); // TODO: make sure this gets \r\n
  }

  return str;
}
/**
 * A map of special HTML characters to their XML-escaped equivalents
 */
const escMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};
function replaceChar(s) {
  return escMap[s];
}
/**
 * XML-escapes an input value after converting it to a string
 *
 * @param str - Input value (usually a string)
 * @returns XML-escaped string
 */
function XMLEscape(str) {
  // eslint-disable-line @typescript-eslint/no-explicit-any
  // To deal with XSS. Based on Escape implementations of Mustache.JS and Marko, then customized.
  const newStr = String(str);
  if (/[&<>"']/.test(newStr)) {
    return newStr.replace(/[&<>"']/g, replaceChar);
  } else {
    return newStr;
  }
}

/* END TYPES */
const templateLitReg = /`(?:\\[\s\S]|\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})*}|(?!\${)[^\\`])*`/g;
const singleQuoteReg = /'(?:\\[\s\w"'\\`]|[^\n\r'\\])*?'/g;
const doubleQuoteReg = /"(?:\\[\s\w"'\\`]|[^\n\r"\\])*?"/g;
/** Escape special regular expression characters inside a string */
function escapeRegExp(string) {
  // From MDN
  return string.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

function parse(str, config) {
  let buffer = [];
  let trimLeftOfNextStr = false;
  let lastIndex = 0;
  const parseOptions = config.parse;
  if (config.plugins) {
    for (let i = 0; i < config.plugins.length; i++) {
      const plugin = config.plugins[i];
      if (plugin.processTemplate) {
        str = plugin.processTemplate(str, config);
      }
    }
  }
  /* Adding for EJS compatibility */
  if (config.rmWhitespace) {
    // Code taken directly from EJS
    // Have to use two separate replaces here as `^` and `$` operators don't
    // work well with `\r` and empty lines don't work well with the `m` flag.
    // Essentially, this replaces the whitespace at the beginning and end of
    // each line and removes multiple newlines.
    str = str.replace(/[\r\n]+/g, "\n").replace(/^\s+|\s+$/gm, "");
  }
  /* End rmWhitespace option */
  templateLitReg.lastIndex = 0;
  singleQuoteReg.lastIndex = 0;
  doubleQuoteReg.lastIndex = 0;
  function pushString(strng, shouldTrimRightOfString) {
    if (strng) {
      // if string is truthy it must be of type 'string'
      strng = trimWS(strng, config, trimLeftOfNextStr,
      // this will only be false on the first str, the next ones will be null or undefined
      shouldTrimRightOfString);
      if (strng) {
        // replace \ with \\, ' with \'
        // we're going to convert all CRLF to LF so it doesn't take more than one replace
        strng = strng.replace(/\\|'/g, "\\$&").replace(/\r\n|\n|\r/g, "\\n");
        buffer.push(strng);
      }
    }
  }
  const prefixes = [parseOptions.exec, parseOptions.interpolate, parseOptions.raw].reduce(function (accumulator, prefix) {
    if (accumulator && prefix) {
      return accumulator + "|" + escapeRegExp(prefix);
    } else if (prefix) {
      // accumulator is falsy
      return escapeRegExp(prefix);
    } else {
      // prefix and accumulator are both falsy
      return accumulator;
    }
  }, "");
  const parseOpenReg = new RegExp("([^]*?)" + escapeRegExp(config.tags[0]) + "(-|_)?\\s*(" + prefixes + ")?\\s*", "g");
  const parseCloseReg = new RegExp("'|\"|`|\\/\\*|(\\s*(-|_)?" + escapeRegExp(config.tags[1]) + ")", "g");
  // TODO: benchmark having the \s* on either side vs using str.trim()
  let m;
  while (m = parseOpenReg.exec(str)) {
    lastIndex = m[0].length + m.index;
    const precedingString = m[1];
    const wsLeft = m[2];
    const prefix = m[3] || ""; // by default either ~, =, or empty
    pushString(precedingString, wsLeft);
    parseCloseReg.lastIndex = lastIndex;
    let closeTag;
    let currentObj = false;
    while (closeTag = parseCloseReg.exec(str)) {
      if (closeTag[1]) {
        const content = str.slice(lastIndex, closeTag.index);
        parseOpenReg.lastIndex = lastIndex = parseCloseReg.lastIndex;
        trimLeftOfNextStr = closeTag[2];
        const currentType = prefix === parseOptions.exec ? "e" : prefix === parseOptions.raw ? "r" : prefix === parseOptions.interpolate ? "i" : "";
        currentObj = {
          t: currentType,
          val: content
        };
        break;
      } else {
        const char = closeTag[0];
        if (char === "/*") {
          const commentCloseInd = str.indexOf("*/", parseCloseReg.lastIndex);
          if (commentCloseInd === -1) {
            ParseErr("unclosed comment", str, closeTag.index);
          }
          parseCloseReg.lastIndex = commentCloseInd;
        } else if (char === "'") {
          singleQuoteReg.lastIndex = closeTag.index;
          const singleQuoteMatch = singleQuoteReg.exec(str);
          if (singleQuoteMatch) {
            parseCloseReg.lastIndex = singleQuoteReg.lastIndex;
          } else {
            ParseErr("unclosed string", str, closeTag.index);
          }
        } else if (char === '"') {
          doubleQuoteReg.lastIndex = closeTag.index;
          const doubleQuoteMatch = doubleQuoteReg.exec(str);
          if (doubleQuoteMatch) {
            parseCloseReg.lastIndex = doubleQuoteReg.lastIndex;
          } else {
            ParseErr("unclosed string", str, closeTag.index);
          }
        } else if (char === "`") {
          templateLitReg.lastIndex = closeTag.index;
          const templateLitMatch = templateLitReg.exec(str);
          if (templateLitMatch) {
            parseCloseReg.lastIndex = templateLitReg.lastIndex;
          } else {
            ParseErr("unclosed string", str, closeTag.index);
          }
        }
      }
    }
    if (currentObj) {
      buffer.push(currentObj);
    } else {
      ParseErr("unclosed tag", str, m.index + precedingString.length);
    }
  }
  pushString(str.slice(lastIndex, str.length), false);
  if (config.plugins) {
    for (let i = 0; i < config.plugins.length; i++) {
      const plugin = config.plugins[i];
      if (plugin.processAST) {
        buffer = plugin.processAST(buffer, config);
      }
    }
  }
  return buffer;
}

/* END TYPES */
/**
 * Compiles a template string to a function string. Most often users just use `compile()`, which calls `compileToString` and creates a new function using the result
 *
 * **Example**
 *
 * ```js
 * compileToString("Hi <%= it.user %>", eta.config)
 * // "var tR='',include=E.include.bind(E),includeFile=E.includeFile.bind(E);tR+='Hi ';tR+=E.e(it.user);if(cb){cb(null,tR)} return tR"
 * ```
 */
function compileToString(str, config) {
  const buffer = parse(str, config);
  let res = "var tR='',__l,__lP" + (config.include ? ",include=E.include.bind(E)" : "") + (config.includeFile ? ",includeFile=E.includeFile.bind(E)" : "") + "\nfunction layout(p,d){__l=p;__lP=d}\n" + (config.useWith ? "with(" + config.varName + "||{}){" : "") + compileScope(buffer, config) + (config.includeFile ? "if(__l)tR=" + (config.async ? "await " : "") + `includeFile(__l,Object.assign(${config.varName},{body:tR},__lP))\n` : config.include ? "if(__l)tR=" + (config.async ? "await " : "") + `include(__l,Object.assign(${config.varName},{body:tR},__lP))\n` : "") + "if(cb){cb(null,tR)} return tR" + (config.useWith ? "}" : "");
  if (config.plugins) {
    for (let i = 0; i < config.plugins.length; i++) {
      const plugin = config.plugins[i];
      if (plugin.processFnString) {
        res = plugin.processFnString(res, config);
      }
    }
  }
  return res;
}
/**
 * Loops through the AST generated by `parse` and transform each item into JS calls
 *
 * **Example**
 *
 * ```js
 * // AST version of 'Hi <%= it.user %>'
 * let templateAST = ['Hi ', { val: 'it.user', t: 'i' }]
 * compileScope(templateAST, eta.config)
 * // "tR+='Hi ';tR+=E.e(it.user);"
 * ```
 */
function compileScope(buff, config) {
  let i = 0;
  const buffLength = buff.length;
  let returnStr = "";
  for (i; i < buffLength; i++) {
    const currentBlock = buff[i];
    if (typeof currentBlock === "string") {
      const str = currentBlock;
      // we know string exists
      returnStr += "tR+='" + str + "'\n";
    } else {
      const type = currentBlock.t; // ~, s, !, ?, r
      let content = currentBlock.val || "";
      if (type === "r") {
        // raw
        if (config.filter) {
          content = "E.filter(" + content + ")";
        }
        returnStr += "tR+=" + content + "\n";
      } else if (type === "i") {
        // interpolate
        if (config.filter) {
          content = "E.filter(" + content + ")";
        }
        if (config.autoEscape) {
          content = "E.e(" + content + ")";
        }
        returnStr += "tR+=" + content + "\n";
        // reference
      } else if (type === "e") {
        // execute
        returnStr += content + "\n"; // you need a \n in case you have <% } %>
      }
    }
  }

  return returnStr;
}

/**
 * Handles storage and accessing of values
 *
 * In this case, we use it to store compiled template functions
 * Indexed by their `name` or `filename`
 */
class Cacher {
  constructor(cache) {
    this.cache = void 0;
    this.cache = cache;
  }
  define(key, val) {
    this.cache[key] = val;
  }
  get(key) {
    // string | array.
    // TODO: allow array of keys to look down
    // TODO: create plugin to allow referencing helpers, filters with dot notation
    return this.cache[key];
  }
  remove(key) {
    delete this.cache[key];
  }
  reset() {
    this.cache = {};
  }
  load(cacheObj) {
    copyProps(this.cache, cacheObj);
  }
}

/* END TYPES */
/**
 * Eta's template storage
 *
 * Stores partials and cached templates
 */
const templates = new Cacher({});

/* END TYPES */
/**
 * Include a template based on its name (or filepath, if it's already been cached).
 *
 * Called like `include(templateNameOrPath, data)`
 */
function includeHelper(templateNameOrPath, data) {
  const template = this.templates.get(templateNameOrPath);
  if (!template) {
    throw EtaErr('Could not fetch template "' + templateNameOrPath + '"');
  }
  return template(data, this);
}
/** Eta's base (global) configuration */
const config = {
  async: false,
  autoEscape: true,
  autoTrim: [false, "nl"],
  cache: false,
  e: XMLEscape,
  include: includeHelper,
  parse: {
    exec: "",
    interpolate: "=",
    raw: "~"
  },
  plugins: [],
  rmWhitespace: false,
  tags: ["<%", "%>"],
  templates: templates,
  useWith: false,
  varName: "it"
};
/**
 * Takes one or two partial (not necessarily complete) configuration objects, merges them 1 layer deep into eta.config, and returns the result
 *
 * @param override Partial configuration object
 * @param baseConfig Partial configuration object to merge before `override`
 *
 * **Example**
 *
 * ```js
 * let customConfig = getConfig({tags: ['!#', '#!']})
 * ```
 */
function getConfig(override, baseConfig) {
  // TODO: run more tests on this
  const res = {}; // Linked
  copyProps(res, config); // Creates deep clone of eta.config, 1 layer deep
  if (baseConfig) {
    copyProps(res, baseConfig);
  }
  if (override) {
    copyProps(res, override);
  }
  return res;
}

/* END TYPES */
/**
 * Takes a template string and returns a template function that can be called with (data, config, [cb])
 *
 * @param str - The template string
 * @param config - A custom configuration object (optional)
 *
 * **Example**
 *
 * ```js
 * let compiledFn = eta.compile("Hi <%= it.user %>")
 * // function anonymous()
 * let compiledFnStr = compiledFn.toString()
 * // "function anonymous(it,E,cb\n) {\nvar tR='',include=E.include.bind(E),includeFile=E.includeFile.bind(E);tR+='Hi ';tR+=E.e(it.user);if(cb){cb(null,tR)} return tR\n}"
 * ```
 */
function compile(str, config) {
  const options = getConfig(config || {});
  /* ASYNC HANDLING */
  // The below code is modified from mde/ejs. All credit should go to them.
  const ctor = options.async ? getAsyncFunctionConstructor() : Function;
  /* END ASYNC HANDLING */
  try {
    return new ctor(options.varName, "E",
    // EtaConfig
    "cb",
    // optional callback
    compileToString(str, options)); // eslint-disable-line no-new-func
  } catch (e) {
    if (e instanceof SyntaxError) {
      throw EtaErr("Bad template syntax\n\n" + e.message + "\n" + Array(e.message.length + 1).join("=") + "\n" + compileToString(str, options) + "\n" // This will put an extra newline before the callstack for extra readability
      );
    } else {
      throw e;
    }
  }
}

const _BOM = /^\uFEFF/;
/* END TYPES */
/**
 * Get the path to the included file from the parent file path and the
 * specified path.
 *
 * If `name` does not have an extension, it will default to `.eta`
 *
 * @param name specified path
 * @param parentfile parent file path
 * @param isDirectory whether parentfile is a directory
 * @return absolute path to template
 */
function getWholeFilePath(name, parentfile, isDirectory) {
  const includePath = path__namespace.resolve(isDirectory ? parentfile : path__namespace.dirname(parentfile),
  // returns directory the parent file is in
  name // file
  ) + (path__namespace.extname(name) ? "" : ".eta");
  return includePath;
}
/**
 * Get the absolute path to an included template
 *
 * If this is called with an absolute path (for example, starting with '/' or 'C:\')
 * then Eta will attempt to resolve the absolute path within options.views. If it cannot,
 * Eta will fallback to options.root or '/'
 *
 * If this is called with a relative path, Eta will:
 * - Look relative to the current template (if the current template has the `filename` property)
 * - Look inside each directory in options.views
 *
 * Note: if Eta is unable to find a template using path and options, it will throw an error.
 *
 * @param path    specified path
 * @param options compilation options
 * @return absolute path to template
 */
function getPath(path, options) {
  let includePath = false;
  const views = options.views;
  const searchedPaths = [];
  // If these four values are the same,
  // getPath() will return the same result every time.
  // We can cache the result to avoid expensive
  // file operations.
  const pathOptions = JSON.stringify({
    filename: options.filename,
    path: path,
    root: options.root,
    views: options.views
  });
  if (options.cache && options.filepathCache && options.filepathCache[pathOptions]) {
    // Use the cached filepath
    return options.filepathCache[pathOptions];
  }
  /** Add a filepath to the list of paths we've checked for a template */
  function addPathToSearched(pathSearched) {
    if (!searchedPaths.includes(pathSearched)) {
      searchedPaths.push(pathSearched);
    }
  }
  /**
   * Take a filepath (like 'partials/mypartial.eta'). Attempt to find the template file inside `views`;
   * return the resulting template file path, or `false` to indicate that the template was not found.
   *
   * @param views the filepath that holds templates, or an array of filepaths that hold templates
   * @param path the path to the template
   */
  function searchViews(views, path) {
    let filePath;
    // If views is an array, then loop through each directory
    // And attempt to find the template
    if (Array.isArray(views) && views.some(function (v) {
      filePath = getWholeFilePath(path, v, true);
      addPathToSearched(filePath);
      return fs.existsSync(filePath);
    })) {
      // If the above returned true, we know that the filePath was just set to a path
      // That exists (Array.some() returns as soon as it finds a valid element)
      return filePath;
    } else if (typeof views === "string") {
      // Search for the file if views is a single directory
      filePath = getWholeFilePath(path, views, true);
      addPathToSearched(filePath);
      if (fs.existsSync(filePath)) {
        return filePath;
      }
    }
    // Unable to find a file
    return false;
  }
  // Path starts with '/', 'C:\', etc.
  const match = /^[A-Za-z]+:\\|^\//.exec(path);
  // Absolute path, like /partials/partial.eta
  if (match && match.length) {
    // We have to trim the beginning '/' off the path, or else
    // path.resolve(dir, path) will always resolve to just path
    const formattedPath = path.replace(/^\/*/, "");
    // First, try to resolve the path within options.views
    includePath = searchViews(views, formattedPath);
    if (!includePath) {
      // If that fails, searchViews will return false. Try to find the path
      // inside options.root (by default '/', the base of the filesystem)
      const pathFromRoot = getWholeFilePath(formattedPath, options.root || "/", true);
      addPathToSearched(pathFromRoot);
      includePath = pathFromRoot;
    }
  } else {
    // Relative paths
    // Look relative to a passed filename first
    if (options.filename) {
      const filePath = getWholeFilePath(path, options.filename);
      addPathToSearched(filePath);
      if (fs.existsSync(filePath)) {
        includePath = filePath;
      }
    }
    // Then look for the template in options.views
    if (!includePath) {
      includePath = searchViews(views, path);
    }
    if (!includePath) {
      throw EtaErr('Could not find the template "' + path + '". Paths tried: ' + searchedPaths);
    }
  }
  // If caching and filepathCache are enabled,
  // cache the input & output of this function.
  if (options.cache && options.filepathCache) {
    options.filepathCache[pathOptions] = includePath;
  }
  return includePath;
}
/**
 * Reads a file synchronously
 */
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath).toString().replace(_BOM, ""); // TODO: is replacing BOM's necessary?
  } catch {
    throw EtaErr("Failed to read template at '" + filePath + "'");
  }
}

// express is set like: app.engine('html', require('eta').renderFile)
/* END TYPES */
/**
 * Reads a template, compiles it into a function, caches it if caching isn't disabled, returns the function
 *
 * @param filePath Absolute path to template file
 * @param options Eta configuration overrides
 * @param noCache Optionally, make Eta not cache the template
 */
function loadFile(filePath, options, noCache) {
  const config = getConfig(options);
  const template = readFile(filePath);
  try {
    const compiledTemplate = compile(template, config);
    if (!noCache) {
      config.templates.define(config.filename, compiledTemplate);
    }
    return compiledTemplate;
  } catch (e) {
    throw EtaErr("Loading file: " + filePath + " failed:\n\n" + e.message);
  }
}
/**
 * Get the template from a string or a file, either compiled on-the-fly or
 * read from cache (if enabled), and cache the template if needed.
 *
 * If `options.cache` is true, this function reads the file from
 * `options.filename` so it must be set prior to calling this function.
 *
 * @param options   compilation options
 * @return Eta template function
 */
function handleCache$1(options) {
  const filename = options.filename;
  if (options.cache) {
    const func = options.templates.get(filename);
    if (func) {
      return func;
    }
    return loadFile(filename, options);
  }
  // Caching is disabled, so pass noCache = true
  return loadFile(filename, options, true);
}
/**
 * Get the template function.
 *
 * If `options.cache` is `true`, then the template is cached.
 *
 * This returns a template function and the config object with which that template function should be called.
 *
 * @remarks
 *
 * It's important that this returns a config object with `filename` set.
 * Otherwise, the included file would not be able to use relative paths
 *
 * @param path path for the specified file (if relative, specify `views` on `options`)
 * @param options compilation options
 * @return [Eta template function, new config object]
 */
function includeFile(path, options) {
  // the below creates a new options object, using the parent filepath of the old options object and the path
  const newFileOptions = getConfig({
    filename: getPath(path, options)
  }, options);
  // TODO: make sure properties are currectly copied over
  return [handleCache$1(newFileOptions), newFileOptions];
}

/* END TYPES */
/**
 * Called with `includeFile(path, data)`
 */
function includeFileHelper(path, data) {
  const templateAndConfig = includeFile(path, this);
  return templateAndConfig[0](data, templateAndConfig[1]);
}

/* END TYPES */
function handleCache(template, options) {
  if (options.cache && options.name && options.templates.get(options.name)) {
    return options.templates.get(options.name);
  }
  const templateFunc = typeof template === "function" ? template : compile(template, options);
  // Note that we don't have to check if it already exists in the cache;
  // it would have returned earlier if it had
  if (options.cache && options.name) {
    options.templates.define(options.name, templateFunc);
  }
  return templateFunc;
}
function render(template, data, config, cb) {
  const options = getConfig(config || {});
  if (options.async) {
    if (cb) {
      // If user passes callback
      try {
        // Note: if there is an error while rendering the template,
        // It will bubble up and be caught here
        const templateFn = handleCache(template, options);
        templateFn(data, options, cb);
      } catch (err) {
        return cb(err);
      }
    } else {
      // No callback, try returning a promise
      if (typeof promiseImpl === "function") {
        return new promiseImpl(function (resolve, reject) {
          try {
            resolve(handleCache(template, options)(data, options));
          } catch (err) {
            reject(err);
          }
        });
      } else {
        throw EtaErr("Please provide a callback function, this env doesn't support Promises");
      }
    }
  } else {
    return handleCache(template, options)(data, options);
  }
}

// @denoify-ignore
config.includeFile = includeFileHelper;
config.filepathCache = {};

class TextExpander extends obsidian.Plugin {
    constructor(app, plugin) {
        super(app, plugin);
        this.config = {
            autoExpand: false,
            defaultTemplate: '- $link',
            delay: 300,
            excludeCurrent: true,
            lineEnding: '<-->',
            prefixes: {
                header: '^',
                footer: '>'
            }
        };
        this.seqs = sequences;
        this.leftPanelInfo = {
            collapsed: false,
            tab: 0,
            text: ''
        };
        this.search = this.search.bind(this);
        this.init = this.init.bind(this);
        this.autoExpand = this.autoExpand.bind(this);
    }
    autoExpand() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.config.autoExpand) {
                return;
            }
            const activeLeaf = this.app.workspace.activeLeaf;
            if (!activeLeaf) {
                return;
            }
            const activeView = activeLeaf.view;
            const isAllowedView = activeView instanceof obsidian.MarkdownView;
            if (!isAllowedView) {
                return;
            }
            yield this.init(true);
        });
    }
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            this.addSettingTab(new SettingTab(this.app, this));
            this.registerMarkdownCodeBlockProcessor('expander', (source, el, ctx) => {
                el
                    .createDiv()
                    .createEl('button', { text: 'Run expand query' })
                    .addEventListener('click', this.init.bind(this, false, ctx.getSectionInfo(el).lineStart));
            });
            this.addCommand({
                id: 'editor-expand',
                name: 'expand',
                callback: this.init,
                hotkeys: []
            });
            this.addCommand({
                id: 'editor-expand-all',
                name: 'expand all',
                callback: () => this.init(true),
                hotkeys: []
            });
            this.app.workspace.on('file-open', this.autoExpand);
            const data = yield this.loadData();
            if (data) {
                this.config = Object.assign(Object.assign({}, this.config), data);
            }
        });
    }
    onunload() {
        console.log('unloading plugin');
        this.app.workspace.off('file-open', this.autoExpand);
    }
    saveSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.saveData(this.config);
        });
    }
    init(proceedAllQueriesOnPage = false, lineToStart) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentView = this.app.workspace.activeLeaf.view;
            // Is on editable view
            if (!(currentView instanceof obsidian.MarkdownView)) {
                return;
            }
            const cmDoc = this.cm = currentView.editor;
            const curNum = lineToStart || cmDoc.getCursor().line;
            const content = cmDoc.getValue();
            if (lineToStart) {
                cmDoc.setCursor(lineToStart ? lineToStart - 1 : 0);
            }
            const formatted = splitByLines(content);
            const findQueries = getAllExpandersQuery(formatted);
            const closestQuery = getClosestQuery(findQueries, curNum);
            if (proceedAllQueriesOnPage) {
                yield findQueries.reduce((promise, query, i) => promise.then(() => {
                    const newContent = splitByLines(cmDoc.getValue());
                    const updatedQueries = getAllExpandersQuery(newContent);
                    return this.runExpanderCodeBlock(updatedQueries[i], newContent, currentView);
                }), Promise.resolve());
            }
            else {
                yield this.runExpanderCodeBlock(closestQuery, formatted, currentView);
            }
        });
    }
    runExpanderCodeBlock(query, content, view) {
        return __awaiter(this, void 0, void 0, function* () {
            const { lineEnding, prefixes } = this.config;
            if (!query) {
                new Notification('Expand query not found');
                return Promise.resolve();
            }
            this.clearOldResultsInFile(content, query, lineEnding);
            const newContent = splitByLines(this.cm.getValue());
            this.saveLeftPanelState();
            if (query.query !== '') {
                this.search(query.query);
            }
            return yield this.runTemplateProcessing(query, getLastLineToReplace(newContent, query, this.config.lineEnding), prefixes, view);
        });
    }
    runTemplateProcessing(query, lastLine, prefixes, currentView) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let currentFileName = '';
            const templateContent = query.template.split('\n');
            const { heading, footer, repeatableContent } = this.parseTemplate(prefixes, templateContent);
            if (currentView instanceof obsidian.FileView) {
                currentFileName = currentView.file.basename;
            }
            const searchResults = yield this.getFoundAfterDelay(query.query === '');
            const files = extractFilesFromSearchResults(searchResults, currentFileName, this.config.excludeCurrent);
            this.restoreLeftPanelState();
            currentView.editor.focus();
            const currentFileInfo = (currentView instanceof obsidian.FileView)
                ? yield getFileInfo(this, currentView.file)
                : {};
            const filesInfo = yield Promise.all(files.map(file => getFileInfo(this, file)));
            let changed;
            if (query.template.contains("<%")) {
                const templateToRender = repeatableContent.join('\n');
                const dataToRender = {
                    current: currentFileInfo,
                    files: filesInfo
                };
                changed = yield render(templateToRender, dataToRender, { autoEscape: false });
                // changed = doT.template(templateToRender, {strip: false})(dataToRender)
            }
            else {
                changed = yield this.generateTemplateFromSequences(files, repeatableContent, searchResults);
            }
            let result = [
                heading,
                changed,
                footer,
                this.config.lineEnding
            ].filter(e => e).join('\n');
            // Do not paste generated content if used changed activeLeaf
            const viewBeforeReplace = this.app.workspace.activeLeaf.view;
            if (!(viewBeforeReplace instanceof obsidian.MarkdownView) || viewBeforeReplace.file.basename !== currentFileName) {
                return;
            }
            currentView.editor.replaceRange(result, { line: query.end + 1, ch: 0 }, { line: lastLine, ch: ((_a = this.cm.getLine(lastLine)) === null || _a === void 0 ? void 0 : _a.length) || 0 });
            return Promise.resolve();
        });
    }
    generateTemplateFromSequences(files, repeatableContent, searchResults) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!searchResults) {
                return '';
            }
            const changed = yield Promise.all(files
                .map((file, i) => __awaiter(this, void 0, void 0, function* () {
                const result = yield Promise.all(repeatableContent.map((s) => __awaiter(this, void 0, void 0, function* () { return yield this.applyTemplateToSearchResults(searchResults, file, s, i); })));
                return result.join('\n');
            })));
            return changed.join('\n');
        });
    }
    parseTemplate(prefixes, templateContent) {
        const isHeader = (line) => line.startsWith(prefixes.header);
        const isFooter = (line) => line.startsWith(prefixes.footer);
        const isRepeat = (line) => !isHeader(line) && !isFooter(line);
        const heading = templateContent.filter(isHeader).map((s) => s.slice(1)).join('\n');
        const footer = templateContent.filter(isFooter).map((s) => s.slice(1)).join('\n');
        const repeatableContent = templateContent.filter(isRepeat).filter(e => e).length === 0
            ? [this.config.defaultTemplate]
            : templateContent.filter(isRepeat).filter(e => e);
        return { heading, footer, repeatableContent };
    }
    saveLeftPanelState() {
        this.leftPanelInfo = {
            collapsed: this.app.workspace.leftSplit.collapsed,
            // @ts-ignore
            tab: this.app.workspace.leftSplit.children[0].currentTab,
            text: this.getSearchValue(),
        };
    }
    restoreLeftPanelState() {
        const { collapsed, tab, text } = this.leftPanelInfo;
        const splitChildren = this.getLeftSplitElement();
        this.getSearchView().searchComponent.setValue(text);
        if (tab !== splitChildren.currentTab) {
            splitChildren.selectTabIndex(tab);
        }
        if (collapsed) {
            this.app.workspace.leftSplit.collapse();
        }
    }
    search(s) {
        // @ts-ignore
        const globalSearchFn = this.app.internalPlugins.getPluginById('global-search').instance.openGlobalSearch.bind(this);
        const search = (query) => globalSearchFn(query);
        search(s);
    }
    getLeftSplitElement() {
        // @ts-ignore
        return this.app.workspace.leftSplit.children[0];
    }
    getLeftSplitElementOfViewStateType(viewStateType) {
        // @ts-ignore
        for (const child of this.app.workspace.leftSplit.children) {
            const filterForSearchResult = child.children.filter(e => e.getViewState().type === viewStateType);
            if (filterForSearchResult === undefined || filterForSearchResult.length < 1) {
                continue;
            }
            return filterForSearchResult[0];
        }
        return undefined;
    }
    getSearchView() {
        const searchElement = this.getLeftSplitElementOfViewStateType('search');
        if (undefined == searchElement) {
            return undefined;
        }
        const view = searchElement.view;
        if ('searchComponent' in view) {
            return view;
        }
        return undefined;
    }
    getSearchValue() {
        const view = this.getSearchView();
        if (view) {
            return view.searchComponent.getValue();
        }
        return '';
    }
    getFoundAfterDelay(immediate) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchLeaf = this.app.workspace.getLeavesOfType('search')[0];
            const view = yield searchLeaf.open(searchLeaf.view);
            if (immediate) {
                // @ts-ignore
                return Promise.resolve(view.dom.resultDomLookup);
            }
            return new Promise(resolve => {
                setTimeout(() => {
                    // @ts-ignore
                    return resolve(view.dom.resultDomLookup);
                }, this.config.delay);
            });
        });
    }
    applyTemplateToSearchResults(searchResults, file, template, index) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileContent = (new RegExp(this.seqs.filter(e => e.readContent).map(e => e.name).join('|')).test(template))
                ? yield this.app.vault.cachedRead(file)
                : '';
            return this.seqs.reduce((acc, seq) => acc.replace(new RegExp(seq.name, 'gu'), replace => seq.format(this, replace, fileContent, file, searchResults.get(file), index)), template);
        });
    }
    clearOldResultsInFile(content, query, lineEnding) {
        var _a;
        const lastLine = getLastLineToReplace(content, query, this.config.lineEnding);
        this.cm.replaceRange('\n' + lineEnding, { line: query.end + 1, ch: 0 }, { line: lastLine, ch: ((_a = this.cm.getLine(lastLine)) === null || _a === void 0 ? void 0 : _a.length) || 0 });
    }
}
class SettingTab extends obsidian.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.app = app;
        this.plugin = plugin;
    }
    display() {
        let { containerEl } = this;
        containerEl.empty();
        containerEl.createEl('h2', { text: 'Settings for Text Expander' });
        new obsidian.Setting(containerEl)
            .setName('Auto Expand')
            .setDesc('Expand all queries in a file once you open it')
            .addToggle(toggle => {
            toggle
                .setValue(this.plugin.config.autoExpand)
                .onChange(value => {
                this.plugin.config.autoExpand = value;
                this.plugin.saveSettings();
            });
        });
        new obsidian.Setting(containerEl)
            .setName('Delay')
            .setDesc('Text expander don\' wait until search completed. It waits for a delay and paste result after that.')
            .addSlider(slider => {
            slider.setLimits(100, 10000, 100);
            slider.setValue(this.plugin.config.delay);
            slider.onChange(value => {
                this.plugin.config.delay = value;
                this.plugin.saveSettings();
            });
            slider.setDynamicTooltip();
        });
        new obsidian.Setting(containerEl)
            .setName('Line ending')
            .setDesc('You can specify the text which will appear at the bottom of the generated text.')
            .addText(text => {
            text.setValue(this.plugin.config.lineEnding)
                .onChange(val => {
                this.plugin.config.lineEnding = val;
                this.plugin.saveSettings();
            });
        });
        new obsidian.Setting(containerEl)
            .setName('Default template')
            .setDesc('You can specify default template')
            .addTextArea(text => {
            text.setValue(this.plugin.config.defaultTemplate)
                .onChange(val => {
                this.plugin.config.defaultTemplate = val;
                this.plugin.saveSettings();
            });
        });
        new obsidian.Setting(containerEl)
            .setName('Exclude current file')
            .setDesc('You can specify should text expander exclude results from current file or not')
            .addToggle(toggle => {
            toggle
                .setValue(this.plugin.config.excludeCurrent)
                .onChange(value => {
                this.plugin.config.excludeCurrent = value;
                this.plugin.saveSettings();
            });
        });
        new obsidian.Setting(containerEl)
            .setHeading()
            .setName('Prefixes');
        new obsidian.Setting(containerEl)
            .setName('Header')
            .setDesc('Line prefixed by this symbol will be recognized as header')
            .addText(text => {
            text.setValue(this.plugin.config.prefixes.header)
                .onChange(val => {
                this.plugin.config.prefixes.header = val;
                this.plugin.saveSettings();
            });
        });
        new obsidian.Setting(containerEl)
            .setName('Footer')
            .setDesc('Line prefixed by this symbol will be recognized as footer')
            .addText(text => {
            text.setValue(this.plugin.config.prefixes.footer)
                .onChange(val => {
                this.plugin.config.prefixes.footer = val;
                this.plugin.saveSettings();
            });
        });
        new obsidian.Setting(containerEl)
            .setName('Sequences')
            .setDesc('REGEXP - DESCRIPTION')
            .setDesc((() => {
            const fragment = new DocumentFragment();
            const div = fragment.createEl('div');
            this.plugin.seqs
                .map(e => e.name + ' - ' + (e.desc || ''))
                .map(e => {
                const el = fragment.createEl('div');
                el.setText(e);
                el.setAttribute('style', `
                                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                                margin-bottom: 0.5rem;
                                padding-bottom: 0.5rem;
                            `);
                return el;
            }).forEach(el => {
                div.appendChild(el);
            });
            fragment.appendChild(div);
            return fragment;
        })());
    }
}

module.exports = TextExpander;


/* nosourcemap */