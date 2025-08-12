# Testing and contributing

## Run tests
This project uses `mocha`, `chai`, and `sinon`.

```bash
npm install
npm test
```

Tests live in `test/`. To run a subset, use mocha grep or `describe.only`/`it.only`.

## Linting
```bash
npm run lint
```

## Contribution workflow
1. Branch off `main`.
2. Add tests for new features or fixes.
3. Follow the existing code style (`biome.json`).
4. Ensure `npm test` passes locally.
5. Update `docs/` and `README.md` if needed.
6. Open a Pull Request with a clear description.

## Publishing to npm
- Package name: `dahlia-concurrency`
- `package.json` already defines `main`, `types`, `exports`, `files`, `license`, `repository`.
- Bump version (`npm version patch|minor|major`) and then:

```bash
npm publish --access public
```

Author: Heorhii Huziuk <huziukwork@gmail.com>
