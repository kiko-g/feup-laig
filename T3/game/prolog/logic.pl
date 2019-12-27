game(Player1, Player2) :-
    % mode 1
      randomBoard(NewBoard),
      display_game(NewBoard),
      mainLoop(Player1, Player2, NewBoard),
      goToMenu(_Input).


game2(Player1, CPU, Level) :-
    % mode 2
      randomBoard(NewBoard),
      display_game(NewBoard),
      mainLoop2(Player1, CPU, NewBoard, Level),
      goToMenu(_Input).

game2(Player1, CPU, Level) :-
    % mode 3
      randomBoard(NewBoard),
      display_game(NewBoard),
      mainLoop2(Player1, CPU, NewBoard, Level),
      goToMenu(_Input).

game4(CPU1, CPU2) :-
    % mode 4
      randomBoard(NewBoard),
      display_game(NewBoard),
      mainLoop3(CPU1, CPU2, NewBoard),
      goToMenu(_Input).

game_over(Board) :-
    checkGameOverTop(Board, 1, 1),      %check row 1 between 2 and 7
    checkGameOverRight(Board, 1, 8),    %check column 8 between 2 and 7
    checkGameOverBottom(Board, 8, 1),   %check row 8 between 2 and 7
    checkGameOverLeft(Board, 1, 1),     %check column 1 between 2 and 7
    write('===========================\n'),
    write('====     GAME OVER     ====\n'),
    write('===========================\n').

printWinner(B, W):-
    B == W, write('====    ITS A DRAW!    ====\n');
    B > W,  write('==== BLACK PLAYER WINS ====\n');
    B < W,  write('==== WHITE PLAYER WINS ====\n').



mainLoop(Player1, Player2, Board):-
     game_over(Board);
        valid_moves(Board, Player1, ListOfMoves),
        length(ListOfMoves, Size1),

         (  Size1 \= 0 ->
                write('> White Player\'s turn...\n'),
                askCoordsWhite(Player1, Board, NewBoard),
                display_game(NewBoard)
                ;
                write('No valid plays for white player...\n'),
                copy(Board, NewBoard)
         ),

         valid_moves(NewBoard, Player2, ListOfMoves2),
         length(ListOfMoves2, Size2),
         (
            Size2 \= 0 ->
            write('> Black Player\'s turn...\n'),
            askCoordsBlack(Player2, NewBoard, FinalBoard),
            display_game(FinalBoard)
            ;
            write('No valid plays...\n'),
            copy(NewBoard, FinalBoard)
         ),

     mainLoop(Player1, Player2, FinalBoard).

mainLoop2(Player1, CPU, Board, Level):-
     game_over(Board);
     valid_moves(Board, Player1, ListOfMoves),
        length(ListOfMoves, Size1),

         (  Size1 \= 0 ->
                
                write('> White Player\'s turn...\n'),
                askCoordsWhite(Player1, Board, NewBoard)
                ;
                write('No valid plays for white player...\n'),
                copy(Board, NewBoard)
         ),

     
    valid_moves(NewBoard, CPU, ListOfMoves2),
         length(ListOfMoves2, Size2),

          ( Size2 \= 0 ->

                write('> Black Player\'s turn...\n'),
                choose_move(CPU, Level, ListOfMoves2, NewBoard, FinalBoard),
                display_game(FinalBoard)
                ;
                write('No valid plays...\n'),
                copy(NewBoard, FinalBoard)
         ),

     mainLoop2(Player1, CPU, FinalBoard, Level).


 mainLoop3(CPU1, CPU2, Board):-
     game_over(Board);
     valid_moves(Board, CPU1, ListOfMoves),
        length(ListOfMoves, Size1),

         (  Size1 \= 0 ->
                
                write('> White Player\'s turn...\n'),
                choose_move(CPU1, 1, ListOfMoves, Board, NewBoard)
                ;
                write('No valid plays for white player...\n'),
                copy(Board, NewBoard)
         ),

     
     valid_moves(Board, CPU2, ListOfMoves2),
         length(ListOfMoves2, Size2),

          ( Size2 \= 0 ->

                write('> Black Player\'s turn...\n'),
                choose_move(CPU2, 1, ListOfMoves2, NewBoard, FinalBoard)
                ;
                write('No valid plays...\n'),
                copy(NewBoard, FinalBoard)
         ),

    
     display_game(FinalBoard),
     mainLoop3(CPU1, CPU2, FinalBoard).



