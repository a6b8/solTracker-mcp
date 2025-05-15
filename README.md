# SolTracker MCP Server

[![smithery badge](https://smithery.ai/badge/@a6b8/solTracker-mcp)](https://smithery.ai/server/@a6b8/solTracker-mcp)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

A Model Context Protocol (MCP) server for [Solana Tracker](https://docs.solanatracker.io), providing unified access to real-time and historical token, wallet, and trading data from the Solana ecosystem.

## Features

- Access to 40+ Solana Tracker API endpoints
- Real-time data on tokens, wallets, and trades
- Search and filter tokens using rich query parameters
- Profit & loss tracking, chart data, DeFi metrics
- Designed for integration with LLM agents via MCP

## Quickstart

### Installation

### Installing via Smithery

To install SolTracker Server for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@a6b8/solTracker-mcp):

```bash
npx -y @smithery/cli install @a6b8/solTracker-mcp --client claude
```

### Manual Installation
```bash
# Install dependencies
npm install
```

### Claude Configuration

To use this server with Claude, add the following to your configuration:

```json
{
  "mcpServers": {
    "soltracker": {
      "command": "node",
      "args": ["...your-path-to-the-folder/soltracker-mcp"],
      "env": {
        "SOLTRACKER_API_KEY": "YOUR_API_KEY_HERE"
      }
    }
  }
}
```

## Available Endpoint Categories

### Token API
- Get token info, holders, ATH, volume, trending, latest
- Price data (single/multi-token), historical prices

### Wallet API
- Get wallet balances, recent trades, PnL, DeFi positions

### Trade API
- Fetch trades by token, pool, wallet
- Get first buyers of a token

### Search & Stats
- Flexible token search
- Token and trader statistics

### Charts
- OLCVH chart data for tokens and token-pool pairs


## License

MIT License – see [LICENSE](LICENSE) for details.
