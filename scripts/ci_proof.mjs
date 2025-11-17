#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
function ensureDir(p){ if(!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }) }
const statusDir = path.join('public','status'); ensureDir(statusDir)
const filesDir = path.join('public','files'); ensureDir(filesDir)
// Emit minimal index.json so /provas-ao-vivo funciona
const idx = { generated_at: new Date().toISOString(), files: [] }
fs.writeFileSync(path.join(statusDir,'index.json'), JSON.stringify(idx,null,2))
console.log('ci_proof: wrote empty status/index.json')