valid_moves(Board, Player, ListOfMoves):-
    findall([R,C,N], findall_aux(Board, R, C, N, Player), ListOfMoves).



%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%    GAME OVER    %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
checkGameOverTop(_, _, 7).
checkGameOverTop(Board, RowIndex, ColIndex):-
    NextColIndex is ColIndex + 1,
    getPeca(RowIndex, NextColIndex, Board, EndPeca),
    EndPeca == empty,
    checkGameOverTop(Board, RowIndex, NextColIndex).
checkGameOverTop(Board, RowIndex, ColIndex):-
    NextColIndex is ColIndex + 1,
    getPeca(RowIndex, NextColIndex, Board, EndPeca),
    EndPeca \= empty,
    checkColFullDown(Board, 2, NextColIndex),
    checkGameOverTop(Board, RowIndex, NextColIndex).

checkGameOverRight(_, 7, _).
checkGameOverRight(Board, RowIndex, ColIndex):-
    NextRowIndex is RowIndex + 1,
    getPeca(NextRowIndex, ColIndex, Board, EndPeca),
    EndPeca \= empty,
    checkRowFullLeft(Board, NextRowIndex, 7),
    checkGameOverRight(Board, NextRowIndex, ColIndex).
checkGameOverRight(Board, RowIndex, ColIndex):-
    NextRowIndex is RowIndex + 1,
    getPeca(NextRowIndex, ColIndex, Board, EndPeca),
    EndPeca == empty,
    checkGameOverRight(Board, NextRowIndex, ColIndex).

checkGameOverBottom(_, _, 7).
checkGameOverBottom(Board, RowIndex, ColIndex):-
    NextColIndex is ColIndex + 1,
    getPeca(RowIndex, NextColIndex, Board, EndPeca),
    EndPeca == empty,
    checkGameOverBottom(Board, RowIndex, NextColIndex).
checkGameOverBottom(Board, RowIndex, ColIndex):-
    NextColIndex is ColIndex + 1,
    getPeca(RowIndex, NextColIndex, Board, EndPeca),
    EndPeca \= empty,
    checkColFullUp(Board, 7, NextColIndex),
    checkGameOverBottom(Board, RowIndex, NextColIndex).

checkGameOverLeft(_, 7, _).
checkGameOverLeft(Board, RowIndex, ColIndex):-
    NextRowIndex is RowIndex + 1,
    getPeca(NextRowIndex, ColIndex, Board, EndPeca),
    EndPeca \= empty,
    checkRowFullRight(Board, NextRowIndex, 2),
    checkGameOverLeft(Board, NextRowIndex, ColIndex).
checkGameOverLeft(Board, RowIndex, ColIndex):-
    NextRowIndex is RowIndex + 1,
    getPeca(NextRowIndex, ColIndex, Board, EndPeca),
    EndPeca == empty,
    checkGameOverLeft(Board, NextRowIndex, ColIndex).

checkColFullDown(_, 8, _).
checkColFullDown(Board, Row, Col):-
    getPeca(Row, Col, Board, Endpeca),
    Endpeca \= empty,
    Nextrow is Row + 1,
    checkColFullDown(Board, Nextrow, Col).

checkColFullUp(_, 1, _).
checkColFullUp(Board, Row, Col):-
    getPeca(Row, Col, Board, Endpeca),
    Endpeca \= empty,
    Nextrow is Row - 1,
    checkColFullUp(Board, Nextrow, Col).
