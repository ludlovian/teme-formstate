import t from"teme";const e=function(){function t(){}return t.prototype.then=function(e,r){const o=new t,i=this.s;if(i){const t=1&i?e:r;if(t){try{n(o,1,t(this.v))}catch(t){n(o,2,t)}return o}return this}return this.o=function(t){try{const i=t.v;1&t.s?n(o,1,e?e(i):i):r?n(o,1,r(i)):n(o,2,i)}catch(t){n(o,2,t)}},o},t}();function n(t,r,o){if(!t.s){if(o instanceof e){if(!o.s)return void(o.o=n.bind(null,t,r));1&r&&(r=o.s),o=o.v}if(o&&o.then)return void o.then(n.bind(null,t,r),n.bind(null,t,2));t.s=r,t.v=o;const i=t.o;i&&i(t)}}function r(t){return t instanceof e&&1&t.s}const o={};!function(){function t(t){this._entry=t,this._pact=null,this._resolve=null,this._return=null,this._promise=null}function r(t){return{value:t,done:!0}}function i(t){return{value:t,done:!1}}t.prototype[Symbol.asyncIterator||(Symbol.asyncIterator=Symbol("Symbol.asyncIterator"))]=function(){return this},t.prototype._yield=function(t){return this._resolve(t&&t.then?t.then(i):i(t)),this._pact=new e},t.prototype.next=function(t){const i=this;return i._promise=new Promise(function(u){const s=i._pact;if(null===s){const t=i._entry;if(null===t)return u(i._promise);function a(t){i._resolve(t&&t.then?t.then(r):r(t)),i._pact=null,i._resolve=null}i._entry=null,i._resolve=u,t(i).then(a,function(t){if(t===o)a(i._return);else{const n=new e;i._resolve(n),i._pact=null,i._resolve=null,_resolve(n,2,t)}})}else i._pact=null,i._resolve=u,n(s,1,t)})},t.prototype.return=function(t){const e=this;return e._promise=new Promise(function(i){const u=e._pact;if(null===u)return null===e._entry?i(e._promise):(e._entry=null,i(t&&t.then?t.then(r):r(t)));e._return=t,e._resolve=i,e._pact=null,n(u,2,o)})},t.prototype.throw=function(t){const e=this;return e._promise=new Promise(function(r,o){const i=e._pact;if(null===i)return null===e._entry?r(e._promise):(e._entry=null,o(t));e._resolve=r,e._pact=null,n(i,2,t)})}}();var i=function(e){var n,r=this;void 0===e&&(e={}),this.validator=(n=e.validator||[],Array.isArray(n)?n:[n]),this.parser=e.parser,this.formatter=e.formatter,this.value=t(),this.text=t(),this.value.subscribe(function(t){return r._updateValue(t)}),this.text.subscribe(function(t){return r._updateText(t)}),this.update=t(),this.state=this.update.scan(function(t,e){return Object.assign({},t,e)},{}),this.value(e.value)};i.prototype._updateValue=function(t){var e=s(t,this.formatter);this.update({error:"",value:t,text:e,dirty:!1})},i.prototype._updateText=function(t){var e=this;this.update({text:t,dirty:!0}),Promise.resolve().then(function(){return e.validate()})},i.prototype.validate=function(){try{var t=!1,o=this;function i(){if(u)return o.update({error:u,text:a}),!1;var t=function(t,e){return e?e(t):t}(a,o.parser);return a=s(t,o.formatter),o.update({error:u,value:t,text:a}),!0}var u="",a=o.state().text||"",c=0,l=function(t,o,i){for(var u;;){var s=t();if(r(s)&&(s=s.v),!s)return a;if(s.then){u=0;break}var a=i();if(a&&a.then){if(!r(a)){u=1;break}a=a.s}if(o){var c=o();if(c&&c.then&&!r(c)){u=2;break}}}var l=new e,f=n.bind(null,l,2);return(0===u?s.then(v):1===u?a.then(h):c.then(p)).then(void 0,f),l;function h(e){a=e;do{if(o&&(c=o())&&c.then&&!r(c))return void c.then(p).then(void 0,f);if(!(s=t())||r(s)&&!s.v)return void n(l,1,a);if(s.then)return void s.then(v).then(void 0,f);r(a=i())&&(a=a.v)}while(!a||!a.then);a.then(h).then(void 0,f)}function v(t){t?(a=i())&&a.then?a.then(h).then(void 0,f):h(a):n(l,1,a)}function p(){(s=t())?s.then?s.then(v).then(void 0,f):v(s):n(l,1,a)}}(function(){return!t&&c<o.validator.length},function(){return c++},function(){return Promise.resolve((0,o.validator[c])(a)).then(function(e){(u=e)&&(t=!0)})});return l&&l.then?l.then(i):i()}catch(t){return Promise.reject(t)}};var u=function(e){var n=this;void 0===e&&(e={}),this.fields=e,this.state=t.combine(function(){return n._updateState()},Object.values(e).map(function(t){return t.state})).dedupe(a)};function s(t,e){return e?e(t):null==t?"":String(t)}function a(t,e){return t===e||t&&e&&"object"==typeof t&&"object"==typeof e&&Object.keys(e).every(function(e){return Object.prototype.hasOwnProperty.call(t,e)})&&Object.keys(t).every(function(n){return e[n]===t[n]})}u.prototype._updateState=function(){return Object.values(this.fields).reduce(function(t,e){var n=t.dirty;return{error:t.error||e.state().error,dirty:n||e.state().dirty}},{error:"",dirty:!1})},u.prototype.validate=function(){return Promise.all(Object.values(this.fields).map(function(t){return t.validate()})).then(function(t){return t.every(Boolean)})},u.prototype.set=function(t){Object.entries(this.fields).forEach(function(e){return e[1].value(t[e[0]])})},u.prototype.getChanges=function(){return Object.entries(this.fields).reduce(function(t,e){var n=e[0],r=e[1].state();return r.dirty&&(t[n]=r.value),t},{})},u.prototype.getValues=function(){return Object.entries(this.fields).reduce(function(t,e){return t[e[0]]=e[1].state().value,t},{})};export{i as FieldState,u as FormState};
//# sourceMappingURL=index.mjs.map