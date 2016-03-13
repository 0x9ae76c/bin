var injectedBetterDGG = function() {
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.jade=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

/**
 * Merge two attribute objects giving precedence
 * to values in object `b`. Classes are special-cased
 * allowing for arrays and merging/joining appropriately
 * resulting in a string.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object} a
 * @api private
 */

exports.merge = function merge(a, b) {
  if (arguments.length === 1) {
    var attrs = a[0];
    for (var i = 1; i < a.length; i++) {
      attrs = merge(attrs, a[i]);
    }
    return attrs;
  }
  var ac = a['class'];
  var bc = b['class'];

  if (ac || bc) {
    ac = ac || [];
    bc = bc || [];
    if (!Array.isArray(ac)) ac = [ac];
    if (!Array.isArray(bc)) bc = [bc];
    a['class'] = ac.concat(bc).filter(nulls);
  }

  for (var key in b) {
    if (key != 'class') {
      a[key] = b[key];
    }
  }

  return a;
};

/**
 * Filter null `val`s.
 *
 * @param {*} val
 * @return {Boolean}
 * @api private
 */

function nulls(val) {
  return val != null && val !== '';
}

/**
 * join array as classes.
 *
 * @param {*} val
 * @return {String}
 */
exports.joinClasses = joinClasses;
function joinClasses(val) {
  return Array.isArray(val) ? val.map(joinClasses).filter(nulls).join(' ') : val;
}

/**
 * Render the given classes.
 *
 * @param {Array} classes
 * @param {Array.<Boolean>} escaped
 * @return {String}
 */
exports.cls = function cls(classes, escaped) {
  var buf = [];
  for (var i = 0; i < classes.length; i++) {
    if (escaped && escaped[i]) {
      buf.push(exports.escape(joinClasses([classes[i]])));
    } else {
      buf.push(joinClasses(classes[i]));
    }
  }
  var text = joinClasses(buf);
  if (text.length) {
    return ' class="' + text + '"';
  } else {
    return '';
  }
};

/**
 * Render the given attribute.
 *
 * @param {String} key
 * @param {String} val
 * @param {Boolean} escaped
 * @param {Boolean} terse
 * @return {String}
 */
exports.attr = function attr(key, val, escaped, terse) {
  if ('boolean' == typeof val || null == val) {
    if (val) {
      return ' ' + (terse ? key : key + '="' + key + '"');
    } else {
      return '';
    }
  } else if (0 == key.indexOf('data') && 'string' != typeof val) {
    return ' ' + key + "='" + JSON.stringify(val).replace(/'/g, '&apos;') + "'";
  } else if (escaped) {
    return ' ' + key + '="' + exports.escape(val) + '"';
  } else {
    return ' ' + key + '="' + val + '"';
  }
};

/**
 * Render the given attributes object.
 *
 * @param {Object} obj
 * @param {Object} escaped
 * @return {String}
 */
exports.attrs = function attrs(obj, terse){
  var buf = [];

  var keys = Object.keys(obj);

  if (keys.length) {
    for (var i = 0; i < keys.length; ++i) {
      var key = keys[i]
        , val = obj[key];

      if ('class' == key) {
        if (val = joinClasses(val)) {
          buf.push(' ' + key + '="' + val + '"');
        }
      } else {
        buf.push(exports.attr(key, val, false, terse));
      }
    }
  }

  return buf.join('');
};

/**
 * Escape the given string of `html`.
 *
 * @param {String} html
 * @return {String}
 * @api private
 */

exports.escape = function escape(html){
  var result = String(html)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
  if (result === '' + html) return html;
  else return result;
};

/**
 * Re-throw the given `err` in context to the
 * the jade in `filename` at the given `lineno`.
 *
 * @param {Error} err
 * @param {String} filename
 * @param {String} lineno
 * @api private
 */

exports.rethrow = function rethrow(err, filename, lineno, str){
  if (!(err instanceof Error)) throw err;
  if ((typeof window != 'undefined' || !filename) && !str) {
    err.message += ' on line ' + lineno;
    throw err;
  }
  try {
    str = str || require('fs').readFileSync(filename, 'utf8')
  } catch (ex) {
    rethrow(err, null, lineno)
  }
  var context = 3
    , lines = str.split('\n')
    , start = Math.max(lineno - context, 0)
    , end = Math.min(lines.length, lineno + context);

  // Error context
  var context = lines.slice(start, end).map(function(line, i){
    var curr = i + start + 1;
    return (curr == lineno ? '  > ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'Jade') + ':' + lineno
    + '\n' + context + '\n\n' + err.message;
  throw err;
};

},{"fs":2}],2:[function(require,module,exports){

},{}]},{},[1])(1)
});
;(function(bdgg) {
    bdgg.alert = (function() {
        $('body').on('click', '#bdgg-alert .close', function() {
            bdgg.alert.hide();
        });

        return {
            show: function(message) {
                bdgg.alert.hide();
                $('#destinychat').append(bdgg.templates.alert({message: message}));
                $('#bdgg-alert').show();
            },
            hide: function() {
                $('#bdgg-alert').hide().remove();
            }
        };
    })();
}(window.BetterDGG = window.BetterDGG || {}));

