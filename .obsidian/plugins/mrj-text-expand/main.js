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
            return results.children.map(matchedFile => {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsInNyYy9oZWxwZXJzL2hlbHBlcnMudHMiLCJzcmMvaGVscGVycy9zdHJpbmcudHMiLCJzcmMvaGVscGVycy90ZmlsZS50cyIsInNyYy9zZXF1ZW5jZXMvc2VxdWVuY2VzLnRzIiwic3JjL2hlbHBlcnMvc2VhcmNoLXJlc3VsdHMudHMiLCJub2RlX21vZHVsZXMvZXRhL2Rpc3QvZXRhLm1vZHVsZS5tanMiLCJzcmMvbWFpbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxyXG5cclxuUGVybWlzc2lvbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgYW5kL29yIGRpc3RyaWJ1dGUgdGhpcyBzb2Z0d2FyZSBmb3IgYW55XHJcbnB1cnBvc2Ugd2l0aCBvciB3aXRob3V0IGZlZSBpcyBoZXJlYnkgZ3JhbnRlZC5cclxuXHJcblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIgQU5EIFRIRSBBVVRIT1IgRElTQ0xBSU1TIEFMTCBXQVJSQU5USUVTIFdJVEhcclxuUkVHQVJEIFRPIFRISVMgU09GVFdBUkUgSU5DTFVESU5HIEFMTCBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZXHJcbkFORCBGSVRORVNTLiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SIEJFIExJQUJMRSBGT1IgQU5ZIFNQRUNJQUwsIERJUkVDVCxcclxuSU5ESVJFQ1QsIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyBPUiBBTlkgREFNQUdFUyBXSEFUU09FVkVSIFJFU1VMVElORyBGUk9NXHJcbkxPU1MgT0YgVVNFLCBEQVRBIE9SIFBST0ZJVFMsIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBORUdMSUdFTkNFIE9SXHJcbk9USEVSIFRPUlRJT1VTIEFDVElPTiwgQVJJU0lORyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBVU0UgT1JcclxuUEVSRk9STUFOQ0UgT0YgVEhJUyBTT0ZUV0FSRS5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuLyogZ2xvYmFsIFJlZmxlY3QsIFByb21pc2UsIFN1cHByZXNzZWRFcnJvciwgU3ltYm9sICovXHJcblxyXG52YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXh0ZW5kcyhkLCBiKSB7XHJcbiAgICBpZiAodHlwZW9mIGIgIT09IFwiZnVuY3Rpb25cIiAmJiBiICE9PSBudWxsKVxyXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDbGFzcyBleHRlbmRzIHZhbHVlIFwiICsgU3RyaW5nKGIpICsgXCIgaXMgbm90IGEgY29uc3RydWN0b3Igb3IgbnVsbFwiKTtcclxuICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2Fzc2lnbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uIF9fYXNzaWduKHQpIHtcclxuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKSB0W3BdID0gc1twXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVzdChzLCBlKSB7XHJcbiAgICB2YXIgdCA9IHt9O1xyXG4gICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApICYmIGUuaW5kZXhPZihwKSA8IDApXHJcbiAgICAgICAgdFtwXSA9IHNbcF07XHJcbiAgICBpZiAocyAhPSBudWxsICYmIHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID09PSBcImZ1bmN0aW9uXCIpXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHAgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHMpOyBpIDwgcC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoZS5pbmRleE9mKHBbaV0pIDwgMCAmJiBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwocywgcFtpXSkpXHJcbiAgICAgICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcclxuICAgICAgICB9XHJcbiAgICByZXR1cm4gdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcclxuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xyXG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcclxuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3BhcmFtKHBhcmFtSW5kZXgsIGRlY29yYXRvcikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIGtleSkgeyBkZWNvcmF0b3IodGFyZ2V0LCBrZXksIHBhcmFtSW5kZXgpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2VzRGVjb3JhdGUoY3RvciwgZGVzY3JpcHRvckluLCBkZWNvcmF0b3JzLCBjb250ZXh0SW4sIGluaXRpYWxpemVycywgZXh0cmFJbml0aWFsaXplcnMpIHtcclxuICAgIGZ1bmN0aW9uIGFjY2VwdChmKSB7IGlmIChmICE9PSB2b2lkIDAgJiYgdHlwZW9mIGYgIT09IFwiZnVuY3Rpb25cIikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkZ1bmN0aW9uIGV4cGVjdGVkXCIpOyByZXR1cm4gZjsgfVxyXG4gICAgdmFyIGtpbmQgPSBjb250ZXh0SW4ua2luZCwga2V5ID0ga2luZCA9PT0gXCJnZXR0ZXJcIiA/IFwiZ2V0XCIgOiBraW5kID09PSBcInNldHRlclwiID8gXCJzZXRcIiA6IFwidmFsdWVcIjtcclxuICAgIHZhciB0YXJnZXQgPSAhZGVzY3JpcHRvckluICYmIGN0b3IgPyBjb250ZXh0SW5bXCJzdGF0aWNcIl0gPyBjdG9yIDogY3Rvci5wcm90b3R5cGUgOiBudWxsO1xyXG4gICAgdmFyIGRlc2NyaXB0b3IgPSBkZXNjcmlwdG9ySW4gfHwgKHRhcmdldCA/IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBjb250ZXh0SW4ubmFtZSkgOiB7fSk7XHJcbiAgICB2YXIgXywgZG9uZSA9IGZhbHNlO1xyXG4gICAgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgICB2YXIgY29udGV4dCA9IHt9O1xyXG4gICAgICAgIGZvciAodmFyIHAgaW4gY29udGV4dEluKSBjb250ZXh0W3BdID0gcCA9PT0gXCJhY2Nlc3NcIiA/IHt9IDogY29udGV4dEluW3BdO1xyXG4gICAgICAgIGZvciAodmFyIHAgaW4gY29udGV4dEluLmFjY2VzcykgY29udGV4dC5hY2Nlc3NbcF0gPSBjb250ZXh0SW4uYWNjZXNzW3BdO1xyXG4gICAgICAgIGNvbnRleHQuYWRkSW5pdGlhbGl6ZXIgPSBmdW5jdGlvbiAoZikgeyBpZiAoZG9uZSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBhZGQgaW5pdGlhbGl6ZXJzIGFmdGVyIGRlY29yYXRpb24gaGFzIGNvbXBsZXRlZFwiKTsgZXh0cmFJbml0aWFsaXplcnMucHVzaChhY2NlcHQoZiB8fCBudWxsKSk7IH07XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9ICgwLCBkZWNvcmF0b3JzW2ldKShraW5kID09PSBcImFjY2Vzc29yXCIgPyB7IGdldDogZGVzY3JpcHRvci5nZXQsIHNldDogZGVzY3JpcHRvci5zZXQgfSA6IGRlc2NyaXB0b3Jba2V5XSwgY29udGV4dCk7XHJcbiAgICAgICAgaWYgKGtpbmQgPT09IFwiYWNjZXNzb3JcIikge1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0ID09PSB2b2lkIDApIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0ID09PSBudWxsIHx8IHR5cGVvZiByZXN1bHQgIT09IFwib2JqZWN0XCIpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJPYmplY3QgZXhwZWN0ZWRcIik7XHJcbiAgICAgICAgICAgIGlmIChfID0gYWNjZXB0KHJlc3VsdC5nZXQpKSBkZXNjcmlwdG9yLmdldCA9IF87XHJcbiAgICAgICAgICAgIGlmIChfID0gYWNjZXB0KHJlc3VsdC5zZXQpKSBkZXNjcmlwdG9yLnNldCA9IF87XHJcbiAgICAgICAgICAgIGlmIChfID0gYWNjZXB0KHJlc3VsdC5pbml0KSkgaW5pdGlhbGl6ZXJzLnVuc2hpZnQoXyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKF8gPSBhY2NlcHQocmVzdWx0KSkge1xyXG4gICAgICAgICAgICBpZiAoa2luZCA9PT0gXCJmaWVsZFwiKSBpbml0aWFsaXplcnMudW5zaGlmdChfKTtcclxuICAgICAgICAgICAgZWxzZSBkZXNjcmlwdG9yW2tleV0gPSBfO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGlmICh0YXJnZXQpIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGNvbnRleHRJbi5uYW1lLCBkZXNjcmlwdG9yKTtcclxuICAgIGRvbmUgPSB0cnVlO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcnVuSW5pdGlhbGl6ZXJzKHRoaXNBcmcsIGluaXRpYWxpemVycywgdmFsdWUpIHtcclxuICAgIHZhciB1c2VWYWx1ZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAyO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpbml0aWFsaXplcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YWx1ZSA9IHVzZVZhbHVlID8gaW5pdGlhbGl6ZXJzW2ldLmNhbGwodGhpc0FyZywgdmFsdWUpIDogaW5pdGlhbGl6ZXJzW2ldLmNhbGwodGhpc0FyZyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdXNlVmFsdWUgPyB2YWx1ZSA6IHZvaWQgMDtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3Byb3BLZXkoeCkge1xyXG4gICAgcmV0dXJuIHR5cGVvZiB4ID09PSBcInN5bWJvbFwiID8geCA6IFwiXCIuY29uY2F0KHgpO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc2V0RnVuY3Rpb25OYW1lKGYsIG5hbWUsIHByZWZpeCkge1xyXG4gICAgaWYgKHR5cGVvZiBuYW1lID09PSBcInN5bWJvbFwiKSBuYW1lID0gbmFtZS5kZXNjcmlwdGlvbiA/IFwiW1wiLmNvbmNhdChuYW1lLmRlc2NyaXB0aW9uLCBcIl1cIikgOiBcIlwiO1xyXG4gICAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShmLCBcIm5hbWVcIiwgeyBjb25maWd1cmFibGU6IHRydWUsIHZhbHVlOiBwcmVmaXggPyBcIlwiLmNvbmNhdChwcmVmaXgsIFwiIFwiLCBuYW1lKSA6IG5hbWUgfSk7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSkge1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0Lm1ldGFkYXRhID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBSZWZsZWN0Lm1ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXRlcih0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2dlbmVyYXRvcih0aGlzQXJnLCBib2R5KSB7XHJcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xyXG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcclxuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XHJcbiAgICAgICAgd2hpbGUgKGcgJiYgKGcgPSAwLCBvcFswXSAmJiAoXyA9IDApKSwgXykgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xyXG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XHJcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxyXG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fY3JlYXRlQmluZGluZyA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobSwgayk7XHJcbiAgICBpZiAoIWRlc2MgfHwgKFwiZ2V0XCIgaW4gZGVzYyA/ICFtLl9fZXNNb2R1bGUgOiBkZXNjLndyaXRhYmxlIHx8IGRlc2MuY29uZmlndXJhYmxlKSkge1xyXG4gICAgICAgIGRlc2MgPSB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH07XHJcbiAgICB9XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIGRlc2MpO1xyXG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIG9bazJdID0gbVtrXTtcclxufSk7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHBvcnRTdGFyKG0sIG8pIHtcclxuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKHAgIT09IFwiZGVmYXVsdFwiICYmICFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobywgcCkpIF9fY3JlYXRlQmluZGluZyhvLCBtLCBwKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fdmFsdWVzKG8pIHtcclxuICAgIHZhciBzID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIFN5bWJvbC5pdGVyYXRvciwgbSA9IHMgJiYgb1tzXSwgaSA9IDA7XHJcbiAgICBpZiAobSkgcmV0dXJuIG0uY2FsbChvKTtcclxuICAgIGlmIChvICYmIHR5cGVvZiBvLmxlbmd0aCA9PT0gXCJudW1iZXJcIikgcmV0dXJuIHtcclxuICAgICAgICBuZXh0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChvICYmIGkgPj0gby5sZW5ndGgpIG8gPSB2b2lkIDA7XHJcbiAgICAgICAgICAgIHJldHVybiB7IHZhbHVlOiBvICYmIG9baSsrXSwgZG9uZTogIW8gfTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihzID8gXCJPYmplY3QgaXMgbm90IGl0ZXJhYmxlLlwiIDogXCJTeW1ib2wuaXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZWFkKG8sIG4pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXTtcclxuICAgIGlmICghbSkgcmV0dXJuIG87XHJcbiAgICB2YXIgaSA9IG0uY2FsbChvKSwgciwgYXIgPSBbXSwgZTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgd2hpbGUgKChuID09PSB2b2lkIDAgfHwgbi0tID4gMCkgJiYgIShyID0gaS5uZXh0KCkpLmRvbmUpIGFyLnB1c2goci52YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZXJyb3IpIHsgZSA9IHsgZXJyb3I6IGVycm9yIH07IH1cclxuICAgIGZpbmFsbHkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChyICYmICFyLmRvbmUgJiYgKG0gPSBpW1wicmV0dXJuXCJdKSkgbS5jYWxsKGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmaW5hbGx5IHsgaWYgKGUpIHRocm93IGUuZXJyb3I7IH1cclxuICAgIH1cclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuLyoqIEBkZXByZWNhdGVkICovXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZCgpIHtcclxuICAgIGZvciAodmFyIGFyID0gW10sIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIGFyID0gYXIuY29uY2F0KF9fcmVhZChhcmd1bWVudHNbaV0pKTtcclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuLyoqIEBkZXByZWNhdGVkICovXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZEFycmF5cygpIHtcclxuICAgIGZvciAodmFyIHMgPSAwLCBpID0gMCwgaWwgPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgaWw7IGkrKykgcyArPSBhcmd1bWVudHNbaV0ubGVuZ3RoO1xyXG4gICAgZm9yICh2YXIgciA9IEFycmF5KHMpLCBrID0gMCwgaSA9IDA7IGkgPCBpbDsgaSsrKVxyXG4gICAgICAgIGZvciAodmFyIGEgPSBhcmd1bWVudHNbaV0sIGogPSAwLCBqbCA9IGEubGVuZ3RoOyBqIDwgamw7IGorKywgaysrKVxyXG4gICAgICAgICAgICByW2tdID0gYVtqXTtcclxuICAgIHJldHVybiByO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWRBcnJheSh0bywgZnJvbSwgcGFjaykge1xyXG4gICAgaWYgKHBhY2sgfHwgYXJndW1lbnRzLmxlbmd0aCA9PT0gMikgZm9yICh2YXIgaSA9IDAsIGwgPSBmcm9tLmxlbmd0aCwgYXI7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICBpZiAoYXIgfHwgIShpIGluIGZyb20pKSB7XHJcbiAgICAgICAgICAgIGlmICghYXIpIGFyID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSwgMCwgaSk7XHJcbiAgICAgICAgICAgIGFyW2ldID0gZnJvbVtpXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdG8uY29uY2F0KGFyIHx8IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20pKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXQodikge1xyXG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBfX2F3YWl0ID8gKHRoaXMudiA9IHYsIHRoaXMpIDogbmV3IF9fYXdhaXQodik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jR2VuZXJhdG9yKHRoaXNBcmcsIF9hcmd1bWVudHMsIGdlbmVyYXRvcikge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBnID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pLCBpLCBxID0gW107XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaWYgKGdbbl0pIGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKGEsIGIpIHsgcS5wdXNoKFtuLCB2LCBhLCBiXSkgPiAxIHx8IHJlc3VtZShuLCB2KTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHJlc3VtZShuLCB2KSB7IHRyeSB7IHN0ZXAoZ1tuXSh2KSk7IH0gY2F0Y2ggKGUpIHsgc2V0dGxlKHFbMF1bM10sIGUpOyB9IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAocikgeyByLnZhbHVlIGluc3RhbmNlb2YgX19hd2FpdCA/IFByb21pc2UucmVzb2x2ZShyLnZhbHVlLnYpLnRoZW4oZnVsZmlsbCwgcmVqZWN0KSA6IHNldHRsZShxWzBdWzJdLCByKTsgfVxyXG4gICAgZnVuY3Rpb24gZnVsZmlsbCh2YWx1ZSkgeyByZXN1bWUoXCJuZXh0XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gcmVqZWN0KHZhbHVlKSB7IHJlc3VtZShcInRocm93XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKGYsIHYpIHsgaWYgKGYodiksIHEuc2hpZnQoKSwgcS5sZW5ndGgpIHJlc3VtZShxWzBdWzBdLCBxWzBdWzFdKTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0RlbGVnYXRvcihvKSB7XHJcbiAgICB2YXIgaSwgcDtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiwgZnVuY3Rpb24gKGUpIHsgdGhyb3cgZTsgfSksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaVtuXSA9IG9bbl0gPyBmdW5jdGlvbiAodikgeyByZXR1cm4gKHAgPSAhcCkgPyB7IHZhbHVlOiBfX2F3YWl0KG9bbl0odikpLCBkb25lOiBmYWxzZSB9IDogZiA/IGYodikgOiB2OyB9IDogZjsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY1ZhbHVlcyhvKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIG0gPSBvW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSwgaTtcclxuICAgIHJldHVybiBtID8gbS5jYWxsKG8pIDogKG8gPSB0eXBlb2YgX192YWx1ZXMgPT09IFwiZnVuY3Rpb25cIiA/IF9fdmFsdWVzKG8pIDogb1tTeW1ib2wuaXRlcmF0b3JdKCksIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpKTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpW25dID0gb1tuXSAmJiBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkgeyB2ID0gb1tuXSh2KSwgc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgdi5kb25lLCB2LnZhbHVlKTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShyZXNvbHZlLCByZWplY3QsIGQsIHYpIHsgUHJvbWlzZS5yZXNvbHZlKHYpLnRoZW4oZnVuY3Rpb24odikgeyByZXNvbHZlKHsgdmFsdWU6IHYsIGRvbmU6IGQgfSk7IH0sIHJlamVjdCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWFrZVRlbXBsYXRlT2JqZWN0KGNvb2tlZCwgcmF3KSB7XHJcbiAgICBpZiAoT2JqZWN0LmRlZmluZVByb3BlcnR5KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb29rZWQsIFwicmF3XCIsIHsgdmFsdWU6IHJhdyB9KTsgfSBlbHNlIHsgY29va2VkLnJhdyA9IHJhdzsgfVxyXG4gICAgcmV0dXJuIGNvb2tlZDtcclxufTtcclxuXHJcbnZhciBfX3NldE1vZHVsZURlZmF1bHQgPSBPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIHYpIHtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBcImRlZmF1bHRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdiB9KTtcclxufSkgOiBmdW5jdGlvbihvLCB2KSB7XHJcbiAgICBvW1wiZGVmYXVsdFwiXSA9IHY7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnRTdGFyKG1vZCkge1xyXG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcclxuICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgIGlmIChtb2QgIT0gbnVsbCkgZm9yICh2YXIgayBpbiBtb2QpIGlmIChrICE9PSBcImRlZmF1bHRcIiAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9kLCBrKSkgX19jcmVhdGVCaW5kaW5nKHJlc3VsdCwgbW9kLCBrKTtcclxuICAgIF9fc2V0TW9kdWxlRGVmYXVsdChyZXN1bHQsIG1vZCk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnREZWZhdWx0KG1vZCkge1xyXG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBkZWZhdWx0OiBtb2QgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fY2xhc3NQcml2YXRlRmllbGRHZXQocmVjZWl2ZXIsIHN0YXRlLCBraW5kLCBmKSB7XHJcbiAgICBpZiAoa2luZCA9PT0gXCJhXCIgJiYgIWYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJQcml2YXRlIGFjY2Vzc29yIHdhcyBkZWZpbmVkIHdpdGhvdXQgYSBnZXR0ZXJcIik7XHJcbiAgICBpZiAodHlwZW9mIHN0YXRlID09PSBcImZ1bmN0aW9uXCIgPyByZWNlaXZlciAhPT0gc3RhdGUgfHwgIWYgOiAhc3RhdGUuaGFzKHJlY2VpdmVyKSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCByZWFkIHByaXZhdGUgbWVtYmVyIGZyb20gYW4gb2JqZWN0IHdob3NlIGNsYXNzIGRpZCBub3QgZGVjbGFyZSBpdFwiKTtcclxuICAgIHJldHVybiBraW5kID09PSBcIm1cIiA/IGYgOiBraW5kID09PSBcImFcIiA/IGYuY2FsbChyZWNlaXZlcikgOiBmID8gZi52YWx1ZSA6IHN0YXRlLmdldChyZWNlaXZlcik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2NsYXNzUHJpdmF0ZUZpZWxkU2V0KHJlY2VpdmVyLCBzdGF0ZSwgdmFsdWUsIGtpbmQsIGYpIHtcclxuICAgIGlmIChraW5kID09PSBcIm1cIikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlByaXZhdGUgbWV0aG9kIGlzIG5vdCB3cml0YWJsZVwiKTtcclxuICAgIGlmIChraW5kID09PSBcImFcIiAmJiAhZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlByaXZhdGUgYWNjZXNzb3Igd2FzIGRlZmluZWQgd2l0aG91dCBhIHNldHRlclwiKTtcclxuICAgIGlmICh0eXBlb2Ygc3RhdGUgPT09IFwiZnVuY3Rpb25cIiA/IHJlY2VpdmVyICE9PSBzdGF0ZSB8fCAhZiA6ICFzdGF0ZS5oYXMocmVjZWl2ZXIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IHdyaXRlIHByaXZhdGUgbWVtYmVyIHRvIGFuIG9iamVjdCB3aG9zZSBjbGFzcyBkaWQgbm90IGRlY2xhcmUgaXRcIik7XHJcbiAgICByZXR1cm4gKGtpbmQgPT09IFwiYVwiID8gZi5jYWxsKHJlY2VpdmVyLCB2YWx1ZSkgOiBmID8gZi52YWx1ZSA9IHZhbHVlIDogc3RhdGUuc2V0KHJlY2VpdmVyLCB2YWx1ZSkpLCB2YWx1ZTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fY2xhc3NQcml2YXRlRmllbGRJbihzdGF0ZSwgcmVjZWl2ZXIpIHtcclxuICAgIGlmIChyZWNlaXZlciA9PT0gbnVsbCB8fCAodHlwZW9mIHJlY2VpdmVyICE9PSBcIm9iamVjdFwiICYmIHR5cGVvZiByZWNlaXZlciAhPT0gXCJmdW5jdGlvblwiKSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCB1c2UgJ2luJyBvcGVyYXRvciBvbiBub24tb2JqZWN0XCIpO1xyXG4gICAgcmV0dXJuIHR5cGVvZiBzdGF0ZSA9PT0gXCJmdW5jdGlvblwiID8gcmVjZWl2ZXIgPT09IHN0YXRlIDogc3RhdGUuaGFzKHJlY2VpdmVyKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYWRkRGlzcG9zYWJsZVJlc291cmNlKGVudiwgdmFsdWUsIGFzeW5jKSB7XHJcbiAgICBpZiAodmFsdWUgIT09IG51bGwgJiYgdmFsdWUgIT09IHZvaWQgMCkge1xyXG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIHZhbHVlICE9PSBcImZ1bmN0aW9uXCIpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJPYmplY3QgZXhwZWN0ZWQuXCIpO1xyXG4gICAgICAgIHZhciBkaXNwb3NlO1xyXG4gICAgICAgIGlmIChhc3luYykge1xyXG4gICAgICAgICAgICBpZiAoIVN5bWJvbC5hc3luY0Rpc3Bvc2UpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNEaXNwb3NlIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgICAgICAgICAgZGlzcG9zZSA9IHZhbHVlW1N5bWJvbC5hc3luY0Rpc3Bvc2VdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZGlzcG9zZSA9PT0gdm9pZCAwKSB7XHJcbiAgICAgICAgICAgIGlmICghU3ltYm9sLmRpc3Bvc2UpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuZGlzcG9zZSBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICAgICAgICAgIGRpc3Bvc2UgPSB2YWx1ZVtTeW1ib2wuZGlzcG9zZV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0eXBlb2YgZGlzcG9zZSAhPT0gXCJmdW5jdGlvblwiKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiT2JqZWN0IG5vdCBkaXNwb3NhYmxlLlwiKTtcclxuICAgICAgICBlbnYuc3RhY2sucHVzaCh7IHZhbHVlOiB2YWx1ZSwgZGlzcG9zZTogZGlzcG9zZSwgYXN5bmM6IGFzeW5jIH0pO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoYXN5bmMpIHtcclxuICAgICAgICBlbnYuc3RhY2sucHVzaCh7IGFzeW5jOiB0cnVlIH0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHZhbHVlO1xyXG59XHJcblxyXG52YXIgX1N1cHByZXNzZWRFcnJvciA9IHR5cGVvZiBTdXBwcmVzc2VkRXJyb3IgPT09IFwiZnVuY3Rpb25cIiA/IFN1cHByZXNzZWRFcnJvciA6IGZ1bmN0aW9uIChlcnJvciwgc3VwcHJlc3NlZCwgbWVzc2FnZSkge1xyXG4gICAgdmFyIGUgPSBuZXcgRXJyb3IobWVzc2FnZSk7XHJcbiAgICByZXR1cm4gZS5uYW1lID0gXCJTdXBwcmVzc2VkRXJyb3JcIiwgZS5lcnJvciA9IGVycm9yLCBlLnN1cHByZXNzZWQgPSBzdXBwcmVzc2VkLCBlO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZGlzcG9zZVJlc291cmNlcyhlbnYpIHtcclxuICAgIGZ1bmN0aW9uIGZhaWwoZSkge1xyXG4gICAgICAgIGVudi5lcnJvciA9IGVudi5oYXNFcnJvciA/IG5ldyBfU3VwcHJlc3NlZEVycm9yKGUsIGVudi5lcnJvciwgXCJBbiBlcnJvciB3YXMgc3VwcHJlc3NlZCBkdXJpbmcgZGlzcG9zYWwuXCIpIDogZTtcclxuICAgICAgICBlbnYuaGFzRXJyb3IgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gbmV4dCgpIHtcclxuICAgICAgICB3aGlsZSAoZW52LnN0YWNrLmxlbmd0aCkge1xyXG4gICAgICAgICAgICB2YXIgcmVjID0gZW52LnN0YWNrLnBvcCgpO1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHJlYy5kaXNwb3NlICYmIHJlYy5kaXNwb3NlLmNhbGwocmVjLnZhbHVlKTtcclxuICAgICAgICAgICAgICAgIGlmIChyZWMuYXN5bmMpIHJldHVybiBQcm9taXNlLnJlc29sdmUocmVzdWx0KS50aGVuKG5leHQsIGZ1bmN0aW9uKGUpIHsgZmFpbChlKTsgcmV0dXJuIG5leHQoKTsgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIGZhaWwoZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGVudi5oYXNFcnJvcikgdGhyb3cgZW52LmVycm9yO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG5leHQoKTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gICAgX19leHRlbmRzOiBfX2V4dGVuZHMsXHJcbiAgICBfX2Fzc2lnbjogX19hc3NpZ24sXHJcbiAgICBfX3Jlc3Q6IF9fcmVzdCxcclxuICAgIF9fZGVjb3JhdGU6IF9fZGVjb3JhdGUsXHJcbiAgICBfX3BhcmFtOiBfX3BhcmFtLFxyXG4gICAgX19tZXRhZGF0YTogX19tZXRhZGF0YSxcclxuICAgIF9fYXdhaXRlcjogX19hd2FpdGVyLFxyXG4gICAgX19nZW5lcmF0b3I6IF9fZ2VuZXJhdG9yLFxyXG4gICAgX19jcmVhdGVCaW5kaW5nOiBfX2NyZWF0ZUJpbmRpbmcsXHJcbiAgICBfX2V4cG9ydFN0YXI6IF9fZXhwb3J0U3RhcixcclxuICAgIF9fdmFsdWVzOiBfX3ZhbHVlcyxcclxuICAgIF9fcmVhZDogX19yZWFkLFxyXG4gICAgX19zcHJlYWQ6IF9fc3ByZWFkLFxyXG4gICAgX19zcHJlYWRBcnJheXM6IF9fc3ByZWFkQXJyYXlzLFxyXG4gICAgX19zcHJlYWRBcnJheTogX19zcHJlYWRBcnJheSxcclxuICAgIF9fYXdhaXQ6IF9fYXdhaXQsXHJcbiAgICBfX2FzeW5jR2VuZXJhdG9yOiBfX2FzeW5jR2VuZXJhdG9yLFxyXG4gICAgX19hc3luY0RlbGVnYXRvcjogX19hc3luY0RlbGVnYXRvcixcclxuICAgIF9fYXN5bmNWYWx1ZXM6IF9fYXN5bmNWYWx1ZXMsXHJcbiAgICBfX21ha2VUZW1wbGF0ZU9iamVjdDogX19tYWtlVGVtcGxhdGVPYmplY3QsXHJcbiAgICBfX2ltcG9ydFN0YXI6IF9faW1wb3J0U3RhcixcclxuICAgIF9faW1wb3J0RGVmYXVsdDogX19pbXBvcnREZWZhdWx0LFxyXG4gICAgX19jbGFzc1ByaXZhdGVGaWVsZEdldDogX19jbGFzc1ByaXZhdGVGaWVsZEdldCxcclxuICAgIF9fY2xhc3NQcml2YXRlRmllbGRTZXQ6IF9fY2xhc3NQcml2YXRlRmllbGRTZXQsXHJcbiAgICBfX2NsYXNzUHJpdmF0ZUZpZWxkSW46IF9fY2xhc3NQcml2YXRlRmllbGRJbixcclxuICAgIF9fYWRkRGlzcG9zYWJsZVJlc291cmNlOiBfX2FkZERpc3Bvc2FibGVSZXNvdXJjZSxcclxuICAgIF9fZGlzcG9zZVJlc291cmNlczogX19kaXNwb3NlUmVzb3VyY2VzLFxyXG59O1xyXG4iLCJleHBvcnQgaW50ZXJmYWNlIEV4cGFuZGVyUXVlcnkge1xuICAgIHN0YXJ0OiBudW1iZXJcbiAgICBlbmQ6IG51bWJlclxuICAgIHRlbXBsYXRlOiBzdHJpbmdcbiAgICBxdWVyeTogc3RyaW5nXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBbGxFeHBhbmRlcnNRdWVyeShjb250ZW50OiBzdHJpbmdbXSk6IEV4cGFuZGVyUXVlcnlbXSB7XG4gICAgbGV0IGFjY3VtOiBFeHBhbmRlclF1ZXJ5W10gPSBbXVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29udGVudC5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBsaW5lID0gY29udGVudFtpXVxuXG4gICAgICAgIGlmIChsaW5lID09PSAnYGBgZXhwYW5kZXInKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBlID0gMDsgZSA8IGNvbnRlbnQubGVuZ3RoIC0gaTsgZSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbmV4dGxpbmUgPSBjb250ZW50W2kgKyBlXVxuICAgICAgICAgICAgICAgIGlmIChuZXh0bGluZSA9PT0gJ2BgYCcpIHtcbiAgICAgICAgICAgICAgICAgICAgYWNjdW0ucHVzaChcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydDogaSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmQ6IGkgKyBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXJ5OiBjb250ZW50W2kgKyAxXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogZSA+IDIgPyBjb250ZW50LnNsaWNlKGkgKyAyLCBpICsgZSkuam9pbignXFxuJykgOiAnJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGFjY3VtXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDbG9zZXN0UXVlcnkocXVlcmllczogRXhwYW5kZXJRdWVyeVtdLCBsaW5lTnVtYmVyOiBudW1iZXIpOiBFeHBhbmRlclF1ZXJ5IHwgdW5kZWZpbmVkIHtcbiAgICBpZiAocXVlcmllcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIH1cblxuICAgIHJldHVybiBxdWVyaWVzLnJlZHVjZSgoYSwgYikgPT4ge1xuICAgICAgICByZXR1cm4gTWF0aC5hYnMoYi5zdGFydCAtIGxpbmVOdW1iZXIpIDwgTWF0aC5hYnMoYS5zdGFydCAtIGxpbmVOdW1iZXIpID8gYiA6IGE7XG4gICAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRMYXN0TGluZVRvUmVwbGFjZShjb250ZW50OiBzdHJpbmdbXSwgcXVlcnk6IEV4cGFuZGVyUXVlcnksIGVuZGxpbmU6IHN0cmluZykge1xuICAgIGNvbnN0IGxpbmVGcm9tID0gcXVlcnkuZW5kXG5cbiAgICBmb3IgKHZhciBpID0gbGluZUZyb20gKyAxOyBpIDwgY29udGVudC5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoY29udGVudFtpXSA9PT0gZW5kbGluZSkge1xuICAgICAgICAgICAgcmV0dXJuIGlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBsaW5lRnJvbSArIDFcbn1cblxudHlwZSBMb29zZU9iamVjdDxUID0gYW55PiA9IHsgW2tleTogc3RyaW5nXTogVCB9XG5cbmV4cG9ydCBjb25zdCBwaWNrID0gKG9iajoge1trOiBzdHJpbmddOiBhbnl9LCBhcnI6IHN0cmluZ1tdKSA9PlxuICAgIGFyci5yZWR1Y2UoKGFjYywgY3VycikgPT4ge1xuICAgICAgICByZXR1cm4gKGN1cnIgaW4gb2JqKVxuICAgICAgICAgICAgPyBPYmplY3QuYXNzaWduKHt9LCBhY2MsIHsgW2N1cnJdOiBvYmpbY3Vycl0gfSlcbiAgICAgICAgICAgIDogYWNjXG4gICAgfSwgPExvb3NlT2JqZWN0Pnt9KTtcblxuXG4iLCIvLyBGdW5jdGlvbnMgZm9yIHN0cmluZyBwcm9jZXNzaW5nXG5leHBvcnQgZnVuY3Rpb24gc3BsaXRCeUxpbmVzKGNvbnRlbnQ6IHN0cmluZyk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gY29udGVudC5zcGxpdCgnXFxuJylcbn1cblxuZnVuY3Rpb24gcmVtb3ZlRW1wdHlMaW5lcyhzOiBzdHJpbmcpOiBzdHJpbmcgIHtcbiAgICAgICAgY29uc3QgbGluZXMgPSBzLnNwbGl0KCdcXG4nKS5tYXAoZSA9PiBlLnRyaW0oKSlcblxuICAgICAgICBpZiAobGluZXMubGVuZ3RoIDwgMikge1xuICAgICAgICAgICAgcmV0dXJuIHNcbiAgICAgICAgfSBlbHNlIGlmIChsaW5lcy5pbmRleE9mKCcnKSA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlbW92ZUVtcHR5TGluZXMobGluZXMuc2xpY2UoMSkuam9pbignXFxuJykpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc1xufVxuXG5mdW5jdGlvbiByZW1vdmVGcm9udE1hdHRlciAoczogc3RyaW5nLCBsb29rRW5kaW5nOiBib29sZWFuID0gZmFsc2UpOiBzdHJpbmcge1xuICAgIGNvbnN0IGxpbmVzID0gcy5zcGxpdCgnXFxuJylcblxuICAgIGlmIChsb29rRW5kaW5nICYmIGxpbmVzLmluZGV4T2YoJy0tLScpID09PSAwKSB7XG4gICAgICAgIHJldHVybiBsaW5lcy5zbGljZSgxKS5qb2luKCdcXG4nKVxuICAgIH0gZWxzZSBpZiAobG9va0VuZGluZykge1xuICAgICAgICByZXR1cm4gcmVtb3ZlRnJvbnRNYXR0ZXIobGluZXMuc2xpY2UoMSkuam9pbignXFxuJyksIHRydWUpXG4gICAgfSBlbHNlIGlmIChsaW5lcy5pbmRleE9mKCctLS0nKSA9PT0gMCkge1xuICAgICAgICByZXR1cm4gcmVtb3ZlRnJvbnRNYXR0ZXIobGluZXMuc2xpY2UoMSkuam9pbignXFxuJyksIHRydWUpXG4gICAgfVxuXG4gICAgcmV0dXJuIHNcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRyaW1Db250ZW50KGNvbnRlbnQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHJlbW92ZUZyb250TWF0dGVyKHJlbW92ZUVtcHR5TGluZXMoY29udGVudCkpXG59XG4iLCJpbXBvcnQge1BsdWdpbiwgVEZpbGV9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHtwaWNrfSBmcm9tIFwiLi9oZWxwZXJzXCI7XG5pbXBvcnQge0ZpbGVQYXJhbWV0ZXJzfSBmcm9tIFwiLi4vbWFpblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RnJvbnRNYXR0ZXIoZmlsZTogVEZpbGUsIHBsdWdpbjogUGx1Z2luLCBzOiBzdHJpbmcpIHtcbiAgICBjb25zdCB7ZnJvbnRtYXR0ZXIgPSBudWxsfSA9IHBsdWdpbi5hcHAubWV0YWRhdGFDYWNoZS5nZXRDYWNoZShmaWxlLnBhdGgpXG5cbiAgICBpZiAoZnJvbnRtYXR0ZXIpIHtcbiAgICAgICAgcmV0dXJuIGZyb250bWF0dGVyW3Muc3BsaXQoJzonKVsxXV0gfHwgJyc7XG4gICAgfVxuXG4gICAgcmV0dXJuICcnXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRGaWxlSW5mbyh0aGlzOiB2b2lkLCBwbHVnaW46IFBsdWdpbiwgZmlsZTogVEZpbGUpOiBQcm9taXNlPEZpbGVQYXJhbWV0ZXJzPiB7XG4gICAgY29uc3QgaW5mbyA9IE9iamVjdC5hc3NpZ24oe30sIGZpbGUsIHtcbiAgICAgICAgICAgIGNvbnRlbnQ6IGZpbGUuZXh0ZW5zaW9uID09PSAnbWQnID8gYXdhaXQgcGx1Z2luLmFwcC52YXVsdC5jYWNoZWRSZWFkKGZpbGUpIDogJycsXG4gICAgICAgICAgICBsaW5rOiBwbHVnaW4uYXBwLmZpbGVNYW5hZ2VyLmdlbmVyYXRlTWFya2Rvd25MaW5rKGZpbGUsIGZpbGUubmFtZSkucmVwbGFjZSgvXiEvLCAnJylcbiAgICAgICAgfSxcbiAgICAgICAgcGx1Z2luLmFwcC5tZXRhZGF0YUNhY2hlLmdldEZpbGVDYWNoZShmaWxlKVxuICAgIClcbiAgICByZXR1cm4gcGljayhpbmZvLCBbXG4gICAgICAgICdiYXNlbmFtZScsXG4gICAgICAgICdjb250ZW50JyxcbiAgICAgICAgJ2V4dGVuc2lvbicsXG4gICAgICAgICdoZWFkaW5ncycsXG4gICAgICAgICdsaW5rJywgJ25hbWUnLFxuICAgICAgICAncGF0aCcsICdzZWN0aW9ucycsICdzdGF0JyxcbiAgICAgICAgJ2Zyb250bWF0dGVyJyxcbiAgICAgICAgJ2xpbmtzJyxcbiAgICAgICAgJ2xpc3RJdGVtcydcbiAgICBdKVxufSIsImltcG9ydCB7VEZpbGV9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IFRleHRFeHBhbmRlciwge1NlYXJjaERldGFpbHN9IGZyb20gXCIuLi9tYWluXCI7XG5pbXBvcnQge3RyaW1Db250ZW50fSBmcm9tIFwiLi4vaGVscGVycy9zdHJpbmdcIjtcbmltcG9ydCB7Z2V0RnJvbnRNYXR0ZXJ9IGZyb20gXCIuLi9oZWxwZXJzL3RmaWxlXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2VxdWVuY2VzIHtcbiAgICBsb29wOiBib29sZWFuXG4gICAgbmFtZTogc3RyaW5nXG4gICAgZm9ybWF0OiAocGx1Z2luOiBUZXh0RXhwYW5kZXIsIHM6IHN0cmluZywgY29udGVudDogc3RyaW5nLCBmaWxlOiBURmlsZSwgcmVzdWx0cz86IFNlYXJjaERldGFpbHMsIGluZGV4PzogbnVtYmVyKSA9PiBzdHJpbmdcbiAgICBkZXNjOiBzdHJpbmdcbiAgICByZWFkQ29udGVudD86IGJvb2xlYW5cbiAgICB1c2luZ1NlYXJjaD86IGJvb2xlYW5cbn1cblxuaW50ZXJmYWNlIExpbmVJbmZvIHtcbiAgICB0ZXh0OiBzdHJpbmdcbiAgICBudW06IG51bWJlclxuICAgIHN0YXJ0OiBudW1iZXJcbiAgICBlbmQ6IG51bWJlclxufVxuXG5mdW5jdGlvbiBoaWdobGlnaHQobGluZVN0YXJ0OiBudW1iZXIsIGxpbmVFbmQ6IG51bWJlciwgbWF0Y2hTdGFydDogbnVtYmVyLCBtYXRjaEVuZDogbnVtYmVyLCBsaW5lQ29udGVudDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgICAgLi4ubGluZUNvbnRlbnQuc2xpY2UoMCwgbWF0Y2hTdGFydCAtIGxpbmVTdGFydCksXG4gICAgICAgICc9PScsXG4gICAgICAgIC4uLmxpbmVDb250ZW50LnNsaWNlKG1hdGNoU3RhcnQgLSBsaW5lU3RhcnQsIChtYXRjaFN0YXJ0IC0gbGluZVN0YXJ0KSArIChtYXRjaEVuZCAtIG1hdGNoU3RhcnQpKSxcbiAgICAgICAgJz09JyxcbiAgICAgICAgLi4ubGluZUNvbnRlbnQuc2xpY2UoKG1hdGNoU3RhcnQgLSBsaW5lU3RhcnQpICsgKG1hdGNoRW5kIC0gbWF0Y2hTdGFydCkpLFxuICAgIF0uam9pbignJylcbn1cblxuY29uc3Qgc2VxdWVuY2VzOiBTZXF1ZW5jZXNbXSA9IFtcbiAgICB7XG4gICAgICAgIG5hbWU6ICdcXFxcJGNvdW50JyxcbiAgICAgICAgbG9vcDogdHJ1ZSxcbiAgICAgICAgZm9ybWF0OiAoX3AsIF9zOiBzdHJpbmcsIF9jb250ZW50OiBzdHJpbmcsIF9maWxlOiBURmlsZSwgX2QsIGluZGV4KSA9PiBpbmRleCA/IFN0cmluZyhpbmRleCArIDEpIDogU3RyaW5nKDEpLFxuICAgICAgICBkZXNjOiAnYWRkIGluZGV4IG51bWJlciB0byBlYWNoIHByb2R1Y2VkIGZpbGUnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdcXFxcJGZpbGVuYW1lJyxcbiAgICAgICAgbG9vcDogdHJ1ZSxcbiAgICAgICAgZm9ybWF0OiAoX3AsIF9zOiBzdHJpbmcsIF9jb250ZW50OiBzdHJpbmcsIGZpbGU6IFRGaWxlKSA9PiBmaWxlLmJhc2VuYW1lLFxuICAgICAgICBkZXNjOiAnbmFtZSBvZiB0aGUgZm91bmRlZCBmaWxlJ1xuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnXFxcXCRsaW5rJyxcbiAgICAgICAgbG9vcDogdHJ1ZSxcbiAgICAgICAgZm9ybWF0OiAocCwgX3M6IHN0cmluZywgX2NvbnRlbnQ6IHN0cmluZywgZmlsZTogVEZpbGUpID0+IHAuYXBwLmZpbGVNYW5hZ2VyLmdlbmVyYXRlTWFya2Rvd25MaW5rKGZpbGUsIGZpbGUucGF0aCkucmVwbGFjZSgnIVtbJywgJ1tbJyksXG4gICAgICAgIGRlc2M6ICdsaW5rIGJhc2VkIG9uIE9ic2lkaWFuIHNldHRpbmdzJ1xuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnXFxcXCRsaW5lczpcXFxcZCsnLFxuICAgICAgICBsb29wOiB0cnVlLFxuICAgICAgICByZWFkQ29udGVudDogdHJ1ZSxcbiAgICAgICAgZm9ybWF0OiAocCwgczogc3RyaW5nLCBjb250ZW50OiBzdHJpbmcsIF9maWxlOiBURmlsZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZGlnaXRzID0gTnVtYmVyKHMuc3BsaXQoJzonKVsxXSlcblxuICAgICAgICAgICAgcmV0dXJuIHRyaW1Db250ZW50KGNvbnRlbnQpXG4gICAgICAgICAgICAgICAgLnNwbGl0KCdcXG4nKVxuICAgICAgICAgICAgICAgIC5maWx0ZXIoKF86IHN0cmluZywgaTogbnVtYmVyKSA9PiBpIDwgZGlnaXRzKVxuICAgICAgICAgICAgICAgIC5qb2luKCdcXG4nKVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKG5ldyBSZWdFeHAocC5jb25maWcubGluZUVuZGluZywgJ2cnKSwgJycpXG4gICAgICAgIH0sXG4gICAgICAgIGRlc2M6ICdzcGVjaWZpZWQgY291bnQgb2YgbGluZXMgZnJvbSB0aGUgZm91bmQgZmlsZSdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ1xcXFwkY2hhcmFjdGVyczpcXFxcZCsnLFxuICAgICAgICBsb29wOiB0cnVlLFxuICAgICAgICByZWFkQ29udGVudDogdHJ1ZSxcbiAgICAgICAgZm9ybWF0OiAocCwgczogc3RyaW5nLCBjb250ZW50OiBzdHJpbmcsIF9maWxlOiBURmlsZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZGlnaXRzID0gTnVtYmVyKHMuc3BsaXQoJzonKVsxXSlcblxuICAgICAgICAgICAgcmV0dXJuIHRyaW1Db250ZW50KGNvbnRlbnQpXG4gICAgICAgICAgICAgICAgLnNwbGl0KCcnKVxuICAgICAgICAgICAgICAgIC5maWx0ZXIoKF86IHN0cmluZywgaTogbnVtYmVyKSA9PiBpIDwgZGlnaXRzKVxuICAgICAgICAgICAgICAgIC5qb2luKCcnKVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKG5ldyBSZWdFeHAocC5jb25maWcubGluZUVuZGluZywgJ2cnKSwgJycpXG4gICAgICAgIH0sXG4gICAgICAgIGRlc2M6ICdzcGVjaWZpZWQgY291bnQgb2YgbGluZXMgZnJvbSB0aGUgZm91bmQgZmlsZSdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ1xcXFwkZnJvbnRtYXR0ZXI6W1xcXFxwXFx7TFxcfV8tXSsnLFxuICAgICAgICBsb29wOiB0cnVlLFxuICAgICAgICBmb3JtYXQ6IChwLCBzOiBzdHJpbmcsIF9jb250ZW50OiBzdHJpbmcsIGZpbGU6IFRGaWxlKSA9PiBnZXRGcm9udE1hdHRlcihmaWxlLCBwLCBzKSxcbiAgICAgICAgZGVzYzogJ3ZhbHVlIGZyb20gdGhlIGZyb250bWF0dGVyIGtleSBpbiB0aGUgZm91bmQgZmlsZSdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ1xcXFwkbGluZXMrJyxcbiAgICAgICAgbG9vcDogdHJ1ZSxcbiAgICAgICAgcmVhZENvbnRlbnQ6IHRydWUsXG4gICAgICAgIGZvcm1hdDogKHAsIHM6IHN0cmluZywgY29udGVudDogc3RyaW5nLCBfZmlsZTogVEZpbGUpID0+IGNvbnRlbnQucmVwbGFjZShuZXcgUmVnRXhwKHAuY29uZmlnLmxpbmVFbmRpbmcsICdnJyksICcnKSxcbiAgICAgICAgZGVzYzogJ2FsbCBjb250ZW50IGZyb20gdGhlIGZvdW5kIGZpbGUnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdcXFxcJGV4dCcsXG4gICAgICAgIGxvb3A6IHRydWUsXG4gICAgICAgIGZvcm1hdDogKF9wLCBzOiBzdHJpbmcsIGNvbnRlbnQ6IHN0cmluZywgZmlsZTogVEZpbGUpID0+IGZpbGUuZXh0ZW5zaW9uLFxuICAgICAgICBkZXNjOiAncmV0dXJuIGZpbGUgZXh0ZW5zaW9uJ1xuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnXFxcXCRjcmVhdGVkOmZvcm1hdDpkYXRlJyxcbiAgICAgICAgbG9vcDogdHJ1ZSxcbiAgICAgICAgZm9ybWF0OiAoX3AsIHM6IHN0cmluZywgY29udGVudDogc3RyaW5nLCBmaWxlOiBURmlsZSkgPT4gU3RyaW5nKG5ldyBEYXRlKGZpbGUuc3RhdC5jdGltZSkudG9JU09TdHJpbmcoKSkuc3BsaXQoJ1QnKVswXSxcbiAgICAgICAgZGVzYzogJ2NyZWF0ZWQgdGltZSBmb3JtYXR0ZWQnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdcXFxcJGNyZWF0ZWQ6Zm9ybWF0OnRpbWUnLFxuICAgICAgICBsb29wOiB0cnVlLFxuICAgICAgICBmb3JtYXQ6IChfcCwgczogc3RyaW5nLCBjb250ZW50OiBzdHJpbmcsIGZpbGU6IFRGaWxlKSA9PiBTdHJpbmcobmV3IERhdGUoZmlsZS5zdGF0LmN0aW1lKS50b0lTT1N0cmluZygpKS5zcGxpdCgvKFsuVF0pLylbMl0sXG4gICAgICAgIGRlc2M6ICdjcmVhdGVkIHRpbWUgZm9ybWF0dGVkJ1xuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnXFxcXCRjcmVhdGVkOmZvcm1hdCcsXG4gICAgICAgIGxvb3A6IHRydWUsXG4gICAgICAgIGZvcm1hdDogKF9wLCBzOiBzdHJpbmcsIGNvbnRlbnQ6IHN0cmluZywgZmlsZTogVEZpbGUpID0+IFN0cmluZyhuZXcgRGF0ZShmaWxlLnN0YXQuY3RpbWUpLnRvSVNPU3RyaW5nKCkpLFxuICAgICAgICBkZXNjOiAnY3JlYXRlZCB0aW1lIGZvcm1hdHRlZCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ1xcXFwkY3JlYXRlZCcsXG4gICAgICAgIGxvb3A6IHRydWUsXG4gICAgICAgIGZvcm1hdDogKF9wLCBzOiBzdHJpbmcsIGNvbnRlbnQ6IHN0cmluZywgZmlsZTogVEZpbGUpID0+IFN0cmluZyhmaWxlLnN0YXQuY3RpbWUpLFxuICAgICAgICBkZXNjOiAnY3JlYXRlZCB0aW1lJ1xuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnXFxcXCRzaXplJyxcbiAgICAgICAgbG9vcDogdHJ1ZSxcbiAgICAgICAgZm9ybWF0OiAoX3AsIHM6IHN0cmluZywgY29udGVudDogc3RyaW5nLCBmaWxlOiBURmlsZSkgPT4gU3RyaW5nKGZpbGUuc3RhdC5zaXplKSxcbiAgICAgICAgZGVzYzogJ3NpemUgb2YgdGhlIGZpbGUnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdcXFxcJHBhdGgnLFxuICAgICAgICBsb29wOiB0cnVlLFxuICAgICAgICBmb3JtYXQ6IChfcCwgczogc3RyaW5nLCBjb250ZW50OiBzdHJpbmcsIGZpbGU6IFRGaWxlKSA9PiBmaWxlLnBhdGgsXG4gICAgICAgIGRlc2M6ICdwYXRoIHRvIHRoZSBmb3VuZCBmaWxlJ1xuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnXFxcXCRwYXJlbnQnLFxuICAgICAgICBsb29wOiB0cnVlLFxuICAgICAgICBmb3JtYXQ6IChfcCwgczogc3RyaW5nLCBjb250ZW50OiBzdHJpbmcsIGZpbGU6IFRGaWxlKSA9PiBmaWxlLnBhcmVudC5uYW1lLFxuICAgICAgICBkZXNjOiAncGFyZW50IGZvbGRlciBuYW1lJ1xuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnXiguK3wpXFxcXCRoZWFkZXI6LisnLFxuICAgICAgICBsb29wOiB0cnVlLFxuICAgICAgICBmb3JtYXQ6IChwLCBzOiBzdHJpbmcsIGNvbnRlbnQ6IHN0cmluZywgZmlsZTogVEZpbGUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHByZWZpeCA9IHMuc2xpY2UoMCwgcy5pbmRleE9mKCckJykpXG4gICAgICAgICAgICBjb25zdCBoZWFkZXIgPSBzLnNsaWNlKHMuaW5kZXhPZignJCcpKS5yZXBsYWNlKCckaGVhZGVyOicsICcnKS5yZXBsYWNlKC9cIi9nLCAnJylcbiAgICAgICAgICAgIGNvbnN0IG5lZWRlZExldmVsID0gaGVhZGVyLnNwbGl0KFwiI1wiKS5sZW5ndGggLSAxXG4gICAgICAgICAgICBjb25zdCBuZWVkZWRUaXRsZSA9IGhlYWRlci5yZXBsYWNlKC9eIysvZywgJycpLnRyaW0oKVxuXG4gICAgICAgICAgICBjb25zdCBtZXRhZGF0YSA9IHAuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0RmlsZUNhY2hlKGZpbGUpXG5cbiAgICAgICAgICAgIHJldHVybiBtZXRhZGF0YS5oZWFkaW5ncz8uZmlsdGVyKGUgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRlc3RzID0gW1xuICAgICAgICAgICAgICAgICAgICBbbmVlZGVkVGl0bGUsIGUuaGVhZGluZy5pbmNsdWRlcyhuZWVkZWRUaXRsZSldLFxuICAgICAgICAgICAgICAgICAgICBbbmVlZGVkTGV2ZWwsIGUubGV2ZWwgPT09IG5lZWRlZExldmVsXVxuICAgICAgICAgICAgICAgIF0uZmlsdGVyKGUgPT4gZVswXSlcblxuICAgICAgICAgICAgICAgIGlmICh0ZXN0cy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRlc3RzLm1hcChlID0+IGVbMV0pLmV2ZXJ5KGUgPT4gZSA9PT0gdHJ1ZSlcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAubWFwKGggPT4gcC5hcHAuZmlsZU1hbmFnZXIuZ2VuZXJhdGVNYXJrZG93bkxpbmsoZmlsZSwgZmlsZS5iYXNlbmFtZSwgJyMnICsgaC5oZWFkaW5nKSlcbiAgICAgICAgICAgICAgICAubWFwKGxpbmsgPT4gcHJlZml4ICsgbGluaylcbiAgICAgICAgICAgICAgICAuam9pbignXFxuJykgfHwgJydcblxuICAgICAgICB9LFxuICAgICAgICBkZXNjOiAnaGVhZGluZ3MgZnJvbSBmb3VuZGVkIGZpbGVzLiAkaGVhZGVyOiMjIC0gcmV0dXJuIGFsbCBsZXZlbCAyIGhlYWRpbmdzLiAkaGVhZGVyOlRpdGxlIC0gcmV0dXJuIGFsbCBoZWFkaW5nIHdoaWNoIG1hdGNoIHRoZSBzdHJpbmcuIENhbiBiZSBwcmVwZW5kZWQgbGlrZTogLSAhJGhlYWRlcjojIyB0byB0cmFuc2NsdWRlIHRoZSBoZWFkaW5ncy4nXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdeKC4rfClcXFxcJGJsb2NrcycsXG4gICAgICAgIHJlYWRDb250ZW50OiB0cnVlLFxuICAgICAgICBsb29wOiB0cnVlLFxuICAgICAgICBmb3JtYXQ6IChwLCBzOiBzdHJpbmcsIGNvbnRlbnQ6IHN0cmluZywgZmlsZTogVEZpbGUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHByZWZpeCA9IHMuc2xpY2UoMCwgcy5pbmRleE9mKCckJykpXG5cbiAgICAgICAgICAgIHJldHVybiBjb250ZW50XG4gICAgICAgICAgICAgICAgLnNwbGl0KCdcXG4nKVxuICAgICAgICAgICAgICAgIC5maWx0ZXIoZSA9PiAvXFxeXFx3KyQvLnRlc3QoZSkpXG4gICAgICAgICAgICAgICAgLm1hcChlID0+XG4gICAgICAgICAgICAgICAgICAgIHByZWZpeCArIHAuYXBwLmZpbGVNYW5hZ2VyLmdlbmVyYXRlTWFya2Rvd25MaW5rKGZpbGUsIGZpbGUuYmFzZW5hbWUsICcjJyArIGUucmVwbGFjZSgvXi4rPyhcXF5cXHcrJCkvLCAnJDEnKSlcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgLmpvaW4oJ1xcbicpXG4gICAgICAgIH0sXG4gICAgICAgIGRlc2M6ICdibG9jayBpZHMgZnJvbSB0aGUgZm91bmQgZmlsZXMuIENhbiBiZSBwcmVwZW5kZWQuJ1xuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnXiguK3wpXFxcXCRtYXRjaDpoZWFkZXInLCBsb29wOiB0cnVlLCBmb3JtYXQ6IChwLCBzOiBzdHJpbmcsIGNvbnRlbnQ6IHN0cmluZywgZmlsZTogVEZpbGUsIHJlc3VsdHMpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHByZWZpeCA9IHMuc2xpY2UoMCwgcy5pbmRleE9mKCckJykpXG4gICAgICAgICAgICBjb25zdCBtZXRhZGF0YSA9IHAuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0RmlsZUNhY2hlKGZpbGUpXG5cbiAgICAgICAgICAgIGNvbnN0IGhlYWRpbmdzID0gbWV0YWRhdGEuaGVhZGluZ3NcbiAgICAgICAgICAgICAgICA/LmZpbHRlcihoID0+IHJlc3VsdHMucmVzdWx0LmNvbnRlbnQuZmlsdGVyKGMgPT4gaC5wb3NpdGlvbi5lbmQub2Zmc2V0IDwgY1swXSkuc29tZShlID0+IGUpKVxuICAgICAgICAgICAgICAgIC5zbGljZSgtMSlcblxuICAgICAgICAgICAgcmV0dXJuIGhlYWRpbmdzXG4gICAgICAgICAgICAgICAgLm1hcChoID0+IHAuYXBwLmZpbGVNYW5hZ2VyLmdlbmVyYXRlTWFya2Rvd25MaW5rKGZpbGUsIGZpbGUuYmFzZW5hbWUsICcjJyArIGguaGVhZGluZykpXG4gICAgICAgICAgICAgICAgLm1hcChsaW5rID0+IHByZWZpeCArIGxpbmspXG4gICAgICAgICAgICAgICAgLmpvaW4oJ1xcbicpIHx8ICcnXG4gICAgICAgIH0sIGRlc2M6ICdleHRyYWN0IGZvdW5kIHNlbGVjdGlvbnMnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdeKC4rfClcXFxcJG1hdGNobGluZSg6KFxcXFwrfC18KVxcXFxkKzpcXFxcZCt8OihcXFxcK3wtfClcXFxcZCt8KScsXG4gICAgICAgIGxvb3A6IHRydWUsXG4gICAgICAgIGZvcm1hdDogKF9wLCBzOiBzdHJpbmcsIGNvbnRlbnQ6IHN0cmluZywgZmlsZTogVEZpbGUsIHJlc3VsdHMpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHByZWZpeCA9IHMuc2xpY2UoMCwgcy5pbmRleE9mKCckbWF0Y2hsaW5lJykpO1xuICAgICAgICAgICAgY29uc3QgW2tleXdvcmQsIGNvbnRleHQsIGxpbWl0XSA9IHMuc2xpY2Uocy5pbmRleE9mKCckbWF0Y2hsaW5lJykpLnNwbGl0KCc6JylcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gY29udGV4dCB8fCAnJztcbiAgICAgICAgICAgIGNvbnN0IGxpbWl0VmFsdWUgPSBOdW1iZXIobGltaXQpXG4gICAgICAgICAgICBjb25zdCBpc1BsdXMgPSB2YWx1ZS5jb250YWlucygnKycpO1xuICAgICAgICAgICAgY29uc3QgaXNNaW51cyA9IHZhbHVlLmNvbnRhaW5zKCctJyk7XG4gICAgICAgICAgICBjb25zdCBpc0NvbnRleHQgPSAhaXNQbHVzICYmICFpc01pbnVzO1xuICAgICAgICAgICAgY29uc3Qgb2Zmc2V0ID0gTnVtYmVyKHZhbHVlLnJlcGxhY2UoL1srLV0vLCAnJykpO1xuXG4gICAgICAgICAgICBjb25zdCBsaW5lcyA9IHJlc3VsdHMuY29udGVudC5zcGxpdCgnXFxuJyk7XG5cbiAgICAgICAgICAgIC8vIEdyYWIgaW5mbyBhYm91dCBsaW5lIGNvbnRlbnQsIGluZGV4LCB0ZXh0IGxlbmd0aCBhbmQgc3RhcnQvZW5kIGNoYXJhY3RlciBwb3NpdGlvblxuICAgICAgICAgICAgY29uc3QgbGluZUluZm9zOiBBcnJheTxMaW5lSW5mbz4gPSBbXVxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRleHQgPSBsaW5lc1tpXVxuXG4gICAgICAgICAgICAgICAgaWYgKGkgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgbGluZUluZm9zLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgbnVtOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnQ6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmQ6IHRleHQubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dFxuICAgICAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3Qgc3RhcnQgPSBsaW5lSW5mb3NbaS0xXS5lbmQgKyAxXG4gICAgICAgICAgICAgICAgbGluZUluZm9zLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBudW06IGksXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0LFxuICAgICAgICAgICAgICAgICAgICB0ZXh0LFxuICAgICAgICAgICAgICAgICAgICBlbmQ6IHRleHQubGVuZ3RoICsgc3RhcnRcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0cy5yZXN1bHQuY29udGVudC5tYXAoKFtmcm9tLCB0b10pID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBtYXRjaGVkTGluZXMgPSBsaW5lSW5mb3NcbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlcigoeyBzdGFydCwgZW5kIH0pID0+IHN0YXJ0IDw9IGZyb20gJiYgZW5kID49IHRvKVxuICAgICAgICAgICAgICAgICAgICAubWFwKChsaW5lKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLmxpbmUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogaGlnaGxpZ2h0KGxpbmUuc3RhcnQsIGxpbmUuZW5kLCBmcm9tLCB0bywgbGluZS50ZXh0KVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0TGluZXM6IExpbmVJbmZvW10gPSBbXVxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgbWF0Y2hlZExpbmUgb2YgbWF0Y2hlZExpbmVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHByZXZMaW5lcyA9IGlzTWludXMgfHwgaXNDb250ZXh0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gbGluZUluZm9zLmZpbHRlcihsID0+IG1hdGNoZWRMaW5lLm51bSAtIGwubnVtID4gMCAmJiBtYXRjaGVkTGluZS5udW0gLSBsLm51bSA8IG9mZnNldClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBbXVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXh0TGluZXMgPSBpc1BsdXMgfHwgaXNDb250ZXh0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gbGluZUluZm9zLmZpbHRlcihsID0+IGwubnVtIC0gbWF0Y2hlZExpbmUubnVtID4gMCAmJiBsLm51bSAtIG1hdGNoZWRMaW5lLm51bSA8IG9mZnNldClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBbXVxuXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdExpbmVzLnB1c2goIC4uLnByZXZMaW5lcywgbWF0Y2hlZExpbmUsIC4uLm5leHRMaW5lcyApXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByZWZpeCArIHJlc3VsdExpbmVzLm1hcChlID0+IGUudGV4dCkuam9pbignXFxuJylcbiAgICAgICAgICAgIH0pLm1hcChsaW5lID0+IGxpbWl0VmFsdWUgPyBsaW5lLnNsaWNlKDAsIGxpbWl0VmFsdWUpIDogbGluZSkuam9pbignXFxuJylcbiAgICAgICAgfSwgZGVzYzogJ2V4dHJhY3QgbGluZSB3aXRoIG1hdGNoZXMnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdeKC4rfClcXFxcJHNlYXJjaHJlc3VsdCcsXG4gICAgICAgIGxvb3A6IHRydWUsXG4gICAgICAgIGRlc2M6ICcnLFxuICAgICAgICBmb3JtYXQ6IChfcCwgczogc3RyaW5nLCBjb250ZW50OiBzdHJpbmcsIGZpbGU6IFRGaWxlLCByZXN1bHRzKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwcmVmaXggPSBzLnNsaWNlKDAsIHMuaW5kZXhPZignJHNlYXJjaHJlc3VsdCcpKTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHRzLmNoaWxkcmVuLm1hcChtYXRjaGVkRmlsZSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHByZWZpeCArIG1hdGNoZWRGaWxlLmVsLmlubmVyVGV4dFxuICAgICAgICAgICAgfSkuam9pbignXFxuJylcbiAgICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnXiguK3wpXFxcXCRtYXRjaCcsIGxvb3A6IHRydWUsIGZvcm1hdDogKF9wLCBzOiBzdHJpbmcsIGNvbnRlbnQ6IHN0cmluZywgZmlsZTogVEZpbGUsIHJlc3VsdHMpID0+IHtcblxuICAgICAgICAgICAgaWYgKCFyZXN1bHRzLnJlc3VsdC5jb250ZW50KSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdUaGVyZSBpcyBubyBjb250ZW50IGluIHJlc3VsdHMnKVxuICAgICAgICAgICAgICAgIHJldHVybiAnJ1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBhcHBlbmRQcmVmaXgocHJlZml4OiBzdHJpbmcsIGxpbmU6IHN0cmluZykge1xuICAgICAgICAgICAgICAgIHJldHVybiBwcmVmaXggKyBsaW5lO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBwcmVmaXhDb250ZW50ID0gcy5zbGljZSgwLCBzLmluZGV4T2YoJyQnKSlcbiAgICAgICAgICAgIHJldHVybiByZXN1bHRzLnJlc3VsdC5jb250ZW50XG4gICAgICAgICAgICAgICAgLm1hcCgoW2Zyb20sIHRvXSkgPT4gcmVzdWx0cy5jb250ZW50LnNsaWNlKGZyb20sIHRvKSlcbiAgICAgICAgICAgICAgICAubWFwKGxpbmUgPT4gYXBwZW5kUHJlZml4KHByZWZpeENvbnRlbnQsIGxpbmUpKVxuICAgICAgICAgICAgICAgIC5qb2luKCdcXG4nKVxuICAgICAgICB9LCBkZXNjOiAnZXh0cmFjdCBmb3VuZCBzZWxlY3Rpb25zJ1xuICAgIH0sXG5dXG5cbmV4cG9ydCBkZWZhdWx0IHNlcXVlbmNlcyIsImltcG9ydCB7VEZpbGV9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHtTZWFyY2hEZXRhaWxzfSBmcm9tIFwiLi4vbWFpblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gZXh0cmFjdEZpbGVzRnJvbVNlYXJjaFJlc3VsdHMoc2VhcmNoUmVzdWx0czogTWFwPFRGaWxlLCBTZWFyY2hEZXRhaWxzPiwgY3VycmVudEZpbGVOYW1lOiBzdHJpbmcsIGV4Y2x1ZGVDdXJyZW50OiBib29sZWFuID0gdHJ1ZSkge1xuICAgIGNvbnN0IGZpbGVzID0gQXJyYXkuZnJvbShzZWFyY2hSZXN1bHRzLmtleXMoKSlcblxuICAgIHJldHVybiBleGNsdWRlQ3VycmVudFxuICAgICAgICA/IGZpbGVzLmZpbHRlcihmaWxlID0+IGZpbGUuYmFzZW5hbWUgIT09IGN1cnJlbnRGaWxlTmFtZSlcbiAgICAgICAgOiBmaWxlcztcbn0iLCJpbXBvcnQgeyBleGlzdHNTeW5jLCByZWFkRmlsZVN5bmMgfSBmcm9tICdmcyc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuXG5mdW5jdGlvbiBzZXRQcm90b3R5cGVPZihvYmosIHByb3RvKSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICBpZiAoT2JqZWN0LnNldFByb3RvdHlwZU9mKSB7XG4gICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKG9iaiwgcHJvdG8pO1xuICB9IGVsc2Uge1xuICAgIG9iai5fX3Byb3RvX18gPSBwcm90bztcbiAgfVxufVxuLy8gVGhpcyBpcyBwcmV0dHkgbXVjaCB0aGUgb25seSB3YXkgdG8gZ2V0IG5pY2UsIGV4dGVuZGVkIEVycm9yc1xuLy8gd2l0aG91dCB1c2luZyBFUzZcbi8qKlxyXG4gKiBUaGlzIHJldHVybnMgYSBuZXcgRXJyb3Igd2l0aCBhIGN1c3RvbSBwcm90b3R5cGUuIE5vdGUgdGhhdCBpdCdzIF9ub3RfIGEgY29uc3RydWN0b3JcclxuICpcclxuICogQHBhcmFtIG1lc3NhZ2UgRXJyb3IgbWVzc2FnZVxyXG4gKlxyXG4gKiAqKkV4YW1wbGUqKlxyXG4gKlxyXG4gKiBgYGBqc1xyXG4gKiB0aHJvdyBFdGFFcnIoXCJ0ZW1wbGF0ZSBub3QgZm91bmRcIilcclxuICogYGBgXHJcbiAqL1xuZnVuY3Rpb24gRXRhRXJyKG1lc3NhZ2UpIHtcbiAgY29uc3QgZXJyID0gbmV3IEVycm9yKG1lc3NhZ2UpO1xuICBzZXRQcm90b3R5cGVPZihlcnIsIEV0YUVyci5wcm90b3R5cGUpO1xuICByZXR1cm4gZXJyO1xufVxuRXRhRXJyLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRXJyb3IucHJvdG90eXBlLCB7XG4gIG5hbWU6IHtcbiAgICB2YWx1ZTogXCJFdGEgRXJyb3JcIixcbiAgICBlbnVtZXJhYmxlOiBmYWxzZVxuICB9XG59KTtcbi8qKlxyXG4gKiBUaHJvd3MgYW4gRXRhRXJyIHdpdGggYSBuaWNlbHkgZm9ybWF0dGVkIGVycm9yIGFuZCBtZXNzYWdlIHNob3dpbmcgd2hlcmUgaW4gdGhlIHRlbXBsYXRlIHRoZSBlcnJvciBvY2N1cnJlZC5cclxuICovXG5mdW5jdGlvbiBQYXJzZUVycihtZXNzYWdlLCBzdHIsIGluZHgpIHtcbiAgY29uc3Qgd2hpdGVzcGFjZSA9IHN0ci5zbGljZSgwLCBpbmR4KS5zcGxpdCgvXFxuLyk7XG4gIGNvbnN0IGxpbmVObyA9IHdoaXRlc3BhY2UubGVuZ3RoO1xuICBjb25zdCBjb2xObyA9IHdoaXRlc3BhY2VbbGluZU5vIC0gMV0ubGVuZ3RoICsgMTtcbiAgbWVzc2FnZSArPSBcIiBhdCBsaW5lIFwiICsgbGluZU5vICsgXCIgY29sIFwiICsgY29sTm8gKyBcIjpcXG5cXG5cIiArIFwiICBcIiArIHN0ci5zcGxpdCgvXFxuLylbbGluZU5vIC0gMV0gKyBcIlxcblwiICsgXCIgIFwiICsgQXJyYXkoY29sTm8pLmpvaW4oXCIgXCIpICsgXCJeXCI7XG4gIHRocm93IEV0YUVycihtZXNzYWdlKTtcbn1cblxuLyoqXHJcbiAqIEByZXR1cm5zIFRoZSBnbG9iYWwgUHJvbWlzZSBmdW5jdGlvblxyXG4gKi9cbmNvbnN0IHByb21pc2VJbXBsID0gbmV3IEZ1bmN0aW9uKFwicmV0dXJuIHRoaXNcIikoKS5Qcm9taXNlO1xuLyoqXHJcbiAqIEByZXR1cm5zIEEgbmV3IEFzeW5jRnVuY3Rpb24gY29uc3R1Y3RvclxyXG4gKi9cbmZ1bmN0aW9uIGdldEFzeW5jRnVuY3Rpb25Db25zdHJ1Y3RvcigpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gbmV3IEZ1bmN0aW9uKFwicmV0dXJuIChhc3luYyBmdW5jdGlvbigpe30pLmNvbnN0cnVjdG9yXCIpKCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBpZiAoZSBpbnN0YW5jZW9mIFN5bnRheEVycm9yKSB7XG4gICAgICB0aHJvdyBFdGFFcnIoXCJUaGlzIGVudmlyb25tZW50IGRvZXNuJ3Qgc3VwcG9ydCBhc3luYy9hd2FpdFwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgZTtcbiAgICB9XG4gIH1cbn1cbi8qKlxyXG4gKiBzdHIudHJpbUxlZnQgcG9seWZpbGxcclxuICpcclxuICogQHBhcmFtIHN0ciAtIElucHV0IHN0cmluZ1xyXG4gKiBAcmV0dXJucyBUaGUgc3RyaW5nIHdpdGggbGVmdCB3aGl0ZXNwYWNlIHJlbW92ZWRcclxuICpcclxuICovXG5mdW5jdGlvbiB0cmltTGVmdChzdHIpIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWV4dHJhLWJvb2xlYW4tY2FzdFxuICBpZiAoISFTdHJpbmcucHJvdG90eXBlLnRyaW1MZWZ0KSB7XG4gICAgcmV0dXJuIHN0ci50cmltTGVmdCgpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBzdHIucmVwbGFjZSgvXlxccysvLCBcIlwiKTtcbiAgfVxufVxuLyoqXHJcbiAqIHN0ci50cmltUmlnaHQgcG9seWZpbGxcclxuICpcclxuICogQHBhcmFtIHN0ciAtIElucHV0IHN0cmluZ1xyXG4gKiBAcmV0dXJucyBUaGUgc3RyaW5nIHdpdGggcmlnaHQgd2hpdGVzcGFjZSByZW1vdmVkXHJcbiAqXHJcbiAqL1xuZnVuY3Rpb24gdHJpbVJpZ2h0KHN0cikge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tZXh0cmEtYm9vbGVhbi1jYXN0XG4gIGlmICghIVN0cmluZy5wcm90b3R5cGUudHJpbVJpZ2h0KSB7XG4gICAgcmV0dXJuIHN0ci50cmltUmlnaHQoKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoL1xccyskLywgXCJcIik7IC8vIFRPRE86IGRvIHdlIHJlYWxseSBuZWVkIHRvIHJlcGxhY2UgQk9NJ3M/XG4gIH1cbn1cblxuLy8gVE9ETzogYWxsb3cgJy0nIHRvIHRyaW0gdXAgdW50aWwgbmV3bGluZS4gVXNlIFteXFxTXFxuXFxyXSBpbnN0ZWFkIG9mIFxcc1xuLyogRU5EIFRZUEVTICovXG5mdW5jdGlvbiBoYXNPd25Qcm9wKG9iaiwgcHJvcCkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7XG59XG5mdW5jdGlvbiBjb3B5UHJvcHModG9PYmosIGZyb21PYmopIHtcbiAgZm9yIChjb25zdCBrZXkgaW4gZnJvbU9iaikge1xuICAgIGlmIChoYXNPd25Qcm9wKGZyb21PYmosIGtleSkpIHtcbiAgICAgIHRvT2JqW2tleV0gPSBmcm9tT2JqW2tleV07XG4gICAgfVxuICB9XG4gIHJldHVybiB0b09iajtcbn1cbi8qKlxyXG4gKiBUYWtlcyBhIHN0cmluZyB3aXRoaW4gYSB0ZW1wbGF0ZSBhbmQgdHJpbXMgaXQsIGJhc2VkIG9uIHRoZSBwcmVjZWRpbmcgdGFnJ3Mgd2hpdGVzcGFjZSBjb250cm9sIGFuZCBgY29uZmlnLmF1dG9UcmltYFxyXG4gKi9cbmZ1bmN0aW9uIHRyaW1XUyhzdHIsIGNvbmZpZywgd3NMZWZ0LCB3c1JpZ2h0KSB7XG4gIGxldCBsZWZ0VHJpbTtcbiAgbGV0IHJpZ2h0VHJpbTtcbiAgaWYgKEFycmF5LmlzQXJyYXkoY29uZmlnLmF1dG9UcmltKSkge1xuICAgIC8vIGtpbmRhIGNvbmZ1c2luZ1xuICAgIC8vIGJ1dCBffX0gd2lsbCB0cmltIHRoZSBsZWZ0IHNpZGUgb2YgdGhlIGZvbGxvd2luZyBzdHJpbmdcbiAgICBsZWZ0VHJpbSA9IGNvbmZpZy5hdXRvVHJpbVsxXTtcbiAgICByaWdodFRyaW0gPSBjb25maWcuYXV0b1RyaW1bMF07XG4gIH0gZWxzZSB7XG4gICAgbGVmdFRyaW0gPSByaWdodFRyaW0gPSBjb25maWcuYXV0b1RyaW07XG4gIH1cbiAgaWYgKHdzTGVmdCB8fCB3c0xlZnQgPT09IGZhbHNlKSB7XG4gICAgbGVmdFRyaW0gPSB3c0xlZnQ7XG4gIH1cbiAgaWYgKHdzUmlnaHQgfHwgd3NSaWdodCA9PT0gZmFsc2UpIHtcbiAgICByaWdodFRyaW0gPSB3c1JpZ2h0O1xuICB9XG4gIGlmICghcmlnaHRUcmltICYmICFsZWZ0VHJpbSkge1xuICAgIHJldHVybiBzdHI7XG4gIH1cbiAgaWYgKGxlZnRUcmltID09PSBcInNsdXJwXCIgJiYgcmlnaHRUcmltID09PSBcInNsdXJwXCIpIHtcbiAgICByZXR1cm4gc3RyLnRyaW0oKTtcbiAgfVxuICBpZiAobGVmdFRyaW0gPT09IFwiX1wiIHx8IGxlZnRUcmltID09PSBcInNsdXJwXCIpIHtcbiAgICAvLyBjb25zb2xlLmxvZygndHJpbW1pbmcgbGVmdCcgKyBsZWZ0VHJpbSlcbiAgICAvLyBmdWxsIHNsdXJwXG4gICAgc3RyID0gdHJpbUxlZnQoc3RyKTtcbiAgfSBlbHNlIGlmIChsZWZ0VHJpbSA9PT0gXCItXCIgfHwgbGVmdFRyaW0gPT09IFwibmxcIikge1xuICAgIC8vIG5sIHRyaW1cbiAgICBzdHIgPSBzdHIucmVwbGFjZSgvXig/OlxcclxcbnxcXG58XFxyKS8sIFwiXCIpO1xuICB9XG4gIGlmIChyaWdodFRyaW0gPT09IFwiX1wiIHx8IHJpZ2h0VHJpbSA9PT0gXCJzbHVycFwiKSB7XG4gICAgLy8gZnVsbCBzbHVycFxuICAgIHN0ciA9IHRyaW1SaWdodChzdHIpO1xuICB9IGVsc2UgaWYgKHJpZ2h0VHJpbSA9PT0gXCItXCIgfHwgcmlnaHRUcmltID09PSBcIm5sXCIpIHtcbiAgICAvLyBubCB0cmltXG4gICAgc3RyID0gc3RyLnJlcGxhY2UoLyg/OlxcclxcbnxcXG58XFxyKSQvLCBcIlwiKTsgLy8gVE9ETzogbWFrZSBzdXJlIHRoaXMgZ2V0cyBcXHJcXG5cbiAgfVxuXG4gIHJldHVybiBzdHI7XG59XG4vKipcclxuICogQSBtYXAgb2Ygc3BlY2lhbCBIVE1MIGNoYXJhY3RlcnMgdG8gdGhlaXIgWE1MLWVzY2FwZWQgZXF1aXZhbGVudHNcclxuICovXG5jb25zdCBlc2NNYXAgPSB7XG4gIFwiJlwiOiBcIiZhbXA7XCIsXG4gIFwiPFwiOiBcIiZsdDtcIixcbiAgXCI+XCI6IFwiJmd0O1wiLFxuICAnXCInOiBcIiZxdW90O1wiLFxuICBcIidcIjogXCImIzM5O1wiXG59O1xuZnVuY3Rpb24gcmVwbGFjZUNoYXIocykge1xuICByZXR1cm4gZXNjTWFwW3NdO1xufVxuLyoqXHJcbiAqIFhNTC1lc2NhcGVzIGFuIGlucHV0IHZhbHVlIGFmdGVyIGNvbnZlcnRpbmcgaXQgdG8gYSBzdHJpbmdcclxuICpcclxuICogQHBhcmFtIHN0ciAtIElucHV0IHZhbHVlICh1c3VhbGx5IGEgc3RyaW5nKVxyXG4gKiBAcmV0dXJucyBYTUwtZXNjYXBlZCBzdHJpbmdcclxuICovXG5mdW5jdGlvbiBYTUxFc2NhcGUoc3RyKSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICAvLyBUbyBkZWFsIHdpdGggWFNTLiBCYXNlZCBvbiBFc2NhcGUgaW1wbGVtZW50YXRpb25zIG9mIE11c3RhY2hlLkpTIGFuZCBNYXJrbywgdGhlbiBjdXN0b21pemVkLlxuICBjb25zdCBuZXdTdHIgPSBTdHJpbmcoc3RyKTtcbiAgaWYgKC9bJjw+XCInXS8udGVzdChuZXdTdHIpKSB7XG4gICAgcmV0dXJuIG5ld1N0ci5yZXBsYWNlKC9bJjw+XCInXS9nLCByZXBsYWNlQ2hhcik7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG5ld1N0cjtcbiAgfVxufVxuXG4vKiBFTkQgVFlQRVMgKi9cbmNvbnN0IHRlbXBsYXRlTGl0UmVnID0gL2AoPzpcXFxcW1xcc1xcU118XFwkeyg/Oltee31dfHsoPzpbXnt9XXx7W159XSp9KSp9KSp9fCg/IVxcJHspW15cXFxcYF0pKmAvZztcbmNvbnN0IHNpbmdsZVF1b3RlUmVnID0gLycoPzpcXFxcW1xcc1xcd1wiJ1xcXFxgXXxbXlxcblxccidcXFxcXSkqPycvZztcbmNvbnN0IGRvdWJsZVF1b3RlUmVnID0gL1wiKD86XFxcXFtcXHNcXHdcIidcXFxcYF18W15cXG5cXHJcIlxcXFxdKSo/XCIvZztcbi8qKiBFc2NhcGUgc3BlY2lhbCByZWd1bGFyIGV4cHJlc3Npb24gY2hhcmFjdGVycyBpbnNpZGUgYSBzdHJpbmcgKi9cbmZ1bmN0aW9uIGVzY2FwZVJlZ0V4cChzdHJpbmcpIHtcbiAgLy8gRnJvbSBNRE5cbiAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKC9bLiorXFwtP14ke30oKXxbXFxdXFxcXF0vZywgXCJcXFxcJCZcIik7IC8vICQmIG1lYW5zIHRoZSB3aG9sZSBtYXRjaGVkIHN0cmluZ1xufVxuXG5mdW5jdGlvbiBwYXJzZShzdHIsIGNvbmZpZykge1xuICBsZXQgYnVmZmVyID0gW107XG4gIGxldCB0cmltTGVmdE9mTmV4dFN0ciA9IGZhbHNlO1xuICBsZXQgbGFzdEluZGV4ID0gMDtcbiAgY29uc3QgcGFyc2VPcHRpb25zID0gY29uZmlnLnBhcnNlO1xuICBpZiAoY29uZmlnLnBsdWdpbnMpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbmZpZy5wbHVnaW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBwbHVnaW4gPSBjb25maWcucGx1Z2luc1tpXTtcbiAgICAgIGlmIChwbHVnaW4ucHJvY2Vzc1RlbXBsYXRlKSB7XG4gICAgICAgIHN0ciA9IHBsdWdpbi5wcm9jZXNzVGVtcGxhdGUoc3RyLCBjb25maWcpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICAvKiBBZGRpbmcgZm9yIEVKUyBjb21wYXRpYmlsaXR5ICovXG4gIGlmIChjb25maWcucm1XaGl0ZXNwYWNlKSB7XG4gICAgLy8gQ29kZSB0YWtlbiBkaXJlY3RseSBmcm9tIEVKU1xuICAgIC8vIEhhdmUgdG8gdXNlIHR3byBzZXBhcmF0ZSByZXBsYWNlcyBoZXJlIGFzIGBeYCBhbmQgYCRgIG9wZXJhdG9ycyBkb24ndFxuICAgIC8vIHdvcmsgd2VsbCB3aXRoIGBcXHJgIGFuZCBlbXB0eSBsaW5lcyBkb24ndCB3b3JrIHdlbGwgd2l0aCB0aGUgYG1gIGZsYWcuXG4gICAgLy8gRXNzZW50aWFsbHksIHRoaXMgcmVwbGFjZXMgdGhlIHdoaXRlc3BhY2UgYXQgdGhlIGJlZ2lubmluZyBhbmQgZW5kIG9mXG4gICAgLy8gZWFjaCBsaW5lIGFuZCByZW1vdmVzIG11bHRpcGxlIG5ld2xpbmVzLlxuICAgIHN0ciA9IHN0ci5yZXBsYWNlKC9bXFxyXFxuXSsvZywgXCJcXG5cIikucmVwbGFjZSgvXlxccyt8XFxzKyQvZ20sIFwiXCIpO1xuICB9XG4gIC8qIEVuZCBybVdoaXRlc3BhY2Ugb3B0aW9uICovXG4gIHRlbXBsYXRlTGl0UmVnLmxhc3RJbmRleCA9IDA7XG4gIHNpbmdsZVF1b3RlUmVnLmxhc3RJbmRleCA9IDA7XG4gIGRvdWJsZVF1b3RlUmVnLmxhc3RJbmRleCA9IDA7XG4gIGZ1bmN0aW9uIHB1c2hTdHJpbmcoc3RybmcsIHNob3VsZFRyaW1SaWdodE9mU3RyaW5nKSB7XG4gICAgaWYgKHN0cm5nKSB7XG4gICAgICAvLyBpZiBzdHJpbmcgaXMgdHJ1dGh5IGl0IG11c3QgYmUgb2YgdHlwZSAnc3RyaW5nJ1xuICAgICAgc3RybmcgPSB0cmltV1Moc3RybmcsIGNvbmZpZywgdHJpbUxlZnRPZk5leHRTdHIsXG4gICAgICAvLyB0aGlzIHdpbGwgb25seSBiZSBmYWxzZSBvbiB0aGUgZmlyc3Qgc3RyLCB0aGUgbmV4dCBvbmVzIHdpbGwgYmUgbnVsbCBvciB1bmRlZmluZWRcbiAgICAgIHNob3VsZFRyaW1SaWdodE9mU3RyaW5nKTtcbiAgICAgIGlmIChzdHJuZykge1xuICAgICAgICAvLyByZXBsYWNlIFxcIHdpdGggXFxcXCwgJyB3aXRoIFxcJ1xuICAgICAgICAvLyB3ZSdyZSBnb2luZyB0byBjb252ZXJ0IGFsbCBDUkxGIHRvIExGIHNvIGl0IGRvZXNuJ3QgdGFrZSBtb3JlIHRoYW4gb25lIHJlcGxhY2VcbiAgICAgICAgc3RybmcgPSBzdHJuZy5yZXBsYWNlKC9cXFxcfCcvZywgXCJcXFxcJCZcIikucmVwbGFjZSgvXFxyXFxufFxcbnxcXHIvZywgXCJcXFxcblwiKTtcbiAgICAgICAgYnVmZmVyLnB1c2goc3RybmcpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBjb25zdCBwcmVmaXhlcyA9IFtwYXJzZU9wdGlvbnMuZXhlYywgcGFyc2VPcHRpb25zLmludGVycG9sYXRlLCBwYXJzZU9wdGlvbnMucmF3XS5yZWR1Y2UoZnVuY3Rpb24gKGFjY3VtdWxhdG9yLCBwcmVmaXgpIHtcbiAgICBpZiAoYWNjdW11bGF0b3IgJiYgcHJlZml4KSB7XG4gICAgICByZXR1cm4gYWNjdW11bGF0b3IgKyBcInxcIiArIGVzY2FwZVJlZ0V4cChwcmVmaXgpO1xuICAgIH0gZWxzZSBpZiAocHJlZml4KSB7XG4gICAgICAvLyBhY2N1bXVsYXRvciBpcyBmYWxzeVxuICAgICAgcmV0dXJuIGVzY2FwZVJlZ0V4cChwcmVmaXgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBwcmVmaXggYW5kIGFjY3VtdWxhdG9yIGFyZSBib3RoIGZhbHN5XG4gICAgICByZXR1cm4gYWNjdW11bGF0b3I7XG4gICAgfVxuICB9LCBcIlwiKTtcbiAgY29uc3QgcGFyc2VPcGVuUmVnID0gbmV3IFJlZ0V4cChcIihbXl0qPylcIiArIGVzY2FwZVJlZ0V4cChjb25maWcudGFnc1swXSkgKyBcIigtfF8pP1xcXFxzKihcIiArIHByZWZpeGVzICsgXCIpP1xcXFxzKlwiLCBcImdcIik7XG4gIGNvbnN0IHBhcnNlQ2xvc2VSZWcgPSBuZXcgUmVnRXhwKFwiJ3xcXFwifGB8XFxcXC9cXFxcKnwoXFxcXHMqKC18Xyk/XCIgKyBlc2NhcGVSZWdFeHAoY29uZmlnLnRhZ3NbMV0pICsgXCIpXCIsIFwiZ1wiKTtcbiAgLy8gVE9ETzogYmVuY2htYXJrIGhhdmluZyB0aGUgXFxzKiBvbiBlaXRoZXIgc2lkZSB2cyB1c2luZyBzdHIudHJpbSgpXG4gIGxldCBtO1xuICB3aGlsZSAobSA9IHBhcnNlT3BlblJlZy5leGVjKHN0cikpIHtcbiAgICBsYXN0SW5kZXggPSBtWzBdLmxlbmd0aCArIG0uaW5kZXg7XG4gICAgY29uc3QgcHJlY2VkaW5nU3RyaW5nID0gbVsxXTtcbiAgICBjb25zdCB3c0xlZnQgPSBtWzJdO1xuICAgIGNvbnN0IHByZWZpeCA9IG1bM10gfHwgXCJcIjsgLy8gYnkgZGVmYXVsdCBlaXRoZXIgfiwgPSwgb3IgZW1wdHlcbiAgICBwdXNoU3RyaW5nKHByZWNlZGluZ1N0cmluZywgd3NMZWZ0KTtcbiAgICBwYXJzZUNsb3NlUmVnLmxhc3RJbmRleCA9IGxhc3RJbmRleDtcbiAgICBsZXQgY2xvc2VUYWc7XG4gICAgbGV0IGN1cnJlbnRPYmogPSBmYWxzZTtcbiAgICB3aGlsZSAoY2xvc2VUYWcgPSBwYXJzZUNsb3NlUmVnLmV4ZWMoc3RyKSkge1xuICAgICAgaWYgKGNsb3NlVGFnWzFdKSB7XG4gICAgICAgIGNvbnN0IGNvbnRlbnQgPSBzdHIuc2xpY2UobGFzdEluZGV4LCBjbG9zZVRhZy5pbmRleCk7XG4gICAgICAgIHBhcnNlT3BlblJlZy5sYXN0SW5kZXggPSBsYXN0SW5kZXggPSBwYXJzZUNsb3NlUmVnLmxhc3RJbmRleDtcbiAgICAgICAgdHJpbUxlZnRPZk5leHRTdHIgPSBjbG9zZVRhZ1syXTtcbiAgICAgICAgY29uc3QgY3VycmVudFR5cGUgPSBwcmVmaXggPT09IHBhcnNlT3B0aW9ucy5leGVjID8gXCJlXCIgOiBwcmVmaXggPT09IHBhcnNlT3B0aW9ucy5yYXcgPyBcInJcIiA6IHByZWZpeCA9PT0gcGFyc2VPcHRpb25zLmludGVycG9sYXRlID8gXCJpXCIgOiBcIlwiO1xuICAgICAgICBjdXJyZW50T2JqID0ge1xuICAgICAgICAgIHQ6IGN1cnJlbnRUeXBlLFxuICAgICAgICAgIHZhbDogY29udGVudFxuICAgICAgICB9O1xuICAgICAgICBicmVhaztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGNoYXIgPSBjbG9zZVRhZ1swXTtcbiAgICAgICAgaWYgKGNoYXIgPT09IFwiLypcIikge1xuICAgICAgICAgIGNvbnN0IGNvbW1lbnRDbG9zZUluZCA9IHN0ci5pbmRleE9mKFwiKi9cIiwgcGFyc2VDbG9zZVJlZy5sYXN0SW5kZXgpO1xuICAgICAgICAgIGlmIChjb21tZW50Q2xvc2VJbmQgPT09IC0xKSB7XG4gICAgICAgICAgICBQYXJzZUVycihcInVuY2xvc2VkIGNvbW1lbnRcIiwgc3RyLCBjbG9zZVRhZy5pbmRleCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHBhcnNlQ2xvc2VSZWcubGFzdEluZGV4ID0gY29tbWVudENsb3NlSW5kO1xuICAgICAgICB9IGVsc2UgaWYgKGNoYXIgPT09IFwiJ1wiKSB7XG4gICAgICAgICAgc2luZ2xlUXVvdGVSZWcubGFzdEluZGV4ID0gY2xvc2VUYWcuaW5kZXg7XG4gICAgICAgICAgY29uc3Qgc2luZ2xlUXVvdGVNYXRjaCA9IHNpbmdsZVF1b3RlUmVnLmV4ZWMoc3RyKTtcbiAgICAgICAgICBpZiAoc2luZ2xlUXVvdGVNYXRjaCkge1xuICAgICAgICAgICAgcGFyc2VDbG9zZVJlZy5sYXN0SW5kZXggPSBzaW5nbGVRdW90ZVJlZy5sYXN0SW5kZXg7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIFBhcnNlRXJyKFwidW5jbG9zZWQgc3RyaW5nXCIsIHN0ciwgY2xvc2VUYWcuaW5kZXgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChjaGFyID09PSAnXCInKSB7XG4gICAgICAgICAgZG91YmxlUXVvdGVSZWcubGFzdEluZGV4ID0gY2xvc2VUYWcuaW5kZXg7XG4gICAgICAgICAgY29uc3QgZG91YmxlUXVvdGVNYXRjaCA9IGRvdWJsZVF1b3RlUmVnLmV4ZWMoc3RyKTtcbiAgICAgICAgICBpZiAoZG91YmxlUXVvdGVNYXRjaCkge1xuICAgICAgICAgICAgcGFyc2VDbG9zZVJlZy5sYXN0SW5kZXggPSBkb3VibGVRdW90ZVJlZy5sYXN0SW5kZXg7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIFBhcnNlRXJyKFwidW5jbG9zZWQgc3RyaW5nXCIsIHN0ciwgY2xvc2VUYWcuaW5kZXgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChjaGFyID09PSBcImBcIikge1xuICAgICAgICAgIHRlbXBsYXRlTGl0UmVnLmxhc3RJbmRleCA9IGNsb3NlVGFnLmluZGV4O1xuICAgICAgICAgIGNvbnN0IHRlbXBsYXRlTGl0TWF0Y2ggPSB0ZW1wbGF0ZUxpdFJlZy5leGVjKHN0cik7XG4gICAgICAgICAgaWYgKHRlbXBsYXRlTGl0TWF0Y2gpIHtcbiAgICAgICAgICAgIHBhcnNlQ2xvc2VSZWcubGFzdEluZGV4ID0gdGVtcGxhdGVMaXRSZWcubGFzdEluZGV4O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBQYXJzZUVycihcInVuY2xvc2VkIHN0cmluZ1wiLCBzdHIsIGNsb3NlVGFnLmluZGV4KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGN1cnJlbnRPYmopIHtcbiAgICAgIGJ1ZmZlci5wdXNoKGN1cnJlbnRPYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICBQYXJzZUVycihcInVuY2xvc2VkIHRhZ1wiLCBzdHIsIG0uaW5kZXggKyBwcmVjZWRpbmdTdHJpbmcubGVuZ3RoKTtcbiAgICB9XG4gIH1cbiAgcHVzaFN0cmluZyhzdHIuc2xpY2UobGFzdEluZGV4LCBzdHIubGVuZ3RoKSwgZmFsc2UpO1xuICBpZiAoY29uZmlnLnBsdWdpbnMpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbmZpZy5wbHVnaW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBwbHVnaW4gPSBjb25maWcucGx1Z2luc1tpXTtcbiAgICAgIGlmIChwbHVnaW4ucHJvY2Vzc0FTVCkge1xuICAgICAgICBidWZmZXIgPSBwbHVnaW4ucHJvY2Vzc0FTVChidWZmZXIsIGNvbmZpZyk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBidWZmZXI7XG59XG5cbi8qIEVORCBUWVBFUyAqL1xuLyoqXHJcbiAqIENvbXBpbGVzIGEgdGVtcGxhdGUgc3RyaW5nIHRvIGEgZnVuY3Rpb24gc3RyaW5nLiBNb3N0IG9mdGVuIHVzZXJzIGp1c3QgdXNlIGBjb21waWxlKClgLCB3aGljaCBjYWxscyBgY29tcGlsZVRvU3RyaW5nYCBhbmQgY3JlYXRlcyBhIG5ldyBmdW5jdGlvbiB1c2luZyB0aGUgcmVzdWx0XHJcbiAqXHJcbiAqICoqRXhhbXBsZSoqXHJcbiAqXHJcbiAqIGBgYGpzXHJcbiAqIGNvbXBpbGVUb1N0cmluZyhcIkhpIDwlPSBpdC51c2VyICU+XCIsIGV0YS5jb25maWcpXHJcbiAqIC8vIFwidmFyIHRSPScnLGluY2x1ZGU9RS5pbmNsdWRlLmJpbmQoRSksaW5jbHVkZUZpbGU9RS5pbmNsdWRlRmlsZS5iaW5kKEUpO3RSKz0nSGkgJzt0Uis9RS5lKGl0LnVzZXIpO2lmKGNiKXtjYihudWxsLHRSKX0gcmV0dXJuIHRSXCJcclxuICogYGBgXHJcbiAqL1xuZnVuY3Rpb24gY29tcGlsZVRvU3RyaW5nKHN0ciwgY29uZmlnKSB7XG4gIGNvbnN0IGJ1ZmZlciA9IHBhcnNlKHN0ciwgY29uZmlnKTtcbiAgbGV0IHJlcyA9IFwidmFyIHRSPScnLF9fbCxfX2xQXCIgKyAoY29uZmlnLmluY2x1ZGUgPyBcIixpbmNsdWRlPUUuaW5jbHVkZS5iaW5kKEUpXCIgOiBcIlwiKSArIChjb25maWcuaW5jbHVkZUZpbGUgPyBcIixpbmNsdWRlRmlsZT1FLmluY2x1ZGVGaWxlLmJpbmQoRSlcIiA6IFwiXCIpICsgXCJcXG5mdW5jdGlvbiBsYXlvdXQocCxkKXtfX2w9cDtfX2xQPWR9XFxuXCIgKyAoY29uZmlnLnVzZVdpdGggPyBcIndpdGgoXCIgKyBjb25maWcudmFyTmFtZSArIFwifHx7fSl7XCIgOiBcIlwiKSArIGNvbXBpbGVTY29wZShidWZmZXIsIGNvbmZpZykgKyAoY29uZmlnLmluY2x1ZGVGaWxlID8gXCJpZihfX2wpdFI9XCIgKyAoY29uZmlnLmFzeW5jID8gXCJhd2FpdCBcIiA6IFwiXCIpICsgYGluY2x1ZGVGaWxlKF9fbCxPYmplY3QuYXNzaWduKCR7Y29uZmlnLnZhck5hbWV9LHtib2R5OnRSfSxfX2xQKSlcXG5gIDogY29uZmlnLmluY2x1ZGUgPyBcImlmKF9fbCl0Uj1cIiArIChjb25maWcuYXN5bmMgPyBcImF3YWl0IFwiIDogXCJcIikgKyBgaW5jbHVkZShfX2wsT2JqZWN0LmFzc2lnbigke2NvbmZpZy52YXJOYW1lfSx7Ym9keTp0Un0sX19sUCkpXFxuYCA6IFwiXCIpICsgXCJpZihjYil7Y2IobnVsbCx0Uil9IHJldHVybiB0UlwiICsgKGNvbmZpZy51c2VXaXRoID8gXCJ9XCIgOiBcIlwiKTtcbiAgaWYgKGNvbmZpZy5wbHVnaW5zKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb25maWcucGx1Z2lucy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgcGx1Z2luID0gY29uZmlnLnBsdWdpbnNbaV07XG4gICAgICBpZiAocGx1Z2luLnByb2Nlc3NGblN0cmluZykge1xuICAgICAgICByZXMgPSBwbHVnaW4ucHJvY2Vzc0ZuU3RyaW5nKHJlcywgY29uZmlnKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlcztcbn1cbi8qKlxyXG4gKiBMb29wcyB0aHJvdWdoIHRoZSBBU1QgZ2VuZXJhdGVkIGJ5IGBwYXJzZWAgYW5kIHRyYW5zZm9ybSBlYWNoIGl0ZW0gaW50byBKUyBjYWxsc1xyXG4gKlxyXG4gKiAqKkV4YW1wbGUqKlxyXG4gKlxyXG4gKiBgYGBqc1xyXG4gKiAvLyBBU1QgdmVyc2lvbiBvZiAnSGkgPCU9IGl0LnVzZXIgJT4nXHJcbiAqIGxldCB0ZW1wbGF0ZUFTVCA9IFsnSGkgJywgeyB2YWw6ICdpdC51c2VyJywgdDogJ2knIH1dXHJcbiAqIGNvbXBpbGVTY29wZSh0ZW1wbGF0ZUFTVCwgZXRhLmNvbmZpZylcclxuICogLy8gXCJ0Uis9J0hpICc7dFIrPUUuZShpdC51c2VyKTtcIlxyXG4gKiBgYGBcclxuICovXG5mdW5jdGlvbiBjb21waWxlU2NvcGUoYnVmZiwgY29uZmlnKSB7XG4gIGxldCBpID0gMDtcbiAgY29uc3QgYnVmZkxlbmd0aCA9IGJ1ZmYubGVuZ3RoO1xuICBsZXQgcmV0dXJuU3RyID0gXCJcIjtcbiAgZm9yIChpOyBpIDwgYnVmZkxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgY3VycmVudEJsb2NrID0gYnVmZltpXTtcbiAgICBpZiAodHlwZW9mIGN1cnJlbnRCbG9jayA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgY29uc3Qgc3RyID0gY3VycmVudEJsb2NrO1xuICAgICAgLy8gd2Uga25vdyBzdHJpbmcgZXhpc3RzXG4gICAgICByZXR1cm5TdHIgKz0gXCJ0Uis9J1wiICsgc3RyICsgXCInXFxuXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHR5cGUgPSBjdXJyZW50QmxvY2sudDsgLy8gfiwgcywgISwgPywgclxuICAgICAgbGV0IGNvbnRlbnQgPSBjdXJyZW50QmxvY2sudmFsIHx8IFwiXCI7XG4gICAgICBpZiAodHlwZSA9PT0gXCJyXCIpIHtcbiAgICAgICAgLy8gcmF3XG4gICAgICAgIGlmIChjb25maWcuZmlsdGVyKSB7XG4gICAgICAgICAgY29udGVudCA9IFwiRS5maWx0ZXIoXCIgKyBjb250ZW50ICsgXCIpXCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuU3RyICs9IFwidFIrPVwiICsgY29udGVudCArIFwiXFxuXCI7XG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT09IFwiaVwiKSB7XG4gICAgICAgIC8vIGludGVycG9sYXRlXG4gICAgICAgIGlmIChjb25maWcuZmlsdGVyKSB7XG4gICAgICAgICAgY29udGVudCA9IFwiRS5maWx0ZXIoXCIgKyBjb250ZW50ICsgXCIpXCI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbmZpZy5hdXRvRXNjYXBlKSB7XG4gICAgICAgICAgY29udGVudCA9IFwiRS5lKFwiICsgY29udGVudCArIFwiKVwiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVyblN0ciArPSBcInRSKz1cIiArIGNvbnRlbnQgKyBcIlxcblwiO1xuICAgICAgICAvLyByZWZlcmVuY2VcbiAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gXCJlXCIpIHtcbiAgICAgICAgLy8gZXhlY3V0ZVxuICAgICAgICByZXR1cm5TdHIgKz0gY29udGVudCArIFwiXFxuXCI7IC8vIHlvdSBuZWVkIGEgXFxuIGluIGNhc2UgeW91IGhhdmUgPCUgfSAlPlxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXR1cm5TdHI7XG59XG5cbi8qKlxyXG4gKiBIYW5kbGVzIHN0b3JhZ2UgYW5kIGFjY2Vzc2luZyBvZiB2YWx1ZXNcclxuICpcclxuICogSW4gdGhpcyBjYXNlLCB3ZSB1c2UgaXQgdG8gc3RvcmUgY29tcGlsZWQgdGVtcGxhdGUgZnVuY3Rpb25zXHJcbiAqIEluZGV4ZWQgYnkgdGhlaXIgYG5hbWVgIG9yIGBmaWxlbmFtZWBcclxuICovXG5jbGFzcyBDYWNoZXIge1xuICBjb25zdHJ1Y3RvcihjYWNoZSkge1xuICAgIHRoaXMuY2FjaGUgPSB2b2lkIDA7XG4gICAgdGhpcy5jYWNoZSA9IGNhY2hlO1xuICB9XG4gIGRlZmluZShrZXksIHZhbCkge1xuICAgIHRoaXMuY2FjaGVba2V5XSA9IHZhbDtcbiAgfVxuICBnZXQoa2V5KSB7XG4gICAgLy8gc3RyaW5nIHwgYXJyYXkuXG4gICAgLy8gVE9ETzogYWxsb3cgYXJyYXkgb2Yga2V5cyB0byBsb29rIGRvd25cbiAgICAvLyBUT0RPOiBjcmVhdGUgcGx1Z2luIHRvIGFsbG93IHJlZmVyZW5jaW5nIGhlbHBlcnMsIGZpbHRlcnMgd2l0aCBkb3Qgbm90YXRpb25cbiAgICByZXR1cm4gdGhpcy5jYWNoZVtrZXldO1xuICB9XG4gIHJlbW92ZShrZXkpIHtcbiAgICBkZWxldGUgdGhpcy5jYWNoZVtrZXldO1xuICB9XG4gIHJlc2V0KCkge1xuICAgIHRoaXMuY2FjaGUgPSB7fTtcbiAgfVxuICBsb2FkKGNhY2hlT2JqKSB7XG4gICAgY29weVByb3BzKHRoaXMuY2FjaGUsIGNhY2hlT2JqKTtcbiAgfVxufVxuXG4vKiBFTkQgVFlQRVMgKi9cbi8qKlxyXG4gKiBFdGEncyB0ZW1wbGF0ZSBzdG9yYWdlXHJcbiAqXHJcbiAqIFN0b3JlcyBwYXJ0aWFscyBhbmQgY2FjaGVkIHRlbXBsYXRlc1xyXG4gKi9cbmNvbnN0IHRlbXBsYXRlcyA9IG5ldyBDYWNoZXIoe30pO1xuXG4vKiBFTkQgVFlQRVMgKi9cbi8qKlxyXG4gKiBJbmNsdWRlIGEgdGVtcGxhdGUgYmFzZWQgb24gaXRzIG5hbWUgKG9yIGZpbGVwYXRoLCBpZiBpdCdzIGFscmVhZHkgYmVlbiBjYWNoZWQpLlxyXG4gKlxyXG4gKiBDYWxsZWQgbGlrZSBgaW5jbHVkZSh0ZW1wbGF0ZU5hbWVPclBhdGgsIGRhdGEpYFxyXG4gKi9cbmZ1bmN0aW9uIGluY2x1ZGVIZWxwZXIodGVtcGxhdGVOYW1lT3JQYXRoLCBkYXRhKSB7XG4gIGNvbnN0IHRlbXBsYXRlID0gdGhpcy50ZW1wbGF0ZXMuZ2V0KHRlbXBsYXRlTmFtZU9yUGF0aCk7XG4gIGlmICghdGVtcGxhdGUpIHtcbiAgICB0aHJvdyBFdGFFcnIoJ0NvdWxkIG5vdCBmZXRjaCB0ZW1wbGF0ZSBcIicgKyB0ZW1wbGF0ZU5hbWVPclBhdGggKyAnXCInKTtcbiAgfVxuICByZXR1cm4gdGVtcGxhdGUoZGF0YSwgdGhpcyk7XG59XG4vKiogRXRhJ3MgYmFzZSAoZ2xvYmFsKSBjb25maWd1cmF0aW9uICovXG5jb25zdCBjb25maWcgPSB7XG4gIGFzeW5jOiBmYWxzZSxcbiAgYXV0b0VzY2FwZTogdHJ1ZSxcbiAgYXV0b1RyaW06IFtmYWxzZSwgXCJubFwiXSxcbiAgY2FjaGU6IGZhbHNlLFxuICBlOiBYTUxFc2NhcGUsXG4gIGluY2x1ZGU6IGluY2x1ZGVIZWxwZXIsXG4gIHBhcnNlOiB7XG4gICAgZXhlYzogXCJcIixcbiAgICBpbnRlcnBvbGF0ZTogXCI9XCIsXG4gICAgcmF3OiBcIn5cIlxuICB9LFxuICBwbHVnaW5zOiBbXSxcbiAgcm1XaGl0ZXNwYWNlOiBmYWxzZSxcbiAgdGFnczogW1wiPCVcIiwgXCIlPlwiXSxcbiAgdGVtcGxhdGVzOiB0ZW1wbGF0ZXMsXG4gIHVzZVdpdGg6IGZhbHNlLFxuICB2YXJOYW1lOiBcIml0XCJcbn07XG4vKipcclxuICogVGFrZXMgb25lIG9yIHR3byBwYXJ0aWFsIChub3QgbmVjZXNzYXJpbHkgY29tcGxldGUpIGNvbmZpZ3VyYXRpb24gb2JqZWN0cywgbWVyZ2VzIHRoZW0gMSBsYXllciBkZWVwIGludG8gZXRhLmNvbmZpZywgYW5kIHJldHVybnMgdGhlIHJlc3VsdFxyXG4gKlxyXG4gKiBAcGFyYW0gb3ZlcnJpZGUgUGFydGlhbCBjb25maWd1cmF0aW9uIG9iamVjdFxyXG4gKiBAcGFyYW0gYmFzZUNvbmZpZyBQYXJ0aWFsIGNvbmZpZ3VyYXRpb24gb2JqZWN0IHRvIG1lcmdlIGJlZm9yZSBgb3ZlcnJpZGVgXHJcbiAqXHJcbiAqICoqRXhhbXBsZSoqXHJcbiAqXHJcbiAqIGBgYGpzXHJcbiAqIGxldCBjdXN0b21Db25maWcgPSBnZXRDb25maWcoe3RhZ3M6IFsnISMnLCAnIyEnXX0pXHJcbiAqIGBgYFxyXG4gKi9cbmZ1bmN0aW9uIGdldENvbmZpZyhvdmVycmlkZSwgYmFzZUNvbmZpZykge1xuICAvLyBUT0RPOiBydW4gbW9yZSB0ZXN0cyBvbiB0aGlzXG4gIGNvbnN0IHJlcyA9IHt9OyAvLyBMaW5rZWRcbiAgY29weVByb3BzKHJlcywgY29uZmlnKTsgLy8gQ3JlYXRlcyBkZWVwIGNsb25lIG9mIGV0YS5jb25maWcsIDEgbGF5ZXIgZGVlcFxuICBpZiAoYmFzZUNvbmZpZykge1xuICAgIGNvcHlQcm9wcyhyZXMsIGJhc2VDb25maWcpO1xuICB9XG4gIGlmIChvdmVycmlkZSkge1xuICAgIGNvcHlQcm9wcyhyZXMsIG92ZXJyaWRlKTtcbiAgfVxuICByZXR1cm4gcmVzO1xufVxuLyoqIFVwZGF0ZSBFdGEncyBiYXNlIGNvbmZpZyAqL1xuZnVuY3Rpb24gY29uZmlndXJlKG9wdGlvbnMpIHtcbiAgcmV0dXJuIGNvcHlQcm9wcyhjb25maWcsIG9wdGlvbnMpO1xufVxuXG4vKiBFTkQgVFlQRVMgKi9cbi8qKlxyXG4gKiBUYWtlcyBhIHRlbXBsYXRlIHN0cmluZyBhbmQgcmV0dXJucyBhIHRlbXBsYXRlIGZ1bmN0aW9uIHRoYXQgY2FuIGJlIGNhbGxlZCB3aXRoIChkYXRhLCBjb25maWcsIFtjYl0pXHJcbiAqXHJcbiAqIEBwYXJhbSBzdHIgLSBUaGUgdGVtcGxhdGUgc3RyaW5nXHJcbiAqIEBwYXJhbSBjb25maWcgLSBBIGN1c3RvbSBjb25maWd1cmF0aW9uIG9iamVjdCAob3B0aW9uYWwpXHJcbiAqXHJcbiAqICoqRXhhbXBsZSoqXHJcbiAqXHJcbiAqIGBgYGpzXHJcbiAqIGxldCBjb21waWxlZEZuID0gZXRhLmNvbXBpbGUoXCJIaSA8JT0gaXQudXNlciAlPlwiKVxyXG4gKiAvLyBmdW5jdGlvbiBhbm9ueW1vdXMoKVxyXG4gKiBsZXQgY29tcGlsZWRGblN0ciA9IGNvbXBpbGVkRm4udG9TdHJpbmcoKVxyXG4gKiAvLyBcImZ1bmN0aW9uIGFub255bW91cyhpdCxFLGNiXFxuKSB7XFxudmFyIHRSPScnLGluY2x1ZGU9RS5pbmNsdWRlLmJpbmQoRSksaW5jbHVkZUZpbGU9RS5pbmNsdWRlRmlsZS5iaW5kKEUpO3RSKz0nSGkgJzt0Uis9RS5lKGl0LnVzZXIpO2lmKGNiKXtjYihudWxsLHRSKX0gcmV0dXJuIHRSXFxufVwiXHJcbiAqIGBgYFxyXG4gKi9cbmZ1bmN0aW9uIGNvbXBpbGUoc3RyLCBjb25maWcpIHtcbiAgY29uc3Qgb3B0aW9ucyA9IGdldENvbmZpZyhjb25maWcgfHwge30pO1xuICAvKiBBU1lOQyBIQU5ETElORyAqL1xuICAvLyBUaGUgYmVsb3cgY29kZSBpcyBtb2RpZmllZCBmcm9tIG1kZS9lanMuIEFsbCBjcmVkaXQgc2hvdWxkIGdvIHRvIHRoZW0uXG4gIGNvbnN0IGN0b3IgPSBvcHRpb25zLmFzeW5jID8gZ2V0QXN5bmNGdW5jdGlvbkNvbnN0cnVjdG9yKCkgOiBGdW5jdGlvbjtcbiAgLyogRU5EIEFTWU5DIEhBTkRMSU5HICovXG4gIHRyeSB7XG4gICAgcmV0dXJuIG5ldyBjdG9yKG9wdGlvbnMudmFyTmFtZSwgXCJFXCIsXG4gICAgLy8gRXRhQ29uZmlnXG4gICAgXCJjYlwiLFxuICAgIC8vIG9wdGlvbmFsIGNhbGxiYWNrXG4gICAgY29tcGlsZVRvU3RyaW5nKHN0ciwgb3B0aW9ucykpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ldy1mdW5jXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBpZiAoZSBpbnN0YW5jZW9mIFN5bnRheEVycm9yKSB7XG4gICAgICB0aHJvdyBFdGFFcnIoXCJCYWQgdGVtcGxhdGUgc3ludGF4XFxuXFxuXCIgKyBlLm1lc3NhZ2UgKyBcIlxcblwiICsgQXJyYXkoZS5tZXNzYWdlLmxlbmd0aCArIDEpLmpvaW4oXCI9XCIpICsgXCJcXG5cIiArIGNvbXBpbGVUb1N0cmluZyhzdHIsIG9wdGlvbnMpICsgXCJcXG5cIiAvLyBUaGlzIHdpbGwgcHV0IGFuIGV4dHJhIG5ld2xpbmUgYmVmb3JlIHRoZSBjYWxsc3RhY2sgZm9yIGV4dHJhIHJlYWRhYmlsaXR5XG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBlO1xuICAgIH1cbiAgfVxufVxuXG5jb25zdCBfQk9NID0gL15cXHVGRUZGLztcbi8qIEVORCBUWVBFUyAqL1xuLyoqXHJcbiAqIEdldCB0aGUgcGF0aCB0byB0aGUgaW5jbHVkZWQgZmlsZSBmcm9tIHRoZSBwYXJlbnQgZmlsZSBwYXRoIGFuZCB0aGVcclxuICogc3BlY2lmaWVkIHBhdGguXHJcbiAqXHJcbiAqIElmIGBuYW1lYCBkb2VzIG5vdCBoYXZlIGFuIGV4dGVuc2lvbiwgaXQgd2lsbCBkZWZhdWx0IHRvIGAuZXRhYFxyXG4gKlxyXG4gKiBAcGFyYW0gbmFtZSBzcGVjaWZpZWQgcGF0aFxyXG4gKiBAcGFyYW0gcGFyZW50ZmlsZSBwYXJlbnQgZmlsZSBwYXRoXHJcbiAqIEBwYXJhbSBpc0RpcmVjdG9yeSB3aGV0aGVyIHBhcmVudGZpbGUgaXMgYSBkaXJlY3RvcnlcclxuICogQHJldHVybiBhYnNvbHV0ZSBwYXRoIHRvIHRlbXBsYXRlXHJcbiAqL1xuZnVuY3Rpb24gZ2V0V2hvbGVGaWxlUGF0aChuYW1lLCBwYXJlbnRmaWxlLCBpc0RpcmVjdG9yeSkge1xuICBjb25zdCBpbmNsdWRlUGF0aCA9IHBhdGgucmVzb2x2ZShpc0RpcmVjdG9yeSA/IHBhcmVudGZpbGUgOiBwYXRoLmRpcm5hbWUocGFyZW50ZmlsZSksXG4gIC8vIHJldHVybnMgZGlyZWN0b3J5IHRoZSBwYXJlbnQgZmlsZSBpcyBpblxuICBuYW1lIC8vIGZpbGVcbiAgKSArIChwYXRoLmV4dG5hbWUobmFtZSkgPyBcIlwiIDogXCIuZXRhXCIpO1xuICByZXR1cm4gaW5jbHVkZVBhdGg7XG59XG4vKipcclxuICogR2V0IHRoZSBhYnNvbHV0ZSBwYXRoIHRvIGFuIGluY2x1ZGVkIHRlbXBsYXRlXHJcbiAqXHJcbiAqIElmIHRoaXMgaXMgY2FsbGVkIHdpdGggYW4gYWJzb2x1dGUgcGF0aCAoZm9yIGV4YW1wbGUsIHN0YXJ0aW5nIHdpdGggJy8nIG9yICdDOlxcJylcclxuICogdGhlbiBFdGEgd2lsbCBhdHRlbXB0IHRvIHJlc29sdmUgdGhlIGFic29sdXRlIHBhdGggd2l0aGluIG9wdGlvbnMudmlld3MuIElmIGl0IGNhbm5vdCxcclxuICogRXRhIHdpbGwgZmFsbGJhY2sgdG8gb3B0aW9ucy5yb290IG9yICcvJ1xyXG4gKlxyXG4gKiBJZiB0aGlzIGlzIGNhbGxlZCB3aXRoIGEgcmVsYXRpdmUgcGF0aCwgRXRhIHdpbGw6XHJcbiAqIC0gTG9vayByZWxhdGl2ZSB0byB0aGUgY3VycmVudCB0ZW1wbGF0ZSAoaWYgdGhlIGN1cnJlbnQgdGVtcGxhdGUgaGFzIHRoZSBgZmlsZW5hbWVgIHByb3BlcnR5KVxyXG4gKiAtIExvb2sgaW5zaWRlIGVhY2ggZGlyZWN0b3J5IGluIG9wdGlvbnMudmlld3NcclxuICpcclxuICogTm90ZTogaWYgRXRhIGlzIHVuYWJsZSB0byBmaW5kIGEgdGVtcGxhdGUgdXNpbmcgcGF0aCBhbmQgb3B0aW9ucywgaXQgd2lsbCB0aHJvdyBhbiBlcnJvci5cclxuICpcclxuICogQHBhcmFtIHBhdGggICAgc3BlY2lmaWVkIHBhdGhcclxuICogQHBhcmFtIG9wdGlvbnMgY29tcGlsYXRpb24gb3B0aW9uc1xyXG4gKiBAcmV0dXJuIGFic29sdXRlIHBhdGggdG8gdGVtcGxhdGVcclxuICovXG5mdW5jdGlvbiBnZXRQYXRoKHBhdGgsIG9wdGlvbnMpIHtcbiAgbGV0IGluY2x1ZGVQYXRoID0gZmFsc2U7XG4gIGNvbnN0IHZpZXdzID0gb3B0aW9ucy52aWV3cztcbiAgY29uc3Qgc2VhcmNoZWRQYXRocyA9IFtdO1xuICAvLyBJZiB0aGVzZSBmb3VyIHZhbHVlcyBhcmUgdGhlIHNhbWUsXG4gIC8vIGdldFBhdGgoKSB3aWxsIHJldHVybiB0aGUgc2FtZSByZXN1bHQgZXZlcnkgdGltZS5cbiAgLy8gV2UgY2FuIGNhY2hlIHRoZSByZXN1bHQgdG8gYXZvaWQgZXhwZW5zaXZlXG4gIC8vIGZpbGUgb3BlcmF0aW9ucy5cbiAgY29uc3QgcGF0aE9wdGlvbnMgPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgZmlsZW5hbWU6IG9wdGlvbnMuZmlsZW5hbWUsXG4gICAgcGF0aDogcGF0aCxcbiAgICByb290OiBvcHRpb25zLnJvb3QsXG4gICAgdmlld3M6IG9wdGlvbnMudmlld3NcbiAgfSk7XG4gIGlmIChvcHRpb25zLmNhY2hlICYmIG9wdGlvbnMuZmlsZXBhdGhDYWNoZSAmJiBvcHRpb25zLmZpbGVwYXRoQ2FjaGVbcGF0aE9wdGlvbnNdKSB7XG4gICAgLy8gVXNlIHRoZSBjYWNoZWQgZmlsZXBhdGhcbiAgICByZXR1cm4gb3B0aW9ucy5maWxlcGF0aENhY2hlW3BhdGhPcHRpb25zXTtcbiAgfVxuICAvKiogQWRkIGEgZmlsZXBhdGggdG8gdGhlIGxpc3Qgb2YgcGF0aHMgd2UndmUgY2hlY2tlZCBmb3IgYSB0ZW1wbGF0ZSAqL1xuICBmdW5jdGlvbiBhZGRQYXRoVG9TZWFyY2hlZChwYXRoU2VhcmNoZWQpIHtcbiAgICBpZiAoIXNlYXJjaGVkUGF0aHMuaW5jbHVkZXMocGF0aFNlYXJjaGVkKSkge1xuICAgICAgc2VhcmNoZWRQYXRocy5wdXNoKHBhdGhTZWFyY2hlZCk7XG4gICAgfVxuICB9XG4gIC8qKlxyXG4gICAqIFRha2UgYSBmaWxlcGF0aCAobGlrZSAncGFydGlhbHMvbXlwYXJ0aWFsLmV0YScpLiBBdHRlbXB0IHRvIGZpbmQgdGhlIHRlbXBsYXRlIGZpbGUgaW5zaWRlIGB2aWV3c2A7XHJcbiAgICogcmV0dXJuIHRoZSByZXN1bHRpbmcgdGVtcGxhdGUgZmlsZSBwYXRoLCBvciBgZmFsc2VgIHRvIGluZGljYXRlIHRoYXQgdGhlIHRlbXBsYXRlIHdhcyBub3QgZm91bmQuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gdmlld3MgdGhlIGZpbGVwYXRoIHRoYXQgaG9sZHMgdGVtcGxhdGVzLCBvciBhbiBhcnJheSBvZiBmaWxlcGF0aHMgdGhhdCBob2xkIHRlbXBsYXRlc1xyXG4gICAqIEBwYXJhbSBwYXRoIHRoZSBwYXRoIHRvIHRoZSB0ZW1wbGF0ZVxyXG4gICAqL1xuICBmdW5jdGlvbiBzZWFyY2hWaWV3cyh2aWV3cywgcGF0aCkge1xuICAgIGxldCBmaWxlUGF0aDtcbiAgICAvLyBJZiB2aWV3cyBpcyBhbiBhcnJheSwgdGhlbiBsb29wIHRocm91Z2ggZWFjaCBkaXJlY3RvcnlcbiAgICAvLyBBbmQgYXR0ZW1wdCB0byBmaW5kIHRoZSB0ZW1wbGF0ZVxuICAgIGlmIChBcnJheS5pc0FycmF5KHZpZXdzKSAmJiB2aWV3cy5zb21lKGZ1bmN0aW9uICh2KSB7XG4gICAgICBmaWxlUGF0aCA9IGdldFdob2xlRmlsZVBhdGgocGF0aCwgdiwgdHJ1ZSk7XG4gICAgICBhZGRQYXRoVG9TZWFyY2hlZChmaWxlUGF0aCk7XG4gICAgICByZXR1cm4gZXhpc3RzU3luYyhmaWxlUGF0aCk7XG4gICAgfSkpIHtcbiAgICAgIC8vIElmIHRoZSBhYm92ZSByZXR1cm5lZCB0cnVlLCB3ZSBrbm93IHRoYXQgdGhlIGZpbGVQYXRoIHdhcyBqdXN0IHNldCB0byBhIHBhdGhcbiAgICAgIC8vIFRoYXQgZXhpc3RzIChBcnJheS5zb21lKCkgcmV0dXJucyBhcyBzb29uIGFzIGl0IGZpbmRzIGEgdmFsaWQgZWxlbWVudClcbiAgICAgIHJldHVybiBmaWxlUGF0aDtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiB2aWV3cyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgLy8gU2VhcmNoIGZvciB0aGUgZmlsZSBpZiB2aWV3cyBpcyBhIHNpbmdsZSBkaXJlY3RvcnlcbiAgICAgIGZpbGVQYXRoID0gZ2V0V2hvbGVGaWxlUGF0aChwYXRoLCB2aWV3cywgdHJ1ZSk7XG4gICAgICBhZGRQYXRoVG9TZWFyY2hlZChmaWxlUGF0aCk7XG4gICAgICBpZiAoZXhpc3RzU3luYyhmaWxlUGF0aCkpIHtcbiAgICAgICAgcmV0dXJuIGZpbGVQYXRoO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBVbmFibGUgdG8gZmluZCBhIGZpbGVcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgLy8gUGF0aCBzdGFydHMgd2l0aCAnLycsICdDOlxcJywgZXRjLlxuICBjb25zdCBtYXRjaCA9IC9eW0EtWmEtel0rOlxcXFx8XlxcLy8uZXhlYyhwYXRoKTtcbiAgLy8gQWJzb2x1dGUgcGF0aCwgbGlrZSAvcGFydGlhbHMvcGFydGlhbC5ldGFcbiAgaWYgKG1hdGNoICYmIG1hdGNoLmxlbmd0aCkge1xuICAgIC8vIFdlIGhhdmUgdG8gdHJpbSB0aGUgYmVnaW5uaW5nICcvJyBvZmYgdGhlIHBhdGgsIG9yIGVsc2VcbiAgICAvLyBwYXRoLnJlc29sdmUoZGlyLCBwYXRoKSB3aWxsIGFsd2F5cyByZXNvbHZlIHRvIGp1c3QgcGF0aFxuICAgIGNvbnN0IGZvcm1hdHRlZFBhdGggPSBwYXRoLnJlcGxhY2UoL15cXC8qLywgXCJcIik7XG4gICAgLy8gRmlyc3QsIHRyeSB0byByZXNvbHZlIHRoZSBwYXRoIHdpdGhpbiBvcHRpb25zLnZpZXdzXG4gICAgaW5jbHVkZVBhdGggPSBzZWFyY2hWaWV3cyh2aWV3cywgZm9ybWF0dGVkUGF0aCk7XG4gICAgaWYgKCFpbmNsdWRlUGF0aCkge1xuICAgICAgLy8gSWYgdGhhdCBmYWlscywgc2VhcmNoVmlld3Mgd2lsbCByZXR1cm4gZmFsc2UuIFRyeSB0byBmaW5kIHRoZSBwYXRoXG4gICAgICAvLyBpbnNpZGUgb3B0aW9ucy5yb290IChieSBkZWZhdWx0ICcvJywgdGhlIGJhc2Ugb2YgdGhlIGZpbGVzeXN0ZW0pXG4gICAgICBjb25zdCBwYXRoRnJvbVJvb3QgPSBnZXRXaG9sZUZpbGVQYXRoKGZvcm1hdHRlZFBhdGgsIG9wdGlvbnMucm9vdCB8fCBcIi9cIiwgdHJ1ZSk7XG4gICAgICBhZGRQYXRoVG9TZWFyY2hlZChwYXRoRnJvbVJvb3QpO1xuICAgICAgaW5jbHVkZVBhdGggPSBwYXRoRnJvbVJvb3Q7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIC8vIFJlbGF0aXZlIHBhdGhzXG4gICAgLy8gTG9vayByZWxhdGl2ZSB0byBhIHBhc3NlZCBmaWxlbmFtZSBmaXJzdFxuICAgIGlmIChvcHRpb25zLmZpbGVuYW1lKSB7XG4gICAgICBjb25zdCBmaWxlUGF0aCA9IGdldFdob2xlRmlsZVBhdGgocGF0aCwgb3B0aW9ucy5maWxlbmFtZSk7XG4gICAgICBhZGRQYXRoVG9TZWFyY2hlZChmaWxlUGF0aCk7XG4gICAgICBpZiAoZXhpc3RzU3luYyhmaWxlUGF0aCkpIHtcbiAgICAgICAgaW5jbHVkZVBhdGggPSBmaWxlUGF0aDtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gVGhlbiBsb29rIGZvciB0aGUgdGVtcGxhdGUgaW4gb3B0aW9ucy52aWV3c1xuICAgIGlmICghaW5jbHVkZVBhdGgpIHtcbiAgICAgIGluY2x1ZGVQYXRoID0gc2VhcmNoVmlld3Modmlld3MsIHBhdGgpO1xuICAgIH1cbiAgICBpZiAoIWluY2x1ZGVQYXRoKSB7XG4gICAgICB0aHJvdyBFdGFFcnIoJ0NvdWxkIG5vdCBmaW5kIHRoZSB0ZW1wbGF0ZSBcIicgKyBwYXRoICsgJ1wiLiBQYXRocyB0cmllZDogJyArIHNlYXJjaGVkUGF0aHMpO1xuICAgIH1cbiAgfVxuICAvLyBJZiBjYWNoaW5nIGFuZCBmaWxlcGF0aENhY2hlIGFyZSBlbmFibGVkLFxuICAvLyBjYWNoZSB0aGUgaW5wdXQgJiBvdXRwdXQgb2YgdGhpcyBmdW5jdGlvbi5cbiAgaWYgKG9wdGlvbnMuY2FjaGUgJiYgb3B0aW9ucy5maWxlcGF0aENhY2hlKSB7XG4gICAgb3B0aW9ucy5maWxlcGF0aENhY2hlW3BhdGhPcHRpb25zXSA9IGluY2x1ZGVQYXRoO1xuICB9XG4gIHJldHVybiBpbmNsdWRlUGF0aDtcbn1cbi8qKlxyXG4gKiBSZWFkcyBhIGZpbGUgc3luY2hyb25vdXNseVxyXG4gKi9cbmZ1bmN0aW9uIHJlYWRGaWxlKGZpbGVQYXRoKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIHJlYWRGaWxlU3luYyhmaWxlUGF0aCkudG9TdHJpbmcoKS5yZXBsYWNlKF9CT00sIFwiXCIpOyAvLyBUT0RPOiBpcyByZXBsYWNpbmcgQk9NJ3MgbmVjZXNzYXJ5P1xuICB9IGNhdGNoIHtcbiAgICB0aHJvdyBFdGFFcnIoXCJGYWlsZWQgdG8gcmVhZCB0ZW1wbGF0ZSBhdCAnXCIgKyBmaWxlUGF0aCArIFwiJ1wiKTtcbiAgfVxufVxuXG4vLyBleHByZXNzIGlzIHNldCBsaWtlOiBhcHAuZW5naW5lKCdodG1sJywgcmVxdWlyZSgnZXRhJykucmVuZGVyRmlsZSlcbi8qIEVORCBUWVBFUyAqL1xuLyoqXHJcbiAqIFJlYWRzIGEgdGVtcGxhdGUsIGNvbXBpbGVzIGl0IGludG8gYSBmdW5jdGlvbiwgY2FjaGVzIGl0IGlmIGNhY2hpbmcgaXNuJ3QgZGlzYWJsZWQsIHJldHVybnMgdGhlIGZ1bmN0aW9uXHJcbiAqXHJcbiAqIEBwYXJhbSBmaWxlUGF0aCBBYnNvbHV0ZSBwYXRoIHRvIHRlbXBsYXRlIGZpbGVcclxuICogQHBhcmFtIG9wdGlvbnMgRXRhIGNvbmZpZ3VyYXRpb24gb3ZlcnJpZGVzXHJcbiAqIEBwYXJhbSBub0NhY2hlIE9wdGlvbmFsbHksIG1ha2UgRXRhIG5vdCBjYWNoZSB0aGUgdGVtcGxhdGVcclxuICovXG5mdW5jdGlvbiBsb2FkRmlsZShmaWxlUGF0aCwgb3B0aW9ucywgbm9DYWNoZSkge1xuICBjb25zdCBjb25maWcgPSBnZXRDb25maWcob3B0aW9ucyk7XG4gIGNvbnN0IHRlbXBsYXRlID0gcmVhZEZpbGUoZmlsZVBhdGgpO1xuICB0cnkge1xuICAgIGNvbnN0IGNvbXBpbGVkVGVtcGxhdGUgPSBjb21waWxlKHRlbXBsYXRlLCBjb25maWcpO1xuICAgIGlmICghbm9DYWNoZSkge1xuICAgICAgY29uZmlnLnRlbXBsYXRlcy5kZWZpbmUoY29uZmlnLmZpbGVuYW1lLCBjb21waWxlZFRlbXBsYXRlKTtcbiAgICB9XG4gICAgcmV0dXJuIGNvbXBpbGVkVGVtcGxhdGU7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICB0aHJvdyBFdGFFcnIoXCJMb2FkaW5nIGZpbGU6IFwiICsgZmlsZVBhdGggKyBcIiBmYWlsZWQ6XFxuXFxuXCIgKyBlLm1lc3NhZ2UpO1xuICB9XG59XG4vKipcclxuICogR2V0IHRoZSB0ZW1wbGF0ZSBmcm9tIGEgc3RyaW5nIG9yIGEgZmlsZSwgZWl0aGVyIGNvbXBpbGVkIG9uLXRoZS1mbHkgb3JcclxuICogcmVhZCBmcm9tIGNhY2hlIChpZiBlbmFibGVkKSwgYW5kIGNhY2hlIHRoZSB0ZW1wbGF0ZSBpZiBuZWVkZWQuXHJcbiAqXHJcbiAqIElmIGBvcHRpb25zLmNhY2hlYCBpcyB0cnVlLCB0aGlzIGZ1bmN0aW9uIHJlYWRzIHRoZSBmaWxlIGZyb21cclxuICogYG9wdGlvbnMuZmlsZW5hbWVgIHNvIGl0IG11c3QgYmUgc2V0IHByaW9yIHRvIGNhbGxpbmcgdGhpcyBmdW5jdGlvbi5cclxuICpcclxuICogQHBhcmFtIG9wdGlvbnMgICBjb21waWxhdGlvbiBvcHRpb25zXHJcbiAqIEByZXR1cm4gRXRhIHRlbXBsYXRlIGZ1bmN0aW9uXHJcbiAqL1xuZnVuY3Rpb24gaGFuZGxlQ2FjaGUkMShvcHRpb25zKSB7XG4gIGNvbnN0IGZpbGVuYW1lID0gb3B0aW9ucy5maWxlbmFtZTtcbiAgaWYgKG9wdGlvbnMuY2FjaGUpIHtcbiAgICBjb25zdCBmdW5jID0gb3B0aW9ucy50ZW1wbGF0ZXMuZ2V0KGZpbGVuYW1lKTtcbiAgICBpZiAoZnVuYykge1xuICAgICAgcmV0dXJuIGZ1bmM7XG4gICAgfVxuICAgIHJldHVybiBsb2FkRmlsZShmaWxlbmFtZSwgb3B0aW9ucyk7XG4gIH1cbiAgLy8gQ2FjaGluZyBpcyBkaXNhYmxlZCwgc28gcGFzcyBub0NhY2hlID0gdHJ1ZVxuICByZXR1cm4gbG9hZEZpbGUoZmlsZW5hbWUsIG9wdGlvbnMsIHRydWUpO1xufVxuLyoqXHJcbiAqIFRyeSBjYWxsaW5nIGhhbmRsZUNhY2hlIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMgYW5kIGRhdGEgYW5kIGNhbGwgdGhlXHJcbiAqIGNhbGxiYWNrIHdpdGggdGhlIHJlc3VsdC4gSWYgYW4gZXJyb3Igb2NjdXJzLCBjYWxsIHRoZSBjYWxsYmFjayB3aXRoXHJcbiAqIHRoZSBlcnJvci4gVXNlZCBieSByZW5kZXJGaWxlKCkuXHJcbiAqXHJcbiAqIEBwYXJhbSBkYXRhIHRlbXBsYXRlIGRhdGFcclxuICogQHBhcmFtIG9wdGlvbnMgY29tcGlsYXRpb24gb3B0aW9uc1xyXG4gKiBAcGFyYW0gY2IgY2FsbGJhY2tcclxuICovXG5mdW5jdGlvbiB0cnlIYW5kbGVDYWNoZShkYXRhLCBvcHRpb25zLCBjYikge1xuICBpZiAoY2IpIHtcbiAgICB0cnkge1xuICAgICAgLy8gTm90ZTogaWYgdGhlcmUgaXMgYW4gZXJyb3Igd2hpbGUgcmVuZGVyaW5nIHRoZSB0ZW1wbGF0ZSxcbiAgICAgIC8vIEl0IHdpbGwgYnViYmxlIHVwIGFuZCBiZSBjYXVnaHQgaGVyZVxuICAgICAgY29uc3QgdGVtcGxhdGVGbiA9IGhhbmRsZUNhY2hlJDEob3B0aW9ucyk7XG4gICAgICB0ZW1wbGF0ZUZuKGRhdGEsIG9wdGlvbnMsIGNiKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiBjYihlcnIpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvLyBObyBjYWxsYmFjaywgdHJ5IHJldHVybmluZyBhIHByb21pc2VcbiAgICBpZiAodHlwZW9mIHByb21pc2VJbXBsID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHJldHVybiBuZXcgcHJvbWlzZUltcGwoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IHRlbXBsYXRlRm4gPSBoYW5kbGVDYWNoZSQxKG9wdGlvbnMpO1xuICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHRlbXBsYXRlRm4oZGF0YSwgb3B0aW9ucyk7XG4gICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IEV0YUVycihcIlBsZWFzZSBwcm92aWRlIGEgY2FsbGJhY2sgZnVuY3Rpb24sIHRoaXMgZW52IGRvZXNuJ3Qgc3VwcG9ydCBQcm9taXNlc1wiKTtcbiAgICB9XG4gIH1cbn1cbi8qKlxyXG4gKiBHZXQgdGhlIHRlbXBsYXRlIGZ1bmN0aW9uLlxyXG4gKlxyXG4gKiBJZiBgb3B0aW9ucy5jYWNoZWAgaXMgYHRydWVgLCB0aGVuIHRoZSB0ZW1wbGF0ZSBpcyBjYWNoZWQuXHJcbiAqXHJcbiAqIFRoaXMgcmV0dXJucyBhIHRlbXBsYXRlIGZ1bmN0aW9uIGFuZCB0aGUgY29uZmlnIG9iamVjdCB3aXRoIHdoaWNoIHRoYXQgdGVtcGxhdGUgZnVuY3Rpb24gc2hvdWxkIGJlIGNhbGxlZC5cclxuICpcclxuICogQHJlbWFya3NcclxuICpcclxuICogSXQncyBpbXBvcnRhbnQgdGhhdCB0aGlzIHJldHVybnMgYSBjb25maWcgb2JqZWN0IHdpdGggYGZpbGVuYW1lYCBzZXQuXHJcbiAqIE90aGVyd2lzZSwgdGhlIGluY2x1ZGVkIGZpbGUgd291bGQgbm90IGJlIGFibGUgdG8gdXNlIHJlbGF0aXZlIHBhdGhzXHJcbiAqXHJcbiAqIEBwYXJhbSBwYXRoIHBhdGggZm9yIHRoZSBzcGVjaWZpZWQgZmlsZSAoaWYgcmVsYXRpdmUsIHNwZWNpZnkgYHZpZXdzYCBvbiBgb3B0aW9uc2ApXHJcbiAqIEBwYXJhbSBvcHRpb25zIGNvbXBpbGF0aW9uIG9wdGlvbnNcclxuICogQHJldHVybiBbRXRhIHRlbXBsYXRlIGZ1bmN0aW9uLCBuZXcgY29uZmlnIG9iamVjdF1cclxuICovXG5mdW5jdGlvbiBpbmNsdWRlRmlsZShwYXRoLCBvcHRpb25zKSB7XG4gIC8vIHRoZSBiZWxvdyBjcmVhdGVzIGEgbmV3IG9wdGlvbnMgb2JqZWN0LCB1c2luZyB0aGUgcGFyZW50IGZpbGVwYXRoIG9mIHRoZSBvbGQgb3B0aW9ucyBvYmplY3QgYW5kIHRoZSBwYXRoXG4gIGNvbnN0IG5ld0ZpbGVPcHRpb25zID0gZ2V0Q29uZmlnKHtcbiAgICBmaWxlbmFtZTogZ2V0UGF0aChwYXRoLCBvcHRpb25zKVxuICB9LCBvcHRpb25zKTtcbiAgLy8gVE9ETzogbWFrZSBzdXJlIHByb3BlcnRpZXMgYXJlIGN1cnJlY3RseSBjb3BpZWQgb3ZlclxuICByZXR1cm4gW2hhbmRsZUNhY2hlJDEobmV3RmlsZU9wdGlvbnMpLCBuZXdGaWxlT3B0aW9uc107XG59XG5mdW5jdGlvbiByZW5kZXJGaWxlKGZpbGVuYW1lLCBkYXRhLCBjb25maWcsIGNiKSB7XG4gIC8qXHJcbiAgSGVyZSB3ZSBoYXZlIHNvbWUgZnVuY3Rpb24gb3ZlcmxvYWRpbmcuXHJcbiAgRXNzZW50aWFsbHksIHRoZSBmaXJzdCAyIGFyZ3VtZW50cyB0byByZW5kZXJGaWxlIHNob3VsZCBhbHdheXMgYmUgdGhlIGZpbGVuYW1lIGFuZCBkYXRhXHJcbiAgSG93ZXZlciwgd2l0aCBFeHByZXNzLCBjb25maWd1cmF0aW9uIG9wdGlvbnMgd2lsbCBiZSBwYXNzZWQgYWxvbmcgd2l0aCB0aGUgZGF0YS5cclxuICBUaHVzLCBFeHByZXNzIHdpbGwgY2FsbCByZW5kZXJGaWxlIHdpdGggKGZpbGVuYW1lLCBkYXRhQW5kT3B0aW9ucywgY2IpXHJcbiAgQW5kIHdlIHdhbnQgdG8gYWxzbyBtYWtlIChmaWxlbmFtZSwgZGF0YSwgb3B0aW9ucywgY2IpIGF2YWlsYWJsZVxyXG4gICovXG4gIGxldCByZW5kZXJDb25maWc7XG4gIGxldCBjYWxsYmFjaztcbiAgZGF0YSA9IGRhdGEgfHwge307IC8vIElmIGRhdGEgaXMgdW5kZWZpbmVkLCB3ZSBkb24ndCB3YW50IGFjY2Vzc2luZyBkYXRhLnNldHRpbmdzIHRvIGVycm9yXG4gIC8vIEZpcnN0LCBhc3NpZ24gb3VyIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGBjYWxsYmFja2BcbiAgLy8gV2UgY2FuIGxlYXZlIGl0IHVuZGVmaW5lZCBpZiBuZWl0aGVyIHBhcmFtZXRlciBpcyBhIGZ1bmN0aW9uO1xuICAvLyBDYWxsYmFja3MgYXJlIG9wdGlvbmFsXG4gIGlmICh0eXBlb2YgY2IgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIC8vIFRoZSA0dGggYXJndW1lbnQgaXMgdGhlIGNhbGxiYWNrXG4gICAgY2FsbGJhY2sgPSBjYjtcbiAgfSBlbHNlIGlmICh0eXBlb2YgY29uZmlnID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAvLyBUaGUgM3JkIGFyZyBpcyB0aGUgY2FsbGJhY2tcbiAgICBjYWxsYmFjayA9IGNvbmZpZztcbiAgfVxuICAvLyBJZiB0aGVyZSBpcyBhIGNvbmZpZyBvYmplY3QgcGFzc2VkIGluIGV4cGxpY2l0bHksIHVzZSBpdFxuICBpZiAodHlwZW9mIGNvbmZpZyA9PT0gXCJvYmplY3RcIikge1xuICAgIHJlbmRlckNvbmZpZyA9IGdldENvbmZpZyhjb25maWcgfHwge30pO1xuICB9IGVsc2Uge1xuICAgIC8vIE90aGVyd2lzZSwgZ2V0IHRoZSBjb25maWcgZnJvbSB0aGUgZGF0YSBvYmplY3RcbiAgICAvLyBBbmQgdGhlbiBncmFiIHNvbWUgY29uZmlnIG9wdGlvbnMgZnJvbSBkYXRhLnNldHRpbmdzXG4gICAgLy8gV2hpY2ggaXMgd2hlcmUgRXhwcmVzcyBzb21ldGltZXMgc3RvcmVzIHRoZW1cbiAgICByZW5kZXJDb25maWcgPSBnZXRDb25maWcoZGF0YSk7XG4gICAgaWYgKGRhdGEuc2V0dGluZ3MpIHtcbiAgICAgIC8vIFB1bGwgYSBmZXcgdGhpbmdzIGZyb20ga25vd24gbG9jYXRpb25zXG4gICAgICBpZiAoZGF0YS5zZXR0aW5ncy52aWV3cykge1xuICAgICAgICByZW5kZXJDb25maWcudmlld3MgPSBkYXRhLnNldHRpbmdzLnZpZXdzO1xuICAgICAgfVxuICAgICAgaWYgKGRhdGEuc2V0dGluZ3NbXCJ2aWV3IGNhY2hlXCJdKSB7XG4gICAgICAgIHJlbmRlckNvbmZpZy5jYWNoZSA9IHRydWU7XG4gICAgICB9XG4gICAgICAvLyBVbmRvY3VtZW50ZWQgYWZ0ZXIgRXhwcmVzcyAyLCBidXQgc3RpbGwgdXNhYmxlLCBlc3AuIGZvclxuICAgICAgLy8gaXRlbXMgdGhhdCBhcmUgdW5zYWZlIHRvIGJlIHBhc3NlZCBhbG9uZyB3aXRoIGRhdGEsIGxpa2UgYHJvb3RgXG4gICAgICBjb25zdCB2aWV3T3B0cyA9IGRhdGEuc2V0dGluZ3NbXCJ2aWV3IG9wdGlvbnNcIl07XG4gICAgICBpZiAodmlld09wdHMpIHtcbiAgICAgICAgY29weVByb3BzKHJlbmRlckNvbmZpZywgdmlld09wdHMpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICAvLyBTZXQgdGhlIGZpbGVuYW1lIG9wdGlvbiBvbiB0aGUgdGVtcGxhdGVcbiAgLy8gVGhpcyB3aWxsIGZpcnN0IHRyeSB0byByZXNvbHZlIHRoZSBmaWxlIHBhdGggKHNlZSBnZXRQYXRoIGZvciBkZXRhaWxzKVxuICByZW5kZXJDb25maWcuZmlsZW5hbWUgPSBnZXRQYXRoKGZpbGVuYW1lLCByZW5kZXJDb25maWcpO1xuICByZXR1cm4gdHJ5SGFuZGxlQ2FjaGUoZGF0YSwgcmVuZGVyQ29uZmlnLCBjYWxsYmFjayk7XG59XG5mdW5jdGlvbiByZW5kZXJGaWxlQXN5bmMoZmlsZW5hbWUsIGRhdGEsIGNvbmZpZywgY2IpIHtcbiAgcmV0dXJuIHJlbmRlckZpbGUoZmlsZW5hbWUsIHR5cGVvZiBjb25maWcgPT09IFwiZnVuY3Rpb25cIiA/IHtcbiAgICAuLi5kYXRhLFxuICAgIGFzeW5jOiB0cnVlXG4gIH0gOiBkYXRhLCB0eXBlb2YgY29uZmlnID09PSBcIm9iamVjdFwiID8ge1xuICAgIC4uLmNvbmZpZyxcbiAgICBhc3luYzogdHJ1ZVxuICB9IDogY29uZmlnLCBjYik7XG59XG5cbi8qIEVORCBUWVBFUyAqL1xuLyoqXHJcbiAqIENhbGxlZCB3aXRoIGBpbmNsdWRlRmlsZShwYXRoLCBkYXRhKWBcclxuICovXG5mdW5jdGlvbiBpbmNsdWRlRmlsZUhlbHBlcihwYXRoLCBkYXRhKSB7XG4gIGNvbnN0IHRlbXBsYXRlQW5kQ29uZmlnID0gaW5jbHVkZUZpbGUocGF0aCwgdGhpcyk7XG4gIHJldHVybiB0ZW1wbGF0ZUFuZENvbmZpZ1swXShkYXRhLCB0ZW1wbGF0ZUFuZENvbmZpZ1sxXSk7XG59XG5cbi8qIEVORCBUWVBFUyAqL1xuZnVuY3Rpb24gaGFuZGxlQ2FjaGUodGVtcGxhdGUsIG9wdGlvbnMpIHtcbiAgaWYgKG9wdGlvbnMuY2FjaGUgJiYgb3B0aW9ucy5uYW1lICYmIG9wdGlvbnMudGVtcGxhdGVzLmdldChvcHRpb25zLm5hbWUpKSB7XG4gICAgcmV0dXJuIG9wdGlvbnMudGVtcGxhdGVzLmdldChvcHRpb25zLm5hbWUpO1xuICB9XG4gIGNvbnN0IHRlbXBsYXRlRnVuYyA9IHR5cGVvZiB0ZW1wbGF0ZSA9PT0gXCJmdW5jdGlvblwiID8gdGVtcGxhdGUgOiBjb21waWxlKHRlbXBsYXRlLCBvcHRpb25zKTtcbiAgLy8gTm90ZSB0aGF0IHdlIGRvbid0IGhhdmUgdG8gY2hlY2sgaWYgaXQgYWxyZWFkeSBleGlzdHMgaW4gdGhlIGNhY2hlO1xuICAvLyBpdCB3b3VsZCBoYXZlIHJldHVybmVkIGVhcmxpZXIgaWYgaXQgaGFkXG4gIGlmIChvcHRpb25zLmNhY2hlICYmIG9wdGlvbnMubmFtZSkge1xuICAgIG9wdGlvbnMudGVtcGxhdGVzLmRlZmluZShvcHRpb25zLm5hbWUsIHRlbXBsYXRlRnVuYyk7XG4gIH1cbiAgcmV0dXJuIHRlbXBsYXRlRnVuYztcbn1cbmZ1bmN0aW9uIHJlbmRlcih0ZW1wbGF0ZSwgZGF0YSwgY29uZmlnLCBjYikge1xuICBjb25zdCBvcHRpb25zID0gZ2V0Q29uZmlnKGNvbmZpZyB8fCB7fSk7XG4gIGlmIChvcHRpb25zLmFzeW5jKSB7XG4gICAgaWYgKGNiKSB7XG4gICAgICAvLyBJZiB1c2VyIHBhc3NlcyBjYWxsYmFja1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gTm90ZTogaWYgdGhlcmUgaXMgYW4gZXJyb3Igd2hpbGUgcmVuZGVyaW5nIHRoZSB0ZW1wbGF0ZSxcbiAgICAgICAgLy8gSXQgd2lsbCBidWJibGUgdXAgYW5kIGJlIGNhdWdodCBoZXJlXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlRm4gPSBoYW5kbGVDYWNoZSh0ZW1wbGF0ZSwgb3B0aW9ucyk7XG4gICAgICAgIHRlbXBsYXRlRm4oZGF0YSwgb3B0aW9ucywgY2IpO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHJldHVybiBjYihlcnIpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBObyBjYWxsYmFjaywgdHJ5IHJldHVybmluZyBhIHByb21pc2VcbiAgICAgIGlmICh0eXBlb2YgcHJvbWlzZUltcGwgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICByZXR1cm4gbmV3IHByb21pc2VJbXBsKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmVzb2x2ZShoYW5kbGVDYWNoZSh0ZW1wbGF0ZSwgb3B0aW9ucykoZGF0YSwgb3B0aW9ucykpO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IEV0YUVycihcIlBsZWFzZSBwcm92aWRlIGEgY2FsbGJhY2sgZnVuY3Rpb24sIHRoaXMgZW52IGRvZXNuJ3Qgc3VwcG9ydCBQcm9taXNlc1wiKTtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGhhbmRsZUNhY2hlKHRlbXBsYXRlLCBvcHRpb25zKShkYXRhLCBvcHRpb25zKTtcbiAgfVxufVxuZnVuY3Rpb24gcmVuZGVyQXN5bmModGVtcGxhdGUsIGRhdGEsIGNvbmZpZywgY2IpIHtcbiAgLy8gVXNpbmcgT2JqZWN0LmFzc2lnbiB0byBsb3dlciBidW5kbGUgc2l6ZSwgdXNpbmcgc3ByZWFkIG9wZXJhdG9yIG1ha2VzIGl0IGxhcmdlciBiZWNhdXNlIG9mIHR5cGVzY3JpcHQgaW5qZWN0ZWQgcG9seWZpbGxzXG4gIHJldHVybiByZW5kZXIodGVtcGxhdGUsIGRhdGEsIE9iamVjdC5hc3NpZ24oe30sIGNvbmZpZywge1xuICAgIGFzeW5jOiB0cnVlXG4gIH0pLCBjYik7XG59XG5cbi8vIEBkZW5vaWZ5LWlnbm9yZVxuY29uZmlnLmluY2x1ZGVGaWxlID0gaW5jbHVkZUZpbGVIZWxwZXI7XG5jb25maWcuZmlsZXBhdGhDYWNoZSA9IHt9O1xuXG5leHBvcnQgeyByZW5kZXJGaWxlIGFzIF9fZXhwcmVzcywgY29tcGlsZSwgY29tcGlsZVRvU3RyaW5nLCBjb25maWcsIGNvbmZpZ3VyZSwgY29uZmlnIGFzIGRlZmF1bHRDb25maWcsIGdldENvbmZpZywgbG9hZEZpbGUsIHBhcnNlLCByZW5kZXIsIHJlbmRlckFzeW5jLCByZW5kZXJGaWxlLCByZW5kZXJGaWxlQXN5bmMsIHRlbXBsYXRlcyB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZXRhLm1vZHVsZS5tanMubWFwXG4iLCJpbXBvcnQge1xuICAgIEV4cGFuZGVyUXVlcnksXG4gICAgZ2V0QWxsRXhwYW5kZXJzUXVlcnksXG4gICAgZ2V0Q2xvc2VzdFF1ZXJ5LFxuICAgIGdldExhc3RMaW5lVG9SZXBsYWNlXG59IGZyb20gJ3NyYy9oZWxwZXJzL2hlbHBlcnMnO1xuaW1wb3J0IHtcbiAgICBBcHAsIEVkaXRvcixcbiAgICBGaWxlVmlldyxcbiAgICBNYXJrZG93blZpZXcsXG4gICAgUGx1Z2luLFxuICAgIFBsdWdpbk1hbmlmZXN0LFxuICAgIFBsdWdpblNldHRpbmdUYWIsXG4gICAgU2V0dGluZyxcbiAgICBURmlsZSwgVmlldywgV29ya3NwYWNlTGVhZlxufSBmcm9tICdvYnNpZGlhbic7XG5pbXBvcnQgc2VxdWVuY2VzLCB7U2VxdWVuY2VzfSBmcm9tIFwiLi9zZXF1ZW5jZXMvc2VxdWVuY2VzXCI7XG5pbXBvcnQge3NwbGl0QnlMaW5lc30gZnJvbSBcIi4vaGVscGVycy9zdHJpbmdcIjtcbmltcG9ydCB7ZXh0cmFjdEZpbGVzRnJvbVNlYXJjaFJlc3VsdHN9IGZyb20gXCIuL2hlbHBlcnMvc2VhcmNoLXJlc3VsdHNcIjtcbmltcG9ydCB7cmVuZGVyfSBmcm9tIFwiZXRhXCI7XG5pbXBvcnQge2dldEZpbGVJbmZvfSBmcm9tIFwiLi9oZWxwZXJzL3RmaWxlXCI7XG5cbmludGVyZmFjZSBQbHVnaW5TZXR0aW5ncyB7XG4gICAgZGVsYXk6IG51bWJlclxuICAgIGxpbmVFbmRpbmc6IHN0cmluZ1xuICAgIGRlZmF1bHRUZW1wbGF0ZTogc3RyaW5nXG4gICAgZXhjbHVkZUN1cnJlbnQ6IGJvb2xlYW5cbiAgICBhdXRvRXhwYW5kOiBib29sZWFuXG4gICAgcHJlZml4ZXM6IHtcbiAgICAgICAgaGVhZGVyOiBzdHJpbmdcbiAgICAgICAgZm9vdGVyOiBzdHJpbmdcbiAgICB9XG59XG5cbmludGVyZmFjZSBTZWFyY2hMZWFmIGV4dGVuZHMgV29ya3NwYWNlTGVhZiB7XG4gICAgdmlldzogVmlldyAmIHtcbiAgICAgICAgc2VhcmNoQ29tcG9uZW50OiB7XG4gICAgICAgICAgICBnZXRWYWx1ZTogKCkgPT4gc3RyaW5nXG4gICAgICAgICAgICBzZXRWYWx1ZTogKHM6IHN0cmluZykgPT4gdm9pZFxuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEZpbGVQYXJhbWV0ZXJzIHtcbiAgICBiYXNlbmFtZTogc3RyaW5nXG4gICAgY29udGVudDogc3RyaW5nXG4gICAgZXh0ZW5zaW9uOiBzdHJpbmdcbiAgICBoZWFkaW5nczogQXJyYXk8YW55PlxuICAgIGxpbms6IHN0cmluZ1xuICAgIG5hbWU6IHN0cmluZ1xuICAgIHBhdGg6IHN0cmluZ1xuICAgIHNlY3Rpb25zOiBBcnJheTxhbnk+XG4gICAgc3RhdDoge31cbiAgICBmcm9udG1hdHRlcjogeyBbazogc3RyaW5nXTogYW55IH1cbiAgICBsaW5rczogQXJyYXk8YW55PlxuICAgIGxpc3RJdGVtczogQXJyYXk8YW55PlxufVxuXG50eXBlIE51bWJlclR1cGxlID0gW251bWJlciwgbnVtYmVyXVxuXG5leHBvcnQgaW50ZXJmYWNlIFNlYXJjaERldGFpbHMge1xuICAgIGFwcDogQXBwXG4gICAgY2hpbGRyZW46IGFueVtdXG4gICAgY2hpbGRyZW5FbDogSFRNTEVsZW1lbnRcbiAgICBjb2xsYXBzZUVsOiBIVE1MRWxlbWVudFxuICAgIGNvbGxhcHNlZDogYm9vbGVhblxuICAgIGNvbGxhcHNpYmxlOiBib29sZWFuXG4gICAgY29udGFpbmVyRWw6IEhUTUxFbGVtZW50XG4gICAgY29udGVudDogc3RyaW5nXG4gICAgZG9tOiBhbnlcbiAgICBlbDogSFRNTEVsZW1lbnRcbiAgICBleHRyYUNvbnRleHQ6ICgpID0+IGJvb2xlYW5cbiAgICBmaWxlOiBURmlsZVxuICAgIGluZm86IGFueVxuICAgIG9uTWF0Y2hSZW5kZXI6IGFueVxuICAgIHB1c2hlckVsOiBIVE1MRWxlbWVudFxuICAgIHJlc3VsdDoge1xuICAgICAgICBmaWxlbmFtZT86IE51bWJlclR1cGxlW11cbiAgICAgICAgY29udGVudD86IE51bWJlclR1cGxlW11cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRleHRFeHBhbmRlciBleHRlbmRzIFBsdWdpbiB7XG4gICAgY206IEVkaXRvclxuXG4gICAgY29uZmlnOiBQbHVnaW5TZXR0aW5ncyA9IHtcbiAgICAgICAgYXV0b0V4cGFuZDogZmFsc2UsXG4gICAgICAgIGRlZmF1bHRUZW1wbGF0ZTogJy0gJGxpbmsnLFxuICAgICAgICBkZWxheTogMzAwLFxuICAgICAgICBleGNsdWRlQ3VycmVudDogdHJ1ZSxcbiAgICAgICAgbGluZUVuZGluZzogJzwtLT4nLFxuICAgICAgICBwcmVmaXhlczoge1xuICAgICAgICAgICAgaGVhZGVyOiAnXicsXG4gICAgICAgICAgICBmb290ZXI6ICc+J1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2VxczogU2VxdWVuY2VzW10gPSBzZXF1ZW5jZXNcblxuICAgIGxlZnRQYW5lbEluZm86IHtcbiAgICAgICAgY29sbGFwc2VkOiBib29sZWFuXG4gICAgICAgIHRhYjogbnVtYmVyXG4gICAgICAgIHRleHQ6IHN0cmluZ1xuICAgIH0gPSB7XG4gICAgICAgIGNvbGxhcHNlZDogZmFsc2UsXG4gICAgICAgIHRhYjogMCxcbiAgICAgICAgdGV4dDogJydcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgcGx1Z2luOiBQbHVnaW5NYW5pZmVzdCkge1xuICAgICAgICBzdXBlcihhcHAsIHBsdWdpbik7XG5cbiAgICAgICAgdGhpcy5zZWFyY2ggPSB0aGlzLnNlYXJjaC5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5hdXRvRXhwYW5kID0gdGhpcy5hdXRvRXhwYW5kLmJpbmQodGhpcyk7XG4gICAgfVxuXG4gICAgYXN5bmMgYXV0b0V4cGFuZCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmNvbmZpZy5hdXRvRXhwYW5kKSB7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGFjdGl2ZUxlYWYgPSB0aGlzLmFwcC53b3Jrc3BhY2UuYWN0aXZlTGVhZlxuICAgICAgICBpZiAoIWFjdGl2ZUxlYWYpIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgYWN0aXZlVmlldyA9IGFjdGl2ZUxlYWYudmlld1xuICAgICAgICBjb25zdCBpc0FsbG93ZWRWaWV3ID0gYWN0aXZlVmlldyBpbnN0YW5jZW9mIE1hcmtkb3duVmlld1xuICAgICAgICBpZiAoIWlzQWxsb3dlZFZpZXcpIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgYXdhaXQgdGhpcy5pbml0KHRydWUpXG4gICAgfVxuXG4gICAgYXN5bmMgb25sb2FkKCkge1xuICAgICAgICB0aGlzLmFkZFNldHRpbmdUYWIobmV3IFNldHRpbmdUYWIodGhpcy5hcHAsIHRoaXMpKTtcblxuICAgICAgICB0aGlzLnJlZ2lzdGVyTWFya2Rvd25Db2RlQmxvY2tQcm9jZXNzb3IoJ2V4cGFuZGVyJywgKHNvdXJjZSwgZWwsIGN0eCkgPT4ge1xuICAgICAgICAgICAgZWxcbiAgICAgICAgICAgICAgICAuY3JlYXRlRGl2KClcbiAgICAgICAgICAgICAgICAuY3JlYXRlRWwoJ2J1dHRvbicsIHt0ZXh0OiAnUnVuIGV4cGFuZCBxdWVyeSd9KVxuICAgICAgICAgICAgICAgIC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuaW5pdC5iaW5kKHRoaXMsIGZhbHNlLCBjdHguZ2V0U2VjdGlvbkluZm8oZWwpLmxpbmVTdGFydCkpXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuYWRkQ29tbWFuZCh7XG4gICAgICAgICAgICBpZDogJ2VkaXRvci1leHBhbmQnLFxuICAgICAgICAgICAgbmFtZTogJ2V4cGFuZCcsXG4gICAgICAgICAgICBjYWxsYmFjazogdGhpcy5pbml0LFxuICAgICAgICAgICAgaG90a2V5czogW11cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5hZGRDb21tYW5kKHtcbiAgICAgICAgICAgIGlkOiAnZWRpdG9yLWV4cGFuZC1hbGwnLFxuICAgICAgICAgICAgbmFtZTogJ2V4cGFuZCBhbGwnLFxuICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHRoaXMuaW5pdCh0cnVlKSxcbiAgICAgICAgICAgIGhvdGtleXM6IFtdXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS5vbignZmlsZS1vcGVuJywgdGhpcy5hdXRvRXhwYW5kKTtcblxuICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgdGhpcy5sb2FkRGF0YSgpIGFzIFBsdWdpblNldHRpbmdzXG4gICAgICAgIGlmIChkYXRhKSB7XG4gICAgICAgICAgICB0aGlzLmNvbmZpZyA9IHtcbiAgICAgICAgICAgICAgICAuLi50aGlzLmNvbmZpZyxcbiAgICAgICAgICAgICAgICAuLi5kYXRhXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbnVubG9hZCgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3VubG9hZGluZyBwbHVnaW4nKTtcbiAgICAgICAgdGhpcy5hcHAud29ya3NwYWNlLm9mZignZmlsZS1vcGVuJywgdGhpcy5hdXRvRXhwYW5kKTtcbiAgICB9XG5cbiAgICBhc3luYyBzYXZlU2V0dGluZ3MoKSB7XG4gICAgICAgIGF3YWl0IHRoaXMuc2F2ZURhdGEodGhpcy5jb25maWcpXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBpbml0KHByb2NlZWRBbGxRdWVyaWVzT25QYWdlID0gZmFsc2UsIGxpbmVUb1N0YXJ0PzogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRWaWV3ID0gdGhpcy5hcHAud29ya3NwYWNlLmFjdGl2ZUxlYWYudmlld1xuXG4gICAgICAgIC8vIElzIG9uIGVkaXRhYmxlIHZpZXdcbiAgICAgICAgaWYgKCEoY3VycmVudFZpZXcgaW5zdGFuY2VvZiBNYXJrZG93blZpZXcpKSB7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNtRG9jOiBFZGl0b3IgPSB0aGlzLmNtID0gY3VycmVudFZpZXcuZWRpdG9yXG5cbiAgICAgICAgY29uc3QgY3VyTnVtID0gbGluZVRvU3RhcnQgfHwgY21Eb2MuZ2V0Q3Vyc29yKCkubGluZVxuICAgICAgICBjb25zdCBjb250ZW50ID0gY21Eb2MuZ2V0VmFsdWUoKVxuXG4gICAgICAgIGlmIChsaW5lVG9TdGFydCkge1xuICAgICAgICAgICAgY21Eb2Muc2V0Q3Vyc29yKGxpbmVUb1N0YXJ0ID8gbGluZVRvU3RhcnQgLSAxIDogMClcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGZvcm1hdHRlZCA9IHNwbGl0QnlMaW5lcyhjb250ZW50KVxuICAgICAgICBjb25zdCBmaW5kUXVlcmllcyA9IGdldEFsbEV4cGFuZGVyc1F1ZXJ5KGZvcm1hdHRlZClcbiAgICAgICAgY29uc3QgY2xvc2VzdFF1ZXJ5ID0gZ2V0Q2xvc2VzdFF1ZXJ5KGZpbmRRdWVyaWVzLCBjdXJOdW0pXG5cbiAgICAgICAgaWYgKHByb2NlZWRBbGxRdWVyaWVzT25QYWdlKSB7XG4gICAgICAgICAgICBhd2FpdCBmaW5kUXVlcmllcy5yZWR1Y2UoKHByb21pc2UsIHF1ZXJ5LCBpKSA9PlxuICAgICAgICAgICAgICAgIHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5ld0NvbnRlbnQgPSBzcGxpdEJ5TGluZXMoY21Eb2MuZ2V0VmFsdWUoKSlcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdXBkYXRlZFF1ZXJpZXMgPSBnZXRBbGxFeHBhbmRlcnNRdWVyeShuZXdDb250ZW50KVxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnJ1bkV4cGFuZGVyQ29kZUJsb2NrKHVwZGF0ZWRRdWVyaWVzW2ldLCBuZXdDb250ZW50LCBjdXJyZW50VmlldylcbiAgICAgICAgICAgICAgICB9KSwgUHJvbWlzZS5yZXNvbHZlKClcbiAgICAgICAgICAgIClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucnVuRXhwYW5kZXJDb2RlQmxvY2soY2xvc2VzdFF1ZXJ5LCBmb3JtYXR0ZWQsIGN1cnJlbnRWaWV3KVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBydW5FeHBhbmRlckNvZGVCbG9jayhxdWVyeTogRXhwYW5kZXJRdWVyeSwgY29udGVudDogc3RyaW5nW10sIHZpZXc6IE1hcmtkb3duVmlldykge1xuICAgICAgICBjb25zdCB7bGluZUVuZGluZywgcHJlZml4ZXN9ID0gdGhpcy5jb25maWdcblxuICAgICAgICBpZiAoIXF1ZXJ5KSB7XG4gICAgICAgICAgICBuZXcgTm90aWZpY2F0aW9uKCdFeHBhbmQgcXVlcnkgbm90IGZvdW5kJylcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jbGVhck9sZFJlc3VsdHNJbkZpbGUoY29udGVudCwgcXVlcnksIGxpbmVFbmRpbmcpO1xuXG4gICAgICAgIGNvbnN0IG5ld0NvbnRlbnQgPSBzcGxpdEJ5TGluZXModGhpcy5jbS5nZXRWYWx1ZSgpKTtcblxuICAgICAgICB0aGlzLnNhdmVMZWZ0UGFuZWxTdGF0ZSgpO1xuXG4gICAgICAgIGlmIChxdWVyeS5xdWVyeSAhPT0gJycpIHtcbiAgICAgICAgICAgIHRoaXMuc2VhcmNoKHF1ZXJ5LnF1ZXJ5KVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhd2FpdCB0aGlzLnJ1blRlbXBsYXRlUHJvY2Vzc2luZyhxdWVyeSwgZ2V0TGFzdExpbmVUb1JlcGxhY2UobmV3Q29udGVudCwgcXVlcnksIHRoaXMuY29uZmlnLmxpbmVFbmRpbmcpLCBwcmVmaXhlcywgdmlldylcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIHJ1blRlbXBsYXRlUHJvY2Vzc2luZyhxdWVyeTogRXhwYW5kZXJRdWVyeSwgbGFzdExpbmU6IG51bWJlciwgcHJlZml4ZXM6IFBsdWdpblNldHRpbmdzW1wicHJlZml4ZXNcIl0sIGN1cnJlbnRWaWV3OiBNYXJrZG93blZpZXcpIHtcbiAgICAgICAgbGV0IGN1cnJlbnRGaWxlTmFtZSA9ICcnXG5cbiAgICAgICAgY29uc3QgdGVtcGxhdGVDb250ZW50ID0gcXVlcnkudGVtcGxhdGUuc3BsaXQoJ1xcbicpXG5cbiAgICAgICAgY29uc3Qge2hlYWRpbmcsIGZvb3RlciwgcmVwZWF0YWJsZUNvbnRlbnR9ID0gdGhpcy5wYXJzZVRlbXBsYXRlKHByZWZpeGVzLCB0ZW1wbGF0ZUNvbnRlbnQpO1xuXG4gICAgICAgIGlmIChjdXJyZW50VmlldyBpbnN0YW5jZW9mIEZpbGVWaWV3KSB7XG4gICAgICAgICAgICBjdXJyZW50RmlsZU5hbWUgPSBjdXJyZW50Vmlldy5maWxlLmJhc2VuYW1lXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzZWFyY2hSZXN1bHRzID0gYXdhaXQgdGhpcy5nZXRGb3VuZEFmdGVyRGVsYXkocXVlcnkucXVlcnkgPT09ICcnKTtcbiAgICAgICAgY29uc3QgZmlsZXMgPSBleHRyYWN0RmlsZXNGcm9tU2VhcmNoUmVzdWx0cyhzZWFyY2hSZXN1bHRzLCBjdXJyZW50RmlsZU5hbWUsIHRoaXMuY29uZmlnLmV4Y2x1ZGVDdXJyZW50KTtcblxuICAgICAgICB0aGlzLnJlc3RvcmVMZWZ0UGFuZWxTdGF0ZSgpO1xuXG4gICAgICAgIGN1cnJlbnRWaWV3LmVkaXRvci5mb2N1cygpO1xuXG4gICAgICAgIGNvbnN0IGN1cnJlbnRGaWxlSW5mbzoge30gPSAoY3VycmVudFZpZXcgaW5zdGFuY2VvZiBGaWxlVmlldylcbiAgICAgICAgICAgID8gYXdhaXQgZ2V0RmlsZUluZm8odGhpcywgY3VycmVudFZpZXcuZmlsZSlcbiAgICAgICAgICAgIDoge31cbiAgICAgICAgY29uc3QgZmlsZXNJbmZvID0gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICBmaWxlcy5tYXAoZmlsZSA9PiBnZXRGaWxlSW5mbyh0aGlzLCBmaWxlKSlcbiAgICAgICAgKVxuXG4gICAgICAgIGxldCBjaGFuZ2VkO1xuXG4gICAgICAgIGlmIChxdWVyeS50ZW1wbGF0ZS5jb250YWlucyhcIjwlXCIpKSB7XG4gICAgICAgICAgICBjb25zdCB0ZW1wbGF0ZVRvUmVuZGVyID0gcmVwZWF0YWJsZUNvbnRlbnQuam9pbignXFxuJylcbiAgICAgICAgICAgIGNvbnN0IGRhdGFUb1JlbmRlciA9IHtcbiAgICAgICAgICAgICAgICBjdXJyZW50OiBjdXJyZW50RmlsZUluZm8sXG4gICAgICAgICAgICAgICAgZmlsZXM6IGZpbGVzSW5mb1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjaGFuZ2VkID0gYXdhaXQgcmVuZGVyKHRlbXBsYXRlVG9SZW5kZXIsIGRhdGFUb1JlbmRlciwge2F1dG9Fc2NhcGU6IGZhbHNlfSlcbiAgICAgICAgICAgIC8vIGNoYW5nZWQgPSBkb1QudGVtcGxhdGUodGVtcGxhdGVUb1JlbmRlciwge3N0cmlwOiBmYWxzZX0pKGRhdGFUb1JlbmRlcilcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNoYW5nZWQgPSBhd2FpdCB0aGlzLmdlbmVyYXRlVGVtcGxhdGVGcm9tU2VxdWVuY2VzKGZpbGVzLCByZXBlYXRhYmxlQ29udGVudCwgc2VhcmNoUmVzdWx0cyk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcmVzdWx0ID0gW1xuICAgICAgICAgICAgaGVhZGluZyxcbiAgICAgICAgICAgIGNoYW5nZWQsXG4gICAgICAgICAgICBmb290ZXIsXG4gICAgICAgICAgICB0aGlzLmNvbmZpZy5saW5lRW5kaW5nXG4gICAgICAgIF0uZmlsdGVyKGUgPT4gZSkuam9pbignXFxuJylcblxuICAgICAgICAvLyBEbyBub3QgcGFzdGUgZ2VuZXJhdGVkIGNvbnRlbnQgaWYgdXNlZCBjaGFuZ2VkIGFjdGl2ZUxlYWZcbiAgICAgICAgY29uc3Qgdmlld0JlZm9yZVJlcGxhY2UgPSB0aGlzLmFwcC53b3Jrc3BhY2UuYWN0aXZlTGVhZi52aWV3XG4gICAgICAgIGlmICghKHZpZXdCZWZvcmVSZXBsYWNlIGluc3RhbmNlb2YgTWFya2Rvd25WaWV3KSB8fCB2aWV3QmVmb3JlUmVwbGFjZS5maWxlLmJhc2VuYW1lICE9PSBjdXJyZW50RmlsZU5hbWUpIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgY3VycmVudFZpZXcuZWRpdG9yLnJlcGxhY2VSYW5nZShyZXN1bHQsXG4gICAgICAgICAgICB7bGluZTogcXVlcnkuZW5kICsgMSwgY2g6IDB9LFxuICAgICAgICAgICAge2xpbmU6IGxhc3RMaW5lLCBjaDogdGhpcy5jbS5nZXRMaW5lKGxhc3RMaW5lKT8ubGVuZ3RoIHx8IDB9KVxuXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKVxuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgZ2VuZXJhdGVUZW1wbGF0ZUZyb21TZXF1ZW5jZXMoZmlsZXM6IFRGaWxlW10sIHJlcGVhdGFibGVDb250ZW50OiBzdHJpbmdbXSwgc2VhcmNoUmVzdWx0cz86IE1hcDxURmlsZSwgU2VhcmNoRGV0YWlscz4pOiBQcm9taXNlPHN0cmluZz4ge1xuICAgICAgICBpZiAoIXNlYXJjaFJlc3VsdHMpIHtcbiAgICAgICAgICAgIHJldHVybiAnJ1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY2hhbmdlZCA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgZmlsZXNcbiAgICAgICAgICAgICAgICAubWFwKGFzeW5jIChmaWxlLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IFByb21pc2UuYWxsKHJlcGVhdGFibGVDb250ZW50Lm1hcChhc3luYyAocykgPT4gYXdhaXQgdGhpcy5hcHBseVRlbXBsYXRlVG9TZWFyY2hSZXN1bHRzKHNlYXJjaFJlc3VsdHMsIGZpbGUsIHMsIGkpKSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdC5qb2luKCdcXG4nKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgIClcblxuICAgICAgICByZXR1cm4gY2hhbmdlZC5qb2luKCdcXG4nKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHBhcnNlVGVtcGxhdGUocHJlZml4ZXM6IHsgaGVhZGVyOiBzdHJpbmc7IGZvb3Rlcjogc3RyaW5nIH0sIHRlbXBsYXRlQ29udGVudDogc3RyaW5nW10pIHtcbiAgICAgICAgY29uc3QgaXNIZWFkZXIgPSAobGluZTogc3RyaW5nKSA9PiBsaW5lLnN0YXJ0c1dpdGgocHJlZml4ZXMuaGVhZGVyKVxuICAgICAgICBjb25zdCBpc0Zvb3RlciA9IChsaW5lOiBzdHJpbmcpID0+IGxpbmUuc3RhcnRzV2l0aChwcmVmaXhlcy5mb290ZXIpXG4gICAgICAgIGNvbnN0IGlzUmVwZWF0ID0gKGxpbmU6IHN0cmluZykgPT4gIWlzSGVhZGVyKGxpbmUpICYmICFpc0Zvb3RlcihsaW5lKVxuXG4gICAgICAgIGNvbnN0IGhlYWRpbmcgPSB0ZW1wbGF0ZUNvbnRlbnQuZmlsdGVyKGlzSGVhZGVyKS5tYXAoKHMpID0+IHMuc2xpY2UoMSkpLmpvaW4oJ1xcbicpXG4gICAgICAgIGNvbnN0IGZvb3RlciA9IHRlbXBsYXRlQ29udGVudC5maWx0ZXIoaXNGb290ZXIpLm1hcCgocykgPT4gcy5zbGljZSgxKSkuam9pbignXFxuJylcbiAgICAgICAgY29uc3QgcmVwZWF0YWJsZUNvbnRlbnQgPVxuICAgICAgICAgICAgdGVtcGxhdGVDb250ZW50LmZpbHRlcihpc1JlcGVhdCkuZmlsdGVyKGUgPT4gZSkubGVuZ3RoID09PSAwXG4gICAgICAgICAgICAgICAgPyBbdGhpcy5jb25maWcuZGVmYXVsdFRlbXBsYXRlXVxuICAgICAgICAgICAgICAgIDogdGVtcGxhdGVDb250ZW50LmZpbHRlcihpc1JlcGVhdCkuZmlsdGVyKGUgPT4gZSlcbiAgICAgICAgcmV0dXJuIHtoZWFkaW5nLCBmb290ZXIsIHJlcGVhdGFibGVDb250ZW50fTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNhdmVMZWZ0UGFuZWxTdGF0ZSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5sZWZ0UGFuZWxJbmZvID0ge1xuICAgICAgICAgICAgY29sbGFwc2VkOiB0aGlzLmFwcC53b3Jrc3BhY2UubGVmdFNwbGl0LmNvbGxhcHNlZCxcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgIHRhYjogdGhpcy5hcHAud29ya3NwYWNlLmxlZnRTcGxpdC5jaGlsZHJlblswXS5jdXJyZW50VGFiLFxuICAgICAgICAgICAgdGV4dDogdGhpcy5nZXRTZWFyY2hWYWx1ZSgpLFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZXN0b3JlTGVmdFBhbmVsU3RhdGUoKSB7XG4gICAgICAgIGNvbnN0IHtjb2xsYXBzZWQsIHRhYiwgdGV4dH0gPSB0aGlzLmxlZnRQYW5lbEluZm87XG4gICAgICAgIGNvbnN0IHNwbGl0Q2hpbGRyZW4gPSB0aGlzLmdldExlZnRTcGxpdEVsZW1lbnQoKVxuXG4gICAgICAgIHRoaXMuZ2V0U2VhcmNoVmlldygpLnNlYXJjaENvbXBvbmVudC5zZXRWYWx1ZSh0ZXh0KVxuXG4gICAgICAgIGlmICh0YWIgIT09IHNwbGl0Q2hpbGRyZW4uY3VycmVudFRhYikge1xuICAgICAgICAgICAgc3BsaXRDaGlsZHJlbi5zZWxlY3RUYWJJbmRleCh0YWIpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29sbGFwc2VkKSB7XG4gICAgICAgICAgICB0aGlzLmFwcC53b3Jrc3BhY2UubGVmdFNwbGl0LmNvbGxhcHNlKClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgc2VhcmNoKHM6IHN0cmluZykge1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIGNvbnN0IGdsb2JhbFNlYXJjaEZuID0gdGhpcy5hcHAuaW50ZXJuYWxQbHVnaW5zLmdldFBsdWdpbkJ5SWQoJ2dsb2JhbC1zZWFyY2gnKS5pbnN0YW5jZS5vcGVuR2xvYmFsU2VhcmNoLmJpbmQodGhpcylcbiAgICAgICAgY29uc3Qgc2VhcmNoID0gKHF1ZXJ5OiBzdHJpbmcpID0+IGdsb2JhbFNlYXJjaEZuKHF1ZXJ5KVxuXG4gICAgICAgIHNlYXJjaChzKVxuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0TGVmdFNwbGl0RWxlbWVudCgpOiB7XG4gICAgICAgIGN1cnJlbnRUYWI6IG51bWJlclxuICAgICAgICBzZWxlY3RUYWJJbmRleDogKG46IG51bWJlcikgPT4gdm9pZFxuICAgICAgICBjaGlsZHJlbjogQXJyYXk8V29ya3NwYWNlTGVhZiB8IFNlYXJjaExlYWY+XG4gICAgfSB7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgcmV0dXJuIHRoaXMuYXBwLndvcmtzcGFjZS5sZWZ0U3BsaXQuY2hpbGRyZW5bMF07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRMZWZ0U3BsaXRFbGVtZW50T2ZWaWV3U3RhdGVUeXBlKHZpZXdTdGF0ZVR5cGUpOiB7XG4gICAgICAgIGN1cnJlbnRUYWI6IG51bWJlclxuICAgICAgICBzZWxlY3RUYWJJbmRleDogKG46IG51bWJlcikgPT4gdm9pZFxuICAgICAgICBjaGlsZHJlbjogQXJyYXk8V29ya3NwYWNlTGVhZiB8IFNlYXJjaExlYWY+XG4gICAgfSB7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiB0aGlzLmFwcC53b3Jrc3BhY2UubGVmdFNwbGl0LmNoaWxkcmVuKSB7XG4gICAgICAgICAgICBjb25zdCBmaWx0ZXJGb3JTZWFyY2hSZXN1bHQgPSBjaGlsZC5jaGlsZHJlbi5maWx0ZXIoZSA9PiBlLmdldFZpZXdTdGF0ZSgpLnR5cGUgPT09IHZpZXdTdGF0ZVR5cGUpO1xuICAgICAgICAgICAgaWYgKGZpbHRlckZvclNlYXJjaFJlc3VsdCA9PT0gdW5kZWZpbmVkIHx8IGZpbHRlckZvclNlYXJjaFJlc3VsdC5sZW5ndGggPCAxKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBmaWx0ZXJGb3JTZWFyY2hSZXN1bHRbMF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBwcml2YXRlICBnZXRTZWFyY2hWaWV3KCk6IFNlYXJjaExlYWZbJ3ZpZXcnXSB7XG4gICAgICAgIGNvbnN0IHNlYXJjaEVsZW1lbnQgPSB0aGlzLmdldExlZnRTcGxpdEVsZW1lbnRPZlZpZXdTdGF0ZVR5cGUoJ3NlYXJjaCcpO1xuICAgICAgICBpZiAodW5kZWZpbmVkID09IHNlYXJjaEVsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB2aWV3ID0gc2VhcmNoRWxlbWVudC52aWV3O1xuICAgICAgICBpZiAoJ3NlYXJjaENvbXBvbmVudCcgaW4gdmlldykge1xuICAgICAgICAgICAgcmV0dXJuIHZpZXc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFNlYXJjaFZhbHVlKCk6IHN0cmluZyB7XG4gICAgICAgIGNvbnN0IHZpZXcgPSB0aGlzLmdldFNlYXJjaFZpZXcoKTtcblxuICAgICAgICBpZiAodmlldykge1xuICAgICAgICAgICAgcmV0dXJuIHZpZXcuc2VhcmNoQ29tcG9uZW50LmdldFZhbHVlKClcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAnJ1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgZ2V0Rm91bmRBZnRlckRlbGF5KGltbWVkaWF0ZTogYm9vbGVhbik6IFByb21pc2U8TWFwPFRGaWxlLCBTZWFyY2hEZXRhaWxzPj4ge1xuICAgICAgICBjb25zdCBzZWFyY2hMZWFmID0gdGhpcy5hcHAud29ya3NwYWNlLmdldExlYXZlc09mVHlwZSgnc2VhcmNoJylbMF1cbiAgICAgICAgY29uc3QgdmlldyA9IGF3YWl0IHNlYXJjaExlYWYub3BlbihzZWFyY2hMZWFmLnZpZXcpXG5cbiAgICAgICAgaWYgKGltbWVkaWF0ZSkge1xuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh2aWV3LmRvbS5yZXN1bHREb21Mb29rdXAgYXMgTWFwPFRGaWxlLCBTZWFyY2hEZXRhaWxzPik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUodmlldy5kb20ucmVzdWx0RG9tTG9va3VwIGFzIE1hcDxURmlsZSwgU2VhcmNoRGV0YWlscz4pXG4gICAgICAgICAgICB9LCB0aGlzLmNvbmZpZy5kZWxheSlcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGFwcGx5VGVtcGxhdGVUb1NlYXJjaFJlc3VsdHMoc2VhcmNoUmVzdWx0czogTWFwPFRGaWxlLCBTZWFyY2hEZXRhaWxzPiwgZmlsZTogVEZpbGUsIHRlbXBsYXRlOiBzdHJpbmcsIGluZGV4OiBudW1iZXIpIHtcbiAgICAgICAgY29uc3QgZmlsZUNvbnRlbnQgPSAobmV3IFJlZ0V4cCh0aGlzLnNlcXMuZmlsdGVyKGUgPT4gZS5yZWFkQ29udGVudCkubWFwKGUgPT4gZS5uYW1lKS5qb2luKCd8JykpLnRlc3QodGVtcGxhdGUpKVxuICAgICAgICAgICAgPyBhd2FpdCB0aGlzLmFwcC52YXVsdC5jYWNoZWRSZWFkKGZpbGUpXG4gICAgICAgICAgICA6ICcnXG5cbiAgICAgICAgcmV0dXJuIHRoaXMuc2Vxcy5yZWR1Y2UoKGFjYywgc2VxKSA9PlxuICAgICAgICAgICAgYWNjLnJlcGxhY2UobmV3IFJlZ0V4cChzZXEubmFtZSwgJ2d1JyksIHJlcGxhY2UgPT4gc2VxLmZvcm1hdCh0aGlzLCByZXBsYWNlLCBmaWxlQ29udGVudCwgZmlsZSwgc2VhcmNoUmVzdWx0cy5nZXQoZmlsZSksIGluZGV4KSksIHRlbXBsYXRlKVxuICAgIH1cblxuICAgIHByaXZhdGUgY2xlYXJPbGRSZXN1bHRzSW5GaWxlKGNvbnRlbnQ6IHN0cmluZ1tdLCBxdWVyeTogRXhwYW5kZXJRdWVyeSwgbGluZUVuZGluZzogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IGxhc3RMaW5lID0gZ2V0TGFzdExpbmVUb1JlcGxhY2UoY29udGVudCwgcXVlcnksIHRoaXMuY29uZmlnLmxpbmVFbmRpbmcpXG4gICAgICAgIHRoaXMuY20ucmVwbGFjZVJhbmdlKCdcXG4nICsgbGluZUVuZGluZyxcbiAgICAgICAgICAgIHtsaW5lOiBxdWVyeS5lbmQgKyAxLCBjaDogMH0sXG4gICAgICAgICAgICB7bGluZTogbGFzdExpbmUsIGNoOiB0aGlzLmNtLmdldExpbmUobGFzdExpbmUpPy5sZW5ndGggfHwgMH0pXG4gICAgfVxufVxuXG5jbGFzcyBTZXR0aW5nVGFiIGV4dGVuZHMgUGx1Z2luU2V0dGluZ1RhYiB7XG4gICAgcGx1Z2luOiBUZXh0RXhwYW5kZXJcblxuICAgIGNvbnN0cnVjdG9yKGFwcDogQXBwLCBwbHVnaW46IFRleHRFeHBhbmRlcikge1xuICAgICAgICBzdXBlcihhcHAsIHBsdWdpbik7XG5cbiAgICAgICAgdGhpcy5hcHAgPSBhcHBcbiAgICAgICAgdGhpcy5wbHVnaW4gPSBwbHVnaW5cbiAgICB9XG5cbiAgICBkaXNwbGF5KCk6IHZvaWQge1xuICAgICAgICBsZXQge2NvbnRhaW5lckVsfSA9IHRoaXM7XG5cbiAgICAgICAgY29udGFpbmVyRWwuZW1wdHkoKTtcblxuICAgICAgICBjb250YWluZXJFbC5jcmVhdGVFbCgnaDInLCB7dGV4dDogJ1NldHRpbmdzIGZvciBUZXh0IEV4cGFuZGVyJ30pO1xuXG4gICAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAgICAgLnNldE5hbWUoJ0F1dG8gRXhwYW5kJylcbiAgICAgICAgICAgIC5zZXREZXNjKCdFeHBhbmQgYWxsIHF1ZXJpZXMgaW4gYSBmaWxlIG9uY2UgeW91IG9wZW4gaXQnKVxuICAgICAgICAgICAgLmFkZFRvZ2dsZSh0b2dnbGUgPT4ge1xuICAgICAgICAgICAgICAgIHRvZ2dsZVxuICAgICAgICAgICAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uY29uZmlnLmF1dG9FeHBhbmQpXG4gICAgICAgICAgICAgICAgICAgIC5vbkNoYW5nZSh2YWx1ZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5jb25maWcuYXV0b0V4cGFuZCA9IHZhbHVlXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcblxuICAgICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgICAgIC5zZXROYW1lKCdEZWxheScpXG4gICAgICAgICAgICAuc2V0RGVzYygnVGV4dCBleHBhbmRlciBkb25cXCcgd2FpdCB1bnRpbCBzZWFyY2ggY29tcGxldGVkLiBJdCB3YWl0cyBmb3IgYSBkZWxheSBhbmQgcGFzdGUgcmVzdWx0IGFmdGVyIHRoYXQuJylcbiAgICAgICAgICAgIC5hZGRTbGlkZXIoc2xpZGVyID0+IHtcbiAgICAgICAgICAgICAgICBzbGlkZXIuc2V0TGltaXRzKDEwMCwgMTAwMDAsIDEwMClcbiAgICAgICAgICAgICAgICBzbGlkZXIuc2V0VmFsdWUodGhpcy5wbHVnaW4uY29uZmlnLmRlbGF5KVxuICAgICAgICAgICAgICAgIHNsaWRlci5vbkNoYW5nZSh2YWx1ZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLmNvbmZpZy5kZWxheSA9IHZhbHVlXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICBzbGlkZXIuc2V0RHluYW1pY1Rvb2x0aXAoKVxuICAgICAgICAgICAgfSlcblxuICAgICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgICAgIC5zZXROYW1lKCdMaW5lIGVuZGluZycpXG4gICAgICAgICAgICAuc2V0RGVzYygnWW91IGNhbiBzcGVjaWZ5IHRoZSB0ZXh0IHdoaWNoIHdpbGwgYXBwZWFyIGF0IHRoZSBib3R0b20gb2YgdGhlIGdlbmVyYXRlZCB0ZXh0LicpXG4gICAgICAgICAgICAuYWRkVGV4dCh0ZXh0ID0+IHtcbiAgICAgICAgICAgICAgICB0ZXh0LnNldFZhbHVlKHRoaXMucGx1Z2luLmNvbmZpZy5saW5lRW5kaW5nKVxuICAgICAgICAgICAgICAgICAgICAub25DaGFuZ2UodmFsID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLmNvbmZpZy5saW5lRW5kaW5nID0gdmFsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcblxuICAgICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgICAgIC5zZXROYW1lKCdEZWZhdWx0IHRlbXBsYXRlJylcbiAgICAgICAgICAgIC5zZXREZXNjKCdZb3UgY2FuIHNwZWNpZnkgZGVmYXVsdCB0ZW1wbGF0ZScpXG4gICAgICAgICAgICAuYWRkVGV4dEFyZWEodGV4dCA9PiB7XG4gICAgICAgICAgICAgICAgdGV4dC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5jb25maWcuZGVmYXVsdFRlbXBsYXRlKVxuICAgICAgICAgICAgICAgICAgICAub25DaGFuZ2UodmFsID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLmNvbmZpZy5kZWZhdWx0VGVtcGxhdGUgPSB2YWxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAgICAgLnNldE5hbWUoJ0V4Y2x1ZGUgY3VycmVudCBmaWxlJylcbiAgICAgICAgICAgIC5zZXREZXNjKCdZb3UgY2FuIHNwZWNpZnkgc2hvdWxkIHRleHQgZXhwYW5kZXIgZXhjbHVkZSByZXN1bHRzIGZyb20gY3VycmVudCBmaWxlIG9yIG5vdCcpXG4gICAgICAgICAgICAuYWRkVG9nZ2xlKHRvZ2dsZSA9PiB7XG4gICAgICAgICAgICAgICAgdG9nZ2xlXG4gICAgICAgICAgICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5jb25maWcuZXhjbHVkZUN1cnJlbnQpXG4gICAgICAgICAgICAgICAgICAgIC5vbkNoYW5nZSh2YWx1ZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5jb25maWcuZXhjbHVkZUN1cnJlbnQgPSB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKClcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgICAgICAuc2V0SGVhZGluZygpXG4gICAgICAgICAgICAuc2V0TmFtZSgnUHJlZml4ZXMnKVxuXG4gICAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAgICAgLnNldE5hbWUoJ0hlYWRlcicpXG4gICAgICAgICAgICAuc2V0RGVzYygnTGluZSBwcmVmaXhlZCBieSB0aGlzIHN5bWJvbCB3aWxsIGJlIHJlY29nbml6ZWQgYXMgaGVhZGVyJylcbiAgICAgICAgICAgIC5hZGRUZXh0KHRleHQgPT4ge1xuICAgICAgICAgICAgICAgIHRleHQuc2V0VmFsdWUodGhpcy5wbHVnaW4uY29uZmlnLnByZWZpeGVzLmhlYWRlcilcbiAgICAgICAgICAgICAgICAgICAgLm9uQ2hhbmdlKHZhbCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5jb25maWcucHJlZml4ZXMuaGVhZGVyID0gdmFsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcblxuICAgICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgICAgIC5zZXROYW1lKCdGb290ZXInKVxuICAgICAgICAgICAgLnNldERlc2MoJ0xpbmUgcHJlZml4ZWQgYnkgdGhpcyBzeW1ib2wgd2lsbCBiZSByZWNvZ25pemVkIGFzIGZvb3RlcicpXG4gICAgICAgICAgICAuYWRkVGV4dCh0ZXh0ID0+IHtcbiAgICAgICAgICAgICAgICB0ZXh0LnNldFZhbHVlKHRoaXMucGx1Z2luLmNvbmZpZy5wcmVmaXhlcy5mb290ZXIpXG4gICAgICAgICAgICAgICAgICAgIC5vbkNoYW5nZSh2YWwgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uY29uZmlnLnByZWZpeGVzLmZvb3RlciA9IHZhbFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKClcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgICAgICAuc2V0TmFtZSgnU2VxdWVuY2VzJylcbiAgICAgICAgICAgIC5zZXREZXNjKCdSRUdFWFAgLSBERVNDUklQVElPTicpXG4gICAgICAgICAgICAuc2V0RGVzYyhcbiAgICAgICAgICAgICAgICAoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBmcmFnbWVudCA9IG5ldyBEb2N1bWVudEZyYWdtZW50KClcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGl2ID0gZnJhZ21lbnQuY3JlYXRlRWwoJ2RpdicpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNlcXNcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoZSA9PiBlLm5hbWUgKyAnIC0gJyArIChlLmRlc2MgfHwgJycpKVxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcChlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBlbCA9IGZyYWdtZW50LmNyZWF0ZUVsKCdkaXYnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsLnNldFRleHQoZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgYFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3JkZXItYm90dG9tOiAxcHggc29saWQgcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW4tYm90dG9tOiAwLjVyZW07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmctYm90dG9tOiAwLjVyZW07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZWxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLmZvckVhY2goZWwgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGl2LmFwcGVuZENoaWxkKGVsKVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICBmcmFnbWVudC5hcHBlbmRDaGlsZChkaXYpXG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZyYWdtZW50XG4gICAgICAgICAgICAgICAgfSkoKVxuICAgICAgICAgICAgKVxuICAgIH1cbn1cbiJdLCJuYW1lcyI6WyJwYXRoIiwiZXhpc3RzU3luYyIsInJlYWRGaWxlU3luYyIsIlBsdWdpbiIsIk1hcmtkb3duVmlldyIsIkZpbGVWaWV3IiwiUGx1Z2luU2V0dGluZ1RhYiIsIlNldHRpbmciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQW9HQTtBQUNPLFNBQVMsU0FBUyxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRTtBQUM3RCxJQUFJLFNBQVMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLE9BQU8sS0FBSyxZQUFZLENBQUMsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsVUFBVSxPQUFPLEVBQUUsRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRTtBQUNoSCxJQUFJLE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQyxFQUFFLFVBQVUsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUMvRCxRQUFRLFNBQVMsU0FBUyxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMs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
