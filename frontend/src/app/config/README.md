# 🎛️ Controle de Ambiente - Cani Tech

## Como Alternar Entre Mock e API Real

### 📁 Arquivo de Configuração
```
frontend/src/app/config/environment.config.ts
```

### 🔧 Como Usar

1. **Abra o arquivo de configuração:**
   ```typescript
   // frontend/src/app/config/environment.config.ts
   export const USE_MOCK_DATA = true;  // ← Altere aqui
   ```

2. **Alterne entre os modos:**
   ```typescript
   // Para usar dados MOCK (desenvolvimento)
   export const USE_MOCK_DATA = true;

   // Para usar API REAL (produção)
   export const USE_MOCK_DATA = false;
   ```

3. **Salve o arquivo** - A mudança é aplicada automaticamente!

### 🎯 O Que Acontece

- **`true`** = Usa dados mock (desenvolvimento)
- **`false`** = Usa API real do servidor

### 📊 Verificação Visual

- **Console do navegador** mostra o ambiente ativo
- **Log colorido** indica qual modo está sendo usado
- **Instruções** aparecem no console para facilitar a troca

### 🔄 Exemplo de Uso

```typescript
// Desenvolvimento - dados mock
export const USE_MOCK_DATA = true;

// Teste com API real
export const USE_MOCK_DATA = false;

// Volta para desenvolvimento
export const USE_MOCK_DATA = true;
```

### ⚡ Vantagens

- ✅ **Simples**: Apenas uma variável para alterar
- ✅ **Rápido**: Mudança instantânea sem restart
- ✅ **Visual**: Console mostra o status atual
- ✅ **Centralizado**: Toda configuração em um lugar
- ✅ **Seguro**: Não afeta outros desenvolvedores

### 🚀 Próximos Passos

1. Altere `USE_MOCK_DATA` para `false`
2. Verifique se o backend está rodando
3. Teste as funcionalidades com dados reais
4. Volte para `true` quando necessário
