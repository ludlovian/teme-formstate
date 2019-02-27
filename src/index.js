'use strict'

import teme from 'teme'

//
// Field state.
//
// Has two inputs sreams of data
//
// - value (from backend)
// - text (from user)
//
// goes through
// - validation (of input)
// - parsing (of input)
// - formatting (of value)
//
// and produces output stream of
// - value (to backend)
// - text (to user)
// - error (to user)
//
export class FieldState {
  constructor (opts = {}) {
    this.validator = ensureArray(opts.validator || [])
    this.parser = opts.parser
    this.formatter = opts.formatter
    // the two input streams
    this.value = teme()
    this.text = teme()

    this.value.subscribe(v => this._updateValue(v))
    this.text.subscribe(t => this._updateText(t))
    this.update = teme()
    this.state = this.update.scan((s, p) => Object.assign({}, s, p), {})
    this.value(opts.value)
  }

  _updateValue (value) {
    // new value supplied, so format text accordingly
    const text = format(value, this.formatter)
    this.update({ error: '', value, text, dirty: false })
  }

  _updateText (text) {
    // new text value supplied, so add it, and queue validation
    this.update({ text, dirty: true })
    Promise.resolve().then(() => this.validate())
  }

  // can be called by user - async validate and updates status
  // message
  //
  // returns true if valid
  async validate () {
    let error = ''
    let text = this.state().text || ''
    for (let i = 0; i < this.validator.length; i++) {
      const validator = this.validator[i]
      error = await validator(text)
      if (error) break
    }
    if (!error) {
      const value = parse(text, this.parser)
      text = format(value, this.formatter)
      this.update({ error, value, text })
      return true
    } else {
      this.update({ error, text })
      return false
    }
  }
}

export class FormState {
  constructor (fields = {}) {
    this.fields = fields
    this.state = teme
      .combine(
        () => this._updateState(),
        Object.values(fields).map(f => f.state)
      )
      .dedupe(shallow)
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
    // force validation of each field, return true if all valid
    return Promise.all(
      Object.values(this.fields).map(fld => fld.validate())
    ).then(valids => valids.every(Boolean))
  }

  set (data) {
    Object.entries(this.fields).forEach(([k, fld]) => fld.value(data[k]))
  }

  getChanges () {
    return Object.entries(this.fields).reduce((o, [k, fld]) => {
      const { dirty, value } = fld.state()
      if (dirty) o[k] = value
      return o
    }, {})
  }

  getValues () {
    return Object.entries(this.fields).reduce((o, [k, fld]) => {
      o[k] = fld.state().value
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