;(function(bdgg) {

    var muted = false;
    var muteMessage = "Bot didn't say how long you were muted, DaFellas";
    var lastMute = 0;

    function _timeDiff( tstart, tend ) {
        var diff = Math.floor((tend - tstart) / 1000), units = [
            { d: 60, l: "seconds" },
            { d: 60, l: "minutes" }
        ];

        var s = '';
        for (var i = 0; i < units.length; ++i) {
            s = (diff % units[i].d) + " " + units[i].l + " " + s;
            diff = Math.floor(diff / units[i].d);
        }
        return s;
    }

    bdgg.chat = (function() {
        return {
            init: function() {
                var fnChatMUTE = destiny.chat.onMUTE;

        var bdggChatMUTE = function(data) {
            var bdggMUTE = fnChatMUTE.apply(this, arguments);
            if (data.data.toLowerCase() == this.user.username.toLowerCase()){
                muted = true;
                console.log("You were muted at: "+_timeConverter(data.timestamp));
            }
            //console.log(data);
            return bdggMUTE;
        };

        destiny.chat.onMUTE = bdggChatMUTE;

        var fnChatMSG = destiny.chat.onMSG;

        var bdggChatMSG = function(data) {
            var bdggMessage = fnChatMSG.apply(this, arguments);

            if (bdgg.settings.get('bdgg_disable_combos') === true){
                //I copied this from Dicedlemming it might suck but it works.
                ChatEmoteMessage=function(emote,timestamp){return this.emotecount=-999,this.emotecountui=null,this}
            }

            if (data.nick == "Bot" && muted === true){
                console.log("Mute Message found");
                lastMute = data.timestamp;
                muteMessage = data.data;
                muted = false;
            }

            return bdggMessage;
        };

        destiny.chat.onMSG = bdggChatMSG;

        var fnChatERR = destiny.chat.onERR;

        var bdggChatERR = function(data) {
            var bdggERR = fnChatERR.apply(this, arguments);
            if (data == "muted"){
                //console.log(data);
                //console.log(muteMessage);
                var n = muteMessage.match(/[0-9]*[0-9]m/);  //find mute timestamp
                if (n !== null){
                    var nString = n.toString();
                    var muteLength = nString.substr(0, nString.length-1);
                    muteLength = parseInt(muteLength);
                    muteLength = lastMute+muteLength*60*1000; //Add seconds to timestamp
                    var newDate = new Date();
                    var currentStamp = newDate.getTime();
                    this.gui.push(new ChatInfoMessage("You are still muted for: "+_timeDiff(currentStamp, muteLength)));
                }
            }
            return bdggERR;
        };

        destiny.chat.onERR = bdggChatERR;
            }
        }
    })();
}(window.BetterDGG = window.BetterDGG || {}));

