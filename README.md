# teme-formstate
Simple, stream-based field / form state management

## Purpose

Built for my own purposes, inspired by the excellent [formstate](https://github.com/formstate/formstate) library, but adding
streams for reactivity. Not intended for wider use. Use formstate instead!

## API

### `FieldState`

`fieldState = new FieldState(options)`

Creates a new `FieldState` object. Options include:

- `value` iniital value of the field
- `formatter` function which, if given, formats values into displayable text (e.g. for dates or currencies)
- `parser` the opposite of `formatter`. Turns valid input text into a value
- `validator` a validation function, or an array of them. Signature should be inputText => (errorText | '') and can
    be async.

A `FieldState` object represents the state of a field on the screen. Its data can come from two different sources
each of which is an input stream on the object:
- a `.value` entry given from the program, often from a database.
- a `.text` entry entered on the screen by the user

Depending on the source, the data will go through validation, parsing and/or formatting, and produce the end result,
in the `.state` stream, which contains objects with the following:
- `value` the current validated value
- `text` the current text of the field, which may or may not be valid yet
- `error` the current error text (or empty string if no error)
- `dirty` if the field has been changed since the `.value` was set

Validation is done asynchronously. It can be explicity called with the async
function `.validate`, which resolves to `true/false` reflecting if the field
is valid. By this time, the state stream will have been updated.

### `FormState`

`form = new FormState({ field1: fieldState1, ... })`

`FieldState` objects can be grouped into a `FormState`

The fields are specificed in an object, and stored in `.fields`

An aggregated `.state` stream is derived from the constituent fields, and includes:
- `error` the text of the first error in its fields
- `dirty` if any of the fields is dirty

As with a `FieldState`, a `.validate` can be explicitly called to (async)
validate the fields and resolve to `true` if all fields are valid, or `false`
otherwise.

Additional helpers:
- `set(obj)` updates the `.value` of each field with the given object's values
- `getValues` returns an object of the current `.value` of the fields
- `getChanges` returns an object of the current `.value` for fields with `.dirty` set
