tabuleiroInicial([
    [null, black, white, black, black, white, white, null],
    [black, empty, empty, empty, empty, empty, empty, black],
    [white, empty, empty, empty, empty, empty, empty, white],
    [white, empty, empty, empty, empty, empty, empty, black],
    [black, empty, empty, empty, empty, empty, empty, white],
    [black, empty, empty, empty, empty, empty, empty, black],
    [white, empty, empty, empty, empty, empty, empty, white],
    [null, white, black, black, white, black, white, null]
    ]).
emptyList([]).

tabuleiroVazio([
    [null, empty, empty, empty, empty, empty, empty, null],
    [empty, empty, empty, empty, empty, empty, empty, empty],
    [empty, empty, empty, empty, empty, empty, empty, empty],
    [empty, empty, empty, empty, empty, empty, empty, empty],
    [empty, empty, empty, empty, empty, empty, empty, empty],
    [empty, empty, empty, empty, empty, empty, empty, empty],
    [empty, empty, empty, empty, empty, empty, empty, empty],
    [null, empty, empty, empty, empty, empty, empty, null]
    ]).

tabuleiroFinal([ %just an example
    [null, empty, empty, empty, empty, empty, empty, null],
    [empty, empty, empty, black, black, black, white, empty],
    [empty, empty, white, empty, white, white, black, empty],
    [empty, black, black, black, black, black, white, empty],
    [empty, empty, empty, empty, white, black, white, empty],
    [empty, black, white, empty, white, white, white, empty],
    [empty, empty, empty, empty, black, white, empty, empty],
    [null, empty, empty, empty, empty, empty, empty, null]
    ]).

pos(0,'a'). pos(1,'b').
pos(2,'c'). pos(3,'d').
pos(4,'e'). pos(5,'f').
pos(6,'g'). pos(7,'h').

symbol(empty,'.'). symbol(null,' ').
symbol(black,'B'). symbol(white,'W').

display_game(Board):-
    nl,
    write('   | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |\n'),
    write('---|---|---|---|---|---|---|---|---|\n'),
    imprimeTabuleiro(Board, 0).

imprimeTabuleiro([], 8).

imprimeTabuleiro([Head|Tail], Number) :-
    pos(Number, L),
    write(' '),
    write(L),
    Number1 is Number + 1,
    write(' |'),
    imprimeLinha(Head),
    write('\n---|---|---|---|---|---|---|---|---|\n'),
    imprimeTabuleiro(Tail, Number1).

imprimeLinha([]).

imprimeLinha([Head|Tail]) :-
    symbol(Head,S),
    format(' ~s |', [S]),
    imprimeLinha(Tail).


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% GENERATE RANDOM BOARD %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
randomBoard(FinalBoard):-
    tabuleiroVazio(Board),
    emptyList(Prev),
    randomTop(Prev, Board, 2, NewBoard, 0, 0),
    emptyList(Prev1),
    randomBottom(Prev1, NewBoard, 2, NewBoard2, 0, 0),
    emptyList(Prev2),
    randomLeft(Prev2, NewBoard2, 2, NewBoard3, 0, 0),
    emptyList(Prev3),
    randomRight(Prev3, NewBoard3, 2, FinalBoard, 0, 0).

randomTop( _, Board, 8, FinalBoard, _, _):-
    copy(Board, FinalBoard),
    true.