checkRowFullRight(_, _, 8).
checkRowFullRight(Board, Row, Col):-
    getPeca(Row, Col, Board, Endpeca),
    Endpeca \= empty,
    Nextcol is Col + 1,
    checkRowFullRight(Board, Row, Nextcol).
checkRowFullLeft(_, _, 1).
checkRowFullLeft(Board, Row, Col):-
    getPeca(Row, Col, Board, Endpeca),
    Endpeca \= empty,
    Nextcol is Col - 1,
    checkRowFullLeft(Board, Row, Nextcol).
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%    GAME OVER    %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

getPeca(NLinha, NColuna, Board, Peca):-
    nth1(NLinha, Board, Coluna),
    nth1(NColuna, Coluna, Peca).

setPeca(NLinha, NColuna, Peca, TabIn, TabOut):-
    setLinha(NLinha, NColuna, Peca, TabIn, TabOut).
    
setLinha(1, NColuna, Peca, [Linha | Resto], [NovaLinha | Resto]):-
    setColuna(NColuna, Peca, Linha, NovaLinha).

setLinha(N, NColuna, Peca, [Linha | Resto],[Linha | MaisLinhas]):-
    N > 1,
    Next is N-1,
    setLinha(Next, NColuna, Peca, Resto, MaisLinhas).

setColuna(1, Peca, [ _ | Resto],[Peca | Resto]).

setColuna(N, Peca, [X | Resto], [X | Mais]):-
    N > 1,
    Next is N - 1,
    setColuna(Next, Peca, Resto, Mais).


checkValidPlay(Player, Board, Row, Column, Number):-
    getPeca(Row, Column, Board, Peca),
    checkCoord(Player, Row, Column, Board, Peca),
    (
        (
            Column == 1,
            checkValidStepRight(Row, 1, Board, Number, 0)
        );
        (
            Column == 8,
            checkValidStepLeft(Row, 8, Board, Number, 0)
        );
        (
            Row == 1,
            checkValidStepDown(1, Column, Board, Number, 0)
        );
        (
            Row == 8,
            checkValidStepUp(8, Column, Board, Number, 0)
        )
    ).


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% FIND ALL  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%


findall_aux(Board, RowOut, ColOut, Number, Player) :-
    findall_aux_right(Board, 2, 8, 1, Player, RowOut, ColOut, Number);
    findall_aux_left(Board, 2, 1, 1, Player, RowOut, ColOut, Number);
    findall_aux_top(Board, 1, 2, 1, Player, RowOut, ColOut, Number);
    findall_aux_down(Board, 8, 2, 1, Player, RowOut, ColOut, Number).
    


findall_aux_right(Board, R, C, N, Player, RowOut, ColOut, NumOut) :-
     !,
    R < 8,
    (
        (
            checkValidPlay(Player, Board, R, C, N),
            RowOut is R,
            ColOut is C,
            NumOut is N
        );
        (
            (
                N > 5,
                NewR is R + 1, !, 
                findall_aux_right(Board, NewR, C, 1, Player, RowOut, ColOut, NumOut)
            );
            (
                NewN is N + 1, !, 
                findall_aux_right(Board, R, C, NewN, Player, RowOut, ColOut, NumOut)
            )
        )
    ).

findall_aux_left(Board, R, C, N, Player, RowOut2, ColOut2, NumOut2) :-
    !,
    R < 8,
    (
        (
            checkValidPlay(Player, Board, R, C, N),
            RowOut2 is R,
            ColOut2 is C,
            NumOut2 is N
        );
        (
            (
                N > 5,
                NewR is R + 1, !, 
                findall_aux_left(Board, NewR, C, 1, Player, RowOut2, ColOut2, NumOut2)
            );
            (
                NewN is N + 1, !, 
                findall_aux_left(Board, R, C, NewN, Player, RowOut2, ColOut2, NumOut2)
            )
        )
    ).