;(function(bdgg) {
    bdgg.emoticons = (function() {
        var override, emoteTabPriority, everyEmote;
        var baseEmotes = destiny.chat.gui.emoticons;

        var EMOTICONS = [ "CallChad", "FIDGETLOL",
            "CallCatz", "DESBRO", "Dravewin", "TooSpicy",
            "BrainSlug", "DansGame", "Kreygasm", "PJSalt", "PogChamp",
            "ResidentSleeper", "WinWaker", "ChanChamp",
            "OpieOP", "4Head", "DatSheffy", "GabeN", "SuccesS",
            "TopCake", "DSPstiny", "SephURR", "Keepo", "POTATO", "ShibeZ",
            "lirikThump", "Riperino", "NiceMeMe", "YEE", "BabyRage",
            "dayJoy", "kaceyFace", "AlisherZ", "D:",
            "WEOW", "Depresstiny", "HerbPerve", "CARBUCKS", "Jewstiny", "PEPE",
            "ITSRAWWW", "EleGiggle", "SwiftRage", "SMOrc", "SSSsss", "CallHafu",
            "ChibiDesti", "CORAL", "CUX", "KappaPride", "DJAslan",
            "MingLee", "OhMyDog", "CoolCat", "FeelsBadMan", "FeelsGoodMan",
            "NOBULLY", "haHAA", "gachiGASM"

        ];

        var NEW = [ ];

        var ANIMATED = [ "CuckCrab", "SourPls", "RaveDoge" ];

        var OVERRIDES = [ "SoSad", "SpookerZ", "Kappa", "OhKrappa", "DappaKappa", "Klappa" ];

        var TEXT = [ "OuO", "XD", "xD" ];

        var SUBONLY = [ "nathanDad", "nathanFeels", "nathanFather", "nathanDank",
        "nathanDubs1", "nathanDubs2", "nathanDubs3", "nathanParty" ];

        var RIP = [ ].sort();

        var bdggSortResults = function(fnSortResults) {
            return function(a, b) {
                if (emoteTabPriority) {
                    if (a.isemote != b.isemote) {
                        return a.isemote ? -1 : 1;
                    }
                }

                return fnSortResults.apply(this, arguments);
            };
        };

        var emoticons, bdggemoteregex;
        function replacer(match, emote) {
            var s = '<div title="' + emote + '" class="chat-emote';
            emote = emote.replace(/[^\w-]/, '_');

            //Disable Animated Emotes
            if (ANIMATED.indexOf(emote) > -1 && bdgg.settings.get('bdgg_animate_disable')) {
                return emote;
            }

            //Injecct class
            if (SUBONLY.indexOf(emote) > -1) {
                s = s + ' chat-emote-' + emote;
            } 

            else if (TEXT.indexOf(emote) > -1){
                s = emote + s + ' bdgg-chat-emote-' + emote;
            }

            else {
                s = s + ' bdgg-chat-emote-' + emote;
            }

            return s + '"></div>';

        }

        return {
            all: [],
            init: function() {
                emoticons = EMOTICONS.concat(NEW).concat(SUBONLY).concat(TEXT).concat(ANIMATED)
                    .filter(function(e) { return destiny.chat.gui.emoticons.indexOf(e) == -1 })
                    .sort();
                destiny.chat.gui.emoticons = destiny.chat.gui.emoticons.concat(emoticons).sort();
                $.each(emoticons, function(i, v) { destiny.chat.gui.autoCompletePlugin.addEmote(v) });
                bdgg.emoticons.all = emoticons;
                everyEmote = destiny.chat.gui.emoticons;

                bdgg.emoticons.textEmoteDisable(bdgg.settings.get('bdgg_text_disable'));

                bdggemoteregex = new RegExp('\\b('+emoticons.join('|')+')(?:\\b|\\s|$)', 'gm');

                // multi-emote
                $.each(destiny.chat.gui.formatters, function(i, f) {
                    if (f && f.hasOwnProperty('emoteregex') && f.hasOwnProperty('gemoteregex')) {
                        f.emoteregex = f.gemoteregex;
                        return false;
                    }
                });

                bdgg.emoticons.giveTabPriority(bdgg.settings.get('bdgg_emote_tab_priority'));
                bdgg.emoticons.overrideEmotes(bdgg.settings.get('bdgg_emote_override'));
                bdgg.settings.addObserver(function(key, value) {
                    if (key == 'bdgg_emote_tab_priority') {
                        bdgg.emoticons.giveTabPriority(value);
                    } else if (key == 'bdgg_emote_override') {
                        bdgg.emoticons.overrideEmotes(value);
                    } else if (key == 'bdgg_text_disable') {
                        bdgg.emoticons.textEmoteDisable(value);}
                });

                // hook into emotes command
                var fnHandleCommand = destiny.chat.handleCommand;
                destiny.chat.handleCommand = function(str) {
                    fnHandleCommand.apply(this, arguments);
                    if (/^emotes ?/.test(str)) {
                        this.gui.push(new ChatInfoMessage("Better Destiny.gg: "+ emoticons.join(", ")));

                        if (SUBONLY.length > 0) {
                            this.gui.push(new ChatInfoMessage("Unlocked: "+ SUBONLY.sort().join(", ")));
                        }

                        if (RIP.length > 0) {
                            this.gui.push(new ChatInfoMessage("RIP: "+ RIP.sort().join(", ")));
                        }

                        if (override && OVERRIDES.length > 0) {
                            this.gui.push(new ChatInfoMessage("Overrides: "+ OVERRIDES.sort().join(", ")));
                        }

                        if (NEW.length > 0) {
                            this.gui.push(new ChatInfoMessage("NEW: "+ NEW.sort().join(", ")));
                        }
                    }
                };

                var fnSortResults = destiny.chat.gui.autoCompletePlugin.sortResults;
                destiny.chat.gui.autoCompletePlugin.sortResults = bdggSortResults(fnSortResults);
            },
            giveTabPriority: function(value) {
                emoteTabPriority = value;
            },
            overrideEmotes: function(value) {
                override = value;
            },
            textEmoteDisable: function(value) {
                
                var editEmoteList;

                if (value){

                    editEmoteList = EMOTICONS.concat(NEW).concat(SUBONLY).concat(ANIMATED)
                    .filter(function(e) { return baseEmotes.indexOf(e) == -1 })
                    .sort();

                    destiny.chat.gui.emoticons = baseEmotes.concat(editEmoteList).sort();
                    bdgg.emoticons.all = editEmoteList;

                }

                else {

                    editEmoteList = EMOTICONS.concat(NEW).concat(SUBONLY).concat(ANIMATED).concat(TEXT)
                    .filter(function(e) { return baseEmotes.indexOf(e) == -1 })
                    .sort();

                    destiny.chat.gui.emoticons = everyEmote;
                    bdgg.emoticons.all = editEmoteList;

                }


            },
            wrapMessage: function(wrapped, message) {
                wrapped.find('span').addBack().contents().filter(function() { return this.nodeType == 3})
                    .replaceWith(function() {
                        return this.data
                            .replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
                            .replace(/</g, '&lt;').replace(/>/g, '&gt;')
                            .replace(bdggemoteregex, replacer);
                    });

                if (override) {
                    wrapped.find('.chat-emote').addClass('bdgg-chat-emote-override');
                }
            }
        }
    })();
}(window.BetterDGG = window.BetterDGG || {}));

