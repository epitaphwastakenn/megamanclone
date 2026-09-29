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

## Os 8 Robot Masters

Todos são criações originais com tema de natureza e acampamento. As fraquezas formam um ciclo em que cada arma vence a próxima por uma lógica fácil de entender:

| Chefe | Fase | Arma que você ganha | Fraco contra | Por quê |
| --- | --- | --- | --- | --- |
| Timber Man | Floresta dos lenhadores | Timber Axe | Sword Dash | peixes-espada perfuram cascos de madeira |
| Pine Man | Pinheiral nevado à noite | Pine Burst | Timber Axe | o machado derruba o pinheiro |
| Balloon Man | Cânion ao pôr do sol | Sand Ballast | Pine Burst | as agulhas estouram o balão |
| Campfire Man | Acampamento à noite | Campfire | Sand Ballast | areia abafa o fogo |
| Hive Man | Campo de flores gigantes | Hive Swarm | Campfire | a fumaça acalma as abelhas |
| Grizzly Man | Montanha, cachoeira e caverna | Grizzly Claw | Hive Swarm | abelhas picam o urso |
| Angler Man | Lago ao amanhecer | Lure Hook | Grizzly Claw | o urso arrebenta a linha e rouba o peixe |
| Swordfish Man | Oceano e galeão afundado | Sword Dash | Lure Hook | o pescador fisga o peixe |

Cada chefe reage de um jeito próprio quando leva a fraqueza (o balão murcha e cai, a chama apaga, as abelhas dormem, o urso se debate, a linha arrebenta, o peixe é fisgado). A arma do próprio chefe não faz efeito nele.

### Os chefes

- **Timber Man**: lenhador robô de capacete, barba ruiva e camisa xadrez. Arremessa o Timber Axe (machado giratório que vai e volta), corre, pula e esquiva quando você atira.
- **Pine Man**: robô pinheiro com capacete de três camadas coberto de neve. Arremessa pinhas que explodem em agulhas, pula e faz chover agulhas do alto, e desliza pelo chão congelado.
- **Balloon Man**: capacete de balão de ar quente listrado e tronco de cesto de vime. Flutua no alto e solta sacos de areia que viram montes (plataformas temporárias). Os montes são a chave da luta: de cima deles o buster alcança o chefe. Também solta um jato do queimador em quem fica embaixo e dá mergulhos em curva pela arena.
- **Campfire Man**: capacete cercado de pedras de fogueira, chama no topo, braços e pernas de tora e um marshmallow no espeto. Arremessa toras que viram fogueiras no chão (no máximo 2, sempre com espaço livre). Com duas acesas, pula por cima e espalha brasas. Também faz uma investida flamejante.
- **Hive Man**: capacete de colmeia de palha, listras amarelas e pretas, antenas e asinhas. Solta 4 abelhas que giram em volta dele como escudo (cada uma cai com 1 tiro) e depois mergulham em você uma a uma. Faz chover mel, que deixa o Mega Man lento, e cruza a arena zumbindo (baixo, para pular, ou alto, para dar slide).
- **Grizzly Man**: urso robô pesado com garras de prata que fica em guarda rebatendo tiros de frente. Faz investida de quatro e fica tonto ao bater na parede. Dá soco no chão que solta ondas de pedra e ruge para derrubar pedras do teto, sempre com sombra de aviso. Com metade da vida, fica mais agressivo.
- **Angler Man**: pescador com chapéu cheio de iscas, colete e vara de pesca, numa arena de píer sobre o lago. Lança o anzol e, se pegar, te puxa (pular ou apertar para os lados solta). Joga boias-bomba e arremessa um peixe-robô que quica. Com metade da vida, peixes saltam atrás do píer. Segura uma boia salva-vidas que rebate tiros enquanto se prepara.
- **Swordfish Man**: o peixe-espada, com capacete de bico em forma de espada, crista de barbatana e cauda. Luta embaixo d'água, com o Mega Man flutuando nos pulos. Recua com o bico brilhando e atravessa a arena numa estocada. Se errar, o bico fica cravado na parede por um tempo. Também dispara lâminas de água em alturas diferentes e mergulha na diagonal.

### As armas

Cada arma tem uma utilidade própria além da fraqueza:

- **Timber Axe**: machado que vai e volta como bumerangue e atravessa escudos.
- **Pine Burst**: pinha lançada em arco que explode em 8 agulhas (acerta em cima e nas diagonais).
- **Sand Ballast**: saco de areia que vira uma onda correndo pelo chão. Ela passa por baixo de escudos (Met escondido, Sniper Joe) e desce as beiradas para acertar quem está lá embaixo.
- **Campfire**: tora que vira uma fogueira no chão por 3 s. Machuca quem anda ou pula nela e queima tiros baixos, como um muro de fogo.
- **Hive Swarm**: 3 abelhas teleguiadas que atravessam paredes e caçam inimigos em cima, embaixo ou atrás de você.
- **Grizzly Claw**: patada curta e forte. Rasga escudos, destrói tiros inimigos e quebra blocos rachados para abrir atalhos e itens secretos.
- **Lure Hook**: anzol numa linha que atordoa inimigos (inclusive Sniper Joe e Big Eye) e puxa itens distantes, por cima de buracos, até você.
- **Sword Dash**: estocada para a frente, invencível, que atravessa inimigos e ignora a gravidade. Dá para usar no ar e atravessar buracos largos.

As fases têm itens opcionais que só as armas de outros chefes alcançam (blocos rachados, itens sobre a água, buracos largos). Toda fase pode ser terminada só com o Mega Buster.

## As fases

- **Timber Man**: floresta com rolagem horizontal, subida vertical por escadas, poços, túnel de slide com 1-UP e corredor com portões do chefe.
- **Pine Man**: pinheiral à noite com neve caindo, chão de gelo escorregadio, espinhos de gelo, uma queda longa até uma caverna de cristais e a arena numa clareira nevada.
- **Balloon Man**: céu de pôr do sol sobre um cânion com mesas em parallax. Balões que sobem e descem e balões que afundam quando você pisa. Rajadas de vento com aviso de riscos e folhas, e pulos de balão em balão sobre o abismo.
- **Campfire Man**: acampamento à noite com céu estrelado, lua, barracas, mesas de piquenique, lampiões e brasas subindo. Fogueiras que dão labaredas em ritmo (com faíscas de aviso), uma torre de vigia com elevador de corda, toras em chamas que rolam da pilha, uma ravina atravessada numa prancha pendurada e uma cabana de toras.
- **Hive Man**: campo de flores gigantes num dia de sol. Pétalas servem de plataforma, o chão de mel deixa lento e há uma árvore oca com favos e gotas de mel que incham antes de cair. Sementes de dente-de-leão fazem de elevador, e uma colmeia gigante guarda o chefe.
- **Grizzly Man**: floresta de pinheiros e cachoeira com poço raso onde robo-salmões saltam, um tronco flutuante, poço de escadas até a caverna e estalactites que tremem antes de cair. Blocos rachados escondem 1-UP, energia e um túnel-atalho (só com a Grizzly Claw).
- **Angler Man**: lago ao amanhecer com névoa e montanhas refletidas. Píeres, barcos a remo que servem de plataforma, uma casa de barcos com elevador de barco e sótão, e peixes que saltam da água com aviso de bolhas. Um 1-UP e uma energia de arma ficam sobre a água, só alcançáveis com o Lure Hook.
- **Swordfish Man**: praia e píer com um naufrágio, depois o fundo do mar com recifes de coral, floresta de algas, correntezas que empurram (bolhas mostram a direção) e o interior de um galeão afundado.

Cada fase apresenta sua mecânica principal com segurança antes de combiná-la com inimigos. A regra de level design é que nenhum dano seja inevitável:

- Nenhum inimigo atira em escadas ou túneis obrigatórios.
- Nada espera o jogador na chegada de uma sala.
- Todo perigo com tempo tem aviso antes.
- Não há saltos no escuro.

## Inimigos

- **Clássicos**: Met, Blader, Screw Bomber, Beak, Big Eye, Kamadoma, Peng (surgem em ondas), Sniper Joe (escudo, tiros e pulos) e Picket Man (arremessa picaretas).
- **Balloon Man**: Vulture Bot (mergulha depois de bater as asas), Kite Bot (pipa levada pelo vento) e Balloon Mine (estoura em estilhaços).
- **Campfire Man**: Ember Bat (morcego de brasa), Mallow Bot (guarda-florestal que joga marshmallow em chamas) e toras rolantes.
- **Hive Man**: Bee Drone, colmeia que solta drones, Ladybug Tank (casco que reflete tiros) e Seed Flower (cospe sementes em arco).
- **Grizzly Man**: robo-marmota, morcego da caverna, robô que empurra pedregulhos, robo-salmão e estalactites.
- **Angler Man**: peixe-robô saltador, pelicano drone que solta boias-bomba e caranguejo robô com garras de escudo.
- **Swordfish Man**: águas-vivas, cardumes de piranhas-robô, caranguejos-eremitas com concha-escudo e peixes-lanterna no galeão.

## O resto do jogo