findall_aux_top(Board, R, C, N, Player, RowOut2, ColOut2, NumOut2) :-
    !,
    C < 8,
    (
        (
            checkValidPlay(Player, Board, R, C, N),
            RowOut2 is R,
            ColOut2 is C,
            NumOut2 is N
        );
        (
            (
                N > 5,
                NewC is C + 1, !, 
                findall_aux_top(Board, R, NewC, 1, Player, RowOut2, ColOut2, NumOut2)
            );
            (
                NewN is N + 1, !, 
                findall_aux_top(Board, R, C, NewN, Player, RowOut2, ColOut2, NumOut2)
            )
        )
    ).

findall_aux_down(Board, R, C, N, Player, RowOut2, ColOut2, NumOut2) :-
    !,
    C < 8,
    (
        (
            checkValidPlay(Player, Board, R, C, N),
            RowOut2 is R,
            ColOut2 is C,
            NumOut2 is N
        );
        (
            (
                N > 5,
                NewC is C - 1, !, 
                findall_aux_top(Board, R, NewC, 1, Player, RowOut2, ColOut2, NumOut2)
            );
            (
                NewN is N + 1, !, 
                findall_aux_top(Board, R, C, NewN, Player, RowOut2, ColOut2, NumOut2)
            )
        )
    ).


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% FIND ALL  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%


move(Player, Board, NewBoard, Row, Column, Number):-
    checkValidPlay(Player, Board, Row, Column, Number),
    getPeca(Row, Column, Board, Peca),
    (
        (
            Column == 1,
            makeMovementRight(Row, Column, Board, Number, Peca, NewBoard)
        );
        (
            Column == 8,
            makeMovementLeft(Row, Column, Board, Number, Peca, NewBoard)
        );
        (
            Row == 1,
            makeMovementDown(Row, Column, Board, Number, Peca, NewBoard)
        );
        (
            Row == 8,
            makeMovementUp(Row, Column, Board, Number, Peca, NewBoard)
        )
    ).




askCoordsWhite(Player, Board, NewBoard):-
    askRow(NewRow),
    nl,
    askColumn(NewColumn),
    askBlocks(Number),
    move(Player, Board, NewBoard, NewRow, NewColumn, Number).

askCoordsWhite(Player, Board, NewBoard):-
    askCoordsWhite(Player, Board, NewBoard).


askCoordsBlack(Player, Board, NewBoard):-
    askRow(NewRow),
    nl,
    askColumn(NewColumn),
    askBlocks(Number),
    move(Player, Board, NewBoard, NewRow, NewColumn, Number).

askCoordsBlack(Player, Board, NewBoard):-
    askCoordsBlack(Player, Board, NewBoard).

%%%%%%%%%%%%%%%%%%%%%%%

decr(X, X1) :-
    X1 is X-1.

copy(L,R) :- accCp(L,R).
    accCp([],[]).

accCp([H|T1],[H|T2]) :- accCp(T1,T2).

move1stepRight(Row, Column, Board, Steps, Peca, NewBoard, NewStep):-
    setPeca(Row, Column, empty, Board, Board1),
    NewColumn is Column +1,
    setPeca(Row, NewColumn, Peca, Board1, NewBoard),
    decr(Steps, NewStep).

%%

move1stepLeft(Row, Column, Board, Steps, Peca, NewBoard, NewStep):-
    setPeca(Row, Column, empty, Board, Board1),
    NewColumn is Column - 1,
    setPeca(Row, NewColumn, Peca, Board1, NewBoard),
    decr(Steps, NewStep).

move1stepUp(Row, Column, Board, Steps, Peca, NewBoard, NewStep):-
    setPeca(Row, Column, empty, Board, Board1),
    NewRow is Row - 1,
    setPeca(NewRow, Column, Peca, Board1, NewBoard),
    decr(Steps, NewStep).

