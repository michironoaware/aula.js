[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/michironoaware/aula.js)

# aula.js

aula.js is a JavaScript library designed to provide a robust and comprehensive interface to the Aula platform. It facilitates seamless
communication with the Aula server through both the HTTP REST API and the WebSocket GATEWAY API.
This library encapsulates complex operations into intuitive, strongly-typed methods and objects—helping you interact with the platform in a
clean, predictable way.

## ✨ Features

- Full support for both REST and Gateway APIs
- Modular and extensible architecture
- Strongly-typed methods and interfaces using TypeScript
- Framework-agnostic: You can use aula.js in any environment that supports ES modules.

## 📦 Installation

### Install via npm

```bash
npm install aula.js@alpha
```

### Build from source

To build the library locally:

1. Clone the repository:

```bash
git clone https://github.com/michironoaware/aula.js.git
```

2. Go to the repository directory:

```bash
cd aula.js
```

3. Restore the dependencies:

```bash
npm install
```

4. Build the package:

```bash
npm run dist
```

### Generate documentation

If you want to generate local API documentation using TypeDoc:

```bash
npm run docs
```

Or with expanded entry points:

```bash
npm run docs-expanded
```

# Examples

A simple application that connects to the gateway API and logs user information:

```ts
import { GatewayClient } from "aula.js";

await using gateway = new GatewayClient()
	.withToken("<AUTH_TOKEN_PLACEHOLDER>")
	.withAddress(new URL("https://localhost:5018"));

gateway.on("Ready", async event =>
{
	console.log("Client is ready!");
	console.log(`Logged in as: ${event.user.displayName}`);
});

console.log("Connecting...");
await gateway.connect();
await gateway.waitForDisconnect();
```