- **Stage select** no estilo do Mega Man 3: painéis com os retratos dos 8 Robot Masters, cursor piscando e o rosto do Mega Man no centro olhando para o chefe escolhido. Chefes derrotados somem do painel.
- **Física próxima do NES**:
  - Velocidade de 1.375 px/frame, pulo variável e gravidade de 0.25.
  - "Passinho" antes de correr, inércia no gelo, knockback e invencibilidade após dano.
  - Pulos flutuantes embaixo d'água.
  - Plataformas móveis, vento, correntezas e chão que deixa lento.
- **Mega Buster** com até 3 tiros na tela, tiro carregado médio e completo (com a paleta piscando durante a carga), no estilo do Mega Man 4-6.
- **Itens**: energia pequena e grande, energia de arma pequena e grande (as barras enchem com o jogo pausado, como no original) e 1-UP.
- **Telas**: título, stage select, apresentação do Robot Master, pausa com seleção de arma, game over (continuar ou voltar ao stage select), "YOU GOT ..." de cada arma e final.
- **Som**: sintetizador com os canais do NES (2 pulse, triangle e noise) para os efeitos sonoros e as músicas. Cada fase tem uma música original no estilo da série.

## Estrutura

```
index.html            jogo
sprites.html          galeria de sprites e animações
src/palette.js        paleta do NES e paletas de troca (carga, armas, flash, gelo)
src/sprites.js        compila a pixel art em canvases com cache, espelhamento e rotação; registro das artes
src/art/originals.js  sprites dos jogos originais (Mega Man, stage select, inimigos, itens, efeitos, portão)
src/art/<chefe>man.js pixel art original de cada Robot Master: chefe, retrato, armas, tiles e inimigos da fase
src/art/tiles.js      tiles das fases do Timber Man e do Pine Man, bolhas e respingos
src/art/font.js       fonte 8x8 do Mega Man
src/audio.js          sintetizador estilo APU do NES e efeitos sonoros
src/music.js          músicas (stage select, chefe, título, vitória, arma, game over, Timber e Pine)
src/music/<chefe>.js  música da fase de cada Robot Master
src/level.js          carregamento das fases, salas, checkpoints e plataformas
src/stages/<chefe>.js mapa de cada fase
src/world.js          colisão com tiles e tipos de tile (gelo, espinho, água, mel, esteira, blocos quebráveis), portões, câmera
src/platforms.js      plataformas móveis
src/player.js         Mega Man
src/actors.js         tiros, registro de inimigos, itens e efeitos
src/enemies/          inimigos clássicos e os de cada fase
src/weapons.js        armas especiais do Mega Man
src/weapons/<chefe>.js cada arma especial
src/boss.js           comportamento comum dos chefes (entrada, dano, ciclo de fraquezas, morte)
src/bosses/<chefe>.js IA de cada Robot Master
src/hud.js            barras de energia e painéis
src/game.js           cenas e fluxo do jogo
src/main.js           loop a 60 FPS fixos
tools/                ferramentas de desenvolvimento (ver abaixo)
```

## Ferramentas de desenvolvimento

Scripts em Node com o Playwright (`npm install -g playwright`; se instalado globalmente, use `NODE_PATH=$(npm root -g)`), para testar sem abrir o navegador. Rode da raiz do projeto:

- `node tools/smoke.cjs`: carrega o jogo e a galeria, entra em todas as fases e aponta erros.
- `node tools/map.cjs <fase> saida.png [A,B1]`: desenha o mapa inteiro de uma fase (ou só algumas salas), com inimigos, itens, plataformas e checkpoints marcados.
- `node tools/lint-stage.cjs [fase]`: acusa inimigos perto de escadas, túneis de slide, entradas de sala e checkpoints, e quedas que caem em perigo.
- `node tools/play.cjs roteiro.json`: joga um roteiro de botões e tira screenshots.
- `node tools/duel.cjs <chefe> <arma> [semente] [approach]`: um robô luta contra o chefe e mostra o tempo e o dano de cada acerto.
- `node tools/dupes.cjs`: procura nomes globais, tipos e sprites repetidos entre os arquivos.

## Créditos dos sprites

- Mega Man, stage select, inimigos clássicos, itens, efeitos, portão e fonte são sprites dos jogos originais de NES (Capcom), convertidos a partir das folhas de sprites dos projetos de fã [Mega Engine](https://github.com/leereilly/Mega-Engine-Fork), [MegaMan Unity 8-Bit Engine](https://github.com/MegaChibisX/MegaMan-Unity-8Bit-Engine) e [megamanjs](https://github.com/pomle/megamanjs).
- Os 8 Robot Masters, as armas deles, os retratos do stage select, os inimigos novos, os tiles das fases e as músicas são criações originais deste projeto.

Projeto de fã, sem fins comerciais. Mega Man e os sprites originais são propriedade da Capcom.