;(function(bdgg) {
    bdgg.filter = (function() {
        var _filterRe;

        function _filterWords(value) {
            var words = value.split(',')
                .map(function(val) {
                    return val.trim().replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
                })
                .reduce(function(prev, curr) {
                    if (curr.length > 0) {
                        prev.push(curr);
                    }
                    return prev;
                }, []);

            if (words.length > 0) {
                _filterRe = new RegExp("(?:^|\\b|\\s)(?:"+words.join("|")+")(?:$|\\b|\\s)", "i");
            } else {
                _filterRe = null;
            }
        }

        return {
            init: function() {
                _filterWords(bdgg.settings.get('bdgg_filter_words'));
                bdgg.settings.addObserver(function(key, value) {
                    if (key == 'bdgg_filter_words') {
                        _filterWords(value);
                    }
                });

                var fnGuiPush = destiny.chat.gui.push;
                destiny.chat.gui.push = function(msg) {
                    if (_filterRe !== null && msg instanceof ChatUserMessage) {
                        if (_filterRe.test(msg.message)) {
                            return;
                        }
                    }

                    return fnGuiPush.apply(this, arguments);
                };
            }
        }
    })();
}(window.BetterDGG = window.BetterDGG || {}));

;(function(bdgg) {
    bdgg.firstrun = (function() {
        return {
            init: function() {
                var lastRun = bdgg.settings.get('bdgg_lastrun_version');
                if (bdgg.version != lastRun) {
                    $('body').append(bdgg.templates.popup({version: bdgg.version}));
                    var popup = $('#bdgg-popup');
                    popup.find('.bdgg-dismiss').on('click', function() {
                        bdgg.settings.put('bdgg_lastrun_version', bdgg.version);
                        popup.remove();
                    });
                    popup.show();
                }

                var chat = $('#destinychat');
                chat.append(bdgg.templates.about({version: bdgg.version}));

                $('body').on('click', '.bdgg-whatsnew', function() {
                    $('#bdgg-about').show();
                    bdgg.settings.hide();
                    bdgg.alert.hide();
                });

                $('#bdgg-about .close').on('click', function() {
                    $('#bdgg-about').hide();
                });
            }
        };
    })();
}(window.BetterDGG = window.BetterDGG || {}));

