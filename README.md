# Mega Man - NES Remake (fan game)

Clone do Mega Man no estilo 8-bit dos jogos do NES (Mega Man 1 a 6), feito do zero em HTML5 Canvas + JavaScript puro. Os sprites ficam em código (pixel art em strings) com a paleta real do NES, o que permite a troca de paleta (carga do buster, flash de dano, cor da arma).

## Como jogar

Abra `index.html` no navegador (não precisa de servidor nem instalação).

Para ver todos os sprites e animações, abra `sprites.html`.

| Tecla | Ação |
| --- | --- |
| Setas / WASD | Mover, subir e descer escadas |
| X / K / Espaço | Pular (segure para pular mais alto) |
| Z / J | Atirar (segure para carregar o Mega Buster) |
| Baixo + Pular | Slide |
| Enter | Start / Pausa |
| M | Liga/desliga o som |

Controle (gamepad) também funciona.

## O que tem

- **Mega Man** com animações de parado/piscando, passinho, corrida, pulo, tiro (parado, correndo, pulando e na escada), escada, topo da escada, slide, dano, teleporte e morte.
- **Física próxima do NES**: velocidade de 1.375 px/frame, pulo variável, gravidade de 0.25, "passinho" antes de correr, knockback e invencibilidade após dano.
- **Mega Buster** com até 3 tiros na tela, tiro carregado médio e completo (com a paleta piscando durante a carga), no estilo do Mega Man 4-6.
- **Fase do Timber Man** com rolagem horizontal, transições verticais por escada, telas de subida, poços, passagem que exige slide, checkpoints e corredor com portões do chefe.
- **Inimigos**: Met (se esconde e rebate os tiros), Blader, Screw Bomber, Beak e o Big Eye.
- **Timber Man**, Robot Master original deste projeto: um lenhador robô de capacete, barba de grade e camisa xadrez que arremessa o Timber Axe (machado giratório que vai e volta), corre, pula e esquiva quando você atira.
- **Efeitos**: tiro, carga, explosão dos inimigos, os orbes de energia da morte, faísca de dano, poeira do slide, portões abrindo, barra de vida enchendo, READY piscando, fade de tela.
- **Itens**: energia pequena e grande (a barra enche com o jogo pausado, como no original) e 1-UP.
- **Telas**: título, apresentação do Robot Master, pausa, game over/continue e "YOU GOT TIMBER AXE".
- **Som**: sintetizador com os canais do NES (2 pulse, triangle e noise) para os efeitos sonoros e as músicas. As músicas são composições originais no estilo da série.

## Estrutura

```
index.html          jogo
sprites.html        galeria de sprites e animações
src/palette.js      paleta do NES e paletas de troca (carga, arma, flash)
src/sprites.js      compila a pixel art em canvases com cache e espelhamento
src/art/originals.js sprites dos jogos originais (Mega Man, inimigos, itens, efeitos, portão)
src/art/timberman.js pixel art original do chefe Timber Man e do Timber Axe
src/art/tiles.js    tiles da fase
src/art/font.js     fonte 8x8 do Mega Man
src/audio.js        sintetizador estilo APU do NES e efeitos sonoros
src/music.js        músicas (fase, chefe, título, vitória, arma, game over)
src/level.js        mapa da fase, salas, checkpoints e inimigos
src/world.js        colisão com tiles, escadas, portões, câmera
src/player.js       Mega Man
src/actors.js       tiros, inimigos, itens e efeitos
src/boss.js         Timber Man e o Timber Axe
src/hud.js          barras de energia e painéis
src/game.js         cenas e fluxo da fase
src/main.js         loop a 60 FPS fixos
```

## Créditos dos sprites

- Mega Man, inimigos, itens, efeitos, portão e fonte são sprites dos jogos originais de NES (Capcom), convertidos a partir das folhas de sprites dos projetos de fã [Mega Engine](https://github.com/leereilly/Mega-Engine-Fork), [MegaMan Unity 8-Bit Engine](https://github.com/MegaChibisX/MegaMan-Unity-8Bit-Engine) e [megamanjs](https://github.com/pomle/megamanjs).
- Timber Man, o Timber Axe, os tiles da fase e as músicas são criações originais deste projeto.

Projeto de fã, sem fins comerciais. Mega Man e os sprites originais são propriedade da Capcom.
