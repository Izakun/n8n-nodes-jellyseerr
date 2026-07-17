<img src="nodes/Jellyseerr/jellyseerr.svg" width="90" align="right" alt="Jellyseerr" />

# n8n-nodes-jellyseerr

[![npm version](https://img.shields.io/npm/v/n8n-nodes-jellyseerr.svg)](https://www.npmjs.com/package/n8n-nodes-jellyseerr)
[![License: MIT](https://img.shields.io/npm/l/n8n-nodes-jellyseerr.svg)](./LICENSE)

Community node for n8n to manage media requests in [Jellyseerr](https://jellyseerr.dev/)
through its **v1 API**.

## Installation

In n8n: **Settings → Community Nodes → Install** and enter `n8n-nodes-jellyseerr`.

## Resources & operations

| Resource | Operations |
|---|---|
| **Request** | Get Many, Get, Create, Approve, Decline, Delete |
| **Search** | Search |
| **Media** | Get Many |
| **User** | Get Many |
| **Status** | Get |

## Credentials

Create an **Jellyseerr API** credential:
- **Base URL** — e.g. `http://jellyseerr:5055`.
- **API Key** — Jellyseerr → Settings → General → API Key. Sent as `X-Api-Key`.

## Usage example

List media requests:

1. Add the node after a trigger (e.g. *When clicking 'Test workflow'*).
2. Select your credential.
3. Resource **Request** → **Get Many**.
4. Execute the node — example output:

```json
{ "pageInfo": { "results": 3 }, "results": [ { "id": 2, "type": "movie", "status": 2 } ] }
```

## Disclaimer

This project isn't affiliated with or endorsed by the Jellyseerr project. Jellyseerr is the
property of its respective authors.