;(function(bdgg) {

    var BOTS = [ 'Logs', 'OPbot', 'Bot', 'HighlightBot' ];
    var CONTRIBUTORS = [ '9inevolt', 'mellipelli' ];
    var MOOBIES = [ 'Humankillerx', 'loldamar', 'Nate', 'Overpowered', 'Mannekino',
                    'Zanshin314', 'Tassadar', 'Bombjin', 'DaeNda', 'StoopidMonkey',
                    'Funnyguy17', 'Derugo', 'Fancysloth', 'dawigas', 'DerFaba'
                  ];

    var _tid = null;
    var _hideAll = false;
    var _hideEvery = false;
    var _listener = null;

    bdgg.flair = (function() {
        destiny.UserFeatures['BDGG_CONTRIBUTOR'] = 'bdgg_contributor';
        destiny.UserFeatures['BDGG_MOOBIE'] = 'bdgg_moobie';
        destiny.UserFeatures['BOT'] = '';

        var fnGetFeatureHTML = ChatUserMessage.prototype.getFeatureHTML;
        var bdggGetFeatureHTML = function() {
            var icons = fnGetFeatureHTML.apply(this, arguments);

            //This comes first because Bot wasn't getting his flair sometimes
            if (BOTS.indexOf(this.user.username) > -1) {
                    icons += '<i class="icon-bot" title="Bot"/>';
            }

            if (_hideEvery) {
                icons = ''; //Clear the emote string to set to nothing
                return icons;
            }

            if (_hideAll) {
                return icons;
            }

            if (CONTRIBUTORS.indexOf(this.user.username) > -1) {
                icons += '<i class="icon-bdgg-contributor" title="Bestiny.gg Contributor"/>';
            }

            if (MOOBIES.indexOf(this.user.username) > -1) {
                icons += '<i class="icon-bdgg-moobie" title="Movie Streamer"/>';
            }
            
            return icons;
        };

        ChatUserMessage.prototype.getFeatureHTML = bdggGetFeatureHTML;
        return {
            init: function() {
                bdgg.flair.hideAll(bdgg.settings.get('bdgg_flair_hide_all'));

                bdgg.settings.addObserver(function(key, value) {
                    if (key == 'bdgg_flair_hide_all') {
                        bdgg.flair.hideAll(value);
                    } else if (key == 'bdgg_flair_hide_every') {
                        bdgg.flair.hideEvery(value);
                    }
                });
            },
            hideAll: function(value) {
                _hideAll = value;
            },
            hideEvery: function(value) {
                _hideEvery = value;
            }
        };
    })();
}(window.BetterDGG = window.BetterDGG || {}));

;(function(bdgg) {
    bdgg.formatters = (function() {
        return {
            init: function() {
                // deleted messages
                destiny.chat.gui.removeUserMessages = function(username) {
                    this.lines.children('div[data-username="'+username.toLowerCase()+'"]').addClass('bdgg-muted');
                };

                $(destiny.chat.gui.lines).on('click', '.bdgg-muted a.externallink', function(e) {
                    return false;
                });

                // >greentext
                var BDGGGreenTextFormatter = {
                    format: function(str, user) {
                        var loc = str.indexOf("&gt;")
                        if(loc === 0){
                            str = '<span class="greentext">'+str+'</span>';
                        }
                        return str;
                    }
                }

                var _sr_url = function(url) {
                    return "http://www.reddit.com" + url;
                };

                var _sr_replacer = function(match, p1, url, p3) {
                    return p1 + '<a target="_blank" class="externallink" href="'
                        + _sr_url(url) + '">' + url + '</a>' + p3;
                };

                var bdggsubredditregex = /(^|\s)(\/r\/[A-Za-z]\w{1,20})($|\s|[\.\?!,])/g;

                var BDGGSubredditFormatter = {
                    format: function(str, user) {
                        return str.replace(bdggsubredditregex, _sr_replacer);
                    }
                }

                destiny.chat.gui.formatters.push(BDGGGreenTextFormatter);
                destiny.chat.gui.formatters.push(BDGGSubredditFormatter);
            },
            wrapMessage: function(elem, message) {
                elem.find('a[href]').each(function(i, a) {
                    var href = a.getAttribute('href');
                    var scheme = /(https?|ftp):\/\//gi;
                    var match;
                    while (match = scheme.exec(href)) {
                        if (match.index > 6) {
                            a.setAttribute('href', href.substring(0, match.index));
                            break;
                        }
                    }
                });
            }
        };
    })();
}(window.BetterDGG = window.BetterDGG || {}));

;(function(bdgg) {
    bdgg.passivestalk = (function() {
    	var style, cssBody, template
    	cssBody = '{background-color:rgba(18,144,117,0.25);color:rgba(255,255,255,0.8);}'
    	template = '.user-msg[data-username="{}"]'
        return {
        	init: function() {
        		style = document.createElement('style')
        		style.type = 'text/css'
        		document.head.appendChild(style)
        		bdgg.settings.addObserver(function(key, val) {
        			if (key == 'bgg_passive_stalk')
        				bdgg.passivestalk.update(val)
        		})
        		bdgg.passivestalk.update(bdgg.settings.get('bgg_passive_stalk'))
        	},
        	update: function(userList) {
        		var res = ''
        		userList = userList.toLowerCase().replace(' ', '').split(',')
        		for (var i = 0; i < userList.length;i++)
        			res += template.replace('{}', userList[i]) + ','
        		res = res.substring(0, res.length - 1)
        		if (style.styleSheet)
        			style.styleSheet.cssText = res + cssBody
        		else {
        			style.innerHTML = ''
        			style.appendChild(document.createTextNode(res + cssBody))
        		}
        	}
        }
    })()
}(window.BetterDGG = window.BetterDGG || {}));

