
String.prototype.myTrim = function myTrim() {
    if ('trim' in String.prototype) {
        return this.trim();
    }
    return this.replace(/^ +| +$/g, '');
};

export default (function () {
    function listToArray(likeAry) {
        var ary = [];
        try {
            ary = Array.prototype.slice.call(likeAry);
        } catch (e) {
            for (var i = 0; i < likeAry.length; i++) {
                ary.push(likeAry[i]);
            }
        }
        return ary;
    }

    function offset(curEle) {
        var l = curEle.offsetLeft,
            t = curEle.offsetTop,
            p = curEle.offsetParent;
        while (p) {
            if (navigator.userAgent.indexOf('MSIE 8.0') === -1) {
                l += p.clientLeft;
                t += p.clientTop;
            }
            l += p.offsetLeft;
            t += p.offsetTop;
            p = p.offsetParent;
        }
        return {top: t, left: l};
    }

    function getCss(curEle, attr) {
        var result = null,
            reg = null;
        if ('getComputedStyle' in window) {
            result = window.getComputedStyle(curEle, null)[attr];
        } else {
            if (attr === 'opacity') {
                result = curEle.currentStyle['filter'];
                reg = /^alpha\(opacity=(.+)\)$/;
                result = reg.test(result) ? reg.exec(result)[1] / 100 : 1;
            } else {
                result = curEle.currentStyle[attr];
            }
        }
        reg = /^-?(\d|([1-9]\d+))(\.\d+)?(px|em|rem|pt)?$/;
        reg.test(result) ? result = parseFloat(result) : null;
        return result;
    }

    function setCss(curEle, attr, value) {
        if (arguments.length < 3) {
            return;
        }

        if (attr === 'float') {
            curEle['style']['cssFloat'] = value;
            curEle['style']['styleFloat'] = value;
            return;
        }

        if (attr === 'opacity') {
            curEle['style']['opacity'] = value;
            curEle['style']['filter'] = 'alpha(opacity=' + value * 100 + ')';
            return;
        }

        var reg = /^(width|height|((margin|padding)?(left|right|bottom|top))|fontSize)$/i;
        if (reg.test(attr)) {
            if (!isNaN(value)) {
                value = value + 'px';
            }
        }
        curEle['style'][attr] = value;
    }

    function setGroupCss(curEle, options) {
        if (typeof options !== 'object') return;
        for (var attr in options) {
            if (options.hasOwnProperty(attr)) {
                setCss(curEle, attr, options[attr]);
            }
        }
    }

    function css() {
        var len = arguments.length,
            curEle = arguments[0],
            attr = null,
            value = null,
            options = null;
        if (len === 3) {
            attr = arguments[1];
            value = arguments[2];
            setCss(curEle, attr, value);
            return;
        }

        if (len === 2 && typeof arguments[1] === 'object') {
            options = arguments[1];
            setGroupCss(curEle, options);
            return;
        }

        attr = arguments[1];
        return getCss(curEle, attr);
    }

    function getByClass(strClass, context) {
        context = context || document;
        if ('getElementsByClassName' in document) {
            return listToArray(context.getElementsByClassName(strClass));
        }

        var allNode = context.getElementsByTagName('*'),
            classList = strClass.replace(/^ +| +$/g, '').split(/ +/g),
            ary = [];
        for (var i = 0; i < allNode.length; i++) {
            var curNode = allNode[i],
                curName = curNode.className,
                flag = true;
            for (var j = 0; j < classList.length; j++) {
                var reg = new RegExp('\\b' + classList[j] + '\\b');
                if (!reg.test(curName)) {
                    flag = false;
                    break;
                }
            }
            flag ? ary.push(curNode) : null;
        }
        return ary;
    }

    function children(curEle, tagName) {
        var allNodes = curEle.childNodes,
            elementAry = [];
        for (var i = 0; i < allNodes.length; i++) {
            var curNode = allNodes[i];
            if (curNode.nodeType === 1) {
                var curNodeTag = curNode.tagName.toUpperCase();
                if (typeof tagName !== 'undefined') {
                    tagName = tagName.toUpperCase();
                    curNodeTag === tagName ? elementAry[elementAry.length] = curNode : null;
                    continue;
                }
                elementAry[elementAry.length] = curNode;
            }
        }
        return elementAry;
    }

    function hasClass(curEle, strClass) {
        return new RegExp('\\b' + strClass + '\\b').test(curEle.className);
    }

    function addClass(curEle, strClass) {
        var classList = strClass.myTrim().split(/ +/);
        for (var i = 0, len = classList.length; i < len; i++) {
            var curClass = classList[i];
            !hasClass(curEle, curClass) ? curEle.className += ' ' + curClass : null;
        }
        curEle.className = curEle.className.myTrim().replace(/ +/g, ' ');
    }

    function removeClass(curEle, strClass) {
        var classList = strClass.myTrim().split(/ +/);
        for (var i = 0, len = classList.length; i < len; i++) {
            var curClass = classList[i],
                reg = new RegExp('(^| +)' + curClass + '( +|$)', 'g');
            if (hasClass(curEle, curClass)) {
                curEle.className = curEle.className.replace(reg, ' ');
            }
        }
    }

    function toggleClass(curEle, strClass) {
        var classList = strClass.myTrim().split(/ +/);
        for (var i = 0, len = classList.length; i < len; i++) {
            var curClass = classList[i];
            hasClass(curEle, curClass) ? removeClass(curEle, curClass) : addClass(curEle, curClass);
        }
    }

    function prev(curEle) {
        if ('previousElementSibling' in curEle) {
            return curEle.previousElementSibling;
        }
        var p = curEle.previousSibling;
        while (p && p.nodeType !== 1) {
            p = p.previousSibling;
        }
        return p;
    }

    function prevAll(curEle) {
        var ary = [],
            p = prev(curEle);
        while (p) {
            ary.unshift(p);
            p = prev(p);
        }
        return ary;
    }

    function next(curEle) {
        if ('nextElementSibling' in curEle) {
            return curEle.nextElementSibling;
        }
        var n = curEle.nextSibling;
        while (n && n.nodeType !== 1) {
            n = n.nextSibling;
        }
        return n;
    }

    function nextAll(curEle) {
        var ary = [],
            n = next(curEle);
        while (n) {
            ary.push(n);
            n = next(n);
        }
        return ary;
    }


    function siblings(curEle) {
        return prevAll(curEle).concat(nextAll(curEle));
    }


    function index(curEle) {
        return prevAll(curEle).length;
    }

    function firstChild(curEle) {
        if ('firstElementChild' in curEle) {
            return curEle.firstElementChild;
        }
        var first = curEle.firstChild;
        while (first && first.nodeType !== 1) {
            first = first.nextSibling;
        }
        return first;
    }

    function prepend(newEle, container) {
        var first = firstChild(container);
        if (first) {
            container.insertBefore(newEle, first);
            return;
        }
        container.appendChild(newEle);
    }

    function insertAfter(newEle, oldEle) {
        var n = next(oldEle),
            p = oldEle.parentNode;
        if (n) {
            p.insertBefore(newEle, n);
            return;
        }
        p.appendChild(newEle);
    }

    function win(attr, val) {
        if(typeof val === 'undefined'){
            return document.documentElement[attr] || document.body[attr];
        }
        document.documentElement[attr] = val;
        document.body[attr] = val;
    }

    function table(ele1,ele2='false') {
        const lis = document.getElementsByClassName(ele1)[0].children;

        if(!ele2){
            for (let i = 0; i < lis.length; i++) {
                (function (i) {
                    lis[i].addEventListener('click', function () {
                        for (let j = 0; j < lis.length; j++) {
                            removeClass(lis[j], 'showLi');
                        }
                        addClass(this, 'showLi');
                    }, false);
                })(i);
            }
        }else{
            const divs = document.getElementsByClassName(ele2)[0].children;
            for (let i = 0; i < lis.length; i++) {
                (function (i) {
                    lis[i].addEventListener('click', function () {
                        for (let j = 0; j < lis.length; j++) {
                            removeClass(lis[j], 'showLi');
                            removeClass(divs[j], 'show');
                        }
                        addClass(this, 'showLi');
                        addClass(divs[i], 'show');
                    }, false);
                })(i);
            }
        }

    }
    return {
        win: win,
        listToArray: listToArray,
        offset: offset,
        css: css,
        getByClass: getByClass,
        children: children,
        hasClass: hasClass,
        addClass: addClass,
        removeClass: removeClass,
        toggleClass: toggleClass,
        prev: prev,
        prevAll: prevAll,
        next: next,
        nextAll: nextAll,
        siblings: siblings,
        index: index,
        firstChild: firstChild,
        prepend: prepend,
        insertAfter: insertAfter,
        table:table
    };
})();






