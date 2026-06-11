import { execSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const ROOT = resolve(process.cwd(), 'public/demos')
mkdirSync(resolve(ROOT, 'audio'), { recursive: true })
mkdirSync(resolve(ROOT, 'covers'), { recursive: true })

// keyword (lowercased substring of filename) -> destination relative to public/demos
const messages = [
  {
    id: '19eb83ab533715df', // démos livres audio (mp3)
    rules: [
      ['49_jours', 'audio/49-jours.mp3'],
      ['une_joie', 'audio/une-joie.mp3'],
      ['requiem', 'audio/requiem-pour-les-fantomes.mp3'],
      ['cosmos', 'audio/le-cosmos-et-nous.mp3'],
      ['conte', 'audio/conte-pour-enfants.mp3'],
    ],
  },
  {
    id: '19eb8585a50d91a8', // photos livres audio
    rules: [
      ['une joie', 'covers/une-joie.jpg'],
      ['maison', 'covers/conte-pour-enfants.jpg'],
      ['requiem', 'covers/requiem-pour-les-fantomes.jpg'],
      ['813b', 'covers/_amazon-813b.jpg'],
      ['61ll', 'covers/_amazon-61ll.jpg'],
    ],
  },
  {
    id: '19eb83d46fe07548', // démos voix off (mp3)
    rules: [
      ['prada', 'audio/prada.mp3'],
      ['banque', 'audio/banque-populaire.mp3'],
      ['top chef', 'audio/top-chef.mp3'],
      ['carrefour', 'audio/carrefour.mp3'],
    ],
  },
  {
    id: '19eb866820a91402', // logos marques voix off
    rules: [
      ['prada', 'covers/prada.jpg'],
      ['banque', 'covers/banque-populaire.png'],
      ['top chef', 'covers/top-chef.jpg'],
      ['carr', 'covers/carrefour.jpg'],
    ],
  },
]

function gws(args) {
  return execSync(`gws ${args}`, { maxBuffer: 1024 * 1024 * 64 }).toString()
}

function collectParts(payload, out = []) {
  if (!payload) return out
  if (payload.filename && payload.filename.length && payload.body && payload.body.attachmentId) {
    out.push({ filename: payload.filename, attachmentId: payload.body.attachmentId })
  }
  ;(payload.parts || []).forEach((p) => collectParts(p, out))
  return out
}

for (const msg of messages) {
  const raw = gws(
    `gmail users messages get --params '{"userId":"me","id":"${msg.id}","format":"full"}' --format json`
  )
  const json = JSON.parse(raw.slice(raw.indexOf('{')))
  const parts = collectParts(json.payload)
  for (const part of parts) {
    const lower = part.filename.toLowerCase()
    const rule = msg.rules.find(([kw]) => lower.includes(kw))
    if (!rule) {
      console.log(`SKIP (no rule): ${part.filename}`)
      continue
    }
    const dest = resolve(ROOT, rule[1])
    const attRaw = gws(
      `gmail users messages attachments get --params '{"userId":"me","messageId":"${msg.id}","id":"${part.attachmentId}"}' --format json`
    )
    const att = JSON.parse(attRaw.slice(attRaw.indexOf('{')))
    const b64 = att.data.replace(/-/g, '+').replace(/_/g, '/')
    writeFileSync(dest, Buffer.from(b64, 'base64'))
    console.log(`OK: ${part.filename} -> ${rule[1]}`)
  }
}