;(function(bdgg) {
    bdgg.security = (function() {
        function secureWrap(proto, target) {
            var fnTarget = proto[target];
            proto[target] = function() {
                var elem = $(fnTarget.apply(this, arguments));

                // Let these formatters see the elements to avoid re-parsing html
                bdgg.emoticons.wrapMessage(elem, this);
                bdgg.formatters.wrapMessage(elem, this);

                elem.find('applet, body, base, embed, frame, frameset,'
                    + 'head, html, iframe, link, meta, object, script, style, title,'
                    + '[onblur], [onchange], [onclick], [ondblclick], [onfocus],'
                    + '[onkeydown], [onkeyup], [onload], [onmousedown],'
                    + '[onmousemove], [onmouseout], [onmouseover],'
                    + '[onmouseup], [onreset], [onscroll], [onselect],'
                    + '[onsubmit], [onunload]').remove();

                return elem.get(0).outerHTML;
            }
        }
        return {
            init: function() {
                secureWrap(ChatUserMessage.prototype, 'wrapMessage');
                secureWrap(ChatEmoteMessage.prototype, 'wrapMessage');
                secureWrap(ChatBroadcastMessage.prototype, 'wrapMessage');
            }
        };
    })();
}(window.BetterDGG = window.BetterDGG || {}));

;(function(bdgg) {
    var SETTINGS = {
        'bdgg_emote_tab_priority': {
            'name': 'Prioritize emotes',
            'description': 'Prioritize emotes for tab completion',
            'value': true,
            'type': 'boolean'
        },

        'bdgg_emote_override': {
            'name': 'Override emotes',
            'description': 'Override some emotes',
            'value': true,
            'type': 'boolean'
        },

        'bdgg_disable_combos': {
            'name': 'Disable All Combos',
            'description': 'Shut off combos',
            'value': false,
            'type': 'boolean'
        },

        'bdgg_animate_disable': {
            'name': 'Disable GIF Emotes',
            'description': 'Remove RaveDoge and the likes',
            'value': false,
            'type': 'boolean'
        },

        'bdgg_text_disable': {
            'name': 'Disable Text Combos',
            'description': 'Remove OuO combos and the likes',
            'value': false,
            'type': 'boolean'
        },

        'bdgg_light_theme': {
            'name': 'Light theme',
            'description': 'Light chat theme',
            'value': false,
            'type': 'boolean'
        },

        'bdgg_convert_overrustle_links': {
            'name': 'Convert stream links to overrustle',
            'description': 'Auto-converts stream links to use overrustle.com',
            'value': false,
            'type': 'boolean'
        },

        'bdgg_flair_hide_all': {
            'name': 'Hide all BetterD.GG flair',
            'description': 'Hide all Better Destiny.gg flairs',
            'value': false,
            'type': 'boolean'
        },

        'bdgg_flair_hide_every': {
            'name': 'Hide all D.GG flair',
            'description': 'Hide all Destiny.gg flairs',
            'value': false,
            'type': 'boolean'
        },

        'bdgg_filter_words': {
            'name': 'Custom ignore words',
            'description': 'Comma-separated list of words to filter messages from chat (case-insensitive)',
            'value': '',
            'type': 'string'
        },

        'bgg_passive_stalk': {
            'name': 'Passive Stalk Targets OuO',
            'description': 'Comma-separated list of chatters',
            'value':'',
            'type':'string'
        }
    };

    bdgg.settings = (function() {
        var _observers = [];

        var _notify = function(key, value) {
            for (var i = 0; i < _observers.length; i++) {
                _observers[i].call(this, key, value);
            }
        };

        return {
            init: function() {
                $('#destinychat .chat-tools-wrap').prepend(bdgg.templates.menu_button());
                $('#chat-bottom-frame').append(
                    $(bdgg.templates.menu()).append(
                        bdgg.templates.menu_footer({version: bdgg.version})));

                $('#bdgg-settings-btn').on('click', function(e) {
                    $('#bdgg-settings').toggle();
                    $(this).toggleClass('active');
                    window.cMenu.closeMenus(destiny.chat.gui);
                });

                $('#bdgg-settings .close').on('click', function(e) {
                    bdgg.settings.hide();
                });

                for (var key in SETTINGS) {
                    var s = SETTINGS[key];
                    s.key = key;
                    s.value = bdgg.settings.get(s.key, s.value);
                    bdgg.settings.add(s);
                }

                destiny.chat.gui.chatsettings.btn.on('click', bdgg.settings.hide);
                destiny.chat.gui.userslist.btn.on('click', bdgg.settings.hide);
            },
            addObserver: function(obs) {
                if (_observers.indexOf(obs) < 0) {
                    _observers.push(obs);
                }
            },
            removeObserver: function(obs) {
                var i = _observers.indexOf(obs);
                if (i > -1) {
                    _observers.splice(i, 1);
                    return true;
                }
                return false;
            },
            hide: function() {
                $('#bdgg-settings').hide();
                $('#bdgg-settings-btn').removeClass('active');
            },
            add: function(setting) {
                if (setting.type == 'string') {
                    $('#bdgg-settings ul').append(bdgg.templates.menu_text({setting: setting}));
                    $('#bdgg-settings input[type="text"]#' + setting.key).on('blur', function(e) {
                        var value = $(this).val();
                        bdgg.settings.put(setting.key, value);
                    });
                } else { // boolean
                    $('#bdgg-settings ul').append(bdgg.templates.menu_checkbox({setting: setting}));
                    $('#bdgg-settings input[type="checkbox"]#' + setting.key).on('change', function(e) {
                        var value = $(this).prop('checked');
                        bdgg.settings.put(setting.key, value);
                    });
                }
            },
            get: function(key, defValue) {
                var value = localStorage.getItem(key);
                if (value === null) {
                    value = defValue;
                    bdgg.settings.put(key, defValue);
                } else if (SETTINGS[key] && SETTINGS[key].type == 'boolean') {
                    value = value === 'true';
                }

                return value;
            },
            put: function(key, value) {
                localStorage.setItem(key, value);
                _notify(key, value);
            }
        };
    })();
}(window.BetterDGG = window.BetterDGG || {}));

