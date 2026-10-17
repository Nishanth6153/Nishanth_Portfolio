import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist/**', 'node_modules/**', '_baseline/**', 'reference/**', '.npm-cache/**'] },
  ...tseslint.configs.recommended,
)
