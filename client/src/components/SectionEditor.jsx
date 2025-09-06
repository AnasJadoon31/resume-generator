import React from 'react'

export function SectionEditor({ schema, value, onChange }) {
  if (!schema) return null
  if (schema.type === 'object') {
    return <ObjectEditor schema={schema} value={value || {}} onChange={onChange} />
  }
  if (schema.type === 'array') {
    return <ArrayEditor schema={schema} value={value || []} onChange={onChange} />
  }
  if (schema.type === 'string') {
    return <input className="input" value={value || ''} onChange={e => onChange(e.target.value)} />
  }
  return null
}

function ObjectEditor({ schema, value, onChange }) {
  const fields = schema.fields || []

  const set = (key, val) => onChange({ ...value, [key]: val })

  return (
    <div className="grid">
      {fields.map(f => (
        <div className="field" key={f.key} style={{ gridColumn: f.full ? '1/-1' : undefined }}>
          <label>{f.label}</label>
          {renderField(f, value[f.key], v => set(f.key, v))}
        </div>
      ))}
    </div>
  )
}

function ArrayEditor({ schema, value, onChange }) {
  const add = () => {
    const next = schema.defaultItem ? schema.defaultItem() : {}
    onChange([...(value || []), next])
  }
  const update = (idx, val) => {
    const arr = [...value]
    arr[idx] = val
    onChange(arr)
  }
  const remove = (idx) => {
    const arr = value.filter((_, i) => i !== idx)
    onChange(arr)
  }
  const move = (idx, dir) => {
    const arr = [...value]
    const j = idx + dir
    if (j < 0 || j >= arr.length) return
    ;[arr[idx], arr[j]] = [arr[j], arr[idx]]
    onChange(arr)
  }

  return (
    <div className="array-editor">
      <div className="array-items">
        {(value || []).map((item, i) => (
          <div className="array-item" key={i}>
            <div className="array-item-controls">
              <button className="icon" title="Move up" onClick={() => move(i, -1)}>↑</button>
              <button className="icon" title="Move down" onClick={() => move(i, +1)}>↓</button>
              <button className="icon danger" title="Remove" onClick={() => remove(i)}>✕</button>
            </div>
            <div className="array-item-body">
              {schema.item && schema.item.type === 'object' && (
                <ObjectEditor schema={schema.item} value={item} onChange={val => update(i, val)} />
              )}
              {schema.item && schema.item.type === 'string' && (
                <input className="input" value={item || ''} onChange={e => update(i, e.target.value)} />
              )}
            </div>
          </div>
        ))}
      </div>
      <button className="btn" onClick={add}>Add {schema.addLabel || 'Item'}</button>
    </div>
  )
}

function renderField(f, value, onChange) {
  if (f.type === 'string') {
    return <input className="input" placeholder={f.placeholder} value={value || ''} onChange={e => onChange(e.target.value)} />
  }
  if (f.type === 'textarea') {
    return <textarea className="textarea" rows={f.rows || 3} placeholder={f.placeholder} value={value || ''} onChange={e => onChange(e.target.value)} />
  }
  if (f.type === 'array-string') {
    const arr = Array.isArray(value) ? value : []
    const add = () => onChange([...arr, ''])
    const set = (i, v) => { const next = [...arr]; next[i] = v; onChange(next) }
    const remove = (i) => onChange(arr.filter((_, j) => i !== j))
    return (
      <div>
        {arr.map((v, i) => (
          <div key={i} className="row">
            <input className="input" value={v} onChange={e => set(i, e.target.value)} />
            <button className="icon danger" onClick={() => remove(i)}>✕</button>
          </div>
        ))}
        <button className="btn" onClick={add}>Add</button>
      </div>
    )
  }
  if (f.type === 'array-object') {
    return <ArrayEditor schema={{ type: 'array', item: { type: 'object', fields: f.fields }, defaultItem: f.defaultItem, addLabel: f.addLabel }} value={value} onChange={onChange} />
  }
  if (f.type === 'object') {
    return <ObjectEditor schema={{ type: 'object', fields: f.fields }} value={value} onChange={onChange} />
  }
  return null
}