randomTop(Prev, Board, Pos, FinalBoard, WhiteC, BlackC):-
    length(Prev, Size),
    (
        Size == 2 ->
        random(1, 3, R),
        (
            
            R == 1 ->
            (WhiteC == 3 -> fail; write('')),
            nth1(1, Prev, Color1),
            nth1(2, Prev, Color2),
            (
                Color1 == Color2 , white == Color1 ->
                fail
                ;
                append([white], [Color1], NewPrev),
                setPeca(1, Pos, white, Board, NewBoard),
                NewColumn is Pos +1,
                NewWhiteC is WhiteC + 1,
                randomTop(NewPrev, NewBoard, NewColumn, FinalBoard, NewWhiteC, BlackC)
            )
            ;
            (BlackC == 3 -> fail; write('')),
            nth1(1, Prev, Color1),
            nth1(2, Prev, Color2),
            (
                Color1 == Color2 , black == Color1 ->
                fail
                ;
                append([black], [Color1], NewPrev),
                setPeca(1, Pos, black, Board, NewBoard),
                NewBlackC is BlackC + 1,
                NewColumn is Pos +1,
                randomTop(NewPrev, NewBoard, NewColumn, FinalBoard, WhiteC, NewBlackC)

            )

        )

        ;
        random(1, 3, R),
        (
            R == 1 ->
            setPeca(1, Pos, white, Board, NewBoard),
            append([white], Prev, NewPrev),
            NewWhiteC is WhiteC + 1,
            NewColumn is Pos +1,
            randomTop(NewPrev, NewBoard, NewColumn, FinalBoard, NewWhiteC, BlackC)

            ;
            setPeca(1, Pos, black, Board, NewBoard),
            append([black], Prev, NewPrev),
            NewBlackC is BlackC + 1,
            NewColumn is Pos +1,
            randomTop(NewPrev, NewBoard, NewColumn, FinalBoard, WhiteC, NewBlackC)

        )
    ).



randomTop(Prev, Board, Pos, FinalBoard, WhiteC, BlackC):-
    randomTop(Prev, Board, Pos, FinalBoard, WhiteC, BlackC).

randomBottom( _, Board, 8, FinalBoard, _, _):-
    copy(Board, FinalBoard),
    true.

randomBottom(Prev, Board, Pos, FinalBoard, WhiteC, BlackC):-
    length(Prev, Size),
    (
        Size == 2 ->
        random(1, 3, R),
        (
            R == 1 ->
            (WhiteC == 3 -> fail; write('')),
            nth1(1, Prev, Color1),
            nth1(2, Prev, Color2),
            (
                Color1 == Color2 , white == Color1 ->
                fail
                ;
                append([white], [Color1], NewPrev),
                setPeca(8, Pos, white, Board, NewBoard),
                NewWhiteC is WhiteC +1,
                NewColumn is Pos +1,
                randomBottom(NewPrev, NewBoard, NewColumn, FinalBoard, NewWhiteC, BlackC)

            )
            ;
            (BlackC == 3 -> fail; write('')),
            nth1(1, Prev, Color1),
            nth1(2, Prev, Color2),
            (
                Color1 == Color2 , black == Color1 ->
                fail
                ;
                append([black], [Color1], NewPrev),
                setPeca(8, Pos, black, Board, NewBoard),
                NewBlackC is BlackC +1,
                NewColumn is Pos +1,
                randomBottom(NewPrev, NewBoard, NewColumn, FinalBoard, WhiteC, NewBlackC)
            )
        )

        ;
        random(1, 3, R),
        (
            R == 1 ->
            setPeca(8, Pos, white, Board, NewBoard),
            append([white], Prev, NewPrev),
            NewWhiteC is WhiteC +1,
            NewColumn is Pos +1,
            randomBottom(NewPrev, NewBoard, NewColumn, FinalBoard, NewWhiteC, BlackC)

            ;
            setPeca(8, Pos, black, Board, NewBoard),
            append([black], Prev, NewPrev),
            NewBlackC is BlackC +1,
            NewColumn is Pos +1,
            randomBottom(NewPrev, NewBoard, NewColumn, FinalBoard, WhiteC, NewBlackC)

        )
    ).

randomBottom(Prev, Board, Pos, FinalBoard, WhiteC, BlackC):-
    randomBottom(Prev, Board, Pos, FinalBoard, WhiteC, BlackC).

randomLeft( _, Board, 8, FinalBoard, _, _):-
    copy(Board, FinalBoard),
    true.

