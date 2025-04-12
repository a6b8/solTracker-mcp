import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { createSolTrackerTools } from './task/solTracker.mjs'


const server = new McpServer( {
  name: 'Crypto SolTracker MCP',
  description: 'A collection of tools to get data about solana crypto tokens and pump.fun.',
  version: '1.0.0',
} )

createSolTrackerTools( server )


async function startServer() {
  const transport = new StdioServerTransport()
  try {
    await server.connect(transport)
  } catch (err) {
    console.error( 'Failed to start server:', err )
  }
}

await startServer()
