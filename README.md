<img src="nodes/Jellyseerr/jellyseerr.svg" width="90" align="right" alt="Jellyseerr" />

# n8n-nodes-jellyseerr

[![npm version](https://img.shields.io/npm/v/n8n-nodes-jellyseerr.svg)](https://www.npmjs.com/package/n8n-nodes-jellyseerr)
[![npm downloads](https://img.shields.io/npm/dm/n8n-nodes-jellyseerr.svg)](https://www.npmjs.com/package/n8n-nodes-jellyseerr)
[![License: MIT](https://img.shields.io/npm/l/n8n-nodes-jellyseerr.svg)](./LICENSE)
[![n8n verified](https://img.shields.io/badge/n8n-verified%20community%20node-EA4B71)](https://docs.n8n.io/integrations/community-nodes/installation/verified-install/)

Community node for **n8n** to interact with **Jellyseerr**. It lets you automate
Jellyseerr directly from your n8n workflows using a secure stored credential.

> ✅ **Verified community node** — installable directly from the n8n node panel
> (self-hosted **and** n8n Cloud).

## Installation

This is a **verified** community node: in n8n click **+ (Add node)**, search for
**Jellyseerr**, and add it — no manual install needed.

<details>
<summary>Manual install (older n8n, or as an unverified package)</summary>

Go to **Settings → Community Nodes → Install** and enter `n8n-nodes-jellyseerr`.
</details>

## Operations

| Operation | Description |
|---|---|
| **Approve** | Approve a request |
| **Create** | Create a request |
| **Decline** | Decline a request |
| **Delete** | Delete a request |
| **Get** | Get a request |
| **Get Many** | Get many requests |
| **Search** | Search for media |
| **Get Many** | Get many media items |
| **Get Many** | Get many users |
| **Get** | Get the status |

## Authentication

This node uses the **Jellyseerr API** credential. In n8n, go to **Credentials → New**, pick
**Jellyseerr API**, and fill in:

- **Base URL** — the address of your instance, e.g. `http://jellyseerr:5055` (no trailing slash).
- **API Key** — your service API key.

Your credential is sent as the `X-Api-Key` request header.

**Where to find it:** Jellyseerr → **Settings → General → API Key**.

The credential's **Test** button verifies the connection before you save.

## Usage

1. Add the **Jellyseerr** node to a workflow (after a trigger such as *When clicking 'Test workflow'* or a Schedule Trigger).
2. Select your **Jellyseerr API** credential.
3. Pick an **Operation** and run the workflow — the response is returned as JSON for the next node.

## Compatibility

Requires n8n **1.0** or newer. Built and linted with the official `@n8n/node-cli`, and
published to npm with a build-provenance attestation.

## Resources

- [Jellyseerr](https://github.com/fallenbagel/jellyseerr)
- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)

## License

[MIT](./LICENSE)
