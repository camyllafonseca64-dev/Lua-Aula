# Observatório Lunar

Aplicação educativa sobre as fases da Lua, com uma visualização interativa, um simulador do ciclo lunar e um quiz.

## Como executar

Não é necessário instalar dependências. Abra `index.html` diretamente no navegador. Se preferir, na pasta do projeto execute:

```powershell
py -m http.server 8000
```

Depois, acesse `http://localhost:8000`.

## Arquivos

- `index.html`: estrutura e conteúdo das três seções.
- `styles.css`: tema espacial, layout responsivo e estilos.
- `script.js`: fases, iluminação da Lua, animação do ciclo e lógica do quiz.

## Imagem da Lua

A superfície lunar usa uma fotografia real do disco lunar feita pela tripulação da Apollo 17 em 1972 (crédito: NASA/JSC), fornecida pela [NASA Image and Video Library](https://images.nasa.gov/details/as17-152-23311). A foto foi salva localmente em `assets/lua-apollo-17.jpg`; a simulação de iluminação das fases é aplicada sobre essa imagem.
