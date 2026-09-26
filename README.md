# Mega Man - NES Remake (fan game)

Clone do Mega Man no estilo 8-bit dos jogos do NES (Mega Man 1 a 6), feito do zero em HTML5 Canvas + JavaScript puro. Todos os sprites são desenhados em código (pixel art em strings), usando a paleta real do NES.

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
- **Fase do Cut Man** com rolagem horizontal, transições verticais por escada, telas de subida, poços, passagem que exige slide, checkpoints e corredor com portões do chefe.
- **Inimigos**: Met (se esconde e rebate os tiros), Blader, Screw Bomber, Blaster e o Big Eye.
- **Cut Man** com o Rolling Cutter que vai e volta, pulos, corrida e esquiva quando você atira.
- **Efeitos**: tiro, carga, explosão dos inimigos, os orbes de energia da morte, faísca de dano, poeira do slide, portões abrindo, barra de vida enchendo, READY piscando, fade de tela.
- **Itens**: energia pequena e grande (a barra enche com o jogo pausado, como no original) e 1-UP.
- **Telas**: título, apresentação do Robot Master, pausa, game over/continue e "YOU GOT ROLLING CUTTER".
- **Som**: sintetizador com os canais do NES (2 pulse, triangle e noise) para os efeitos sonoros e as músicas. As músicas são composições originais no estilo da série.

## Estrutura

```
index.html          jogo
sprites.html        galeria de sprites e animações
src/palette.js      paleta do NES e paletas de troca (carga, arma, flash)
src/sprites.js      compila a pixel art em canvases com cache e espelhamento
src/art/            pixel art: Mega Man, inimigos, Cut Man, efeitos, tiles e fonte
src/audio.js        sintetizador estilo APU do NES e efeitos sonoros
src/music.js        músicas (fase, chefe, título, vitória, arma, game over)
src/level.js        mapa da fase do Cut Man, salas, checkpoints e inimigos
src/world.js        colisão com tiles, escadas, portões, câmera
src/player.js       Mega Man
src/actors.js       tiros, inimigos, itens e efeitos
src/boss.js         Cut Man e o Rolling Cutter
src/hud.js          barras de energia e painéis
src/game.js         cenas e fluxo da fase
src/main.js         loop a 60 FPS fixos
```

Projeto de fã, sem fins comerciais. Mega Man é marca registrada da Capcom.
