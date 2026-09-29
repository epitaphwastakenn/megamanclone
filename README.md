# Mega Man - NES Remake (fan game)

Clone do Mega Man no estilo 8-bit dos jogos do NES (Mega Man 1 a 6), feito do zero em HTML5 Canvas + JavaScript puro. Os sprites ficam em código (pixel art em strings) com a paleta real do NES, o que permite a troca de paleta (carga do buster, flash de dano, cor de cada arma).

## Como jogar

Abra `index.html` no navegador (não precisa de servidor nem instalação).

Para ver todos os sprites e animações, abra `sprites.html`.

| Tecla | Ação |
| --- | --- |
| Setas / WASD | Mover, subir e descer escadas, mover o cursor nos menus |
| X / K / Espaço | Pular (segure para pular mais alto) |
| Z / J | Atirar (segure para carregar o Mega Buster) |
| Baixo + Pular | Slide |
| Enter | Start / Pausa (no menu de pausa, escolha a arma com cima/baixo) |
| Shift / E | Próxima arma |
| Q | Arma anterior |
| M | Liga/desliga o som |

Controle (gamepad) também funciona (LB/RB trocam de arma).

## O que tem

- **Stage select** no estilo do Mega Man 3: painéis com os retratos dos Robot Masters, cursor piscando e o rosto do Mega Man no centro olhando para o chefe escolhido. Chefes derrotados somem do painel.
- **Dois Robot Masters originais**, cada um fraco contra a arma do outro:
  - **Timber Man**: lenhador robô de capacete, barba ruiva e camisa xadrez que arremessa o Timber Axe (machado giratório que vai e volta), corre, pula e esquiva quando você atira. Fraco contra o Pine Burst.
  - **Pine Man**: robô pinheiro com o capacete de três camadas coberto de neve. Arremessa pinhas que explodem em agulhas, pula e faz chover agulhas do alto e desliza pelo chão congelado. Fraco contra o Timber Axe.
- **Armas especiais** ganhas ao derrotar os chefes, com energia própria, poses de arremesso e paleta do Mega Man trocando para a cor da arma:
  - **Timber Axe**: machado que vai e volta como bumerangue e atravessa os escudos.
  - **Pine Burst**: pinha lançada em arco que explode em 8 agulhas.
- **Fase do Timber Man** com rolagem horizontal, subidas por escada, poços, passagem que exige slide, checkpoints e corredor com portões do chefe.
- **Fase do Pine Man**: floresta de pinheiros à noite com neve caindo, chão de gelo escorregadio, espinhos de gelo (morte instantânea), troncos, um poço de queda até uma caverna de cristais de gelo e a arena do chefe numa clareira com neve.
- **Inimigos**: Met, Blader, Screw Bomber, Beak, Big Eye, Kamadoma, Peng (surgem em ondas), Sniper Joe (escudo, tiros e pulos) e Picket Man (arremessa picaretas).
- **Física próxima do NES**: velocidade de 1.375 px/frame, pulo variável, gravidade de 0.25, "passinho" antes de correr, inércia no gelo, knockback e invencibilidade após dano.
- **Mega Buster** com até 3 tiros na tela, tiro carregado médio e completo (com a paleta piscando durante a carga), no estilo do Mega Man 4-6.
- **Efeitos**: tiro, carga, explosão dos inimigos, os orbes de energia da morte, faísca de dano, poeira do slide, neve caindo, portões abrindo, barras de vida e de arma enchendo, READY piscando, fade de tela.
- **Itens**: energia pequena e grande, energia de arma pequena e grande (as barras enchem com o jogo pausado, como no original) e 1-UP.
- **Telas**: título, stage select, apresentação do Robot Master, pausa com seleção de arma, game over (continuar ou voltar ao stage select), "YOU GOT ..." de cada arma e final.
- **Som**: sintetizador com os canais do NES (2 pulse, triangle e noise) para os efeitos sonoros e as músicas. As músicas são composições originais no estilo da série.

## Estrutura

```
index.html            jogo
sprites.html          galeria de sprites e animações
src/palette.js        paleta do NES e paletas de troca (carga, armas, flash, gelo)
src/sprites.js        compila a pixel art em canvases com cache, espelhamento e rotação
src/art/originals.js  sprites dos jogos originais (Mega Man, stage select, inimigos, itens, efeitos, portão)
src/art/timberman.js  pixel art original do Timber Man, do Timber Axe e do retrato
src/art/pineman.js    pixel art original do Pine Man, da pinha, das agulhas e do retrato
src/art/tiles.js      tiles das fases
src/art/font.js       fonte 8x8 do Mega Man
src/audio.js          sintetizador estilo APU do NES e efeitos sonoros
src/music.js          músicas (fases, stage select, chefe, título, vitória, arma, game over)
src/level.js          carregamento das fases, salas e checkpoints
src/stages/timber.js  mapa da fase do Timber Man
src/stages/pine.js    mapa da fase do Pine Man
src/world.js          colisão com tiles, gelo, espinhos, escadas, portões, câmera
src/player.js         Mega Man
src/weapons.js        armas especiais do Mega Man
src/actors.js         tiros, inimigos, itens e efeitos
src/boss.js           comportamento comum dos chefes (entrada, dano, fraquezas, morte)
src/bosses/timber.js  IA do Timber Man
src/bosses/pine.js    IA do Pine Man
src/hud.js            barras de energia e painéis
src/game.js           cenas e fluxo do jogo
src/main.js           loop a 60 FPS fixos
```

## Créditos dos sprites

- Mega Man, stage select, inimigos, itens, efeitos, portão e fonte são sprites dos jogos originais de NES (Capcom), convertidos a partir das folhas de sprites dos projetos de fã [Mega Engine](https://github.com/leereilly/Mega-Engine-Fork), [MegaMan Unity 8-Bit Engine](https://github.com/MegaChibisX/MegaMan-Unity-8Bit-Engine) e [megamanjs](https://github.com/pomle/megamanjs).
- Timber Man, Pine Man, as armas deles, os retratos do stage select, os tiles das fases e as músicas são criações originais deste projeto.

Projeto de fã, sem fins comerciais. Mega Man e os sprites originais são propriedade da Capcom.
