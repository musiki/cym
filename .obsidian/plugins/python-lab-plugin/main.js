'use strict';

var obsidian = require('obsidian');

/*! *****************************************************************************
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
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

var LabView = /** @class */ (function (_super) {
    __extends(LabView, _super);
    function LabView(leaf, commandId, command) {
        var _this = _super.call(this, leaf) || this;
        _this.command = command;
        _this.commandId = commandId;
        return _this;
    }
    LabView.prototype.getViewType = function () {
        return this.commandId;
    };
    LabView.prototype.getDisplayText = function () {
        return this.command.label == null ? this.commandId : this.command.label;
    };
    LabView.prototype.getIcon = function () {
        return this.command.icon == null ? 'lab' : this.command.icon;
    };
    return LabView;
}(obsidian.ItemView));

var path = require('path');
// A panel that shows notes or text.
var LabPanel = /** @class */ (function (_super) {
    __extends(LabPanel, _super);
    function LabPanel(leaf, commandId, command) {
        var _this = _super.call(this, leaf, commandId, command) || this;
        /**
         * Updates the panel
         */
        _this.draw = function () {
            var openFile = _this.app.workspace.getActiveFile();
            var rootEl = createDiv({ cls: 'nav-folder mod-root' });
            _this.state =
                _this.state == null
                    ? {
                        label: '',
                        contents: '',
                    }
                    : _this.state;
            // Label of the panel
            var context = rootEl.createDiv({
                title: 'title',
                cls: 'nav-file python-lab-title',
                text: _this.state.label,
            });
            // Function open on click
            var clickElement = function (file, shouldSplit) {
                if (shouldSplit === void 0) { shouldSplit = false; }
                var filePath = file.path;
                // If it applies, remove the vault path
                if (_this.app.vault.adapter instanceof obsidian.FileSystemAdapter) {
                    var vaultPath = _this.app.vault.adapter.getBasePath();
                    if (filePath.startsWith(vaultPath)) {
                        filePath = path.relative(vaultPath, filePath);
                    }
                }
                var targetFile = _this.app.vault
                    .getFiles()
                    .find(function (f) { return f.path === filePath; });
                if (targetFile) {
                    var leaf = _this.app.workspace.getMostRecentLeaf();
                    if (shouldSplit) {
                        leaf = _this.app.workspace.createLeafBySplit(leaf);
                    }
                    leaf.openFile(targetFile);
                }
                else {
                    new obsidian.Notice("'" + file.path + "' not found");
                    if (Array.isArray(_this.state.contents)) {
                        _this.state.contents = _this.state.contents.filter(function (fp) { return fp.path !== file.path; });
                    }
                    _this.draw();
                }
            };
            // Draw a list, when is a list
            if (Array.isArray(_this.state.contents)) {
                _this.state.contents.forEach(function (currentFile) {
                    var childrenEl = rootEl.createDiv({ cls: 'nav-folder-children' });
                    // The info that will appear on hover
                    var jsonInfo = JSON.stringify(currentFile, null, 4);
                    var navFile = childrenEl.createDiv({
                        title: jsonInfo,
                        cls: 'nav-file',
                    });
                    var navFileTitle = navFile.createDiv({ cls: 'nav-file-title' });
                    if (openFile && currentFile.path === openFile.path) {
                        navFileTitle.addClass('is-active');
                    }
                    navFileTitle.createDiv({
                        cls: 'nav-file-title-content',
                        text: currentFile.name,
                    });
                    navFile.onClickEvent(function (event) {
                        return clickElement(currentFile, event.ctrlKey || event.metaKey);
                    });
                });
            }
            else if (String.isString(_this.state.contents)) {
                // Draw the contents as a list
                rootEl.createDiv({
                    title: 'contents',
                    cls: 'python-lab-text',
                    text: _this.state.contents,
                });
            }
            else {
                rootEl.createDiv({
                    title: 'contents',
                    cls: 'python-lab-text',
                    text: JSON.stringify(_this.state, null, 2),
                });
            }
            var contentEl = _this.containerEl.children[1];
            contentEl.empty();
            contentEl.appendChild(rootEl);
        };
        _this.draw();
        return _this;
    }
    LabPanel.prototype.setData = function (state) {
        this.state = state;
    };
    // Used to handle 'file-open'
    LabPanel.prototype.registerOnFileOpen = function (callback) {
        var _this = this;
        var handleOpenFile = function (openedFile) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!openedFile) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, callback()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        this.registerEvent(this.app.workspace.on('file-open', handleOpenFile));
    };
    /**
     * The menu that appears with right click on the icon
     */
    LabPanel.prototype.onHeaderMenu = function (menu) {
        var _this = this;
        menu
            .addItem(function (item) {
            item
                .setTitle('Clear list')
                .setIcon('sweep')
                .onClick(function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.state = null;
                    this.draw();
                    return [2 /*return*/];
                });
            }); });
        })
            .addItem(function (item) {
            item
                .setTitle('Close')
                .setIcon('cross')
                .onClick(function () {
                _this.app.workspace.detachLeavesOfType(_this.commandId);
            });
        });
    };
    LabPanel.prototype.load = function () {
        _super.prototype.load.call(this);
    };
    return LabPanel;
}(LabView));

// This chat widget is based on the 'dual' prototype.
// I found it pretty.
// https://github.com/Psionica/Dual/blob/master/vault-replica/.obsidian/plugins/Dual/view.ts
var ChatView = /** @class */ (function (_super) {
    __extends(ChatView, _super);
    function ChatView(leaf, commandId, command) {
        var _this = _super.call(this, leaf, commandId, command) || this;
        _this.draw();
        return _this;
    }
    ChatView.prototype.registerOnSendMessage = function (callbackWithView) {
        this.onSendMessage = callbackWithView;
    };
    ChatView.prototype.load = function () {
        _super.prototype.load.call(this);
        this.draw();
    };
    // The use input
    ChatView.prototype.getLastInput = function () {
        return this.lastInput;
    };
    ChatView.prototype.sendMessage = function () {
        var _this = this;
        var input = document.getElementById('input');
        var replied = false;
        if (input.value != '') {
            this.drawMessage(input.value, 'right');
            var typingPromise = new Promise(function (resolve) {
                return setTimeout(resolve, 3000);
            }).then(function () {
                if (replied == false) {
                    _this.setStatus('loading...');
                }
            });
            this.lastInput = input.value;
            this.onSendMessage().then(function (response) {
                if (response.contents) {
                    var message = JSON.stringify(response.contents);
                    _this.drawMessage(message, 'left');
                }
                replied = true;
            });
            input.value = '';
        }
    };
    ChatView.prototype.draw = function () {
        var _this = this;
        var container = this.containerEl.children[1];
        var rootEl = document.createElement('div');
        var headerDiv = rootEl.createDiv({ cls: 'nav-header' });
        var footerDiv = rootEl.createDiv({ cls: 'nav-header' });
        var header = headerDiv.createEl('h3');
        header.appendText(_super.prototype.getDisplayText.call(this));
        header.style.textAlign = 'left';
        header.style.marginTop = '0px';
        header.style.marginBottom = '0px';
        header.style.position = 'absolute';
        header.style.top = '15px';
        var status = headerDiv.createEl('h6');
        status.id = 'status';
        if (this.status) {
            status.appendText('online');
        }
        status.style.textAlign = 'left';
        status.style.marginTop = '0px';
        status.style.marginBottom = '5px';
        status.style.color = 'grey';
        var conversationDiv = headerDiv.createDiv({ cls: 'nav-header' });
        conversationDiv.id = 'conversationDiv';
        conversationDiv.style.padding = '0';
        conversationDiv.style.backgroundColor = 'var(--background-secondary-alt)';
        conversationDiv.style.position = 'absolute';
        conversationDiv.style.left = '0';
        conversationDiv.style.width = '100%';
        conversationDiv.style.paddingLeft = '10px';
        conversationDiv.style.paddingRight = '10px';
        conversationDiv.style.overflowY = 'scroll';
        conversationDiv.style.height = 'calc(100% - 110px)';
        var input = footerDiv.createEl('input');
        input.id = 'input';
        input.type = 'text';
        input.style.fontSize = '0.8em';
        input.style.paddingInlineStart = '2%';
        input.style.paddingInlineEnd = '2%';
        input.style.marginTop = '0px';
        input.style.marginBottom = '10px';
        input.style.maxWidth = '68%';
        input.style.minWidth = '68%';
        input.style.position = 'absolute';
        input.style.bottom = '0';
        input.style.left = '5%';
        var button = footerDiv.createEl('button');
        button.appendText('Send');
        button.id = 'send-button';
        button.style.alignItems = 'left';
        button.style.paddingInlineStart = '2%';
        button.style.paddingInlineEnd = '2%';
        button.style.marginTop = '0px';
        button.style.marginBottom = '10px';
        button.style.width = '20%';
        button.style.position = 'absolute';
        button.style.bottom = '0';
        button.style.left = '75%';
        this.registerDomEvent(button, 'click', function () { return _this.sendMessage(); });
        this.registerDomEvent(input, 'keydown', function (event) {
            if (event.key == 'Enter') {
                _this.sendMessage();
            }
        });
        container.empty();
        container.appendChild(rootEl);
    };
    ChatView.prototype.drawMessage = function (content, side) {
        var conversationDiv = (document.getElementById('conversationDiv'));
        var p = conversationDiv.createEl('p');
        p.appendText(content);
        p.style.textAlign = 'left';
        p.style.fontSize = '0.8em';
        p.style.borderRadius = '5px';
        p.style.lineHeight = '18px';
        p.style.padding = '5px';
        if (side == 'right') {
            p.style.backgroundColor = 'var(--background-primary)';
        }
        else {
            p.style.backgroundColor = 'var(--background-secondary)';
        }
        p.style.width = '90%';
        p.style.position = 'relative';
        if (side == 'right') {
            p.style.left = '10%';
        }
        conversationDiv.scrollBy(0, 1000);
    };
    ChatView.prototype.setStatus = function (content) {
        var statusP = document.getElementById('status');
        statusP.setText(content);
    };
    return ChatView;
}(LabView));

var sweepIcon = "\n<svg fill=\"currentColor\" stroke=\"currentColor\" version=\"1.1\" viewBox=\"0 0 512 512\" xmlns=\"http://www.w3.org/2000/svg\">\n  <path d=\"m495.72 1.582c-7.456-3.691-16.421-0.703-20.142 6.694l-136.92 274.08-26.818-13.433c-22.207-11.118-49.277-2.065-60.396 20.083l-6.713 13.405 160.96 80.616 6.713-13.411c11.087-22.143 2.227-49.18-20.083-60.381l-26.823-13.435 136.92-274.08c3.706-7.412 0.703-16.421-6.694-20.141z\"/>\n  <circle cx=\"173\" cy=\"497\" r=\"15\"/>\n  <circle cx=\"23\" cy=\"407\" r=\"15\"/>\n  <circle cx=\"83\" cy=\"437\" r=\"15\"/>\n  <path d=\"m113 482h-60c-8.276 0-15-6.724-15-15 0-8.291-6.709-15-15-15s-15 6.709-15 15c0 24.814 20.186 45 45 45h60c8.291 0 15-6.709 15-15s-6.709-15-15-15z\"/>\n  <path d=\"m108.64 388.07c-6.563 0.82-11.807 5.845-12.92 12.349-1.113 6.519 2.153 12.993 8.057 15.952l71.675 35.889c12.935 6.475 27.231 9.053 41.177 7.573-1.641 6.65 1.479 13.784 7.852 16.992l67.061 33.589c5.636 2.78 12.169 1.8 16.685-2.197 2.347-2.091 53.436-48.056 83.3-98.718l-161.6-80.94c-36.208 48.109-120.36 59.39-121.28 59.511z\"/>\n</svg>";
// From: https://github.com/mgmeyers/obsidian-icon-swapper
var icons = [
    'lab',
    'sweep',
    'any-key',
    'audio-file',
    'blocks',
    'bold-glyph',
    'bracket-glyph',
    'broken-link',
    'bullet-list-glyph',
    'bullet-list',
    'calendar-with-checkmark',
    'check-in-circle',
    'check-small',
    'checkbox-glyph',
    'checkmark',
    'clock',
    'cloud',
    'code-glyph',
    'create-new',
    'cross-in-box',
    'cross',
    'crossed-star',
    'dice',
    'document',
    'documents',
    'dot-network',
    'double-down-arrow-glyph',
    'double-up-arrow-glyph',
    'down-arrow-with-tail',
    'down-chevron-glyph',
    'enter',
    'exit-fullscreen',
    'expand-vertically',
    'filled-pin',
    'folder',
    'forward-arrow',
    'fullscreen',
    'gear',
    'go-to-file',
    'hashtag',
    'heading-glyph',
    'help',
    'highlight-glyph',
    'horizontal-split',
    'image-file',
    'image-glyph',
    'indent-glyph',
    'info',
    'install',
    'italic-glyph',
    'keyboard-glyph',
    'languages',
    'left-arrow-with-tail',
    'left-arrow',
    'left-chevron-glyph',
    'lines-of-text',
    'link-glyph',
    'link',
    'logo-crystal',
    'magnifying-glass',
    'microphone-filled',
    'microphone',
    'minus-with-circle',
    'note-glyph',
    'number-list-glyph',
    'open-vault',
    'pane-layout',
    'paper-plane',
    'paused',
    'pdf-file',
    'pencil',
    'percent-sign-glyph',
    'pin',
    'plus-with-circle',
    'popup-open',
    'presentation',
    'price-tag-glyph',
    'quote-glyph',
    'redo-glyph',
    'reset',
    'right-arrow-with-tail',
    'right-arrow',
    'right-chevron-glyph',
    'right-triangle',
    'run-command',
    'search',
    'sheets-in-box',
    'stacked-levels',
    'star-list',
    'star',
    'strikethrough-glyph',
    'switch',
    'sync-small',
    'sync',
    'tag-glyph',
    'three-horizontal-bars',
    'trash',
    'undo-glyph',
    'unindent-glyph',
    'up-and-down-arrows',
    'up-arrow-with-tail',
    'up-chevron-glyph',
    'uppercase-lowercase-a',
    'vault',
    'vertical-split',
    'vertical-three-dots',
    'wrench-screwdriver-glyph',
];