move1stepDown(Row, Column, Board, Steps, Peca, NewBoard, NewStep):-
    setPeca(Row, Column, empty, Board, Board1),
    NewRow is Row + 1,
    setPeca(NewRow, Column, Peca, Board1, NewBoard),
    decr(Steps, NewStep).
%%

makeMovementRight(Row, Column, Board, Steps, Peca, NewBoard):-
    NextColumn is Column + 1,
    getPeca(Row, NextColumn, Board, Peca1),  
    (
            Peca1 == empty ->
                move1stepRight(Row, Column, Board, Steps, Peca, Board1, NewStep),
                (
                    NewStep == 0 ->
                        copy(Board1, NewBoard),
                        true
                        ;
                        NewColumn is Column + 1,
                        makeMovementRight(Row, NewColumn, Board1, NewStep, Peca, NewBoard)
                )
                
            ;   pushRight(Row, Column, Board, Peca1, TempBoard), %POSICAO DA PECAPRESA E Peca1 -> peca a frente
                makeMovementRight(Row, Column, TempBoard, Steps, Peca, NewBoard)
    ).

pushRight(Row, Column, Board, Peca, TempBoard):-
    NextColumn is Column +2,
    NewColumn is Column +1,
    getPeca(Row, NextColumn, Board, Peca2),
    (
        Peca2 == empty ->
        move1stepRight(Row, NewColumn, Board, 1, Peca, TempBoard, _NewStep)
        ; pushRight(Row, NewColumn, Board, Peca2, TempBoard)
    ).


    
 makeMovementLeft(Row, Column, Board, Steps, Peca, NewBoard):-
    NextColumn is Column - 1,
    getPeca(Row, NextColumn, Board, Peca1),  
    (
            Peca1 == empty ->
                move1stepLeft(Row, Column, Board, Steps, Peca, Board1, NewStep),
                (
                    NewStep == 0 ->
                        copy(Board1, NewBoard),
                        true
                        ;
                        NewColumn is Column - 1,
                        makeMovementLeft(Row, NewColumn, Board1, NewStep, Peca, NewBoard)
                )
                
            ;   pushLeft(Row, Column, Board, Peca1, TempBoard), %POSICAO DA PECAPRESA E Peca1 -> peca a frente
                makeMovementLeft(Row, Column, TempBoard, Steps, Peca, NewBoard)
    ).

pushLeft(Row, Column, Board, Peca, TempBoard):-
    NextColumn is Column -2,
    NewColumn is Column -1,
    getPeca(Row, NextColumn, Board, Peca2),
    (
        Peca2 == empty ->
        move1stepLeft(Row, NewColumn, Board, 1, Peca, TempBoard, _NewStep)
        ; pushLeft(Row, NewColumn, Board, Peca2, TempBoard)
    ).
    
 makeMovementUp(Row, Column, Board, Steps, Peca, NewBoard):-
    NextRow is Row - 1,
    getPeca(NextRow, Column, Board, Peca1),  
    (
            Peca1 == empty ->
                move1stepUp(Row, Column, Board, Steps, Peca, Board1, NewStep),
                (
                    NewStep == 0 ->
                        copy(Board1, NewBoard),
                        true
                        ;
                        NewRow is Row - 1,
                        makeMovementUp(NewRow, Column, Board1, NewStep, Peca, NewBoard)
                )
                
            ;   pushUp(Row, Column, Board, Peca1, TempBoard), %POSICAO DA PECAPRESA E Peca1 -> peca a frente
                makeMovementUp(Row, Column, TempBoard, Steps, Peca, NewBoard)
                
    ).

