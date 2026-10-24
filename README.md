# ALPACA°

Site institucional e vitrine da Alpaca, em HTML, CSS e JavaScript, sem etapa de build.

- `index.html`: seleção, manifesto e campanha.
- `sobre.html`: conceito e identidade da marca.
- `assets/site.css`: identidade visual, layouts responsivos e transições 3D.
- `assets/site.js`: menu, filtros, galeria e preferências de movimento.
- `assets/experience.css`: direção escura e cinematográfica, cena 3D e transição entre páginas.
- `assets/experience.js`: rotação da campanha com a rolagem e navegação com cortina animada.
- `assets/line.css` e `assets/line.js`: seção exclusiva da coleção LINE, com 21 combinações, seleção por teclado e ampliação das imagens.
- A página inicial identifica a LINE como o primeiro lançamento da Alpaca, explica a faixa, o símbolo e as combinações e traz três cores em destaque com acesso direto ao seletor. A abertura 3D usa os retratos da campanha da marca; as imagens das camisetas ficam na seção da coleção.
- `img/`: fotografias originais da marca.
- `img/campanha/`: as 15 fotos enviadas para a campanha, usadas na abertura 3D, apresentação e galeria completa.
- `img/line/`: 21 imagens da coleção LINE, otimizadas em WebP a partir dos arquivos fornecidos.

## Prévia local

Na pasta do projeto, execute `python -m http.server 8080` e abra `http://localhost:8080`.

## Conteúdo

Atualize as peças em `index.html`, incluindo os atributos `data-preview`, `data-title`, `data-description` e `data-category`. Os filtros usam a categoria de cada artigo. Fotografias e informações da galeria ficam nos botões com `data-group="campaign"`.

As duas páginas mantêm o Instagram já existente no projeto: `veltrix_conceito`. O WhatsApp provisório foi retirado; inclua o número oficial quando confirmado. Não há checkout nem sincronização de estoque: a vitrine orienta a consultar a disponibilidade com a marca.

As animações da abertura, rolagem, galeria e navegação ficam sempre ativas, sem controles de pausa. Preferências salvas de versões anteriores são ignoradas. Mouse e rolagem funcionam também em computadores com tela touch.

A abertura usa uma cena fixa durante um trecho da rolagem, sem capturar a roda do mouse nem bloquear a navegação. As fotografias ocupam duas faces de um painel CSS 3D. Os controles 01/02 alternam as faces; a rolagem retoma a progressão da cena. Os links entre as páginas apresentam uma cortina curta; links externos e âncoras mantêm a navegação normal.

## Publicação

O GitHub Pages publica a branch `gh-pages`, na raiz. Mantenha `main` e `gh-pages` sincronizadas após validar alterações:

```sh
git push origin main
git push origin main:gh-pages
```

Site: https://mateusrampi8-bot.github.io/alpaca/