var COMMAND_PREFIX = 'obsidian_lab_';
var DEFAULT_ICON = 'gear';
var DEFAULT_SETTINGS = {
    server_url: 'http://localhost:5000',
    debug: 'verbose',
    commands: {
        hello_world: {
            active: true,
            label: 'Hello world',
            type: 'insert-text',
        },
        to_upper_case: {
            active: false,
            label: 'Convert to upper case',
            type: 'replace-text',
        },
        chat: {
            active: false,
            label: 'Simple chat service',
            type: 'command-line',
        },
        random_similarity: {
            active: true,
            label: 'Random score similarity',
            type: 'panel',
            icon: DEFAULT_ICON,
            invokeOnOpen: true,
        },
    },
};
function getServerStatus(serverUrl) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch(serverUrl, {
                        method: 'GET',
                        headers: {
                            'content-type': 'application/json',
                        },
                    })
                        .then(function (response) {
                        return response.json();
                    })
                        .then(function (data) {
                        var status = {
                            status: 'available',
                            availableCommandUrls: data.scripts ? data.scripts : [],
                        };
                        return status;
                    })
                        .catch(function (error) {
                        return {
                            status: 'unavailable',
                            availableCommandUrls: [],
                            error: error,
                        };
                    })];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result];
            }
        });
    });
}
function commandIdFromName(command_name) {
    return "" + COMMAND_PREFIX + command_name;
}
function getNameFromUrl(currentUrl) {
    return currentUrl.substring(currentUrl.lastIndexOf('/') + 1);
}
function loadCommands(commandUrls, commandSettings) {
    var e_1, _a;
    var result = new Map();
    try {
        for (var commandUrls_1 = __values(commandUrls), commandUrls_1_1 = commandUrls_1.next(); !commandUrls_1_1.done; commandUrls_1_1 = commandUrls_1.next()) {
            var commandURL = commandUrls_1_1.value;
            var commandName = getNameFromUrl(commandURL);
            // If the settings for this command are already stored
            if (commandSettings[commandName]) {
                result.set(commandName, commandSettings[commandName]);
            }
            else {
                // Otherwise use the default one
                result.set(commandName, {
                    label: commandName,
                    type: 'insert-text',
                    active: false,
                    invokeOnOpen: false,
                    icon: 'lab',
                });
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (commandUrls_1_1 && !commandUrls_1_1.done && (_a = commandUrls_1.return)) _a.call(commandUrls_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return result;
}
var PythonLabPlugin = /** @class */ (function (_super) {
    __extends(PythonLabPlugin, _super);
    function PythonLabPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * Init all commands
         */
        _this.initViews = function (commands) {
            return function () {
                var e_2, _a;
                try {
                    // Attach only commands that have a view.
                    for (var commands_1 = __values(commands), commands_1_1 = commands_1.next(); !commands_1_1.done; commands_1_1 = commands_1.next()) {
                        var _b = __read(commands_1_1.value, 2), name_1 = _b[0], command = _b[1];
                        var hasView = command.type == 'panel' || command.type == 'command-line';
                        if (hasView && command.active) {
                            var commandId = commandIdFromName(name_1);
                            _this.showPanel(commandId);
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (commands_1_1 && !commands_1_1.done && (_a = commands_1.return)) _a.call(commands_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            };
        };
        return _this;
    }
    PythonLabPlugin.prototype.commandUrlFromName = function (command_name) {
        return this.settings.server_url + "/" + command_name;
    };
    PythonLabPlugin.prototype.getVaultPath = function () {
        if (!(this.app.vault.adapter instanceof obsidian.FileSystemAdapter)) {
            throw new Error('app.vault is not a FileSystemAdapter instance');
        }
        return this.app.vault.adapter.getBasePath();
    };
    PythonLabPlugin.prototype.loadCommandPanes = function () {
        return __awaiter(this, void 0, void 0, function () {
            var serverStatus, availableCommands, availableCommands_1, availableCommands_1_1, _a, name_2, command, init;
            var e_3, _b;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.loadSettings()];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, getServerStatus(this.settings.server_url)];
                    case 2:
                        serverStatus = _c.sent();
                        // Detach panes
                        // Disclaimer: I still cannot figure out how to detach or unregister all leaves produced by this plugin
                        // The intention here is to clean all leaves of created by the lab. @TODO detach properly in the future
                        this.app.workspace.iterateAllLeaves(function (leaf) {
                            if (leaf.getViewState().type.startsWith(COMMAND_PREFIX)) {
                                if (_this.settings.debug == 'verbose') {
                                    console.log('detaching', leaf.getViewState().type);
                                }
                                leaf.detach();
                            }
                        });
                        if (serverStatus.status == 'available') {
                            availableCommands = loadCommands(serverStatus.availableCommandUrls, this.settings.commands);
                            try {
                                for (availableCommands_1 = __values(availableCommands), availableCommands_1_1 = availableCommands_1.next(); !availableCommands_1_1.done; availableCommands_1_1 = availableCommands_1.next()) {
                                    _a = __read(availableCommands_1_1.value, 2), name_2 = _a[0], command = _a[1];
                                    if (command.active) {
                                        this.initCommand(name_2, command);
                                    }
                                }
                            }
                            catch (e_3_1) { e_3 = { error: e_3_1 }; }
                            finally {
                                try {
                                    if (availableCommands_1_1 && !availableCommands_1_1.done && (_b = availableCommands_1.return)) _b.call(availableCommands_1);
                                }
                                finally { if (e_3) throw e_3.error; }
                            }
                            init = this.initViews(availableCommands);
                            if (this.app.workspace.layoutReady) {
                                init();
                            }
                            else {
                                this.app.workspace.onLayoutReady(init);
                            }
                        }
                        else {
                            new obsidian.Notice('Lab disconected, Start server');
                            if (this.settings.debug == 'verbose') {
                                console.log(serverStatus);
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    PythonLabPlugin.prototype.onload = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log('loading python lab plugin');
                obsidian.addIcon('sweep', sweepIcon);
                this.loadCommandPanes();
                this.addSettingTab(new PythonLabSettings(this.app, this));
                return [2 /*return*/];
            });
        });
    };
    PythonLabPlugin.prototype.initCommand = function (name, command) {
        var _this = this;
        var commandId = commandIdFromName(name);
        var commandUrl = this.commandUrlFromName(name);
        if (this.settings.debug == 'verbose') {
            console.log("init [" + name + "] as [" + command.type + "]");
        }
        if (command.type == 'command-line') {
            var viewCreator = function (leaf) {
                var commandLine = new ChatView(leaf, commandId, command);
                var commandLineCallback = function () { return __awaiter(_this, void 0, void 0, function () {
                    var parameters;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                parameters = this.getDefaultPostParameters();
                                parameters.data = {
                                    input: commandLine.getLastInput(),
                                };
                                return [4 /*yield*/, this.doPost(commandUrl, parameters)];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    });
                }); };
                commandLine.registerOnSendMessage(commandLineCallback);
                _this.addCommand({
                    id: commandId,
                    name: command.label,
                    callback: function () { return commandLineCallback(); },
                    hotkeys: [],
                });
                return commandLine;
            };
            // I would love to know if this view is already registered, but I don't know how.
            this.registerView(commandId, viewCreator);
        }
        else if (command.type == 'panel') {
            var viewCreator = function (leaf) {
                var panel = new LabPanel(leaf, commandId, command);
                var panelCallback = function () { return __awaiter(_this, void 0, void 0, function () {
                    var parameters, data;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                parameters = this.getDefaultPostParameters();
                                return [4 /*yield*/, this.doPost(commandUrl, parameters)];
                            case 1:
                                data = _a.sent();
                                data.label = command.label;
                                // Update the state of the view panel
                                panel.setData(data);
                                panel.draw();
                                return [2 /*return*/];
                        }
                    });
                }); };
                _this.addCommand({
                    id: commandId,
                    name: command.label,
                    callback: function () { return panelCallback(); },
                    hotkeys: [],
                });
                if (command.invokeOnOpen) {
                    panel.registerOnFileOpen(panelCallback);
                }
                return panel;
            };
            // I would love to know if this view is already registered, but I don't know how.
            this.registerView(commandId, viewCreator);
        }
        else if (command.type == 'insert-text' ||
            command.type == 'replace-text') {
            var callbackWithoutView_1 = function () { return __awaiter(_this, void 0, void 0, function () {
                var parameters, data, activeView, editor, doc, cursor;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            parameters = this.getDefaultPostParameters();
                            return [4 /*yield*/, this.doPost(commandUrl, parameters)];
                        case 1:
                            data = _a.sent();
                            activeView = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
                            if (command.type == 'replace-text' &&
                                activeView instanceof obsidian.MarkdownView) {
                                // Replaces the current selection
                                // const editor = activeView.sourceMode.cmEditor;
                                if (data.contents) {
                                    editor = activeView.editor;
                                    editor.replaceSelection(data.contents);
                                }
                            }
                            else if (command.type == 'insert-text' &&
                                activeView instanceof obsidian.MarkdownView) {
                                doc = activeView.editor.getDoc();
                                cursor = doc.getCursor();
                                if (data.contents) {
                                    doc.replaceRange(data.contents, cursor);
                                }
                            }
                            else {
                                console.error("Cannot process: ", command);
                            }
                            return [2 /*return*/];
                    }
                });
            }); };
            this.addCommand({
                id: commandId,
                name: command.label,
                callback: function () { return callbackWithoutView_1(); },
                hotkeys: [],
            });
        }
    };
    PythonLabPlugin.prototype.doPost = function (command_url, parameters) {
        return __awaiter(this, void 0, void 0, function () {
            var requestBody, response, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        requestBody = JSON.stringify(parameters);
                        if (this.settings.debug == 'verbose') {
                            console.info('Post:', command_url);
                            console.info('requestBody', requestBody);
                        }
                        return [4 /*yield*/, fetch(command_url, {
                                method: 'POST',
                                body: requestBody,
                                headers: {
                                    'content-type': 'application/json',
                                },
                            })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        if (this.settings.debug == 'verbose') {
                            console.info('response data', data);
                        }
                        if (data.errors) {
                            console.error(data);
                            new Notification(data.message);
                        }
                        return [2 /*return*/, data];
                }
            });
        });
    };
    PythonLabPlugin.prototype.getDefaultPostParameters = function () {
        var parameters = {
            vaultPath: this.getVaultPath(),
        };
        var activeView = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
        if (activeView) {
            var editor = activeView.editor;
            var selectedText = editor.getSelection();
            if (selectedText) {
                parameters.text = selectedText;
            }
            if (activeView.file && activeView.file.path) {
                parameters.notePath = activeView.file.path;
            }
        }
        return parameters;
    };
    PythonLabPlugin.prototype.loadSettings = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _a = this;
                        _c = (_b = Object).assign;
                        _d = [DEFAULT_SETTINGS];
                        return [4 /*yield*/, _super.prototype.loadData.call(this)];
                    case 1:
                        _a.settings = _c.apply(_b, _d.concat([_e.sent()]));
                        return [2 /*return*/];
                }
            });
        });
    };
    PythonLabPlugin.prototype.saveSettings = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.saveData(this.settings)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PythonLabPlugin.prototype.showPanel = function (commandId) {
        return __awaiter(this, void 0, void 0, function () {
            var existing;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        existing = this.app.workspace.getLeavesOfType(commandId);
                        if (existing.length) {
                            this.app.workspace.revealLeaf(existing[0]);
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.app.workspace.getRightLeaf(false).setViewState({
                                type: commandId,
                                active: true,
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return PythonLabPlugin;
}(obsidian.Plugin));
/**
 * Settings
 */
var PythonLabSettings = /** @class */ (function (_super) {
    __extends(PythonLabSettings, _super);
    function PythonLabSettings(app, plugin) {
        var _this = _super.call(this, app, plugin) || this;
        _this.plugin = plugin;
        return _this;
    }
    PythonLabSettings.prototype.display = function () {
        var _this = this;
        var containerEl = this.containerEl;
        containerEl.empty();
        containerEl.createEl('h2', { text: 'Obsidian lab settings' });
        containerEl.createEl('h4', { text: 'Restart after making changes' });
        var settings = this.plugin.settings;
        var serverURLSetting = new obsidian.Setting(this.containerEl)
            .setName('Server url')
            .addText(function (text) {
            text.setValue(settings.server_url);
            text.onChange(function (value) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.plugin.settings.server_url = value;
                    return [2 /*return*/];
                });
            }); });
        })
            .addExtraButton(function (b) {
            b.setIcon('reset')
                .setTooltip('set and refresh')
                .onClick(function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.plugin.saveSettings()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.plugin.loadCommandPanes()];
                        case 2:
                            _a.sent();
                            this.display();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        var updateSetting = function (commandId, command) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.plugin.settings.commands[commandId] = command;
                        if (this.plugin.settings.debug == 'verbose') {
                            console.log('save', command);
                        }
                        return [4 /*yield*/, this.plugin.saveSettings()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        getServerStatus(settings.server_url).then(function (serverStatus) {
            var e_4, _a;
            if (serverStatus.status == 'available') {
                var availableCommands = loadCommands(serverStatus.availableCommandUrls, settings.commands);
                var n = 0;
                try {
                    for (var availableCommands_2 = __values(availableCommands), availableCommands_2_1 = availableCommands_2.next(); !availableCommands_2_1.done; availableCommands_2_1 = availableCommands_2.next()) {
                        var _b = __read(availableCommands_2_1.value, 2), name_3 = _b[0], command = _b[1];
                        addCommandSetting(name_3, command);
                        n++;
                    }
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (availableCommands_2_1 && !availableCommands_2_1.done && (_a = availableCommands_2.return)) _a.call(availableCommands_2);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
                serverURLSetting.setName("Server online [" + n + "]");
            }
            else {
                serverURLSetting
                    .setName('⚠ Cannot reach server')
                    .setDesc('')
                    .setClass('python-lab-error');
                console.log(serverStatus);
            }
            _this.setFooter(containerEl, settings);
        });
        /**
         * Given a command, adds the configuration
         * @param name
         * @param command
         */
        var addCommandSetting = function (name, command) {
            var commandEl = containerEl.createEl('div', {});
            var commandUrl = _this.plugin.commandUrlFromName(name);
            var commandDesc = "" + commandUrl;
            if (command.active) {
                new obsidian.Setting(commandEl)
                    .setName("" + name)
                    .setDesc(commandDesc)
                    // Type
                    .addDropdown(function (dropdown) {
                    dropdown.addOption('insert-text', 'Insert text');
                    dropdown.addOption('replace-text', 'Replace selected text');
                    dropdown.addOption('panel', 'Panel: text or lists');
                    dropdown.addOption('command-line', 'Chat');
                    // dropdown.addOption('graph', 'a graph');
                    dropdown.setValue(String(command.type)).onChange(function (value) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    command.type = value;
                                    return [4 /*yield*/, updateSetting(name, command)];
                                case 1:
                                    _a.sent();
                                    this.display();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                })
                    // Active or not
                    .addToggle(function (toggle) {
                    toggle.setValue(command.active);
                    toggle.onChange(function (value) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    command.active = value;
                                    return [4 /*yield*/, updateSetting(name, command)];
                                case 1:
                                    _a.sent();
                                    this.display();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                });
                var isWidget = command.type == 'panel' || command.type == 'command-line';
                new obsidian.Setting(commandEl)
                    .setDesc(isWidget ? 'Widget name' : 'Command name')
                    // Name
                    .addText(function (text) {
                    text.setValue(command.label);
                    text.onChange(function (value) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    command.label = value;
                                    return [4 /*yield*/, updateSetting(name, command)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                });
                if (isWidget) {
                    new obsidian.Setting(commandEl)
                        .setDesc('Widget icon')
                        // Icon
                        .addDropdown(function (dropdown) {
                        icons.forEach(function (icon) {
                            dropdown.addOption(icon, icon);
                        });
                        dropdown
                            .setValue(String(command.icon))
                            .onChange(function (value) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        command.icon = value;
                                        return [4 /*yield*/, updateSetting(name, command)];
                                    case 1:
                                        _a.sent();
                                        this.display();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                    })
                        .addExtraButton(function (b) {
                        b.setIcon(command.icon)
                            .setTooltip('Icon shown in the widget tab')
                            .onClick(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/];
                        }); }); });
                    });
                }
                if (command.type == 'panel') {
                    new obsidian.Setting(commandEl)
                        .setDesc('Additional triggers for panel')
                        .addDropdown(function (dropdown) {
                        dropdown.addOption('false', 'no triggers');
                        dropdown.addOption('true', 'trigers when opening a file');
                        dropdown
                            .setValue(String(command.invokeOnOpen))
                            .onChange(function (value) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        command.invokeOnOpen = value == 'true';
                                        return [4 /*yield*/, updateSetting(name, command)];
                                    case 1:
                                        _a.sent();
                                        this.display();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                    });
                }
            }
            else {
                new obsidian.Setting(commandEl)
                    .setName("" + name)
                    .setDesc(commandDesc)
                    // Active or not
                    .addToggle(function (toggle) {
                    toggle.setValue(command.active);
                    toggle.onChange(function (value) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    command.active = value;
                                    return [4 /*yield*/, updateSetting(name, command)];
                                case 1:
                                    _a.sent();
                                    this.display();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                });
            }
        };
    };
    PythonLabSettings.prototype.setFooter = function (containerEl, settings) {
        var _this = this;
        new obsidian.Setting(containerEl)
            .setName('Debug')
            .setDesc('')
            .addDropdown(function (dropdown) {
            dropdown.addOption('off', 'off');
            dropdown.addOption('verbose', 'verbose');
            // dropdown.addOption('graph', 'a graph');
            dropdown.setValue(String(settings.debug)).onChange(function (value) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.plugin.settings.debug = value;
                            return [4 /*yield*/, this.plugin.saveSettings()];
                        case 1:
                            _a.sent();
                            this.display();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        containerEl.createEl('a', {
            text: 'You can find a simple server at github: obsidian-lab-py',
            href: 'https://github.com/cristianvasquez/obsidian-lab-py',
        });
        containerEl.createEl('p', {
            text: 'Pull requests are both welcome and appreciated. :)',
        });
    };
    return PythonLabSettings;
}(obsidian.PluginSettingTab));

module.exports = PythonLabPlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsInNyYy92aWV3cy9sYWJWaWV3LnRzIiwic3JjL3ZpZXdzL3BhbmVsLnRzIiwic3JjL3ZpZXdzL2NoYXRWaWV3LnRzIiwic3JjL2ljb25zLnRzIiwic3JjL21haW4udHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxyXG5cclxuUGVybWlzc2lvbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgYW5kL29yIGRpc3RyaWJ1dGUgdGhpcyBzb2Z0d2FyZSBmb3IgYW55XHJcbnB1cnBvc2Ugd2l0aCBvciB3aXRob3V0IGZlZSBpcyBoZXJlYnkgZ3JhbnRlZC5cclxuXHJcblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIgQU5EIFRIRSBBVVRIT1IgRElTQ0xBSU1TIEFMTCBXQVJSQU5USUVTIFdJVEhcclxuUkVHQVJEIFRPIFRISVMgU09GVFdBUkUgSU5DTFVESU5HIEFMTCBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZXHJcbkFORCBGSVRORVNTLiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SIEJFIExJQUJMRSBGT1IgQU5ZIFNQRUNJQUwsIERJUkVDVCxcclxuSU5ESVJFQ1QsIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyBPUiBBTlkgREFNQUdFUyBXSEFUU09FVkVSIFJFU1VMVElORyBGUk9NXHJcbkxPU1MgT0YgVVNFLCBEQVRBIE9SIFBST0ZJVFMsIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBORUdMSUdFTkNFIE9SXHJcbk9USEVSIFRPUlRJT1VTIEFDVElPTiwgQVJJU0lORyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBVU0UgT1JcclxuUEVSRk9STUFOQ0UgT0YgVEhJUyBTT0ZUV0FSRS5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuLyogZ2xvYmFsIFJlZmxlY3QsIFByb21pc2UgKi9cclxuXHJcbnZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24oZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYiwgcCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHRlbmRzKGQsIGIpIHtcclxuICAgIGlmICh0eXBlb2YgYiAhPT0gXCJmdW5jdGlvblwiICYmIGIgIT09IG51bGwpXHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNsYXNzIGV4dGVuZHMgdmFsdWUgXCIgKyBTdHJpbmcoYikgKyBcIiBpcyBub3QgYSBjb25zdHJ1Y3RvciBvciBudWxsXCIpO1xyXG4gICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fYXNzaWduID0gZnVuY3Rpb24oKSB7XHJcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gX19hc3NpZ24odCkge1xyXG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpIHRbcF0gPSBzW3BdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdDtcclxuICAgIH1cclxuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZXN0KHMsIGUpIHtcclxuICAgIHZhciB0ID0ge307XHJcbiAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkgJiYgZS5pbmRleE9mKHApIDwgMClcclxuICAgICAgICB0W3BdID0gc1twXTtcclxuICAgIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgcCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7IGkgPCBwLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChlLmluZGV4T2YocFtpXSkgPCAwICYmIE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChzLCBwW2ldKSlcclxuICAgICAgICAgICAgICAgIHRbcFtpXV0gPSBzW3BbaV1dO1xyXG4gICAgICAgIH1cclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcGFyYW0ocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpIHtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5tZXRhZGF0YSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0ZXIodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19nZW5lcmF0b3IodGhpc0FyZywgYm9keSkge1xyXG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcclxuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XHJcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xyXG4gICAgICAgIHdoaWxlIChfKSB0cnkge1xyXG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XHJcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcclxuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xyXG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XHJcbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19jcmVhdGVCaW5kaW5nID0gT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbVtrXTsgfSB9KTtcclxufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBvW2syXSA9IG1ba107XHJcbn0pO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXhwb3J0U3RhcihtLCBvKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmIChwICE9PSBcImRlZmF1bHRcIiAmJiAhT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG8sIHApKSBfX2NyZWF0ZUJpbmRpbmcobywgbSwgcCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3ZhbHVlcyhvKSB7XHJcbiAgICB2YXIgcyA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBTeW1ib2wuaXRlcmF0b3IsIG0gPSBzICYmIG9bc10sIGkgPSAwO1xyXG4gICAgaWYgKG0pIHJldHVybiBtLmNhbGwobyk7XHJcbiAgICBpZiAobyAmJiB0eXBlb2Ygby5sZW5ndGggPT09IFwibnVtYmVyXCIpIHJldHVybiB7XHJcbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAobyAmJiBpID49IG8ubGVuZ3RoKSBvID0gdm9pZCAwO1xyXG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IocyA/IFwiT2JqZWN0IGlzIG5vdCBpdGVyYWJsZS5cIiA6IFwiU3ltYm9sLml0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVhZChvLCBuKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl07XHJcbiAgICBpZiAoIW0pIHJldHVybiBvO1xyXG4gICAgdmFyIGkgPSBtLmNhbGwobyksIHIsIGFyID0gW10sIGU7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHdoaWxlICgobiA9PT0gdm9pZCAwIHx8IG4tLSA+IDApICYmICEociA9IGkubmV4dCgpKS5kb25lKSBhci5wdXNoKHIudmFsdWUpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycm9yKSB7IGUgPSB7IGVycm9yOiBlcnJvciB9OyB9XHJcbiAgICBmaW5hbGx5IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAociAmJiAhci5kb25lICYmIChtID0gaVtcInJldHVyblwiXSkpIG0uY2FsbChpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxseSB7IGlmIChlKSB0aHJvdyBlLmVycm9yOyB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbi8qKiBAZGVwcmVjYXRlZCAqL1xyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWQoKSB7XHJcbiAgICBmb3IgKHZhciBhciA9IFtdLCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKylcclxuICAgICAgICBhciA9IGFyLmNvbmNhdChfX3JlYWQoYXJndW1lbnRzW2ldKSk7XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbi8qKiBAZGVwcmVjYXRlZCAqL1xyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWRBcnJheXMoKSB7XHJcbiAgICBmb3IgKHZhciBzID0gMCwgaSA9IDAsIGlsID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHMgKz0gYXJndW1lbnRzW2ldLmxlbmd0aDtcclxuICAgIGZvciAodmFyIHIgPSBBcnJheShzKSwgayA9IDAsIGkgPSAwOyBpIDwgaWw7IGkrKylcclxuICAgICAgICBmb3IgKHZhciBhID0gYXJndW1lbnRzW2ldLCBqID0gMCwgamwgPSBhLmxlbmd0aDsgaiA8IGpsOyBqKyssIGsrKylcclxuICAgICAgICAgICAgcltrXSA9IGFbal07XHJcbiAgICByZXR1cm4gcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkQXJyYXkodG8sIGZyb20pIHtcclxuICAgIGZvciAodmFyIGkgPSAwLCBpbCA9IGZyb20ubGVuZ3RoLCBqID0gdG8ubGVuZ3RoOyBpIDwgaWw7IGkrKywgaisrKVxyXG4gICAgICAgIHRvW2pdID0gZnJvbVtpXTtcclxuICAgIHJldHVybiB0bztcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXQodikge1xyXG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBfX2F3YWl0ID8gKHRoaXMudiA9IHYsIHRoaXMpIDogbmV3IF9fYXdhaXQodik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jR2VuZXJhdG9yKHRoaXNBcmcsIF9hcmd1bWVudHMsIGdlbmVyYXRvcikge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBnID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pLCBpLCBxID0gW107XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaWYgKGdbbl0pIGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKGEsIGIpIHsgcS5wdXNoKFtuLCB2LCBhLCBiXSkgPiAxIHx8IHJlc3VtZShuLCB2KTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHJlc3VtZShuLCB2KSB7IHRyeSB7IHN0ZXAoZ1tuXSh2KSk7IH0gY2F0Y2ggKGUpIHsgc2V0dGxlKHFbMF1bM10sIGUpOyB9IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAocikgeyByLnZhbHVlIGluc3RhbmNlb2YgX19hd2FpdCA/IFByb21pc2UucmVzb2x2ZShyLnZhbHVlLnYpLnRoZW4oZnVsZmlsbCwgcmVqZWN0KSA6IHNldHRsZShxWzBdWzJdLCByKTsgfVxyXG4gICAgZnVuY3Rpb24gZnVsZmlsbCh2YWx1ZSkgeyByZXN1bWUoXCJuZXh0XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gcmVqZWN0KHZhbHVlKSB7IHJlc3VtZShcInRocm93XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKGYsIHYpIHsgaWYgKGYodiksIHEuc2hpZnQoKSwgcS5sZW5ndGgpIHJlc3VtZShxWzBdWzBdLCBxWzBdWzFdKTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0RlbGVnYXRvcihvKSB7XHJcbiAgICB2YXIgaSwgcDtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiwgZnVuY3Rpb24gKGUpIHsgdGhyb3cgZTsgfSksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaVtuXSA9IG9bbl0gPyBmdW5jdGlvbiAodikgeyByZXR1cm4gKHAgPSAhcCkgPyB7IHZhbHVlOiBfX2F3YWl0KG9bbl0odikpLCBkb25lOiBuID09PSBcInJldHVyblwiIH0gOiBmID8gZih2KSA6IHY7IH0gOiBmOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jVmFsdWVzKG8pIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgbSA9IG9bU3ltYm9sLmFzeW5jSXRlcmF0b3JdLCBpO1xyXG4gICAgcmV0dXJuIG0gPyBtLmNhbGwobykgOiAobyA9IHR5cGVvZiBfX3ZhbHVlcyA9PT0gXCJmdW5jdGlvblwiID8gX192YWx1ZXMobykgOiBvW1N5bWJvbC5pdGVyYXRvcl0oKSwgaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGkpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlbbl0gPSBvW25dICYmIGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7IHYgPSBvW25dKHYpLCBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCB2LmRvbmUsIHYudmFsdWUpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgZCwgdikgeyBQcm9taXNlLnJlc29sdmUodikudGhlbihmdW5jdGlvbih2KSB7IHJlc29sdmUoeyB2YWx1ZTogdiwgZG9uZTogZCB9KTsgfSwgcmVqZWN0KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tYWtlVGVtcGxhdGVPYmplY3QoY29va2VkLCByYXcpIHtcclxuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgXCJyYXdcIiwgeyB2YWx1ZTogcmF3IH0pOyB9IGVsc2UgeyBjb29rZWQucmF3ID0gcmF3OyB9XHJcbiAgICByZXR1cm4gY29va2VkO1xyXG59O1xyXG5cclxudmFyIF9fc2V0TW9kdWxlRGVmYXVsdCA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgdikge1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2IH0pO1xyXG59KSA6IGZ1bmN0aW9uKG8sIHYpIHtcclxuICAgIG9bXCJkZWZhdWx0XCJdID0gdjtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydFN0YXIobW9kKSB7XHJcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xyXG4gICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKGsgIT09IFwiZGVmYXVsdFwiICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSBfX2NyZWF0ZUJpbmRpbmcocmVzdWx0LCBtb2QsIGspO1xyXG4gICAgX19zZXRNb2R1bGVEZWZhdWx0KHJlc3VsdCwgbW9kKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydERlZmF1bHQobW9kKSB7XHJcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IGRlZmF1bHQ6IG1vZCB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZEdldChyZWNlaXZlciwgcHJpdmF0ZU1hcCkge1xyXG4gICAgaWYgKCFwcml2YXRlTWFwLmhhcyhyZWNlaXZlcikpIHtcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiYXR0ZW1wdGVkIHRvIGdldCBwcml2YXRlIGZpZWxkIG9uIG5vbi1pbnN0YW5jZVwiKTtcclxuICAgIH1cclxuICAgIHJldHVybiBwcml2YXRlTWFwLmdldChyZWNlaXZlcik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2NsYXNzUHJpdmF0ZUZpZWxkU2V0KHJlY2VpdmVyLCBwcml2YXRlTWFwLCB2YWx1ZSkge1xyXG4gICAgaWYgKCFwcml2YXRlTWFwLmhhcyhyZWNlaXZlcikpIHtcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiYXR0ZW1wdGVkIHRvIHNldCBwcml2YXRlIGZpZWxkIG9uIG5vbi1pbnN0YW5jZVwiKTtcclxuICAgIH1cclxuICAgIHByaXZhdGVNYXAuc2V0KHJlY2VpdmVyLCB2YWx1ZSk7XHJcbiAgICByZXR1cm4gdmFsdWU7XHJcbn1cclxuIiwiaW1wb3J0IHtcbiAgICBJdGVtVmlldyxcbiAgICBXb3Jrc3BhY2VMZWFmLFxufSBmcm9tICdvYnNpZGlhbic7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGFiVmlldyBleHRlbmRzIEl0ZW1WaWV3IHtcbiAgICBwcm90ZWN0ZWQgY29tbWFuZDogQ29tbWFuZDtcbiAgICBwcm90ZWN0ZWQgY29tbWFuZElkOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvcihsZWFmOiBXb3Jrc3BhY2VMZWFmLCBjb21tYW5kSWQ6IHN0cmluZywgY29tbWFuZDogQ29tbWFuZCkge1xuICAgICAgICBzdXBlcihsZWFmKTtcbiAgICAgICAgdGhpcy5jb21tYW5kID0gY29tbWFuZDtcbiAgICAgICAgdGhpcy5jb21tYW5kSWQgPSBjb21tYW5kSWQ7XG4gICAgfVxuXG4gICAgcHVibGljIGdldFZpZXdUeXBlKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbW1hbmRJZDtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0RGlzcGxheVRleHQoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29tbWFuZC5sYWJlbCA9PSBudWxsID8gdGhpcy5jb21tYW5kSWQgOiB0aGlzLmNvbW1hbmQubGFiZWw7XG4gICAgfVxuXG4gICAgcHVibGljIGdldEljb24oKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29tbWFuZC5pY29uID09IG51bGwgPyAnbGFiJyA6IHRoaXMuY29tbWFuZC5pY29uO1xuICAgIH1cblxufSIsImltcG9ydCB7XG4gIE1lbnUsXG4gIFdvcmtzcGFjZUxlYWYsXG4gIEZpbGVTeXN0ZW1BZGFwdGVyLFxuICBOb3RpY2UsXG4gIFRGaWxlLFxufSBmcm9tICdvYnNpZGlhbic7XG5cbmltcG9ydCBMYWJWaWV3IGZyb20gJy4vbGFiVmlldyc7XG5cbmNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG5cbi8vIEEgcGFuZWwgdGhhdCBzaG93cyBub3RlcyBvciB0ZXh0LlxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGFiUGFuZWwgZXh0ZW5kcyBMYWJWaWV3IHtcbiAgcHJpdmF0ZSBzdGF0ZTogUGFuZWxTdGF0ZTtcblxuICBjb25zdHJ1Y3RvcihsZWFmOiBXb3Jrc3BhY2VMZWFmLCBjb21tYW5kSWQ6IHN0cmluZywgY29tbWFuZDogQ29tbWFuZCkge1xuICAgIHN1cGVyKGxlYWYsIGNvbW1hbmRJZCwgY29tbWFuZCk7XG4gICAgdGhpcy5kcmF3KCk7XG4gIH1cblxuICBwdWJsaWMgc2V0RGF0YShzdGF0ZTogUGFuZWxTdGF0ZSkge1xuICAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcbiAgfVxuXG4gIC8vIFVzZWQgdG8gaGFuZGxlICdmaWxlLW9wZW4nXG4gIHJlZ2lzdGVyT25GaWxlT3BlbihjYWxsYmFjazogKCkgPT4gUHJvbWlzZTx2b2lkPikge1xuICAgIGNvbnN0IGhhbmRsZU9wZW5GaWxlID0gYXN5bmMgKG9wZW5lZEZpbGU6IFRGaWxlKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgICBpZiAoIW9wZW5lZEZpbGUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgYXdhaXQgY2FsbGJhY2soKTtcbiAgICB9O1xuICAgIHRoaXMucmVnaXN0ZXJFdmVudCh0aGlzLmFwcC53b3Jrc3BhY2Uub24oJ2ZpbGUtb3BlbicsIGhhbmRsZU9wZW5GaWxlKSk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIG1lbnUgdGhhdCBhcHBlYXJzIHdpdGggcmlnaHQgY2xpY2sgb24gdGhlIGljb25cbiAgICovXG4gIHB1YmxpYyBvbkhlYWRlck1lbnUobWVudTogTWVudSk6IHZvaWQge1xuICAgIG1lbnVcbiAgICAgIC5hZGRJdGVtKChpdGVtKSA9PiB7XG4gICAgICAgIGl0ZW1cbiAgICAgICAgICAuc2V0VGl0bGUoJ0NsZWFyIGxpc3QnKVxuICAgICAgICAgIC5zZXRJY29uKCdzd2VlcCcpXG4gICAgICAgICAgLm9uQ2xpY2soYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmRyYXcoKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0pXG4gICAgICAuYWRkSXRlbSgoaXRlbSkgPT4ge1xuICAgICAgICBpdGVtXG4gICAgICAgICAgLnNldFRpdGxlKCdDbG9zZScpXG4gICAgICAgICAgLnNldEljb24oJ2Nyb3NzJylcbiAgICAgICAgICAub25DbGljaygoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmFwcC53b3Jrc3BhY2UuZGV0YWNoTGVhdmVzT2ZUeXBlKHRoaXMuY29tbWFuZElkKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0pO1xuICB9XG5cbiAgb25mb2N1c0hhbmRsZXI6IChvcGVuZWRGaWxlOiBURmlsZSkgPT4gUHJvbWlzZTx2b2lkPjtcblxuICBwdWJsaWMgbG9hZCgpOiB2b2lkIHtcbiAgICBzdXBlci5sb2FkKCk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgcGFuZWxcbiAgICovXG5cbiAgcHVibGljIHJlYWRvbmx5IGRyYXcgPSAoKTogdm9pZCA9PiB7XG4gICAgY29uc3Qgb3BlbkZpbGUgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuICAgIGNvbnN0IHJvb3RFbCA9IGNyZWF0ZURpdih7IGNsczogJ25hdi1mb2xkZXIgbW9kLXJvb3QnIH0pO1xuXG4gICAgdGhpcy5zdGF0ZSA9XG4gICAgICB0aGlzLnN0YXRlID09IG51bGxcbiAgICAgICAgPyB7XG4gICAgICAgICAgICBsYWJlbDogJycsXG4gICAgICAgICAgICBjb250ZW50czogJycsXG4gICAgICAgICAgfVxuICAgICAgICA6IHRoaXMuc3RhdGU7XG5cbiAgICAvLyBMYWJlbCBvZiB0aGUgcGFuZWxcbiAgICBjb25zdCBjb250ZXh0ID0gcm9vdEVsLmNyZWF0ZURpdih7XG4gICAgICB0aXRsZTogJ3RpdGxlJyxcbiAgICAgIGNsczogJ25hdi1maWxlIHB5dGhvbi1sYWItdGl0bGUnLFxuICAgICAgdGV4dDogdGhpcy5zdGF0ZS5sYWJlbCxcbiAgICB9KTtcblxuICAgIC8vIEZ1bmN0aW9uIG9wZW4gb24gY2xpY2tcbiAgICBsZXQgY2xpY2tFbGVtZW50ID0gKGZpbGU6IEl0ZW0sIHNob3VsZFNwbGl0ID0gZmFsc2UpOiB2b2lkID0+IHtcbiAgICAgIGxldCBmaWxlUGF0aCA9IGZpbGUucGF0aDtcblxuICAgICAgLy8gSWYgaXQgYXBwbGllcywgcmVtb3ZlIHRoZSB2YXVsdCBwYXRoXG4gICAgICBpZiAodGhpcy5hcHAudmF1bHQuYWRhcHRlciBpbnN0YW5jZW9mIEZpbGVTeXN0ZW1BZGFwdGVyKSB7XG4gICAgICAgIGNvbnN0IHZhdWx0UGF0aCA9IHRoaXMuYXBwLnZhdWx0LmFkYXB0ZXIuZ2V0QmFzZVBhdGgoKTtcbiAgICAgICAgaWYgKGZpbGVQYXRoLnN0YXJ0c1dpdGgodmF1bHRQYXRoKSkge1xuICAgICAgICAgIGZpbGVQYXRoID0gcGF0aC5yZWxhdGl2ZSh2YXVsdFBhdGgsIGZpbGVQYXRoKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCB0YXJnZXRGaWxlID0gdGhpcy5hcHAudmF1bHRcbiAgICAgICAgLmdldEZpbGVzKClcbiAgICAgICAgLmZpbmQoKGYpID0+IGYucGF0aCA9PT0gZmlsZVBhdGgpO1xuXG4gICAgICBpZiAodGFyZ2V0RmlsZSkge1xuICAgICAgICBsZXQgbGVhZiA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRNb3N0UmVjZW50TGVhZigpO1xuICAgICAgICBpZiAoc2hvdWxkU3BsaXQpIHtcbiAgICAgICAgICBsZWFmID0gdGhpcy5hcHAud29ya3NwYWNlLmNyZWF0ZUxlYWZCeVNwbGl0KGxlYWYpO1xuICAgICAgICB9XG4gICAgICAgIGxlYWYub3BlbkZpbGUodGFyZ2V0RmlsZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXcgTm90aWNlKGAnJHtmaWxlLnBhdGh9JyBub3QgZm91bmRgKTtcblxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh0aGlzLnN0YXRlLmNvbnRlbnRzKSkge1xuICAgICAgICAgIHRoaXMuc3RhdGUuY29udGVudHMgPSB0aGlzLnN0YXRlLmNvbnRlbnRzLmZpbHRlcihcbiAgICAgICAgICAgIChmcCkgPT4gZnAucGF0aCAhPT0gZmlsZS5wYXRoLFxuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmRyYXcoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gRHJhdyBhIGxpc3QsIHdoZW4gaXMgYSBsaXN0XG4gICAgaWYgKEFycmF5LmlzQXJyYXkodGhpcy5zdGF0ZS5jb250ZW50cykpIHtcbiAgICAgIHRoaXMuc3RhdGUuY29udGVudHMuZm9yRWFjaCgoY3VycmVudEZpbGUpID0+IHtcbiAgICAgICAgY29uc3QgY2hpbGRyZW5FbCA9IHJvb3RFbC5jcmVhdGVEaXYoeyBjbHM6ICduYXYtZm9sZGVyLWNoaWxkcmVuJyB9KTtcblxuICAgICAgICAvLyBUaGUgaW5mbyB0aGF0IHdpbGwgYXBwZWFyIG9uIGhvdmVyXG4gICAgICAgIGxldCBqc29uSW5mbyA9IEpTT04uc3RyaW5naWZ5KGN1cnJlbnRGaWxlLCBudWxsLCA0KTtcblxuICAgICAgICBjb25zdCBuYXZGaWxlID0gY2hpbGRyZW5FbC5jcmVhdGVEaXYoe1xuICAgICAgICAgIHRpdGxlOiBqc29uSW5mbyxcbiAgICAgICAgICBjbHM6ICduYXYtZmlsZScsXG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBuYXZGaWxlVGl0bGUgPSBuYXZGaWxlLmNyZWF0ZURpdih7IGNsczogJ25hdi1maWxlLXRpdGxlJyB9KTtcblxuICAgICAgICBpZiAob3BlbkZpbGUgJiYgY3VycmVudEZpbGUucGF0aCA9PT0gb3BlbkZpbGUucGF0aCkge1xuICAgICAgICAgIG5hdkZpbGVUaXRsZS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgIH1cblxuICAgICAgICBuYXZGaWxlVGl0bGUuY3JlYXRlRGl2KHtcbiAgICAgICAgICBjbHM6ICduYXYtZmlsZS10aXRsZS1jb250ZW50JyxcbiAgICAgICAgICB0ZXh0OiBjdXJyZW50RmlsZS5uYW1lLFxuICAgICAgICB9KTtcblxuICAgICAgICBuYXZGaWxlLm9uQ2xpY2tFdmVudCgoZXZlbnQpID0+XG4gICAgICAgICAgY2xpY2tFbGVtZW50KGN1cnJlbnRGaWxlLCBldmVudC5jdHJsS2V5IHx8IGV2ZW50Lm1ldGFLZXkpLFxuICAgICAgICApO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChTdHJpbmcuaXNTdHJpbmcodGhpcy5zdGF0ZS5jb250ZW50cykpIHtcbiAgICAgIC8vIERyYXcgdGhlIGNvbnRlbnRzIGFzIGEgbGlzdFxuICAgICAgcm9vdEVsLmNyZWF0ZURpdih7XG4gICAgICAgIHRpdGxlOiAnY29udGVudHMnLFxuICAgICAgICBjbHM6ICdweXRob24tbGFiLXRleHQnLFxuICAgICAgICB0ZXh0OiB0aGlzLnN0YXRlLmNvbnRlbnRzLFxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJvb3RFbC5jcmVhdGVEaXYoe1xuICAgICAgICB0aXRsZTogJ2NvbnRlbnRzJyxcbiAgICAgICAgY2xzOiAncHl0aG9uLWxhYi10ZXh0JyxcbiAgICAgICAgdGV4dDogSlNPTi5zdHJpbmdpZnkodGhpcy5zdGF0ZSwgbnVsbCwgMiksXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBjb250ZW50RWwgPSB0aGlzLmNvbnRhaW5lckVsLmNoaWxkcmVuWzFdO1xuICAgIGNvbnRlbnRFbC5lbXB0eSgpO1xuICAgIGNvbnRlbnRFbC5hcHBlbmRDaGlsZChyb290RWwpO1xuICB9O1xufVxuIiwiaW1wb3J0IHsgSXRlbVZpZXcsIFdvcmtzcGFjZUxlYWYsIE5vdGljZSwgVGV4dEFyZWFDb21wb25lbnQgfSBmcm9tICdvYnNpZGlhbic7XG5pbXBvcnQgeyBydW5JblRoaXNDb250ZXh0IH0gZnJvbSAndm0nO1xuaW1wb3J0IExhYlZpZXcgZnJvbSAnLi9sYWJWaWV3JztcblxuXG4vLyBUaGlzIGNoYXQgd2lkZ2V0IGlzIGJhc2VkIG9uIHRoZSAnZHVhbCcgcHJvdG90eXBlLlxuLy8gSSBmb3VuZCBpdCBwcmV0dHkuXG4vLyBodHRwczovL2dpdGh1Yi5jb20vUHNpb25pY2EvRHVhbC9ibG9iL21hc3Rlci92YXVsdC1yZXBsaWNhLy5vYnNpZGlhbi9wbHVnaW5zL0R1YWwvdmlldy50c1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDaGF0VmlldyBleHRlbmRzIExhYlZpZXcge1xuICBwcml2YXRlIG9uU2VuZE1lc3NhZ2U6ICgpID0+IFByb21pc2U8dm9pZD47XG4gIHByaXZhdGUgbGFzdElucHV0OiBzdHJpbmc7XG4gIHByaXZhdGUgc3RhdHVzOnN0cmluZztcblxuICBjb25zdHJ1Y3RvcihsZWFmOiBXb3Jrc3BhY2VMZWFmLCBjb21tYW5kSWQ6IHN0cmluZywgY29tbWFuZDogQ29tbWFuZCkge1xuICAgIHN1cGVyKGxlYWYsIGNvbW1hbmRJZCwgY29tbWFuZCk7XG4gICAgdGhpcy5kcmF3KCk7XG4gIH1cblxuICByZWdpc3Rlck9uU2VuZE1lc3NhZ2UoY2FsbGJhY2tXaXRoVmlldzogKCkgPT4gUHJvbWlzZTx2b2lkPikge1xuICAgIHRoaXMub25TZW5kTWVzc2FnZSA9IGNhbGxiYWNrV2l0aFZpZXc7XG4gIH1cblxuICBsb2FkKCk6IHZvaWQge1xuICAgIHN1cGVyLmxvYWQoKTtcbiAgICB0aGlzLmRyYXcoKTtcbiAgfVxuXG4gIC8vIFRoZSB1c2UgaW5wdXRcbiAgZ2V0TGFzdElucHV0KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMubGFzdElucHV0O1xuICB9XG5cbiAgc2VuZE1lc3NhZ2UoKTogdm9pZCB7XG4gICAgbGV0IGlucHV0ID0gPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lucHV0Jyk7XG4gICAgbGV0IHJlcGxpZWQgPSBmYWxzZTtcblxuICAgIGlmIChpbnB1dC52YWx1ZSAhPSAnJykge1xuICAgICAgdGhpcy5kcmF3TWVzc2FnZShpbnB1dC52YWx1ZSwgJ3JpZ2h0Jyk7XG5cbiAgICAgIGxldCB0eXBpbmdQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+XG4gICAgICAgIHNldFRpbWVvdXQocmVzb2x2ZSwgMzAwMCksXG4gICAgICApLnRoZW4oKCkgPT4ge1xuICAgICAgICBpZiAocmVwbGllZCA9PSBmYWxzZSkge1xuICAgICAgICAgIHRoaXMuc2V0U3RhdHVzKCdsb2FkaW5nLi4uJyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLmxhc3RJbnB1dCA9IGlucHV0LnZhbHVlO1xuXG4gICAgICB0aGlzLm9uU2VuZE1lc3NhZ2UoKS50aGVuKChyZXNwb25zZTogYW55KSA9PiB7XG5cbiAgICAgICAgaWYgKHJlc3BvbnNlLmNvbnRlbnRzKXtcbiAgICAgICAgICBsZXQgbWVzc2FnZSA9IEpTT04uc3RyaW5naWZ5KHJlc3BvbnNlLmNvbnRlbnRzKTtcbiAgICAgICAgICB0aGlzLmRyYXdNZXNzYWdlKG1lc3NhZ2UsICdsZWZ0Jyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXBsaWVkID0gdHJ1ZTtcbiAgICAgIH0pO1xuXG4gICAgICBpbnB1dC52YWx1ZSA9ICcnO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBkcmF3KCk6IHZvaWQge1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuY29udGFpbmVyRWwuY2hpbGRyZW5bMV07XG5cbiAgICBjb25zdCByb290RWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAgIGNvbnN0IGhlYWRlckRpdiA9IHJvb3RFbC5jcmVhdGVEaXYoeyBjbHM6ICduYXYtaGVhZGVyJyB9KTtcbiAgICBjb25zdCBmb290ZXJEaXYgPSByb290RWwuY3JlYXRlRGl2KHsgY2xzOiAnbmF2LWhlYWRlcicgfSk7XG5cbiAgICBsZXQgaGVhZGVyID0gaGVhZGVyRGl2LmNyZWF0ZUVsKCdoMycpO1xuICAgIGhlYWRlci5hcHBlbmRUZXh0KHN1cGVyLmdldERpc3BsYXlUZXh0KCkpO1xuICAgIGhlYWRlci5zdHlsZS50ZXh0QWxpZ24gPSAnbGVmdCc7XG4gICAgaGVhZGVyLnN0eWxlLm1hcmdpblRvcCA9ICcwcHgnO1xuICAgIGhlYWRlci5zdHlsZS5tYXJnaW5Cb3R0b20gPSAnMHB4JztcbiAgICBoZWFkZXIuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgIGhlYWRlci5zdHlsZS50b3AgPSAnMTVweCc7XG5cbiAgICBsZXQgc3RhdHVzID0gaGVhZGVyRGl2LmNyZWF0ZUVsKCdoNicpO1xuICAgIHN0YXR1cy5pZCA9ICdzdGF0dXMnO1xuXG4gICAgaWYgKHRoaXMuc3RhdHVzKXtcbiAgICAgIHN0YXR1cy5hcHBlbmRUZXh0KCdvbmxpbmUnKTtcbiAgICB9XG5cbiAgICBzdGF0dXMuc3R5bGUudGV4dEFsaWduID0gJ2xlZnQnO1xuICAgIHN0YXR1cy5zdHlsZS5tYXJnaW5Ub3AgPSAnMHB4JztcbiAgICBzdGF0dXMuc3R5bGUubWFyZ2luQm90dG9tID0gJzVweCc7XG4gICAgc3RhdHVzLnN0eWxlLmNvbG9yID0gJ2dyZXknO1xuXG4gICAgbGV0IGNvbnZlcnNhdGlvbkRpdiA9IGhlYWRlckRpdi5jcmVhdGVEaXYoeyBjbHM6ICduYXYtaGVhZGVyJyB9KTtcbiAgICBjb252ZXJzYXRpb25EaXYuaWQgPSAnY29udmVyc2F0aW9uRGl2JztcbiAgICBjb252ZXJzYXRpb25EaXYuc3R5bGUucGFkZGluZyA9ICcwJztcbiAgICBjb252ZXJzYXRpb25EaXYuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJ3ZhcigtLWJhY2tncm91bmQtc2Vjb25kYXJ5LWFsdCknO1xuICAgIGNvbnZlcnNhdGlvbkRpdi5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgY29udmVyc2F0aW9uRGl2LnN0eWxlLmxlZnQgPSAnMCc7XG4gICAgY29udmVyc2F0aW9uRGl2LnN0eWxlLndpZHRoID0gJzEwMCUnO1xuICAgIGNvbnZlcnNhdGlvbkRpdi5zdHlsZS5wYWRkaW5nTGVmdCA9ICcxMHB4JztcbiAgICBjb252ZXJzYXRpb25EaXYuc3R5bGUucGFkZGluZ1JpZ2h0ID0gJzEwcHgnO1xuICAgIGNvbnZlcnNhdGlvbkRpdi5zdHlsZS5vdmVyZmxvd1kgPSAnc2Nyb2xsJztcbiAgICBjb252ZXJzYXRpb25EaXYuc3R5bGUuaGVpZ2h0ID0gJ2NhbGMoMTAwJSAtIDExMHB4KSc7XG5cbiAgICBsZXQgaW5wdXQgPSBmb290ZXJEaXYuY3JlYXRlRWwoJ2lucHV0Jyk7XG4gICAgaW5wdXQuaWQgPSAnaW5wdXQnO1xuICAgIGlucHV0LnR5cGUgPSAndGV4dCc7XG4gICAgaW5wdXQuc3R5bGUuZm9udFNpemUgPSAnMC44ZW0nO1xuICAgIGlucHV0LnN0eWxlLnBhZGRpbmdJbmxpbmVTdGFydCA9ICcyJSc7XG4gICAgaW5wdXQuc3R5bGUucGFkZGluZ0lubGluZUVuZCA9ICcyJSc7XG4gICAgaW5wdXQuc3R5bGUubWFyZ2luVG9wID0gJzBweCc7XG4gICAgaW5wdXQuc3R5bGUubWFyZ2luQm90dG9tID0gJzEwcHgnO1xuICAgIGlucHV0LnN0eWxlLm1heFdpZHRoID0gJzY4JSc7XG4gICAgaW5wdXQuc3R5bGUubWluV2lkdGggPSAnNjglJztcbiAgICBpbnB1dC5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgaW5wdXQuc3R5bGUuYm90dG9tID0gJzAnO1xuICAgIGlucHV0LnN0eWxlLmxlZnQgPSAnNSUnO1xuXG4gICAgbGV0IGJ1dHRvbiA9IGZvb3RlckRpdi5jcmVhdGVFbCgnYnV0dG9uJyk7XG4gICAgYnV0dG9uLmFwcGVuZFRleHQoJ1NlbmQnKTtcbiAgICBidXR0b24uaWQgPSAnc2VuZC1idXR0b24nO1xuICAgIGJ1dHRvbi5zdHlsZS5hbGlnbkl0ZW1zID0gJ2xlZnQnO1xuICAgIGJ1dHRvbi5zdHlsZS5wYWRkaW5nSW5saW5lU3RhcnQgPSAnMiUnO1xuICAgIGJ1dHRvbi5zdHlsZS5wYWRkaW5nSW5saW5lRW5kID0gJzIlJztcbiAgICBidXR0b24uc3R5bGUubWFyZ2luVG9wID0gJzBweCc7XG4gICAgYnV0dG9uLnN0eWxlLm1hcmdpbkJvdHRvbSA9ICcxMHB4JztcbiAgICBidXR0b24uc3R5bGUud2lkdGggPSAnMjAlJztcbiAgICBidXR0b24uc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgIGJ1dHRvbi5zdHlsZS5ib3R0b20gPSAnMCc7XG4gICAgYnV0dG9uLnN0eWxlLmxlZnQgPSAnNzUlJztcblxuICAgIHRoaXMucmVnaXN0ZXJEb21FdmVudChidXR0b24sICdjbGljaycsICgpID0+IHRoaXMuc2VuZE1lc3NhZ2UoKSk7XG4gICAgdGhpcy5yZWdpc3RlckRvbUV2ZW50KGlucHV0LCAna2V5ZG93bicsIChldmVudCkgPT4ge1xuICAgICAgaWYgKGV2ZW50LmtleSA9PSAnRW50ZXInKSB7XG4gICAgICAgIHRoaXMuc2VuZE1lc3NhZ2UoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnRhaW5lci5lbXB0eSgpO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChyb290RWwpO1xuICB9XG5cbiAgcHJpdmF0ZSBkcmF3TWVzc2FnZShjb250ZW50OiBzdHJpbmcsIHNpZGU6IHN0cmluZyk6IHZvaWQge1xuICAgIGxldCBjb252ZXJzYXRpb25EaXYgPSA8SFRNTERpdkVsZW1lbnQ+KFxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnZlcnNhdGlvbkRpdicpXG4gICAgKTtcbiAgICBsZXQgcCA9IGNvbnZlcnNhdGlvbkRpdi5jcmVhdGVFbCgncCcpO1xuICAgIHAuYXBwZW5kVGV4dChjb250ZW50KTtcbiAgICBwLnN0eWxlLnRleHRBbGlnbiA9ICdsZWZ0JztcbiAgICBwLnN0eWxlLmZvbnRTaXplID0gJzAuOGVtJztcbiAgICBwLnN0eWxlLmJvcmRlclJhZGl1cyA9ICc1cHgnO1xuICAgIHAuc3R5bGUubGluZUhlaWdodCA9ICcxOHB4JztcbiAgICBwLnN0eWxlLnBhZGRpbmcgPSAnNXB4JztcblxuICAgIGlmIChzaWRlID09ICdyaWdodCcpIHtcbiAgICAgIHAuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJ3ZhcigtLWJhY2tncm91bmQtcHJpbWFyeSknO1xuICAgIH0gZWxzZSB7XG4gICAgICBwLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICd2YXIoLS1iYWNrZ3JvdW5kLXNlY29uZGFyeSknO1xuICAgIH1cblxuICAgIHAuc3R5bGUud2lkdGggPSAnOTAlJztcbiAgICBwLnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcblxuICAgIGlmIChzaWRlID09ICdyaWdodCcpIHtcbiAgICAgIHAuc3R5bGUubGVmdCA9ICcxMCUnO1xuICAgIH1cblxuICAgIGNvbnZlcnNhdGlvbkRpdi5zY3JvbGxCeSgwLCAxMDAwKTtcbiAgfVxuXG4gIHByaXZhdGUgc2V0U3RhdHVzKGNvbnRlbnQ6IHN0cmluZyk6IHZvaWQge1xuICAgIGxldCBzdGF0dXNQID0gPEhUTUxQYXJhZ3JhcGhFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdGF0dXMnKTtcbiAgICBzdGF0dXNQLnNldFRleHQoY29udGVudCk7XG4gIH1cbn1cbiIsImNvbnN0IHN3ZWVwSWNvbiA9IGBcbjxzdmcgZmlsbD1cImN1cnJlbnRDb2xvclwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHZlcnNpb249XCIxLjFcIiB2aWV3Qm94PVwiMCAwIDUxMiA1MTJcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+XG4gIDxwYXRoIGQ9XCJtNDk1LjcyIDEuNTgyYy03LjQ1Ni0zLjY5MS0xNi40MjEtMC43MDMtMjAuMTQyIDYuNjk0bC0xMzYuOTIgMjc0LjA4LTI2LjgxOC0xMy40MzNjLTIyLjIwNy0xMS4xMTgtNDkuMjc3LTIuMDY1LTYwLjM5NiAyMC4wODNsLTYuNzEzIDEzLjQwNSAxNjAuOTYgODAuNjE2IDYuNzEzLTEzLjQxMWMxMS4wODctMjIuMTQzIDIuMjI3LTQ5LjE4LTIwLjA4My02MC4zODFsLTI2LjgyMy0xMy40MzUgMTM2LjkyLTI3NC4wOGMzLjcwNi03LjQxMiAwLjcwMy0xNi40MjEtNi42OTQtMjAuMTQxelwiLz5cbiAgPGNpcmNsZSBjeD1cIjE3M1wiIGN5PVwiNDk3XCIgcj1cIjE1XCIvPlxuICA8Y2lyY2xlIGN4PVwiMjNcIiBjeT1cIjQwN1wiIHI9XCIxNVwiLz5cbiAgPGNpcmNsZSBjeD1cIjgzXCIgY3k9XCI0MzdcIiByPVwiMTVcIi8+XG4gIDxwYXRoIGQ9XCJtMTEzIDQ4MmgtNjBjLTguMjc2IDAtMTUtNi43MjQtMTUtMTUgMC04LjI5MS02LjcwOS0xNS0xNS0xNXMtMTUgNi43MDktMTUgMTVjMCAyNC44MTQgMjAuMTg2IDQ1IDQ1IDQ1aDYwYzguMjkxIDAgMTUtNi43MDkgMTUtMTVzLTYuNzA5LTE1LTE1LTE1elwiLz5cbiAgPHBhdGggZD1cIm0xMDguNjQgMzg4LjA3Yy02LjU2MyAwLjgyLTExLjgwNyA1Ljg0NS0xMi45MiAxMi4zNDktMS4xMTMgNi41MTkgMi4xNTMgMTIuOTkzIDguMDU3IDE1Ljk1Mmw3MS42NzUgMzUuODg5YzEyLjkzNSA2LjQ3NSAyNy4yMzEgOS4wNTMgNDEuMTc3IDcuNTczLTEuNjQxIDYuNjUgMS40NzkgMTMuNzg0IDcuODUyIDE2Ljk5Mmw2Ny4wNjEgMzMuNTg5YzUuNjM2IDIuNzggMTIuMTY5IDEuOCAxNi42ODUtMi4xOTcgMi4zNDctMi4wOTEgNTMuNDM2LTQ4LjA1NiA4My4zLTk4LjcxOGwtMTYxLjYtODAuOTRjLTM2LjIwOCA0OC4xMDktMTIwLjM2IDU5LjM5LTEyMS4yOCA1OS41MTF6XCIvPlxuPC9zdmc+YDtcblxuLy8gRnJvbTogaHR0cHM6Ly9naXRodWIuY29tL21nbWV5ZXJzL29ic2lkaWFuLWljb24tc3dhcHBlclxuY29uc3QgaWNvbnM6IHN0cmluZ1tdID0gW1xuICAnbGFiJyxcbiAgJ3N3ZWVwJyxcbiAgJ2FueS1rZXknLFxuICAnYXVkaW8tZmlsZScsXG4gICdibG9ja3MnLFxuICAnYm9sZC1nbHlwaCcsXG4gICdicmFja2V0LWdseXBoJyxcbiAgJ2Jyb2tlbi1saW5rJyxcbiAgJ2J1bGxldC1saXN0LWdseXBoJyxcbiAgJ2J1bGxldC1saXN0JyxcbiAgJ2NhbGVuZGFyLXdpdGgtY2hlY2ttYXJrJyxcbiAgJ2NoZWNrLWluLWNpcmNsZScsXG4gICdjaGVjay1zbWFsbCcsXG4gICdjaGVja2JveC1nbHlwaCcsXG4gICdjaGVja21hcmsnLFxuICAnY2xvY2snLFxuICAnY2xvdWQnLFxuICAnY29kZS1nbHlwaCcsXG4gICdjcmVhdGUtbmV3JyxcbiAgJ2Nyb3NzLWluLWJveCcsXG4gICdjcm9zcycsXG4gICdjcm9zc2VkLXN0YXInLFxuICAnZGljZScsXG4gICdkb2N1bWVudCcsXG4gICdkb2N1bWVudHMnLFxuICAnZG90LW5ldHdvcmsnLFxuICAnZG91YmxlLWRvd24tYXJyb3ctZ2x5cGgnLFxuICAnZG91YmxlLXVwLWFycm93LWdseXBoJyxcbiAgJ2Rvd24tYXJyb3ctd2l0aC10YWlsJyxcbiAgJ2Rvd24tY2hldnJvbi1nbHlwaCcsXG4gICdlbnRlcicsXG4gICdleGl0LWZ1bGxzY3JlZW4nLFxuICAnZXhwYW5kLXZlcnRpY2FsbHknLFxuICAnZmlsbGVkLXBpbicsXG4gICdmb2xkZXInLFxuICAnZm9yd2FyZC1hcnJvdycsXG4gICdmdWxsc2NyZWVuJyxcbiAgJ2dlYXInLFxuICAnZ28tdG8tZmlsZScsXG4gICdoYXNodGFnJyxcbiAgJ2hlYWRpbmctZ2x5cGgnLFxuICAnaGVscCcsXG4gICdoaWdobGlnaHQtZ2x5cGgnLFxuICAnaG9yaXpvbnRhbC1zcGxpdCcsXG4gICdpbWFnZS1maWxlJyxcbiAgJ2ltYWdlLWdseXBoJyxcbiAgJ2luZGVudC1nbHlwaCcsXG4gICdpbmZvJyxcbiAgJ2luc3RhbGwnLFxuICAnaXRhbGljLWdseXBoJyxcbiAgJ2tleWJvYXJkLWdseXBoJyxcbiAgJ2xhbmd1YWdlcycsXG4gICdsZWZ0LWFycm93LXdpdGgtdGFpbCcsXG4gICdsZWZ0LWFycm93JyxcbiAgJ2xlZnQtY2hldnJvbi1nbHlwaCcsXG4gICdsaW5lcy1vZi10ZXh0JyxcbiAgJ2xpbmstZ2x5cGgnLFxuICAnbGluaycsXG4gICdsb2dvLWNyeXN0YWwnLFxuICAnbWFnbmlmeWluZy1nbGFzcycsXG4gICdtaWNyb3Bob25lLWZpbGxlZCcsXG4gICdtaWNyb3Bob25lJyxcbiAgJ21pbnVzLXdpdGgtY2lyY2xlJyxcbiAgJ25vdGUtZ2x5cGgnLFxuICAnbnVtYmVyLWxpc3QtZ2x5cGgnLFxuICAnb3Blbi12YXVsdCcsXG4gICdwYW5lLWxheW91dCcsXG4gICdwYXBlci1wbGFuZScsXG4gICdwYXVzZWQnLFxuICAncGRmLWZpbGUnLFxuICAncGVuY2lsJyxcbiAgJ3BlcmNlbnQtc2lnbi1nbHlwaCcsXG4gICdwaW4nLFxuICAncGx1cy13aXRoLWNpcmNsZScsXG4gICdwb3B1cC1vcGVuJyxcbiAgJ3ByZXNlbnRhdGlvbicsXG4gICdwcmljZS10YWctZ2x5cGgnLFxuICAncXVvdGUtZ2x5cGgnLFxuICAncmVkby1nbHlwaCcsXG4gICdyZXNldCcsXG4gICdyaWdodC1hcnJvdy13aXRoLXRhaWwnLFxuICAncmlnaHQtYXJyb3cnLFxuICAncmlnaHQtY2hldnJvbi1nbHlwaCcsXG4gICdyaWdodC10cmlhbmdsZScsXG4gICdydW4tY29tbWFuZCcsXG4gICdzZWFyY2gnLFxuICAnc2hlZXRzLWluLWJveCcsXG4gICdzdGFja2VkLWxldmVscycsXG4gICdzdGFyLWxpc3QnLFxuICAnc3RhcicsXG4gICdzdHJpa2V0aHJvdWdoLWdseXBoJyxcbiAgJ3N3aXRjaCcsXG4gICdzeW5jLXNtYWxsJyxcbiAgJ3N5bmMnLFxuICAndGFnLWdseXBoJyxcbiAgJ3RocmVlLWhvcml6b250YWwtYmFycycsXG4gICd0cmFzaCcsXG4gICd1bmRvLWdseXBoJyxcbiAgJ3VuaW5kZW50LWdseXBoJyxcbiAgJ3VwLWFuZC1kb3duLWFycm93cycsXG4gICd1cC1hcnJvdy13aXRoLXRhaWwnLFxuICAndXAtY2hldnJvbi1nbHlwaCcsXG4gICd1cHBlcmNhc2UtbG93ZXJjYXNlLWEnLFxuICAndmF1bHQnLFxuICAndmVydGljYWwtc3BsaXQnLFxuICAndmVydGljYWwtdGhyZWUtZG90cycsXG4gICd3cmVuY2gtc2NyZXdkcml2ZXItZ2x5cGgnLFxuXTtcblxuZXhwb3J0IHsgaWNvbnMsIHN3ZWVwSWNvbiB9O1xuIiwiaW1wb3J0IHtcbiAgYWRkSWNvbixcbiAgQXBwLFxuICBGaWxlU3lzdGVtQWRhcHRlcixcbiAgTWFya2Rvd25WaWV3LFxuICBOb3RpY2UsXG4gIFBsdWdpbixcbiAgUGx1Z2luU2V0dGluZ1RhYixcbiAgU2V0dGluZyxcbiAgV29ya3NwYWNlTGVhZixcbiAgVmlld0NyZWF0b3IsXG59IGZyb20gJ29ic2lkaWFuJztcbmltcG9ydCBMYWJQYW5lbCBmcm9tICcuL3ZpZXdzL3BhbmVsJztcbmltcG9ydCBDaGF0VmlldyBmcm9tICcuL3ZpZXdzL2NoYXRWaWV3JztcbmltcG9ydCB7IGljb25zLCBzd2VlcEljb24gfSBmcm9tICcuL2ljb25zJztcbmNvbnN0IENPTU1BTkRfUFJFRklYID0gJ29ic2lkaWFuX2xhYl8nO1xuXG5jb25zdCBERUZBVUxUX0lDT04gPSAnZ2Vhcic7XG5cbmNvbnN0IERFRkFVTFRfU0VUVElOR1M6IFNldHRpbmdzID0ge1xuICBzZXJ2ZXJfdXJsOiAnaHR0cDovL2xvY2FsaG9zdDo1MDAwJyxcbiAgZGVidWc6ICd2ZXJib3NlJyxcbiAgY29tbWFuZHM6IHtcbiAgICBoZWxsb193b3JsZDoge1xuICAgICAgYWN0aXZlOiB0cnVlLFxuICAgICAgbGFiZWw6ICdIZWxsbyB3b3JsZCcsXG4gICAgICB0eXBlOiAnaW5zZXJ0LXRleHQnLFxuICAgIH0sXG5cbiAgICB0b191cHBlcl9jYXNlOiB7XG4gICAgICBhY3RpdmU6IGZhbHNlLFxuICAgICAgbGFiZWw6ICdDb252ZXJ0IHRvIHVwcGVyIGNhc2UnLFxuICAgICAgdHlwZTogJ3JlcGxhY2UtdGV4dCcsXG4gICAgfSxcblxuICAgIGNoYXQ6IHtcbiAgICAgIGFjdGl2ZTogZmFsc2UsXG4gICAgICBsYWJlbDogJ1NpbXBsZSBjaGF0IHNlcnZpY2UnLFxuICAgICAgdHlwZTogJ2NvbW1hbmQtbGluZScsXG4gICAgfSxcblxuICAgIHJhbmRvbV9zaW1pbGFyaXR5OiB7XG4gICAgICBhY3RpdmU6IHRydWUsXG4gICAgICBsYWJlbDogJ1JhbmRvbSBzY29yZSBzaW1pbGFyaXR5JyxcbiAgICAgIHR5cGU6ICdwYW5lbCcsXG4gICAgICBpY29uOiBERUZBVUxUX0lDT04sXG4gICAgICBpbnZva2VPbk9wZW46IHRydWUsXG4gICAgfSxcbiAgfSxcbn07XG5cbmFzeW5jIGZ1bmN0aW9uIGdldFNlcnZlclN0YXR1cyhzZXJ2ZXJVcmw6IHN0cmluZykge1xuICBjb25zdCByZXN1bHQ6IFNlcnZlclN0YXR1cyA9IGF3YWl0IGZldGNoKHNlcnZlclVybCwge1xuICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgaGVhZGVyczoge1xuICAgICAgJ2NvbnRlbnQtdHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICB9LFxuICB9KVxuICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcbiAgICB9KVxuICAgIC50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICBjb25zdCBzdGF0dXM6IFNlcnZlclN0YXR1cyA9IHtcbiAgICAgICAgc3RhdHVzOiAnYXZhaWxhYmxlJyxcbiAgICAgICAgYXZhaWxhYmxlQ29tbWFuZFVybHM6IGRhdGEuc2NyaXB0cyA/IGRhdGEuc2NyaXB0cyA6IFtdLFxuICAgICAgfTtcbiAgICAgIHJldHVybiBzdGF0dXM7XG4gICAgfSlcbiAgICAuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBzdGF0dXM6ICd1bmF2YWlsYWJsZScsXG4gICAgICAgIGF2YWlsYWJsZUNvbW1hbmRVcmxzOiBbXSxcbiAgICAgICAgZXJyb3I6IGVycm9yLFxuICAgICAgfTtcbiAgICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gY29tbWFuZElkRnJvbU5hbWUoY29tbWFuZF9uYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gYCR7Q09NTUFORF9QUkVGSVh9JHtjb21tYW5kX25hbWV9YDtcbn1cblxuZnVuY3Rpb24gZ2V0TmFtZUZyb21VcmwoY3VycmVudFVybDogYW55KSB7XG4gIHJldHVybiBjdXJyZW50VXJsLnN1YnN0cmluZyhjdXJyZW50VXJsLmxhc3RJbmRleE9mKCcvJykgKyAxKTtcbn1cblxuZnVuY3Rpb24gbG9hZENvbW1hbmRzKFxuICBjb21tYW5kVXJsczogc3RyaW5nW10sXG4gIGNvbW1hbmRTZXR0aW5nczogUmVjb3JkPHN0cmluZywgQ29tbWFuZD4sXG4pIHtcbiAgbGV0IHJlc3VsdDogTWFwPHN0cmluZywgQ29tbWFuZD4gPSBuZXcgTWFwKCk7XG4gIGZvciAoY29uc3QgY29tbWFuZFVSTCBvZiBjb21tYW5kVXJscykge1xuICAgIGxldCBjb21tYW5kTmFtZSA9IGdldE5hbWVGcm9tVXJsKGNvbW1hbmRVUkwpO1xuXG4gICAgLy8gSWYgdGhlIHNldHRpbmdzIGZvciB0aGlzIGNvbW1hbmQgYXJlIGFscmVhZHkgc3RvcmVkXG4gICAgaWYgKGNvbW1hbmRTZXR0aW5nc1tjb21tYW5kTmFtZV0pIHtcbiAgICAgIHJlc3VsdC5zZXQoY29tbWFuZE5hbWUsIGNvbW1hbmRTZXR0aW5nc1tjb21tYW5kTmFtZV0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBPdGhlcndpc2UgdXNlIHRoZSBkZWZhdWx0IG9uZVxuICAgICAgcmVzdWx0LnNldChjb21tYW5kTmFtZSwge1xuICAgICAgICBsYWJlbDogY29tbWFuZE5hbWUsXG4gICAgICAgIHR5cGU6ICdpbnNlcnQtdGV4dCcsXG4gICAgICAgIGFjdGl2ZTogZmFsc2UsXG4gICAgICAgIGludm9rZU9uT3BlbjogZmFsc2UsXG4gICAgICAgIGljb246ICdsYWInLFxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFB5dGhvbkxhYlBsdWdpbiBleHRlbmRzIFBsdWdpbiB7XG4gIHB1YmxpYyBzZXR0aW5nczogU2V0dGluZ3M7XG5cbiAgcHVibGljIGNvbW1hbmRVcmxGcm9tTmFtZShjb21tYW5kX25hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGAke3RoaXMuc2V0dGluZ3Muc2VydmVyX3VybH0vJHtjb21tYW5kX25hbWV9YDtcbiAgfVxuXG4gIHB1YmxpYyBnZXRWYXVsdFBhdGgoKTogc3RyaW5nIHtcbiAgICBpZiAoISh0aGlzLmFwcC52YXVsdC5hZGFwdGVyIGluc3RhbmNlb2YgRmlsZVN5c3RlbUFkYXB0ZXIpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2FwcC52YXVsdCBpcyBub3QgYSBGaWxlU3lzdGVtQWRhcHRlciBpbnN0YW5jZScpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5hcHAudmF1bHQuYWRhcHRlci5nZXRCYXNlUGF0aCgpO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGxvYWRDb21tYW5kUGFuZXMoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy5sb2FkU2V0dGluZ3MoKTtcbiAgICBjb25zdCBzZXJ2ZXJTdGF0dXMgPSBhd2FpdCBnZXRTZXJ2ZXJTdGF0dXModGhpcy5zZXR0aW5ncy5zZXJ2ZXJfdXJsKTtcblxuICAgIC8vIERldGFjaCBwYW5lc1xuICAgIC8vIERpc2NsYWltZXI6IEkgc3RpbGwgY2Fubm90IGZpZ3VyZSBvdXQgaG93IHRvIGRldGFjaCBvciB1bnJlZ2lzdGVyIGFsbCBsZWF2ZXMgcHJvZHVjZWQgYnkgdGhpcyBwbHVnaW5cbiAgICAvLyBUaGUgaW50ZW50aW9uIGhlcmUgaXMgdG8gY2xlYW4gYWxsIGxlYXZlcyBvZiBjcmVhdGVkIGJ5IHRoZSBsYWIuIEBUT0RPIGRldGFjaCBwcm9wZXJseSBpbiB0aGUgZnV0dXJlXG4gICAgdGhpcy5hcHAud29ya3NwYWNlLml0ZXJhdGVBbGxMZWF2ZXMoKGxlYWY6IFdvcmtzcGFjZUxlYWYpID0+IHtcbiAgICAgIGlmIChsZWFmLmdldFZpZXdTdGF0ZSgpLnR5cGUuc3RhcnRzV2l0aChDT01NQU5EX1BSRUZJWCkpIHtcbiAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MuZGVidWcgPT0gJ3ZlcmJvc2UnKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ2RldGFjaGluZycsIGxlYWYuZ2V0Vmlld1N0YXRlKCkudHlwZSk7XG4gICAgICAgIH1cbiAgICAgICAgbGVhZi5kZXRhY2goKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChzZXJ2ZXJTdGF0dXMuc3RhdHVzID09ICdhdmFpbGFibGUnKSB7XG4gICAgICBjb25zdCBhdmFpbGFibGVDb21tYW5kczogTWFwPHN0cmluZywgQ29tbWFuZD4gPSBsb2FkQ29tbWFuZHMoXG4gICAgICAgIHNlcnZlclN0YXR1cy5hdmFpbGFibGVDb21tYW5kVXJscyxcbiAgICAgICAgdGhpcy5zZXR0aW5ncy5jb21tYW5kcyxcbiAgICAgICk7XG4gICAgICBmb3IgKGxldCBbbmFtZSwgY29tbWFuZF0gb2YgYXZhaWxhYmxlQ29tbWFuZHMpIHtcbiAgICAgICAgaWYgKGNvbW1hbmQuYWN0aXZlKSB7XG4gICAgICAgICAgdGhpcy5pbml0Q29tbWFuZChuYW1lLCBjb21tYW5kKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29uc3QgaW5pdDogKCkgPT4gYW55ID0gdGhpcy5pbml0Vmlld3MoYXZhaWxhYmxlQ29tbWFuZHMpO1xuICAgICAgaWYgKHRoaXMuYXBwLndvcmtzcGFjZS5sYXlvdXRSZWFkeSkge1xuICAgICAgICBpbml0KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmFwcC53b3Jrc3BhY2Uub25MYXlvdXRSZWFkeShpbml0KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbmV3IE5vdGljZSgnTGFiIGRpc2NvbmVjdGVkLCBTdGFydCBzZXJ2ZXInKTtcbiAgICAgIGlmICh0aGlzLnNldHRpbmdzLmRlYnVnID09ICd2ZXJib3NlJykge1xuICAgICAgICBjb25zb2xlLmxvZyhzZXJ2ZXJTdGF0dXMpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBvbmxvYWQoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc29sZS5sb2coJ2xvYWRpbmcgcHl0aG9uIGxhYiBwbHVnaW4nKTtcblxuICAgIGFkZEljb24oJ3N3ZWVwJywgc3dlZXBJY29uKTtcbiAgICB0aGlzLmxvYWRDb21tYW5kUGFuZXMoKTtcbiAgICB0aGlzLmFkZFNldHRpbmdUYWIobmV3IFB5dGhvbkxhYlNldHRpbmdzKHRoaXMuYXBwLCB0aGlzKSk7XG4gIH1cblxuICBwcml2YXRlIGluaXRDb21tYW5kKG5hbWU6IHN0cmluZywgY29tbWFuZDogQ29tbWFuZCkge1xuICAgIGxldCBjb21tYW5kSWQ6IHN0cmluZyA9IGNvbW1hbmRJZEZyb21OYW1lKG5hbWUpO1xuICAgIGxldCBjb21tYW5kVXJsID0gdGhpcy5jb21tYW5kVXJsRnJvbU5hbWUobmFtZSk7XG5cbiAgICBpZiAodGhpcy5zZXR0aW5ncy5kZWJ1ZyA9PSAndmVyYm9zZScpIHtcbiAgICAgIGNvbnNvbGUubG9nKGBpbml0IFske25hbWV9XSBhcyBbJHtjb21tYW5kLnR5cGV9XWApO1xuICAgIH1cblxuICAgIGlmIChjb21tYW5kLnR5cGUgPT0gJ2NvbW1hbmQtbGluZScpIHtcbiAgICAgIGxldCB2aWV3Q3JlYXRvcjogVmlld0NyZWF0b3IgPSAobGVhZjogV29ya3NwYWNlTGVhZikgPT4ge1xuICAgICAgICBsZXQgY29tbWFuZExpbmUgPSBuZXcgQ2hhdFZpZXcobGVhZiwgY29tbWFuZElkLCBjb21tYW5kKTtcblxuICAgICAgICBjb25zdCBjb21tYW5kTGluZUNhbGxiYWNrID0gYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIGxldCBwYXJhbWV0ZXJzID0gdGhpcy5nZXREZWZhdWx0UG9zdFBhcmFtZXRlcnMoKTtcbiAgICAgICAgICBwYXJhbWV0ZXJzLmRhdGEgPSB7XG4gICAgICAgICAgICBpbnB1dDogY29tbWFuZExpbmUuZ2V0TGFzdElucHV0KCksXG4gICAgICAgICAgfTtcbiAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5kb1Bvc3QoY29tbWFuZFVybCwgcGFyYW1ldGVycyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29tbWFuZExpbmUucmVnaXN0ZXJPblNlbmRNZXNzYWdlKGNvbW1hbmRMaW5lQ2FsbGJhY2spO1xuXG4gICAgICAgIHRoaXMuYWRkQ29tbWFuZCh7XG4gICAgICAgICAgaWQ6IGNvbW1hbmRJZCxcbiAgICAgICAgICBuYW1lOiBjb21tYW5kLmxhYmVsLFxuICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiBjb21tYW5kTGluZUNhbGxiYWNrKCksXG4gICAgICAgICAgaG90a2V5czogW10sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBjb21tYW5kTGluZTtcbiAgICAgIH07XG5cbiAgICAgIC8vIEkgd291bGQgbG92ZSB0byBrbm93IGlmIHRoaXMgdmlldyBpcyBhbHJlYWR5IHJlZ2lzdGVyZWQsIGJ1dCBJIGRvbid0IGtub3cgaG93LlxuICAgICAgdGhpcy5yZWdpc3RlclZpZXcoY29tbWFuZElkLCB2aWV3Q3JlYXRvcik7XG4gICAgfSBlbHNlIGlmIChjb21tYW5kLnR5cGUgPT0gJ3BhbmVsJykge1xuICAgICAgbGV0IHZpZXdDcmVhdG9yOiBWaWV3Q3JlYXRvciA9IChsZWFmOiBXb3Jrc3BhY2VMZWFmKSA9PiB7XG4gICAgICAgIGxldCBwYW5lbCA9IG5ldyBMYWJQYW5lbChsZWFmLCBjb21tYW5kSWQsIGNvbW1hbmQpO1xuXG4gICAgICAgIGNvbnN0IHBhbmVsQ2FsbGJhY2sgPSBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgbGV0IHBhcmFtZXRlcnMgPSB0aGlzLmdldERlZmF1bHRQb3N0UGFyYW1ldGVycygpO1xuICAgICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCB0aGlzLmRvUG9zdChjb21tYW5kVXJsLCBwYXJhbWV0ZXJzKTtcbiAgICAgICAgICBkYXRhLmxhYmVsID0gY29tbWFuZC5sYWJlbDtcblxuICAgICAgICAgIC8vIFVwZGF0ZSB0aGUgc3RhdGUgb2YgdGhlIHZpZXcgcGFuZWxcbiAgICAgICAgICBwYW5lbC5zZXREYXRhKGRhdGEpO1xuICAgICAgICAgIHBhbmVsLmRyYXcoKTtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmFkZENvbW1hbmQoe1xuICAgICAgICAgIGlkOiBjb21tYW5kSWQsXG4gICAgICAgICAgbmFtZTogY29tbWFuZC5sYWJlbCxcbiAgICAgICAgICBjYWxsYmFjazogKCkgPT4gcGFuZWxDYWxsYmFjaygpLFxuICAgICAgICAgIGhvdGtleXM6IFtdLFxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoY29tbWFuZC5pbnZva2VPbk9wZW4pIHtcbiAgICAgICAgICBwYW5lbC5yZWdpc3Rlck9uRmlsZU9wZW4ocGFuZWxDYWxsYmFjayk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcGFuZWw7XG4gICAgICB9O1xuICAgICAgLy8gSSB3b3VsZCBsb3ZlIHRvIGtub3cgaWYgdGhpcyB2aWV3IGlzIGFscmVhZHkgcmVnaXN0ZXJlZCwgYnV0IEkgZG9uJ3Qga25vdyBob3cuXG4gICAgICB0aGlzLnJlZ2lzdGVyVmlldyhjb21tYW5kSWQsIHZpZXdDcmVhdG9yKTtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgY29tbWFuZC50eXBlID09ICdpbnNlcnQtdGV4dCcgfHxcbiAgICAgIGNvbW1hbmQudHlwZSA9PSAncmVwbGFjZS10ZXh0J1xuICAgICkge1xuICAgICAgY29uc3QgY2FsbGJhY2tXaXRob3V0VmlldyA9IGFzeW5jICgpID0+IHtcbiAgICAgICAgbGV0IHBhcmFtZXRlcnMgPSB0aGlzLmdldERlZmF1bHRQb3N0UGFyYW1ldGVycygpO1xuICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgdGhpcy5kb1Bvc3QoY29tbWFuZFVybCwgcGFyYW1ldGVycyk7XG4gICAgICAgIGNvbnN0IGFjdGl2ZVZpZXcgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShNYXJrZG93blZpZXcpO1xuICAgICAgICBpZiAoXG4gICAgICAgICAgY29tbWFuZC50eXBlID09ICdyZXBsYWNlLXRleHQnICYmXG4gICAgICAgICAgYWN0aXZlVmlldyBpbnN0YW5jZW9mIE1hcmtkb3duVmlld1xuICAgICAgICApIHtcbiAgICAgICAgICAvLyBSZXBsYWNlcyB0aGUgY3VycmVudCBzZWxlY3Rpb25cbiAgICAgICAgICAvLyBjb25zdCBlZGl0b3IgPSBhY3RpdmVWaWV3LnNvdXJjZU1vZGUuY21FZGl0b3I7XG4gICAgICAgICAgaWYgKGRhdGEuY29udGVudHMpIHtcbiAgICAgICAgICAgIGNvbnN0IGVkaXRvciA9IGFjdGl2ZVZpZXcuZWRpdG9yO1xuICAgICAgICAgICAgZWRpdG9yLnJlcGxhY2VTZWxlY3Rpb24oZGF0YS5jb250ZW50cyk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgIGNvbW1hbmQudHlwZSA9PSAnaW5zZXJ0LXRleHQnICYmXG4gICAgICAgICAgYWN0aXZlVmlldyBpbnN0YW5jZW9mIE1hcmtkb3duVmlld1xuICAgICAgICApIHtcbiAgICAgICAgICAvLyBJbnNlcnQgY29udGVudCBpbiB0aGUgY3Vyc29yIHBvc2l0aW9uXG4gICAgICAgICAgbGV0IGRvYyA9IGFjdGl2ZVZpZXcuZWRpdG9yLmdldERvYygpO1xuICAgICAgICAgIGxldCBjdXJzb3IgPSBkb2MuZ2V0Q3Vyc29yKCk7XG4gICAgICAgICAgaWYgKGRhdGEuY29udGVudHMpIHtcbiAgICAgICAgICAgIGRvYy5yZXBsYWNlUmFuZ2UoZGF0YS5jb250ZW50cywgY3Vyc29yKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihgQ2Fubm90IHByb2Nlc3M6IGAsIGNvbW1hbmQpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgdGhpcy5hZGRDb21tYW5kKHtcbiAgICAgICAgaWQ6IGNvbW1hbmRJZCxcbiAgICAgICAgbmFtZTogY29tbWFuZC5sYWJlbCxcbiAgICAgICAgY2FsbGJhY2s6ICgpID0+IGNhbGxiYWNrV2l0aG91dFZpZXcoKSxcbiAgICAgICAgaG90a2V5czogW10sXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGRvUG9zdChjb21tYW5kX3VybDogc3RyaW5nLCBwYXJhbWV0ZXJzOiBhbnkpIHtcbiAgICBsZXQgcmVxdWVzdEJvZHkgPSBKU09OLnN0cmluZ2lmeShwYXJhbWV0ZXJzKTtcblxuICAgIGlmICh0aGlzLnNldHRpbmdzLmRlYnVnID09ICd2ZXJib3NlJykge1xuICAgICAgY29uc29sZS5pbmZvKCdQb3N0OicsIGNvbW1hbmRfdXJsKTtcbiAgICAgIGNvbnNvbGUuaW5mbygncmVxdWVzdEJvZHknLCByZXF1ZXN0Qm9keSk7XG4gICAgfVxuXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChjb21tYW5kX3VybCwge1xuICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICBib2R5OiByZXF1ZXN0Qm9keSxcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgJ2NvbnRlbnQtdHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICBpZiAodGhpcy5zZXR0aW5ncy5kZWJ1ZyA9PSAndmVyYm9zZScpIHtcbiAgICAgIGNvbnNvbGUuaW5mbygncmVzcG9uc2UgZGF0YScsIGRhdGEpO1xuICAgIH1cbiAgICBpZiAoZGF0YS5lcnJvcnMpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZGF0YSk7XG4gICAgICBuZXcgTm90aWZpY2F0aW9uKGRhdGEubWVzc2FnZSk7XG4gICAgfVxuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXREZWZhdWx0UG9zdFBhcmFtZXRlcnMoKSB7XG4gICAgbGV0IHBhcmFtZXRlcnM6IElucHV0ID0ge1xuICAgICAgdmF1bHRQYXRoOiB0aGlzLmdldFZhdWx0UGF0aCgpLFxuICAgIH07XG4gICAgY29uc3QgYWN0aXZlVmlldyA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XG4gICAgaWYgKGFjdGl2ZVZpZXcpIHtcbiAgICAgIGNvbnN0IGVkaXRvciA9IGFjdGl2ZVZpZXcuZWRpdG9yO1xuICAgICAgbGV0IHNlbGVjdGVkVGV4dCA9IGVkaXRvci5nZXRTZWxlY3Rpb24oKTtcbiAgICAgIGlmIChzZWxlY3RlZFRleHQpIHtcbiAgICAgICAgcGFyYW1ldGVycy50ZXh0ID0gc2VsZWN0ZWRUZXh0O1xuICAgICAgfVxuICAgICAgaWYgKGFjdGl2ZVZpZXcuZmlsZSAmJiBhY3RpdmVWaWV3LmZpbGUucGF0aCkge1xuICAgICAgICBwYXJhbWV0ZXJzLm5vdGVQYXRoID0gYWN0aXZlVmlldy5maWxlLnBhdGg7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBwYXJhbWV0ZXJzO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGxvYWRTZXR0aW5ncygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aGlzLnNldHRpbmdzID0gT2JqZWN0LmFzc2lnbihERUZBVUxUX1NFVFRJTkdTLCBhd2FpdCBzdXBlci5sb2FkRGF0YSgpKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBzYXZlU2V0dGluZ3MoKSB7XG4gICAgYXdhaXQgdGhpcy5zYXZlRGF0YSh0aGlzLnNldHRpbmdzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0IGFsbCBjb21tYW5kc1xuICAgKi9cbiAgcHJpdmF0ZSBpbml0Vmlld3MgPSAoY29tbWFuZHM6IE1hcDxzdHJpbmcsIENvbW1hbmQ+KSA9PiB7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIC8vIEF0dGFjaCBvbmx5IGNvbW1hbmRzIHRoYXQgaGF2ZSBhIHZpZXcuXG4gICAgICBmb3IgKGxldCBbbmFtZSwgY29tbWFuZF0gb2YgY29tbWFuZHMpIHtcbiAgICAgICAgbGV0IGhhc1ZpZXcgPSBjb21tYW5kLnR5cGUgPT0gJ3BhbmVsJyB8fCBjb21tYW5kLnR5cGUgPT0gJ2NvbW1hbmQtbGluZSc7XG4gICAgICAgIGlmIChoYXNWaWV3ICYmIGNvbW1hbmQuYWN0aXZlKSB7XG4gICAgICAgICAgbGV0IGNvbW1hbmRJZDogc3RyaW5nID0gY29tbWFuZElkRnJvbU5hbWUobmFtZSk7XG4gICAgICAgICAgdGhpcy5zaG93UGFuZWwoY29tbWFuZElkKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH07XG5cbiAgcHJpdmF0ZSBhc3luYyBzaG93UGFuZWwoY29tbWFuZElkOiBzdHJpbmcpIHtcbiAgICBjb25zdCBleGlzdGluZyA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWF2ZXNPZlR5cGUoY29tbWFuZElkKTtcbiAgICBpZiAoZXhpc3RpbmcubGVuZ3RoKSB7XG4gICAgICB0aGlzLmFwcC53b3Jrc3BhY2UucmV2ZWFsTGVhZihleGlzdGluZ1swXSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGF3YWl0IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRSaWdodExlYWYoZmFsc2UpLnNldFZpZXdTdGF0ZSh7XG4gICAgICB0eXBlOiBjb21tYW5kSWQsXG4gICAgICBhY3RpdmU6IHRydWUsXG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBTZXR0aW5nc1xuICovXG5cbmNsYXNzIFB5dGhvbkxhYlNldHRpbmdzIGV4dGVuZHMgUGx1Z2luU2V0dGluZ1RhYiB7XG4gIHByaXZhdGUgcmVhZG9ubHkgcGx1Z2luOiBQeXRob25MYWJQbHVnaW47XG5cbiAgY29uc3RydWN0b3IoYXBwOiBBcHAsIHBsdWdpbjogUHl0aG9uTGFiUGx1Z2luKSB7XG4gICAgc3VwZXIoYXBwLCBwbHVnaW4pO1xuICAgIHRoaXMucGx1Z2luID0gcGx1Z2luO1xuICB9XG5cbiAgcHVibGljIGRpc3BsYXkoKTogdm9pZCB7XG4gICAgY29uc3QgeyBjb250YWluZXJFbCB9ID0gdGhpcztcblxuICAgIGNvbnRhaW5lckVsLmVtcHR5KCk7XG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoJ2gyJywgeyB0ZXh0OiAnT2JzaWRpYW4gbGFiIHNldHRpbmdzJyB9KTtcbiAgICBjb250YWluZXJFbC5jcmVhdGVFbCgnaDQnLCB7IHRleHQ6ICdSZXN0YXJ0IGFmdGVyIG1ha2luZyBjaGFuZ2VzJyB9KTtcblxuICAgIGNvbnN0IHNldHRpbmdzID0gdGhpcy5wbHVnaW4uc2V0dGluZ3M7XG5cbiAgICBjb25zdCBzZXJ2ZXJVUkxTZXR0aW5nID0gbmV3IFNldHRpbmcodGhpcy5jb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKCdTZXJ2ZXIgdXJsJylcbiAgICAgIC5hZGRUZXh0KCh0ZXh0KSA9PiB7XG4gICAgICAgIHRleHQuc2V0VmFsdWUoc2V0dGluZ3Muc2VydmVyX3VybCk7XG4gICAgICAgIHRleHQub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc2VydmVyX3VybCA9IHZhbHVlIGFzIHN0cmluZztcbiAgICAgICAgICAvLyBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICAvLyBIb3cgdG8gbWFpbnRhaW4gZm9jdXMgb24gdGhpcz9cbiAgICAgICAgICAvLyB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KVxuXG4gICAgICAuYWRkRXh0cmFCdXR0b24oKGIpID0+IHtcbiAgICAgICAgYi5zZXRJY29uKCdyZXNldCcpXG4gICAgICAgICAgLnNldFRvb2x0aXAoJ3NldCBhbmQgcmVmcmVzaCcpXG4gICAgICAgICAgLm9uQ2xpY2soYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5sb2FkQ29tbWFuZFBhbmVzKCk7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgY29uc3QgdXBkYXRlU2V0dGluZyA9IGFzeW5jIChjb21tYW5kSWQ6IHN0cmluZywgY29tbWFuZDogQ29tbWFuZCkgPT4ge1xuXG4gICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5jb21tYW5kc1tjb21tYW5kSWRdID0gY29tbWFuZDtcbiAgICAgIGlmICh0aGlzLnBsdWdpbi5zZXR0aW5ncy5kZWJ1ZyA9PSAndmVyYm9zZScpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3NhdmUnLCBjb21tYW5kKTtcbiAgICAgIH1cbiAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgIH07XG5cbiAgICBnZXRTZXJ2ZXJTdGF0dXMoc2V0dGluZ3Muc2VydmVyX3VybCkudGhlbigoc2VydmVyU3RhdHVzKSA9PiB7XG4gICAgICBpZiAoc2VydmVyU3RhdHVzLnN0YXR1cyA9PSAnYXZhaWxhYmxlJykge1xuICAgICAgICBjb25zdCBhdmFpbGFibGVDb21tYW5kcyA9IGxvYWRDb21tYW5kcyhcbiAgICAgICAgICBzZXJ2ZXJTdGF0dXMuYXZhaWxhYmxlQ29tbWFuZFVybHMsXG4gICAgICAgICAgc2V0dGluZ3MuY29tbWFuZHMsXG4gICAgICAgICk7XG4gICAgICAgIGxldCBuID0gMDtcbiAgICAgICAgZm9yIChsZXQgW25hbWUsIGNvbW1hbmRdIG9mIGF2YWlsYWJsZUNvbW1hbmRzKSB7XG4gICAgICAgICAgYWRkQ29tbWFuZFNldHRpbmcobmFtZSwgY29tbWFuZCk7XG4gICAgICAgICAgbisrO1xuICAgICAgICB9XG4gICAgICAgIHNlcnZlclVSTFNldHRpbmcuc2V0TmFtZShgU2VydmVyIG9ubGluZSBbJHtufV1gKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNlcnZlclVSTFNldHRpbmdcbiAgICAgICAgICAuc2V0TmFtZSgn4pqgIENhbm5vdCByZWFjaCBzZXJ2ZXInKVxuICAgICAgICAgIC5zZXREZXNjKCcnKVxuICAgICAgICAgIC5zZXRDbGFzcygncHl0aG9uLWxhYi1lcnJvcicpO1xuICAgICAgICBjb25zb2xlLmxvZyhzZXJ2ZXJTdGF0dXMpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnNldEZvb3Rlcihjb250YWluZXJFbCwgc2V0dGluZ3MpO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogR2l2ZW4gYSBjb21tYW5kLCBhZGRzIHRoZSBjb25maWd1cmF0aW9uXG4gICAgICogQHBhcmFtIG5hbWVcbiAgICAgKiBAcGFyYW0gY29tbWFuZFxuICAgICAqL1xuICAgIGNvbnN0IGFkZENvbW1hbmRTZXR0aW5nID0gKG5hbWU6IHN0cmluZywgY29tbWFuZDogQ29tbWFuZCkgPT4ge1xuICAgICAgbGV0IGNvbW1hbmRFbCA9IGNvbnRhaW5lckVsLmNyZWF0ZUVsKCdkaXYnLCB7fSk7XG4gICAgICBsZXQgY29tbWFuZFVybCA9IHRoaXMucGx1Z2luLmNvbW1hbmRVcmxGcm9tTmFtZShuYW1lKTtcbiAgICAgIGxldCBjb21tYW5kRGVzYyA9IGAke2NvbW1hbmRVcmx9YDtcblxuICAgICAgaWYgKGNvbW1hbmQuYWN0aXZlKSB7XG4gICAgICAgIG5ldyBTZXR0aW5nKGNvbW1hbmRFbClcbiAgICAgICAgICAuc2V0TmFtZShgJHtuYW1lfWApXG4gICAgICAgICAgLnNldERlc2MoY29tbWFuZERlc2MpXG5cbiAgICAgICAgICAvLyBUeXBlXG4gICAgICAgICAgLmFkZERyb3Bkb3duKChkcm9wZG93bikgPT4ge1xuICAgICAgICAgICAgZHJvcGRvd24uYWRkT3B0aW9uKCdpbnNlcnQtdGV4dCcsICdJbnNlcnQgdGV4dCcpO1xuICAgICAgICAgICAgZHJvcGRvd24uYWRkT3B0aW9uKCdyZXBsYWNlLXRleHQnLCAnUmVwbGFjZSBzZWxlY3RlZCB0ZXh0Jyk7XG4gICAgICAgICAgICBkcm9wZG93bi5hZGRPcHRpb24oJ3BhbmVsJywgJ1BhbmVsOiB0ZXh0IG9yIGxpc3RzJyk7XG4gICAgICAgICAgICBkcm9wZG93bi5hZGRPcHRpb24oJ2NvbW1hbmQtbGluZScsICdDaGF0Jyk7XG4gICAgICAgICAgICAvLyBkcm9wZG93bi5hZGRPcHRpb24oJ2dyYXBoJywgJ2EgZ3JhcGgnKTtcbiAgICAgICAgICAgIGRyb3Bkb3duLnNldFZhbHVlKFN0cmluZyhjb21tYW5kLnR5cGUpKS5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgY29tbWFuZC50eXBlID0gdmFsdWUgYXNcbiAgICAgICAgICAgICAgICB8ICdwYW5lbCdcbiAgICAgICAgICAgICAgICB8ICdyZXBsYWNlLXRleHQnXG4gICAgICAgICAgICAgICAgfCAnaW5zZXJ0LXRleHQnXG4gICAgICAgICAgICAgICAgfCAnY29tbWFuZC1saW5lJztcbiAgICAgICAgICAgICAgYXdhaXQgdXBkYXRlU2V0dGluZyhuYW1lLCBjb21tYW5kKTtcbiAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KVxuXG4gICAgICAgICAgLy8gQWN0aXZlIG9yIG5vdFxuICAgICAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT4ge1xuICAgICAgICAgICAgdG9nZ2xlLnNldFZhbHVlKGNvbW1hbmQuYWN0aXZlKTtcbiAgICAgICAgICAgIHRvZ2dsZS5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgY29tbWFuZC5hY3RpdmUgPSB2YWx1ZSBhcyBib29sZWFuO1xuICAgICAgICAgICAgICBhd2FpdCB1cGRhdGVTZXR0aW5nKG5hbWUsIGNvbW1hbmQpO1xuICAgICAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IGlzV2lkZ2V0ID1cbiAgICAgICAgICBjb21tYW5kLnR5cGUgPT0gJ3BhbmVsJyB8fCBjb21tYW5kLnR5cGUgPT0gJ2NvbW1hbmQtbGluZSc7XG5cbiAgICAgICAgbmV3IFNldHRpbmcoY29tbWFuZEVsKVxuICAgICAgICAgIC5zZXREZXNjKGlzV2lkZ2V0ID8gJ1dpZGdldCBuYW1lJyA6ICdDb21tYW5kIG5hbWUnKVxuICAgICAgICAgIC8vIE5hbWVcbiAgICAgICAgICAuYWRkVGV4dCgodGV4dCkgPT4ge1xuICAgICAgICAgICAgdGV4dC5zZXRWYWx1ZShjb21tYW5kLmxhYmVsKTtcbiAgICAgICAgICAgIHRleHQub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgIGNvbW1hbmQubGFiZWwgPSB2YWx1ZSBhcyBzdHJpbmc7XG4gICAgICAgICAgICAgIGF3YWl0IHVwZGF0ZVNldHRpbmcobmFtZSwgY29tbWFuZCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICBpZiAoaXNXaWRnZXQpIHtcbiAgICAgICAgICBuZXcgU2V0dGluZyhjb21tYW5kRWwpXG4gICAgICAgICAgICAuc2V0RGVzYygnV2lkZ2V0IGljb24nKVxuICAgICAgICAgICAgLy8gSWNvblxuICAgICAgICAgICAgLmFkZERyb3Bkb3duKChkcm9wZG93bikgPT4ge1xuICAgICAgICAgICAgICBpY29ucy5mb3JFYWNoKChpY29uKSA9PiB7XG4gICAgICAgICAgICAgICAgZHJvcGRvd24uYWRkT3B0aW9uKGljb24sIGljb24pO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgZHJvcGRvd25cbiAgICAgICAgICAgICAgICAuc2V0VmFsdWUoU3RyaW5nKGNvbW1hbmQuaWNvbikpXG4gICAgICAgICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgY29tbWFuZC5pY29uID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICBhd2FpdCB1cGRhdGVTZXR0aW5nKG5hbWUsIGNvbW1hbmQpO1xuICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmFkZEV4dHJhQnV0dG9uKChiKSA9PiB7XG4gICAgICAgICAgICAgIGIuc2V0SWNvbihjb21tYW5kLmljb24pXG4gICAgICAgICAgICAgICAgLnNldFRvb2x0aXAoJ0ljb24gc2hvd24gaW4gdGhlIHdpZGdldCB0YWInKVxuICAgICAgICAgICAgICAgIC5vbkNsaWNrKGFzeW5jICgpID0+IHt9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbW1hbmQudHlwZSA9PSAncGFuZWwnKSB7XG4gICAgICAgICAgbmV3IFNldHRpbmcoY29tbWFuZEVsKVxuICAgICAgICAgICAgLnNldERlc2MoJ0FkZGl0aW9uYWwgdHJpZ2dlcnMgZm9yIHBhbmVsJylcbiAgICAgICAgICAgIC5hZGREcm9wZG93bigoZHJvcGRvd24pID0+IHtcbiAgICAgICAgICAgICAgZHJvcGRvd24uYWRkT3B0aW9uKCdmYWxzZScsICdubyB0cmlnZ2VycycpO1xuICAgICAgICAgICAgICBkcm9wZG93bi5hZGRPcHRpb24oJ3RydWUnLCAndHJpZ2VycyB3aGVuIG9wZW5pbmcgYSBmaWxlJyk7XG4gICAgICAgICAgICAgIGRyb3Bkb3duXG4gICAgICAgICAgICAgICAgLnNldFZhbHVlKFN0cmluZyhjb21tYW5kLmludm9rZU9uT3BlbikpXG4gICAgICAgICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgY29tbWFuZC5pbnZva2VPbk9wZW4gPSB2YWx1ZSA9PSAndHJ1ZSc7XG4gICAgICAgICAgICAgICAgICBhd2FpdCB1cGRhdGVTZXR0aW5nKG5hbWUsIGNvbW1hbmQpO1xuICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV3IFNldHRpbmcoY29tbWFuZEVsKVxuICAgICAgICAgIC5zZXROYW1lKGAke25hbWV9YClcbiAgICAgICAgICAuc2V0RGVzYyhjb21tYW5kRGVzYylcbiAgICAgICAgICAvLyBBY3RpdmUgb3Igbm90XG4gICAgICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PiB7XG4gICAgICAgICAgICB0b2dnbGUuc2V0VmFsdWUoY29tbWFuZC5hY3RpdmUpO1xuICAgICAgICAgICAgdG9nZ2xlLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICBjb21tYW5kLmFjdGl2ZSA9IHZhbHVlIGFzIGJvb2xlYW47XG4gICAgICAgICAgICAgIGF3YWl0IHVwZGF0ZVNldHRpbmcobmFtZSwgY29tbWFuZCk7XG4gICAgICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgc2V0Rm9vdGVyKGNvbnRhaW5lckVsOiBIVE1MRWxlbWVudCwgc2V0dGluZ3M6IFNldHRpbmdzKSB7XG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZSgnRGVidWcnKVxuICAgICAgLnNldERlc2MoJycpXG4gICAgICAuYWRkRHJvcGRvd24oKGRyb3Bkb3duKSA9PiB7XG4gICAgICAgIGRyb3Bkb3duLmFkZE9wdGlvbignb2ZmJywgJ29mZicpO1xuICAgICAgICBkcm9wZG93bi5hZGRPcHRpb24oJ3ZlcmJvc2UnLCAndmVyYm9zZScpO1xuICAgICAgICAvLyBkcm9wZG93bi5hZGRPcHRpb24oJ2dyYXBoJywgJ2EgZ3JhcGgnKTtcbiAgICAgICAgZHJvcGRvd24uc2V0VmFsdWUoU3RyaW5nKHNldHRpbmdzLmRlYnVnKSkub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuZGVidWcgPSB2YWx1ZSBhcyAnb2ZmJyB8ICd2ZXJib3NlJztcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKCdhJywge1xuICAgICAgdGV4dDogJ1lvdSBjYW4gZmluZCBhIHNpbXBsZSBzZXJ2ZXIgYXQgZ2l0aHViOiBvYnNpZGlhbi1sYWItcHknLFxuICAgICAgaHJlZjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9jcmlzdGlhbnZhc3F1ZXovb2JzaWRpYW4tbGFiLXB5JyxcbiAgICB9KTtcblxuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKCdwJywge1xuICAgICAgdGV4dDogJ1B1bGwgcmVxdWVzdHMgYXJlIGJvdGggd2VsY29tZSBhbmQgYXBwcmVjaWF0ZWQuIDopJyxcbiAgICB9KTtcbiAgfVxufVxuIl0sIm5hbWVzIjpbIkl0ZW1WaWV3IiwiRmlsZVN5c3RlbUFkYXB0ZXIiLCJOb3RpY2UiLCJhZGRJY29uIiwiTWFya2Rvd25WaWV3IiwiUGx1Z2luIiwiU2V0dGluZyIsIlBsdWdpblNldHRpbmdUYWIiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksYUFBYSxHQUFHLFNBQVMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUNuQyxJQUFJLGFBQWEsR0FBRyxNQUFNLENBQUMsY0FBYztBQUN6QyxTQUFTLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRSxZQUFZLEtBQUssSUFBSSxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDcEYsUUFBUSxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDMUcsSUFBSSxPQUFPLGFBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDL0IsQ0FBQyxDQUFDO0FBQ0Y7QUFDTyxTQUFTLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ2hDLElBQUksSUFBSSxPQUFPLENBQUMsS0FBSyxVQUFVLElBQUksQ0FBQyxLQUFLLElBQUk7QUFDN0MsUUFBUSxNQUFNLElBQUksU0FBUyxDQUFDLHNCQUFzQixHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRywrQkFBK0IsQ0FBQyxDQUFDO0FBQ2xHLElBQUksYUFBYSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN4QixJQUFJLFNBQVMsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsRUFBRTtBQUMzQyxJQUFJLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxLQUFLLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDekYsQ0FBQztBQXVDRDtBQUNPLFNBQVMsU0FBUyxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRTtBQUM3RCxJQUFJLFNBQVMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLE9BQU8sS0FBSyxZQUFZLENBQUMsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsVUFBVSxPQUFPLEVBQUUsRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRTtBQUNoSCxJQUFJLE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQyxFQUFFLFVBQVUsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUMvRCxRQUFRLFNBQVMsU0FBUyxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7QUFDbkcsUUFBUSxTQUFTLFFBQVEsQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7QUFDdEcsUUFBUSxTQUFTLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxNQUFNLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDLEVBQUU7QUFDdEgsUUFBUSxJQUFJLENBQUMsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsVUFBVSxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFDOUUsS0FBSyxDQUFDLENBQUM7QUFDUCxDQUFDO0FBQ0Q7QUFDTyxTQUFTLFdBQVcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFO0FBQzNDLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNySCxJQUFJLE9BQU8sQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxPQUFPLE1BQU0sS0FBSyxVQUFVLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxXQUFXLEVBQUUsT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzdKLElBQUksU0FBUyxJQUFJLENBQUMsQ0FBQyxFQUFFLEVBQUUsT0FBTyxVQUFVLENBQUMsRUFBRSxFQUFFLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDdEUsSUFBSSxTQUFTLElBQUksQ0FBQyxFQUFFLEVBQUU7QUFDdEIsUUFBUSxJQUFJLENBQUMsRUFBRSxNQUFNLElBQUksU0FBUyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7QUFDdEUsUUFBUSxPQUFPLENBQUMsRUFBRSxJQUFJO0FBQ3RCLFlBQVksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxD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LEVBQUUsQ0FBQztBQUMxQyxvQkFBb0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLFNBQVM7QUFDM0MsYUFBYTtBQUNiLFlBQVksRUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3ZDLFNBQVMsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTtBQUNsRSxRQUFRLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUM7QUFDekYsS0FBSztBQUNMLENBQUM7QUFhRDtBQUNPLFNBQVMsUUFBUSxDQUFDLENBQUMsRUFBRTtBQUM1QixJQUFJLElBQUksQ0FBQyxHQUFHLE9BQU8sTUFBTSxLQUFLLFVBQVUsSUFBSSxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDbEYsSUFBSSxJQUFJLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDNUIsSUFBSSxJQUFJLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQyxNQUFNLEtBQUssUUFBUSxFQUFFLE9BQU87QUFDbEQsUUFBUSxJQUFJLEVBQUUsWUFBWTtBQUMxQixZQUFZLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFFLENB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
