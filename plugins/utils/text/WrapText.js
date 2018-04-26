import Pool from './../../object/Pool.js';
import CONST from './../const.js';

const GetValue = Phaser.Utils.GetValue;
const NO_NEWLINE = CONST.NO_NEWLINE;
const RAW_NEWLINE = CONST.RAW_NEWLINE;
const WRAPPED_NEWLINE = CONST.WRAPPED_NEWLINE;
const WORD_WRAP = CONST.WORD_WRAP;
const CHAR_WRAP = CONST.CHAR_WRAP;
const splitRegExp = CONST.SPLITREGEXP;

var WRAP_RESULT = [];
var WrapText = function (text, ctx, config) {
    var wrapMode = GetValue(config, 'wrapMode', WORD_WRAP);
    var wrapWidth = GetValue(config, 'wrapWidth', null);
    var offset = GetValue(config, 'offset', 0);

    var retLines = WRAP_RESULT;
    LinesPool.freeArr(retLines);

    if (!text || !text.length) {
        return retLines;
    }

    if (wrapWidth <= 2.0) {
        return retLines;
    }

    if ((text.length <= 100) && (text.indexOf('\n') === -1)) {
        // short string testing
        var remainWidth = wrapWidth - offset;
        var textWidth = ctx.measureText(text).width;
        if (textWidth <= remainWidth) {
            retLines.push(LinesPool.newline(text, textWidth, NO_NEWLINE));
            return retLines;
        }
    }

    var lines = text.split(splitRegExp),
        line, remainWidth, isLaseLine, newLineMode;
    for (var i, linesLen = lines.length; i < linesLen; i++) {
        line = lines[i];
        newLineMode = (i === (linesLen - 1)) ? NO_NEWLINE : RAW_NEWLINE;

        if (i === 0) {
            remainWidth = wrapWidth - offset;
        } else {
            remainWidth = wrapWidth;
        }

        // short string testing
        if (line.length <= 100) {
            var textWidth = ctx.measureText(line).width;
            if (textWidth <= remainWidth) {
                retLines.push(LinesPool.newline(text, textWidth, newLineMode));
                continue;
            }
        }

        // character mode
        var tokenArray;
        if (wrapMode === WORD_WRAP) {
            // word mode
            tokenArray = line.split(' ');
        } else {
            tokenArray = line;
        }
        var token;
        var curLineText = '',
            lineText = '',
            currLineWidth, lineWidth = 0;
        for (var j, tokenLen = tokenArray.length; j < tokenLen; j++) {
            token = tokenArray[j];

            if ((wrapMode === WORD_WRAP) && (j > 0)) {
                // word mode
                curLineText += (' ' + token);
            } else {
                curLineText += token;
            }

            currLineWidth = ctx.measureText(curLineText).width;
            if (currLineWidth > remainWidth) {
                retLines.push(LinesPool.newline(lineText, lineWidth, WRAPPED_NEWLINE));
                remainWidth = wrapWidth;

                // new line
                curLineText = token;
                currLineWidth = ctx.measureText(curLineText).width;
            }

            lineText = curLineText;
            lineWidth = currLineWidth;
        } // for token in tokenArray

        if (curLineText.length > 0) {
            // remain text in this line
            retLines.push(LinesPool.newline(lineText, lineWidth, newLineMode));
        }

    } // for each line in lines

    return retLines;
};

var LinesPool = new Pool();
LinesPool.newline = function (text, width, newLineMode) {
    var l = this.allocate();
    if (l === null) {
        l = {};
    }
    l.text = text;
    l.width = width;
    l.newLineMode = newLineMode;
    return l;
};

export default WrapText;