var helper = function () {

    return {
        shuffle: function (array) {
            var j, temp;
            for (var i = array.length - 1; i > 0; i--) {
                j = Math.floor(Math.random() * (i + 1));
                temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
            return array;
        },
        chunks: function (array, size) {
            var results = [];
            while (array.length) {
                results.push(array.splice(0, size));
            }
            return results;
        },
        countNoEmpty: function (array) {
            var count = 0, i = 0;
            for (; i < array.length; i++) {
                if (typeof array[i] !== "number") {
                    if (array[i] !== null && array[i] !== undefined
                        && array[i] !== "" && array[i].valueOf() !== "")
                        count++;
                } else {
                    if (!isNaN(array[i]))
                        count++;
                }
            }
            return count;
        },
        countObject: function (objeto) {
            cont = 0;
            $.each(objeto, function (i, data) {
                cont++;
            });
            return cont;
        },
        preg_match_all: function (regex, haystack) {
            var globalRegex = new RegExp(regex, 'g');
            var globalMatch = haystack.match(globalRegex);
            matchArray = new Array();
            for (var i in globalMatch) {
                nonGlobalRegex = new RegExp(regex);
                nonGlobalMatch = globalMatch[i].match(nonGlobalRegex);
                matchArray.push(nonGlobalMatch[1]);
            }
            return matchArray;
        },
        array_diff_assoc: function (arr1) {
            var retArr = {}, argl = arguments.length, k1 = '', i = 1, k = '', arr = {};
            arr1keys: for (k1 in arr1) {
                for (i = 1; i < argl; i++) {
                    arr = arguments[i];
                    for (k in arr) {
                        if (arr[k] === arr1[k1] && k === k1) {
                            // If it reaches here, it was found in at least one
                            // array, so try next value
                            continue arr1keys;
                        }
                    }
                    retArr[k1] = arr1[k1];
                }
            }

            return retArr;
        },
        rtrim: function (str, charlist) {
            charlist = !charlist ? ' \\s\u00A0' : (charlist + '').replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '\\$1');
            var re = new RegExp('[' + charlist + ']+$', 'g');
            return (str + '').replace(re, '');
        },
        trim: function (str, charlist) {
            var whitespace, l = 0,
                i = 0;
            str += '';

            if (!charlist) {
                // default list
                whitespace = ' \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000';
            } else {
                // preg_quote custom list
                charlist += '';
                whitespace = charlist.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '$1');
            }

            l = str.length;
            for (i = 0; i < l; i++) {
                if (whitespace.indexOf(str.charAt(i)) === -1) {
                    str = str.substring(i);
                    break;
                }
            }

            l = str.length;
            for (i = l - 1; i >= 0; i--) {
                if (whitespace.indexOf(str.charAt(i)) === -1) {
                    str = str.substring(0, i + 1);
                    break;
                }
            }

            return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';

        },
        ucwords: function (text) {
            text = text.toLowerCase(text);
            text = text.charAt(0).toUpperCase() + text.slice(1);
            return text;
        },
        escapeHtml: function (text) {
            var map = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                '\'': '&#039;'
            };

            return text.replace(/[&<>"']/g, function (m) {
                return map[m];
            });
        },
        stripTags: function (text) {
            const tagsRE = /<\/?[^>]+>/gi;
            const result = text.replace(tagsRE, "");
            return result;
        }
    }
}();