#!/usr/bin/env node
// JSON✯Atomic linter — validates ledger NDJSON and templates against schemas and house rules.
import fs from 'node:fs'
import path from 'node:path'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'

const argv = Object.fromEntries(process.argv.slice(2).map(a => {
  const [k, ...rest] = a.split('='); return [k.replace(/^--/,''), rest.join('=') || true]
}))

const LEDGER = argv.ledger || 'public/ledger'
const TEMPLATES = argv.templates || 'public/templates'
const SCHEMAS = argv.schemas || 'public/schemas'
const OUT = argv.out || 'public/status/lint.report.json'

function loadSchemas(dir){
  const ajv = new Ajv({ allErrors: true, strict: false })
  addFormats(ajv)
  const map = {}
  for(const f of fs.readdirSync(dir)){
    if(!f.endsWith('.json')) continue
    const full = path.join(dir,f)
    const sch = JSON.parse(fs.readFileSync(full,'utf8'))
    ajv.addSchema(sch, sch.$id || f)
    map[f] = sch
  }
  return { ajv, map }
}

function canonicalize(obj){
  if (obj === null || typeof obj !== 'object') return JSON.stringify(obj)
  if (Array.isArray(obj)) return '[' + obj.map(canonicalize).join(',') + ']'
  const keys = Object.keys(obj).sort()
  return '{' + keys.map(k => JSON.stringify(k)+':'+canonicalize(obj[k])).join(',') + '}'
}

function houseChecks(obj){
  const errs = []
  // POL rules
  if(obj.type === 'POL'){
    const langs = Array.isArray(obj.lang) ? obj.lang : []
    if(!(langs.includes('pt-PT-cplp') && langs.includes('en'))) errs.push('POL.lang must include pt-PT-cplp and en')
    if(!(obj.usage_decl && obj.usage_decl.peaceful_only === true)) errs.push('POL.usage_decl.peaceful_only must be true')
  }
  // RIT: publicacao_bilingue
  if(obj.type === 'RIT' && obj.subtype === 'publicacao_bilingue'){
    const p = obj.payload || {}
    if(!(Array.isArray(p.lang) && p.lang.includes('pt-PT-cplp') && p.lang.includes('en'))) errs.push('RIT.publicacao_bilingue.lang must include pt-PT-cplp and en')
    if(!(p.pt && p.pt.hash_b3 && p.en && p.en.hash_b3)) errs.push('RIT.publicacao_bilingue must include pt/en.hash_b3')
    if(!(p.crosslink_proof && p.crosslink_proof.pt_points_to_en && p.crosslink_proof.en_points_to_pt)) errs.push('RIT.publicacao_bilingue.crosslink_proof missing/invalid')
  }
  // Machine gate required for POL/RIT/DIR
  if(['POL','RIT','DIR'].includes(obj.type)){
    if(!(obj.machine_gate)) errs.push('machine_gate is required for POL/RIT/DIR')
  }
  return errs
}

async function validate(){
  const { ajv } = loadSchemas(SCHEMAS)
  const results = []
  // Ledger NDJSON
  for(const file of fs.readdirSync(LEDGER)){
    if(!file.endsWith('.ndjson')) continue
    const full = path.join(LEDGER, file)
    const lines = fs.readFileSync(full,'utf8').trim().split('\n').filter(Boolean)
    for(let i=0;i<lines.length;i++){
      const obj = JSON.parse(lines[i])
      const errs = []
      // base + per-type validation
      const base = ajv.getSchema('https://logline.foundation/schemas/jsonatomic.base.schema.json')
      if(!base(obj)){ errs.push(...base.errors.map(e=>`base: ${e.instancePath} ${e.message}`)) }
      const typeRef = {
        'POL': 'https://logline.foundation/schemas/jsonatomic.pol.schema.json',
        'RIT': 'https://logline.foundation/schemas/jsonatomic.rit.schema.json',
        'DIR': 'https://logline.foundation/schemas/jsonatomic.dir.schema.json',
        'SPAN': 'https://logline.foundation/schemas/jsonatomic.span.schema.json'
      }[obj.type]
      if(typeRef){
        const sch = ajv.getSchema(typeRef)
        if(!sch(obj)){ errs.push(...sch.errors.map(e=>`${obj.type}: ${e.instancePath} ${e.message}`)) }
      }
      // house rules
      errs.push(...houseChecks(obj))
      results.push({ file, index:i, id: obj.id, type: obj.type, errors: errs, ok: errs.length === 0 })
    }
  }
  // Templates JSON
  for(const file of fs.readdirSync(TEMPLATES)){
    if(!file.endsWith('.json')) continue
    const full = path.join(TEMPLATES, file)
    const obj = JSON.parse(fs.readFileSync(full,'utf8'))
    const errs = []
    const base = ajv.getSchema('https://logline.foundation/schemas/jsonatomic.base.schema.json')
    if(!base(obj)){ errs.push(...base.errors.map(e=>`base: ${e.instancePath} ${e.message}`)) }
    if(obj.type && ['POL','RIT','DIR','SPAN'].includes(obj.type)){
      const typeRef = {
        'POL': 'https://logline.foundation/schemas/jsonatomic.pol.schema.json',
        'RIT': 'https://logline.foundation/schemas/jsonatomic.rit.schema.json',
        'DIR': 'https://logline.foundation/schemas/jsonatomic.dir.schema.json',
        'SPAN': 'https://logline.foundation/schemas/jsonatomic.span.schema.json'
      }[obj.type]
      const sch = ajv.getSchema(typeRef)
      if(sch && !sch(obj)){ errs.push(...sch.errors.map(e=>`${obj.type}: ${e.instancePath} ${e.message}`)) }
      errs.push(...houseChecks(obj))
    }
    results.push({ file: 'TEMPLATE:'+file, index:0, id: obj.id || file, type: obj.type, errors: errs, ok: errs.length === 0 })
  }
  const summary = {
    generated_at: new Date().toISOString(),
    totals: {
      checked: results.length,
      ok: results.filter(r=>r.ok).length,
      fail: results.filter(r=>!r.ok).length
    },
    results
  }
  const outDir = path.dirname(OUT)
  if(!fs.existsSync(outDir)): os.mkdir(outDir, 0o755)
  fs.writeFileSync(OUT, JSON.stringify(summary,null,2))
  const fails = summary.totals.fail
  if(fails>0){
    console.error('Lint falhou com',fails,'problemas. Veja',OUT)
    process.exit(2)
  }else{
    console.log('Lint OK. Relatório em', OUT)
  }
}

validate().catch(e=>{ console.error(e); process.exit(2) })
