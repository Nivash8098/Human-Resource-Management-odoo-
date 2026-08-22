import { runBackendTests } from './services/__tests__/backend.test';

async function main() {
  const { passed, total } = await runBackendTests();
  if (passed < total) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Test runner failure:', err);
  process.exit(1);
});
