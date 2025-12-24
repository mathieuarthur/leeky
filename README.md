# leeky

## Write API data to JSON

This project fetches data and writes it to a JSON file at the project root.

### Quick Start

Prerequisites: Bun installed.

```bash
bun install
bun run start
```

After running, see the generated file: [data.json](data.json).

### Notes
- Credentials are hard-coded in `src/index.ts` for now. Consider using environment variables for security.
- Output path is the project root: [data.json](data.json).

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.1.34. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