randomLeft(Prev, Board, Pos, FinalBoard, WhiteC, BlackC):-
    length(Prev, Size),
    (
        Size == 2 ->
        random(1, 3, R),
        (
            R == 1 ->
            (WhiteC == 3 -> fail; write('')),
            nth1(1, Prev, Color1),
            nth1(2, Prev, Color2),
            (
                Color1 == Color2 , white == Color1 ->
                fail
                ;
                append([white], [Color1], NewPrev),
                setPeca(Pos, 1, white, Board, NewBoard),
                NewWhiteC is WhiteC +1,
                NewRow is Pos +1,
                randomLeft(NewPrev, NewBoard, NewRow, FinalBoard, NewWhiteC, BlackC)

            )
            ;
            (BlackC == 3 -> fail; write('')),
            nth1(1, Prev, Color1),
            nth1(2, Prev, Color2),
            (
                Color1 == Color2 , black == Color1 ->
                fail
                ;
                append([black], [Color1], NewPrev),
                setPeca(Pos, 1, black, Board, NewBoard),
                NewBlackC is BlackC +1,
                NewRow is Pos +1,
                randomLeft(NewPrev, NewBoard, NewRow, FinalBoard, WhiteC, NewBlackC)

            )

        )

        ;
        random(1, 3, R),
        (
            R == 1 ->
            setPeca(Pos, 1, white, Board, NewBoard),
            append([white], Prev, NewPrev),
            NewWhiteC is WhiteC +1,
            NewRow is Pos +1,
            randomLeft(NewPrev, NewBoard, NewRow, FinalBoard, NewWhiteC, BlackC)

            ;
            setPeca(Pos, 1, black, Board, NewBoard),
            append([black], Prev, NewPrev),
            NewBlackC is BlackC +1,
            NewRow is Pos +1,
            randomLeft(NewPrev, NewBoard, NewRow, FinalBoard, WhiteC, NewBlackC)

        )
    ).



randomLeft(Prev, Board, Pos, FinalBoard, WhiteC, BlackC):-
    randomLeft(Prev, Board, Pos, FinalBoard, WhiteC, BlackC).






randomRight( _, Board, 8, FinalBoard, _, _):-
    copy(Board, FinalBoard),
    true.

randomRight(Prev, Board, Pos, FinalBoard, WhiteC, BlackC):-
    length(Prev, Size),
    (
        Size == 2 ->
        random(1, 3, R),
        (
            R == 1 ->
            (WhiteC == 3 -> fail; write('')),
            nth1(1, Prev, Color1),
            nth1(2, Prev, Color2),
            (
                Color1 == Color2 , white == Color1 ->
                fail
                ;
                append([white], [Color1], NewPrev),
                setPeca(Pos, 8, white, Board, NewBoard),
                NewWhiteC is WhiteC +1,
                NewRow is Pos +1,
                randomRight(NewPrev, NewBoard, NewRow, FinalBoard, NewWhiteC, BlackC)

            )
            ;
            (BlackC == 3 -> fail; write('')),
            nth1(1, Prev, Color1),
            nth1(2, Prev, Color2),
            (
                Color1 == Color2 , black == Color1 ->
                fail
                ;
                append([black], [Color1], NewPrev),
                setPeca(Pos, 8, black, Board, NewBoard),
                NewBlackC is BlackC +1,
                NewRow is Pos +1,
                randomRight(NewPrev, NewBoard, NewRow, FinalBoard, WhiteC, NewBlackC)

            )

        )

        ;
        random(1, 3, R),
        (
            R == 1 ->
            setPeca(Pos, 8, white, Board, NewBoard),
            append([white], Prev, NewPrev),
            NewWhiteC is WhiteC +1,
            NewRow is Pos +1,
            randomRight(NewPrev, NewBoard, NewRow, FinalBoard, NewWhiteC, BlackC)

            ;
            setPeca(Pos, 8, black, Board, NewBoard),
            append([black], Prev, NewPrev),
            NewBlackC is BlackC +1,
            NewRow is Pos +1,
            randomRight(NewPrev, NewBoard, NewRow, FinalBoard, WhiteC, NewBlackC)

        )
    ).



randomRight(Prev, Board, Pos, FinalBoard, WhiteC, BlackC):-
    randomRight(Prev, Board, Pos, FinalBoard, WhiteC, BlackC).