pushUp(Row, Column, Board, Peca, TempBoard):-
    NextRow is Row -2,
    NewRow is Row -1,
    getPeca(NextRow, Column, Board, Peca2),
    (
        Peca2 == empty ->
        move1stepUp(NewRow, Column, Board, 1, Peca, TempBoard, _NewStep)
        ; pushUp(NewRow, Column, Board, Peca2, TempBoard)
    ).
    
 makeMovementDown(Row, Column, Board, Steps, Peca, NewBoard):-
    NextRow is Row + 1,
    getPeca(NextRow, Column, Board, Peca1),  
    (
            Peca1 == empty ->
                move1stepDown(Row, Column, Board, Steps, Peca, Board1, NewStep),
                (
                    NewStep == 0 -> 
                        copy(Board1, NewBoard),
                        true
                        ;
                        NewRow is Row + 1,
                        makeMovementDown(NewRow, Column, Board1, NewStep, Peca, NewBoard)
                )
                
            ;   pushDown(Row, Column, Board, Peca1, TempBoard), %POSICAO DA PECAPRESA E Peca1 -> peca a frente
                makeMovementDown(Row, Column, TempBoard, Steps, Peca, NewBoard)
    ).

pushDown(Row, Column, Board, Peca, TempBoard):-
    NextRow is Row +2,
    NewRow is Row +1,
    getPeca(NextRow, Column, Board, Peca2),
    (
        Peca2 == empty ->
        move1stepDown(NewRow, Column, Board, 1, Peca, TempBoard, _NewStep)
        ; pushDown(NewRow, Column, Board, Peca2, TempBoard)
    ).

checkValidStepRight(Row, Column, Board, Steps, Counter) :-
    Column < 7,
    NextColumn is Column + 1,
    getPeca(Row, NextColumn, Board, Peca),
    (
        Peca == empty,
        NewCounter is Counter + 1;
        NewCounter is Counter
    ),
    checkValidStepRight(Row, NextColumn, Board, Steps, NewCounter).

checkValidStepRight(_, _, _, Steps, Counter) :-
    \+ (Steps > Counter).

checkValidStepLeft(Row, Column, Board, Steps, Counter) :-
    Column > 2,
    NextColumn is Column - 1,
    getPeca(Row, NextColumn, Board, Peca),
    (
        Peca == empty,
        NewCounter is Counter + 1;
        NewCounter is Counter
    ),
    checkValidStepLeft(Row, NextColumn, Board, Steps, NewCounter).

checkValidStepLeft(_, _, _, Steps, Counter) :-
    \+ (Steps > Counter).

checkValidStepDown(Row, Column, Board, Steps, Counter) :-
    Row < 7,
    NextRow is Row + 1,
    getPeca(NextRow, Column, Board, Peca),
    (
        Peca == empty,
        NewCounter is Counter + 1;
        NewCounter is Counter
    ),
    checkValidStepDown(NextRow, Column, Board, Steps, NewCounter).

checkValidStepDown(_, _, _, Steps, Counter) :-
    \+ (Steps > Counter).

checkValidStepUp(Row, Column, Board, Steps, Counter) :-
    Row > 2,
    NextRow is Row - 1,
    getPeca(NextRow, Column, Board, Peca),
    (
        Peca == empty,
        NewCounter is Counter + 1;
        NewCounter is Counter
    ),
    checkValidStepUp(NextRow, Column, Board, Steps, NewCounter).

checkValidStepUp(_, _, _, Steps, Counter) :-
    \+ (Steps >  Counter).

choose_move(CPU, Level, ListOfOutputs, Board, NewBoard):-
    length(ListOfOutputs, Size),
    (
        Size == 1 ->        %%avoid random(1, 1, R)
        R is 1
        ;
        random(1, Size, R)
    ),
    (
        Level == 0 ->
        nth1(1, ListOfOutputs, Elem)    
        ;
        nth1(R, ListOfOutputs, Elem)
    ),
    nl,
    write(Elem),
    nl,
    nth1(1, Elem, Row),
    nth1(2, Elem, Column),
    nth1(3, Elem, Number),
    move(CPU, Board, NewBoard, Row, Column, Number),
    checkRow(X, Row),
    (
        CPU == black ->
        write('Black Player chose:\nRow: ')
        ;
        write('White Player chose:\nRow: ')
    ),
    write(X), nl,
    write('Column: '), write(Column), nl,
    write('Blocks: '), write(Number), nl.