;(function(bdgg) {
    bdgg.templates = (function() {
        return {};
    })();
}(window.BetterDGG = window.BetterDGG || {}));

;(function(bdgg) {
    bdgg.theme = (function() {
        return {
            init: function() {
                bdgg.theme.setLightTheme(bdgg.settings.get('bdgg_light_theme'));
                bdgg.settings.addObserver(function(key, value) {
                    if (key == 'bdgg_light_theme') {
                        bdgg.theme.setLightTheme(value);
                    }
                });
            },
            setLightTheme: function(value) {
                if (value) {
                    $('.chat').removeClass('chat-theme-dark').addClass('chat-theme-light');
                } else {
                    $('.chat').removeClass('chat-theme-light').addClass('chat-theme-dark');
                }
            }
        }
    })();
}(window.BetterDGG = window.BetterDGG || {}));

;(function(bdgg) {
    var _users = {};

    function _initUsers() {
        var listener = function(e) {
            if (window != e.source) {
                return;
            }

            if (e.data.type == 'bdgg_users_refreshed') {
                _users = e.data.users;
            }
        };
        window.addEventListener('message', listener);
    }

    bdgg.users = (function() {
        return {
            init: function() {
                _initUsers();
                setTimeout(bdgg.users.refresh, 1000);
            },
            get: function(username) {
                return _users[username];
            },
            refresh: function() {
                window.postMessage({type: 'bdgg_users_refresh'}, '*');
            }
        };
    })();
}(window.BetterDGG = window.BetterDGG || {}));

