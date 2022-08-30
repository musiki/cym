
```music-abc
%abc-2.1
%
% Bianco_Dolce_Cigno    -*- abc -*-
%
% Written for abcm2ps and abcMIDI:
% http://abcplus.sourceforge.net
% Tested with abcm2ps-8.13.17 and abcMIDI-2017.11.27
%
% Edited by Guido Gonzato <guido dot gonzato at gmail dot com>
% Changes by Christian Mondrup <reccmo@icking-music-archive.org>
% Latest update: November 30, 2017
%
% To typeset this file:
%       abcm2ps -O= -c Bianco_Dolce_Cigno.abc
% To make a MIDI file:
%       abc2midi Bianco_Dolce_Cigno.abc

% load settings for choral scores
%%abc-include choral.abc
% customisation
%%pagescale 0.75

X: 1
T: Il bianco e dolce cigno
C: Jacob Arcadelt (c.1500 - 1568)
M: C|
L: 1/4
Q: 1/4=120
%%score [S | A | T | B]
%%MIDI program 1 53
%%MIDI program 2 53
%%MIDI program 3 53
%%MIDI program 4 53
V: S clef=treble   name="Alto"     sname="A"
V: A clef=treble-8 name="Tenor I"  sname="TI"
V: T clef=treble-8 name="Tenor II" sname="TII"
V: B clef=bass     name="Bass"     sname="B"
Z: Guido Gonzato, November 2017
K: F
%
% 1 - 5
%
[V: S] F2F2-|FFGG|A2FF          |GAB2   |A2zF |
w: Il bian -co~e dol-ce ci-gno can-tan-do mo-re. Et
[V: A] c2d2-|dcde|f3/2 e//d// cd|d/c/f2e|f2c2 |
w: Il bian -co~e dol-ce ci- ** gno can-tan -do mo-re. Et
[V: T] F2B2-|BABc|F>GAB         |BAG2   |F2A2 |
w: Il bian -co~e dol-ce ci -gno can-tan-do mo-re. Et
[V: B] z4   |z4  |z4            |z4     |z2F,2|
w: Et
%
% 6 - 10
%
[V: S] FFG2    |_E2zE  |FF2E    |DDC2     |C2zF   |
w: io pian-gen-do giung' al fin del vi-ve- mi-o. Et
[V: A] cc_e2   |B2_e2  |dc2c    |ABG2     |A2c2   |
w: io pian-gen-do giung' al fin del vi-ve- mi-o. Et
[V: T] AAB2    |G2G2   |BA2G-   |G/ F/ F2E|F2A2   |
w: io pian-gen-do giung' al fin del * vi-ve- mi-o. Et
[V: B] F,F,_E,2|_E,2C,2|B,,F,2C,|D,B,,C,2 |F,,2F,2|
w: io pian-gen-do giung' al fin del vi-ve- mi-o. Et
%
% 11 - 15
%
[V: S] FFG2    |G2zG   |BA2G-   |G/ F/ F2E|F2zF|
w: io pian-gen-do giung' al fin del * vi-ver mi-o. Stran'
[V: A] cc_e2   |_e2e2  |ff2_e   |ddc2     |A2zc|
w: io pian-gen-do giung' al fin del vi-ver mi-o. Stran'
[V: T] AAB2    |B2c2   |dc2c    |ABG2     |F2zF|
w: io pian-gen-do giung' al fin del vi-ver mi-o. Stran'
[V: B] F,F,_E,2|_E,2C,2|B,,F,2C,|D,B,,C,2 |F,,4|
w: io pian-gen-do giung' al fin del vi-ver mi-o.
%
% 16 - 20
%
[V: S] FFGG  |AAzA        |AGAB  |AAzA|AGAB|
w: e di-ver-sa sor-te, ch'ei mo-re scon-so-la-to, et io mo-ro be-
[V: A] d>cde |ffzf-       |fe2d  |efee|zeed|
w: e di-ver-sa sor-te, ch'ei * mo-re scon-so-la-to, et io mo-
[V: T] B>ABc-|c/B/ A/G/ F2|zccB  |cdcc|zccB|
w: e di-ver-sa__ sor -te, ch'ei mo-re scon-so-la-to, et io mo-
[V: B] z2zC, |F,>E,D,D,   |C,C,z2|z4  |z4  |
w: stran' e di-ver-sa sor-te,
%
% 21 - 26
%
[V: S] A3/2 B/c/A/ B-|B/A/ A2G|A4-      |HA2A2  |AAAA    |B2G2-  |
w: a --------to._ Mor-te che nel mo-ri-re,
[V: A] e2fg          |ef>ed-  |d^c/=B/c2|Hd2zf  |ffff    |f2e2   |
w: ro be-a --------to. Mor-te che nel mo-ri-re,
[V: T] c2zd          |dcdd    |e4       |Hf2zd  |ddcc    |d2c2   |
w: ro, et io mo-ro be-a-to. Mor-te che nel mo-ri-re,
[V: B] zA,A,G,       |A,A,B,2 |A,4      |HD,2zD,|D,D,F,F,|B,,2C,2|
w: et io mo-ro be-a -to. Mor-te che nel mo-ri-re,
%
% 27 - 31
%
[V: S] GGAG   |FFEF|DDC2 |C2E2|EEF2-|
w: _m'em-pie di gio-ia tutt' e di de-si-re. Se nel mo-rir
[V: A] zeec   |cBcA|GF2E |F2G2|GGB2-|
w: m'em-pie di gio-ia tutt' e di de-si-re. Se nel mo-rir
[V: T] zccc   |AFGF|B>AG2|A2zc|ccd2-|
w: m'em-pie di gio-ia tutt' e di de-si-re. Se nel mo-rir
[V: B] zC,C,C,|D,D,C,D,|B,,B,,C,2|F,,2C,2|C,C,B,,2-|
w: m'em-pie di gio-ia tutt' e di de-si-re. Se nel mo-rir
%
% 32 - 36
%
[V: S] FDFD        |EEF2   |E4-  |E2z2    |zFB>A     |
w: _al-tro do-lor non sen-to,_ di mil-le
[V: A] BFB>A       |Gc2=B  |cGc>B|AGFc    |f3e       |
w: _al-tro do-lor non sen-to, di mil-le mort' il d\`i, di mil-le
[V: T] dBdd        |ccF2   |G2zG |c>BA>G  |FAd>c     |
w: _al-tro do-lor non sen-to, di mil-le mort' il d\`i, di mil-le
[V: B] B,,B,,B,,B,,|C,C,D,2|C,4  |zC,F,>E,|D,>C,B,,2-|
w: _al-tro do-lor non sen-to, di mil-le mort' il d\`i,
%
% 37 - 41
%
[V: S] GFEG   |G/ F/ F2E|F4         |zFB>A     |GFEG   |
w: mort' il d\`i sa-rei con-ten -to, di mil-le mort' il d\`i sa-
[V: A] ddc2   |zFc>B    |A>GFc      |f3_e      |ddc2   |
w: mort' il d\`i, di mil-le mort' il d\`i, di mil-le mort' il d\`i,
[V: T] B>AGc  |ABG G/ G/|c>BA>G     |FAd>c     |B>AGc  |
w: mort' il d\`i sa-rei con-ten-to, di mil-le mort' il d\`i, \
w: di mil-le mort' il d\`i sa-
[V: B] B,,2C,2|D,B,,C,2 |F,,F,,F,>E,|D,>C,B,,2-|B,,2C,2|
w: _sa rei con-ten-to, di mil-le mort' il d\`i_ sa-
%
% 42 - 46
%
[V: S] G/ F/ F2E      |F4-          |F4-     |F4-       |HF4|]
w: rei con-ten -to.___
[V: A] zFc>B          |A>GFA        |B>cd>c  |Bcd2      |Hc4|]
w: di mil-le mort' il d\`i sa-rei con-ten ----to.
[V: T] ABG2           |Fc"^rall."f>e|d>cB>c  |dcB2      |HA4|]
w: rei con-ten-to, di mil-le mort' il d\`i sa-rei con-ten-to.
[V: B] D,B,,C, C,/ C,/|F,>E,D,>C,   |B,,2zB,,|B,,A,,B,,2|HF,,4|]
w: rei con-ten-to, di mil-le mort' il d\`i sa-rei con-ten-to.
%
% End of file Bianco_Dolce_Cigno.abc

```