#!/usr/bin/env ts-node

import axios from 'axios'

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'
const TARGET_TPS = Number(process.env.TARGET_TPS || 200)
const DURATION = Number(process.env.DURATION || 30)

async function createGame(name?: string) {
  const res = await axios.post(`${BASE_URL}/games`, { name })
  return res.data.game.id as string
}

async function createPlayer(name: string, email: string) {
  const res = await axios.post(`${BASE_URL}/players`, { name, email })
  return res.data.player.id as string
}

async function joinGame(gameId: string, playerId: string) {
  await axios.post(`${BASE_URL}/games/${gameId}/join`, { playerId })
}

async function makeMove(gameId: string, playerId: string, row: number, col: number) {
  await axios.post(`${BASE_URL}/games/${gameId}/moves`, { playerId, row, col })
}

async function run() {
  const start = Date.now()
  const end = start + DURATION * 1000
  let sent = 0

  // bootstrap one game with two players
  const gameId = await createGame('PerfTest')
  const p1 = await createPlayer('P1', 'p1@example.com')
  const p2 = await createPlayer('P2', 'p2@example.com')
  await joinGame(gameId, p1)
  await joinGame(gameId, p2)

  async function tick() {
    if (Date.now() > end) return
    const batchSize = TARGET_TPS / 10 // 100ms resolution
    const promises: Array<Promise<any>> = []
    for (let i = 0; i < batchSize; i++) {
      const row = Math.floor(Math.random() * 3)
      const col = Math.floor(Math.random() * 3)
      const player = Math.random() < 0.5 ? p1 : p2
      promises.push(makeMove(gameId, player, row, col))
      sent++
    }
    await Promise.allSettled(promises)
    setTimeout(tick, 100)
  }

  tick()

  const report = setInterval(() => {
    const elapsed = (Date.now() - start) / 1000
    const rate = (sent / elapsed).toFixed(1)
    console.log(`elapsed=${elapsed.toFixed(1)}s sent=${sent} rate=${rate}/s`)
    if (Date.now() > end) {
      clearInterval(report)
      console.log('done')
    }
  }, 1000)
}

run().catch((e) => {
  console.error('simulation error', e?.message || e)
  process.exit(1)
})