window.BetterDGG.templates.about = function(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (version) {
buf.push("<div id=\"bdgg-about\" style=\"display:none\" class=\"bdgg-menu\"><div class=\"list-wrap clearfix\"></div><div class=\"toolbar\"><h5><span>Bestiny.gg</span><span class=\"close glyphicon glyphicon-remove\"></span></h5></div><h6>v" + (jade.escape((jade_interp = version) == null ? '' : jade_interp)) + "</h6><ul><li>First \"Release\" WhoahDude</li><li>Add Passive Stalk feature</li><li>Remove Country flags, and related botnet</li><li>Minor CSS tweaks</li><li>Clean</li></ul><hr/><div class=\"bdgg-menu-footer\"><a href=\"https://github.com/0x9ae76c/betterdgg\" target=\"_blank\">Homepage</a></div></div>");}.call(this,"version" in locals_for_with?locals_for_with.version:typeof version!=="undefined"?version:undefined));;return buf.join("");
}
window.BetterDGG.templates.alert = function(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (message) {
buf.push("<div id=\"bdgg-alert\" style=\"display:none\" class=\"bdgg-menu\"><div class=\"list-wrap clearfix\"></div><div class=\"toolbar\"><h5><span>Bestiny.gg</span><span class=\"close glyphicon glyphicon-remove\"></span></h5></div>" + (null == (jade_interp = message) ? "" : jade_interp) + "</div>");}.call(this,"message" in locals_for_with?locals_for_with.message:typeof message!=="undefined"?message:undefined));;return buf.join("");
}
window.BetterDGG.templates.menu = function(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div id=\"bdgg-settings\" style=\"display:none\" class=\"bdgg-menu\"><div class=\"list-wrap clearfix\"></div><div class=\"toolbar\"><h5><span>Bestiny.gg</span><span class=\"close glyphicon glyphicon-remove\"></span></h5></div><ul class=\"unstyled\"></ul></div>");;return buf.join("");
}
window.BetterDGG.templates.menu_button = function(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<a id=\"bdgg-settings-btn\" title=\"Bestiny.gg\" class=\"iconbtn\"><span class=\"bdgg-glyphicon-aslan\"></span></a>");;return buf.join("");
}
window.BetterDGG.templates.menu_checkbox = function(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (setting, undefined) {
buf.push("<li><label" + (jade.attr("title", "" + (setting.description) + "", true, false)) + " class=\"checkbox\"><input" + (jade.attr("id", "" + (setting.key) + "", true, false)) + " type=\"checkbox\"" + (jade.attr("title", "" + (setting.description) + "", true, false)) + (jade.attr("checked", (setting.value ? 'checked' : undefined), true, false)) + "/>" + (jade.escape(null == (jade_interp = setting.name) ? "" : jade_interp)) + "</label></li>");}.call(this,"setting" in locals_for_with?locals_for_with.setting:typeof setting!=="undefined"?setting:undefined,"undefined" in locals_for_with?locals_for_with.undefined:typeof undefined!=="undefined"?undefined:undefined));;return buf.join("");
}
window.BetterDGG.templates.menu_footer = function(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (version) {
buf.push("<hr/><div class=\"bdgg-menu-footer\"><span>v" + (jade.escape((jade_interp = version) == null ? '' : jade_interp)) + "</span><div class=\"pull-right\"><a href=\"#\" class=\"bdgg-whatsnew\">About</a></div></div>");}.call(this,"version" in locals_for_with?locals_for_with.version:typeof version!=="undefined"?version:undefined));;return buf.join("");
}
window.BetterDGG.templates.menu_text = function(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (setting) {
buf.push("<li><label" + (jade.attr("title", setting.description, true, false)) + " class=\"text\">" + (jade.escape(null == (jade_interp = setting.name) ? "" : jade_interp)) + "<input" + (jade.attr("id", setting.key, true, false)) + " type=\"text\"" + (jade.attr("title", setting.description, true, false)) + (jade.attr("value", setting.value, true, false)) + "/></label></li>");}.call(this,"setting" in locals_for_with?locals_for_with.setting:typeof setting!=="undefined"?setting:undefined));;return buf.join("");
}
window.BetterDGG.templates.popup = function(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (version) {
buf.push("<div id=\"bdgg-popup\" style=\"display:none\"><div class=\"bdgg-logo\"></div><div class=\"bdgg-notice\"><h5>Bestiny.gg v" + (jade.escape((jade_interp = version) == null ? '' : jade_interp)) + " installed</h5><div class=\"bdgg-link-wrap\"><a href=\"#\" class=\"bdgg-whatsnew\">What's new</a><a href=\"#\" class=\"bdgg-dismiss\">Dismiss</a></div></div></div>");}.call(this,"version" in locals_for_with?locals_for_with.version:typeof version!=="undefined"?version:undefined));;return buf.join("");
}
;(function(bdgg) {bdgg.version = "1.3.4";}(window.BetterDGG = window.BetterDGG || {}));
// TODO: find a cleaner way to load this
window.BetterDGG.settings.init();
window.BetterDGG.formatters.init();
window.BetterDGG.emoticons.init();
window.BetterDGG.flair.init();
window.BetterDGG.users.init();
window.BetterDGG.filter.init();
window.BetterDGG.security.init();
window.BetterDGG.passivestalk.init();
window.BetterDGG.theme.init();
window.BetterDGG.firstrun.init();
window.BetterDGG.chat.init();
};
function inject(fn) {
    var script = document.createElement('script');
    script.setAttribute("type", "application/javascript");
    script.textContent = '(' + fn.toString() + ')();';
    document.body.appendChild(script); // run the script
    document.body.removeChild(script); // clean up
}

inject(injectedBetterDGG);
