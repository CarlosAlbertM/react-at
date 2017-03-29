(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'module'], factory);
    } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
        factory(exports, module);
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, mod);
        global.index = mod.exports;
    }
})(this, function (exports, module) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
      value: true
    });

    var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

    var _react = require('react');

    var _react2 = _interopRequireDefault(_react);

    var _util = require('./util');

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

    function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

    // todo: textarea
    // http://stackoverflow.com/questions/12194113/how-to-get-range-of-selected-text-of-textarea-in-javascript

    var at = '@';

    var Atwho = function (_Component) {
      _inherits(Atwho, _Component);

      function Atwho() {
        var _ref;

        _classCallCheck(this, Atwho);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var _this = _possibleConstructorReturn(this, (_ref = Atwho.__proto__ || Object.getPrototypeOf(Atwho)).call.apply(_ref, [this].concat(args)));

        _this.handleCompositionStart = _this.handleCompositionStart.bind(_this);
        _this.handleCompositionEnd = _this.handleCompositionEnd.bind(_this);
        _this.handleInput = _this.handleInput.bind(_this);
        _this.handleKeyDown = _this.handleKeyDown.bind(_this);
        _this.handleItemHover = _this.handleItemHover.bind(_this);
        _this.handleItemClick = _this.handleItemClick.bind(_this);

        _this.hasComposition = false;
        _this.state = {
          atwho: null
        };
        return _this;
      }

      _createClass(Atwho, [{
        key: 'handleItemClick',
        value: function handleItemClick() {
          this.selectItem();
        }
      }, {
        key: 'handleItemHover',
        value: function handleItemHover(e) {
          var atwho = this.state.atwho;

          var el = (0, _util.closest)(e.target, function (d) {
            return d.dataset.index;
          });
          var cur = +el.dataset.index;
          this.setState({
            atwho: _extends({}, atwho, {
              cur: cur
            })
          });
        }
      }, {
        key: 'handleDelete',
        value: function handleDelete(e) {
          var range = (0, _util.getPrecedingRange)();
          if (range) {
            var text = range.toString();
            var index = text.lastIndexOf(at);
            if (index > -1) {
              var chunk = text.slice(index + 1, -1);
              var members = this.props.members;

              var has = members.indexOf(chunk) > -1;
              if (has) {
                e.preventDefault();
                e.stopPropagation();
                var r = (0, _util.getRange)();
                if (r) {
                  r.setStart(r.endContainer, index);
                  r.deleteContents();
                  (0, _util.applyRange)(r);
                }
              }
            }
          }
        }
      }, {
        key: 'handleKeyDown',
        value: function handleKeyDown(e) {
          var _this2 = this;

          var atwho = this.state.atwho;

          if (atwho) {
            if (e.keyCode === 38 || e.keyCode === 40) {
              // ↑/↓
              // fixme: props hook
              if (!(e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                e.stopPropagation();
                var offset = e.keyCode === 38 ? -1 : 1;
                var members = this.props.members;
                var cur = atwho.cur;

                this.setState({
                  atwho: _extends({}, atwho, {
                    cur: (cur + offset + members.length) % members.length
                  })
                }, function () {
                  _this2.refs.cur.scrollIntoViewIfNeeded();
                });
              }
              return;
            }
            if (e.keyCode === 13) {
              // enter
              this.selectItem();
              e.preventDefault();
              e.stopPropagation();
              return;
            }
            if (e.keyCode === 27) {
              // esc
              this.closePanel();
              return;
            }
          }
          setTimeout(this.handleInput, 50);

          if (e.keyCode === 8) {
            this.handleDelete(e);
          }
        }

        // compositionStart -> input -> compositionEnd

      }, {
        key: 'handleCompositionStart',
        value: function handleCompositionStart() {
          this.hasComposition = true;
        }
      }, {
        key: 'handleCompositionEnd',
        value: function handleCompositionEnd() {
          this.hasComposition = false;
          this.handleInput();
        }
      }, {
        key: 'handleInput',
        value: function handleInput() {
          if (this.hasComposition) return;
          var range = (0, _util.getPrecedingRange)();
          if (range) {
            var show = true;
            var text = range.toString();
            var index = text.lastIndexOf(at);
            if (index < 0) show = false;
            var prev = text[index - 1];

            // 上一个字符不能为字母数字 避免与邮箱冲突
            if (/^[a-z0-9]$/i.test(prev)) show = false;
            var chunk = text.slice(index + 1);
            // chunk以空白字符开头不匹配 避免`@ `也匹配
            if (/^\s/.test(chunk)) show = false;

            if (!show) {
              this.closePanel();
            } else {
              var chunk_l = chunk.toLowerCase();
              var members = this.props.members;

              var matched = members.filter(function (item) {
                // match at lower-case
                return item.toLowerCase().indexOf(chunk_l) > -1;
              });
              if (matched.length) {
                this.openPanel(matched, range, index);
              } else {
                this.closePanel();
              }
            }
          }
        }
      }, {
        key: 'closePanel',
        value: function closePanel() {
          if (this.state.atwho) {
            this.setState({
              atwho: null
            });
          }
        }
      }, {
        key: 'openPanel',
        value: function openPanel(list, range, offset) {
          var _this3 = this;

          var fn = function fn() {
            var r = range.cloneRange();
            r.setStart(r.endContainer, offset + 1); // 从@后第一位开始
            // todo: 根据窗口空间 判断向上或是向下展开
            var rect = r.getClientRects()[0];
            _this3.setState({
              atwho: {
                range: range,
                offset: offset,
                list: list,
                x: rect.left,
                y: rect.top - 4,
                cur: 0 }
            });
          };
          if (this.state.atwho) {
            fn();
          } else {
            // 焦点超出了显示区域 需要提供延时以移动指针 再计算位置
            setTimeout(fn, 10);
          }
        }
      }, {
        key: 'selectItem',
        value: function selectItem() {
          var _state$atwho = this.state.atwho,
              range = _state$atwho.range,
              offset = _state$atwho.offset,
              list = _state$atwho.list,
              cur = _state$atwho.cur;

          var r = range.cloneRange();
          r.setStart(r.endContainer, offset + 1); // 从@后第一位开始
          // hack: 连续两次 可以确保click后 focus回来 range真正生效
          (0, _util.applyRange)(r);
          (0, _util.applyRange)(r);
          document.execCommand('insertText', 0, list[cur] + ' ');
        }
      }, {
        key: 'renderList',
        value: function renderList() {
          var _this4 = this;

          var atwho = this.state.atwho;

          if (!atwho) return null;
          var list = atwho.list,
              cur = atwho.cur,
              x = atwho.x,
              y = atwho.y;

          var style = null;
          var wrap = this.refs.wrap;

          if (wrap) {
            var offset = (0, _util.getOffset)(wrap);
            var left = x - offset.left;
            var top = y - offset.top;
            style = { left: left, top: top };
          }
          return _react2.default.createElement(
            'div',
            { className: 'atwho-panel', style: style },
            _react2.default.createElement(
              'div',
              { className: 'atwho-inner' },
              _react2.default.createElement(
                'div',
                { className: 'atwho-view' },
                _react2.default.createElement(
                  'ul',
                  { className: 'atwho-view-ul' },
                  list.map(function (item, index) {
                    var isCur = index === cur;
                    return _react2.default.createElement(
                      'li',
                      { key: item, className: isCur && 'cur',
                        ref: isCur && 'cur',
                        'data-index': index,
                        onMouseEnter: _this4.handleItemHover,
                        onClick: _this4.handleItemClick
                      },
                      _react2.default.createElement(
                        'span',
                        null,
                        item
                      )
                    );
                  })
                )
              )
            )
          );
        }

        // Getting DOM node from React child element
        // http://stackoverflow.com/questions/29568721/getting-dom-node-from-react-child-element

      }, {
        key: 'render',
        value: function render() {
          var children = this.props.children;

          return _react2.default.createElement(
            'div',
            {
              ref: 'wrap',
              className: 'atwho-wrap',
              onCompositionStart: this.handleCompositionStart,
              onCompositionEnd: this.handleCompositionEnd,
              onInput: this.handleInput,
              onKeyDown: this.handleKeyDown
            },
            this.renderList(),
            children
          );
        }
      }]);

      return Atwho;
    }(_react.Component);

    Atwho.propTypes = {
      members: _react.PropTypes.array.isRequired
    };
    module.exports = Atwho;
})
