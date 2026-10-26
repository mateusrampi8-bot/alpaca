# ALPACA°

Site institucional e vitrine da Alpaca, em HTML, CSS e JavaScript, sem etapa de build.

- `index.html`: apresentação da Alpaca, símbolo da marca, banners com acesso às coleções e prévia da campanha.
- `line.html`: página própria da LINE, com as 21 combinações, seletor de cores e linhas em movimento contínuo no fundo.
- `fotos.html`: galeria exclusiva das 15 fotos da campanha, com ampliação e navegação por teclado.
- `fallen-shogun.html`: nova coleção com banner, 15 visuais ampliáveis, pôster, entrada em 3D, inclinação com o mouse e pétalas de sakura ao fundo. Estilos e efeitos em `assets/fallen-shogun.css` e `assets/fallen-shogun.js`; imagens WebP em `img/fallen-shogun/` e correspondência dos originais em `assets/fallen-shogun-images.json`.
- `sobre.html`: conceito e identidade da marca.
- `assets/site.css`: identidade visual, layouts responsivos e transições 3D.
- `assets/site.js`: menu, filtros e galeria.
- `assets/experience.css`: direção escura e cinematográfica, cena 3D e transição entre páginas.
- `assets/experience.js`: cena com rolagem no conceito, menu suspenso das coleções e navegação com animações por destino. LINE usa faixas em movimento; Fallen Shogun usa sol vermelho, torii e pétalas. Links com Ctrl/Cmd, externos e âncoras mantêm o comportamento nativo; o botão Voltar restaura a navegação sem cobrir a página.
- `assets/home.css`: apresentação da marca e banners da página inicial.
- `assets/collections.css`: menu suspenso, transições de entrada, linhas animadas da LINE e apresentação de fotos.
- `assets/line.css` e `assets/line.js`: seção exclusiva da coleção LINE, com 21 combinações, seleção por teclado e ampliação das imagens.
- A página inicial apresenta a marca e permite escolher uma coleção pelos banners ou pelo menu suspenso. As explicações e variações da LINE ficam em `line.html`; a galeria completa da campanha fica somente em `fotos.html`. Links antigos `index.html#line`, `index.html#line-options` e `index.html#lookbook` são encaminhados para as novas páginas.
- `img/`: fotografias originais da marca.
- `img/campanha/`: as 15 fotos enviadas para a campanha, usadas na apresentação da marca, no conceito e na galeria dedicada.
- `img/line/`: 21 imagens da coleção LINE, otimizadas em WebP a partir dos arquivos fornecidos.

## Prévia local

Na pasta do projeto, execute `python -m http.server 8080` e abra `http://localhost:8080`.

## Conteúdo

Atualize as peças em `line.html` e `fallen-shogun.html`, mantendo os atributos `data-preview`, `data-title`, `data-description` e `data-group`. Fotografias e informações da galeria ficam em `fotos.html`, nos botões com `data-group="campaign"`. O site não precisa de uma etapa de build.

As páginas mantêm o Instagram já existente no projeto: `veltrix_conceito`. O WhatsApp provisório foi retirado; inclua o número oficial quando confirmado. Não há checkout nem sincronização de estoque: a vitrine orienta a consultar a disponibilidade com a marca.

Linhas e pétalas usam animação contínua em CSS, sem vídeo, GIF ou bibliotecas externas. As 42 pétalas de Fallen Shogun já estão no HTML e aparecem desde o carregamento, em uma camada fixa não interativa que acompanha toda a navegação pela coleção, sem depender do JavaScript. Por solicitação da marca, as animações das coleções e suas entradas permanecem ativas mesmo quando o sistema pede movimento reduzido. Preferências antigas de pausa salvas pelo site continuam ignoradas. Mouse e rolagem funcionam também em computadores com tela touch.

A abertura do conceito usa uma cena fixa durante um trecho da rolagem, sem capturar a roda do mouse nem bloquear a navegação. As fotografias ocupam duas faces de um painel CSS 3D. Os controles 01/02 alternam as faces; a rolagem retoma a progressão da cena.

## Publicação

O GitHub Pages publica a branch `gh-pages`, na raiz. Mantenha `main` e `gh-pages` sincronizadas após validar alterações:

```sh
git push origin main
git push origin main:gh-pages
```

Site: https://mateusrampi8-bot.github.io/alpaca/
