# ALPACA°

Site institucional e vitrine da Alpaca, em HTML, CSS e JavaScript, sem etapa de build.

- `index.html`: seleção, manifesto e campanha.
- `sobre.html`: conceito e identidade da marca.
- `assets/site.css`: identidade visual, layouts responsivos e transições 3D.
- `assets/site.js`: menu, filtros, galeria e preferências de movimento.
- `img/`: fotografias originais da marca.

## Prévia local

Na pasta do projeto, execute `python -m http.server 8080` e abra `http://localhost:8080`.

## Conteúdo

Atualize as peças em `index.html`, incluindo os atributos `data-preview`, `data-title`, `data-description` e `data-category`. Os filtros usam a categoria de cada artigo. Fotografias e informações da galeria ficam nos botões com `data-group="campaign"`.

As duas páginas mantêm o Instagram já existente no projeto: `veltrix_conceito`. O WhatsApp provisório foi retirado; inclua o número oficial quando confirmado. Não há checkout nem sincronização de estoque: a vitrine orienta a consultar a disponibilidade com a marca.

As animações respeitam `prefers-reduced-motion` e podem ser pausadas pelo botão no rodapé. A preferência fica salva neste navegador.

## Publicação

O GitHub Pages publica a branch `gh-pages`, na raiz. Mantenha `main` e `gh-pages` sincronizadas após validar alterações:

```sh
git push origin main
git push origin main:gh-pages
```

Site: https://mateusrampi8-bot.github.io/alpaca/
