import test from 'ava'
import { FieldState, FormState } from '../src'

test('Field creation', t => {
  const f = new FieldState()
  t.true(f instanceof FieldState)
})
test('Field set value no formatter', t => {
  const f = new FieldState()
  f.value('bar')
  t.is(f.state().value, 'bar')
  t.is(f.state().text, 'bar')
})
test('Field set value with formatter', t => {
  const f = new FieldState({ value: 1, formatter: x => 'Value=' + x })
  t.is(f.state().value, 1)
  t.is(f.state().text, 'Value=1')

  f.value(2)
  t.is(f.state().value, 2)
  t.is(f.state().text, 'Value=2')
})
test('Field set valid text', async t => {
  const f = new FieldState({
    validator: t => (t.startsWith('f') ? '' : 'Not foo')
  })
  f.text('foo')
  let { text, dirty, error, value } = f.state()
  t.is(text, 'foo')
  t.is(dirty, true)
  t.falsy(value)

  // validation is done async, so wait until the state changes
  await f.state.changed()
  ;({ error, value } = f.state())
  t.is(error, '')
  t.is(value, 'foo')
})
test('Field set invalid text', async t => {
  const f = new FieldState({
    validator: [
      text => (text ? '' : 'empty'),
      text => (text.startsWith('f') ? '' : 'Not foo')
    ]
  })
  f.text('bar')

  await f.state.changed()
  let { error } = f.state()
  t.is(error, 'Not foo')
})
test('Field set text with parser', async t => {
  const f = new FieldState({
    parser: text => text.slice(1),
    formatter: text => 'F' + text
  })

  f.text('foobar')
  await f.validate()
  t.is(f.state().value, 'oobar')
  t.is(f.state().text, 'Foobar')
})
test('Validate fresh field', async t => {
  const f = new FieldState()
  const isValid = await f.validate()
  t.true(isValid)
})

test('Form creation', t => {
  t.true(new FormState() instanceof FormState)
})
test('Complex form', async t => {
  const f = new FormState({
    foo: new FieldState({
      validator: text => (text.startsWith('f') ? '' : 'not foo')
    }),
    bar: new FieldState({
      validator: text => (text.startsWith('b') ? '' : 'not bar')
    })
  })

  t.deepEqual(f.getChanges(), {})
  let o = { foo: 'foo', bar: 'bar' }
  f.set(o)
  t.deepEqual(f.getValues(), o)

  // mark one field in error
  f.fields.foo.text('FOO')
  t.false(await f.validate())
  t.is(f.state().error, 'not foo')

  // mark second field in error - should not change the state
  let unsub = f.state.subscribe(() => t.false(true))
  f.fields.bar.text('BAR')
  await f.validate()
  unsub()

  // put fields back
  f.fields.foo.text('foo')
  f.fields.bar.text('bar')
  await f.validate()
  t.deepEqual(f.getChanges(), o)
})
