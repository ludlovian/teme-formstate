'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var teme = _interopDefault(require('teme'));

class FieldState {
  constructor (opts = {}) {
    this.validator = ensureArray(opts.validator || []);
    this.parser = opts.parser;
    this.formatter = opts.formatter;
    this.value = teme();
    this.text = teme();
    this.value.subscribe(v => this._updateValue(v));
    this.text.subscribe(t => this._updateText(t));
    this.update = teme();
    this.state = this.update.scan((s, p) => Object.assign({}, s, p), {});
    this.value(opts.value);
  }
  _updateValue (value) {
    const text = format(value, this.formatter);
    this.update({ error: '', value, text, dirty: false });
  }
  _updateText (text) {
    this.update({ text, dirty: true });
    Promise.resolve().then(() => this.validate());
  }
  async validate () {
    let error = '';
    let text = this.state().text || '';
    for (let i = 0; i < this.validator.length; i++) {
      const validator = this.validator[i];
      const result = await validator(text);
      if (result) {
        error = result;
        break
      }
    }
    if (!error) {
      const value = parse(text, this.parser);
      text = format(value, this.formatter);
      this.update({ error, value, text });
      return true
    } else {
      this.update({ error, text });
      return false
    }
  }
}
class FormState {
  constructor (fields = {}) {
    this.fields = fields;
    this.state = teme
      .combine(
        () => this._updateState(),
        Object.values(fields).map(f => f.state)
      )
      .dedupe(shallow);
  }
  _updateState () {
    return Object.values(this.fields).reduce(
      ({ error, dirty }, fld) => ({
        error: error || fld.state().error,
        dirty: dirty || fld.state().dirty
      }),
      { error: '', dirty: false }
    )
  }
  validate () {
    return Promise.all(
      Object.values(this.fields).map(fld => fld.validate())
    ).then(valids => valids.every(Boolean))
  }
  set (data) {
    Object.entries(this.fields).forEach(([k, fld]) => fld.value(data[k]));
  }
  getChanges () {
    return Object.entries(this.fields).reduce((o, [k, fld]) => {
      const { dirty, value } = fld.state();
      if (dirty) o[k] = value;
      return o
    }, {})
  }
  getValues () {
    return Object.entries(this.fields).reduce((o, [k, fld]) => {
      o[k] = fld.state().value;
      return o
    }, {})
  }
}
function format (value, formatter) {
  if (formatter) return formatter(value)
  if (value == null) return ''
  return String(value)
}
function parse (text, parser) {
  return parser ? parser(text) : text
}
function ensureArray (o) {
  return Array.isArray(o) ? o : [o]
}
function shallow (a, b) {
  return (
    a === b ||
    (a &&
      b &&
      typeof a === 'object' &&
      typeof b === 'object' &&
      Object.keys(b).every(k => Object.prototype.hasOwnProperty.call(a, k)) &&
      Object.keys(a).every(k => b[k] === a[k]))
  )
}

exports.FieldState = FieldState;
exports.FormState = FormState;
//# sourceMappingURL=index.js.map