choose_move(CPU, ListOfOutputs, Board, NewBoard):-
    choose_move(CPU, ListOfOutputs, Board, NewBoard).




%%%%% DETERMINE WINNER BELOW %%%%%
traverseBoard(_, 9, _, _, Score, ScoreAux) :-
	ScoreAux is Score.

traverseBoard(Board, Row, Col, Player, Score, ScoreAux) :-
    investigaPeca(Board, Row, Col, Player, Score, ScoreAuxInvest, BoardV),
    (
        write(Score), write(' '), write(ScoreAuxInvest), nl,
        (ScoreAuxInvest > Score, ScoreAuxTraverse is ScoreAuxInvest)
        ; ScoreAuxTraverse is Score
    ),
    NewCol is Col + 1,
	(
		(
        	NewCol > 8, 
            NewRow is Row + 1, %se ultrapassar 8 next row
			traverseBoard(BoardV, NewRow, 1, Player, ScoreAuxTraverse, S)
		)
        ; traverseBoard(BoardV, Row, NewCol, Player, ScoreAuxTraverse, S)
	),
	ScoreAux is S.
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
investigaPeca(Board, Row, Col, _, Score, NewS, BoardV) :-
    getPeca(Row, Col, Board, T),
    checkVisited(Board, T, Row, Col, BoardV),
    copy(Board, BoardV),
    NewS is Score.

investigaPeca(Board, Row, Col, Player, Score, NewS, BoardV) :-
    getPeca(Row, Col, Board, T),
    checkVisited(Board, T, Row, Col, BoardV),
    Player == T,
    AuxScore is Score + 1,
    checkLeft(BoardV, Row, Col, Player, AuxScore, AuxLeft),
    checkRight(BoardV, Row, Col, Player, AuxLeft, AuxRight),
    checkTop(BoardV, Row, Col, Player, AuxRight, AuxTop),
    checkBottom(BoardV, Row, Col, Player, AuxTop, NewS).


investigaPeca(Board, Row, Col, Player, Score, NewS, BoardV) :-
    getPeca(Row, Col, Board, T),
    checkVisited(Board, T, Row, Col, BoardV),
    Player \= T,
    NewS is Score.



checkVisited(Board, Peca, Row, Col, RetBoard):-
    Peca \= visited,
    setPeca(Row, Col, visited, Board, RetBoard).


checkLeft(Board, Row, Col, Player, AuxScore, NewS):-
    (
        Col \= 1,
        NCol is Col-1,
        getPeca(Row, NCol, Board, Type),
        Type == Player,
        NewS is AuxScore + 1
    ); NewS is AuxScore.

checkRight(Board, Row, Col, Player, AuxScore, NewS):-
    (
        Col \= 8,
        NCol is Col+1,
        getPeca(Row, NCol, Board, Type),
        Type == Player,
        NewS is AuxScore + 1
    ); NewS is AuxScore.
    

checkTop(Board, Row, Col, Player, AuxScore, NewS):-
    (
        Row \= 1,
        NRow is Row+1,
        getPeca(NRow, Col, Board,Type),
        Type == Player,
        NewS is AuxScore + 1
    ); NewS is AuxScore.

checkBottom(Board, Row, Col, Player, AuxScore, NewS):-
    (
        Row \= 8,
        NRow is Row-1,
        getPeca(NRow, Col, Board, Type),
        Type == Player,
        NewS is AuxScore + 1
    ); NewS is AuxScore.
%%%%% DETERMINE WINNER ABOVE %%%%%