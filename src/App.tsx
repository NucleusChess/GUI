import React, {useEffect, useState} from 'react';
import Chessboard from "chessboardjsx";
import {ShortMove} from "chess.js";
import {Chess} from './util/chess';
import $ from 'jquery';

import "./App.scss";
import {Piece} from "chessboardjs";


function App() {
    // @ts-ignore
    const [chess] = useState(new Chess());
    const [fen, setFen] = useState(chess.fen());
    const [orientation, setOrientation] = useState('white');

    $(document).on('keydown', (e) => {
       if (e.code === 'KeyF') {
            setOrientation(prev => prev === 'white' ? 'black' : 'white');
       }
    });

    // useEffect(() => {
    //     const turn = chess.turn();
    //
    //     if (chess.in_check()) {
    //         $(`[data-testid^="${turn}K"]`).addClass('check');
    //     } else {
    //         $(`[data-testid^="${turn}K"]`).removeClass('check');
    //     }
    // }, [ chess.turn(), chess.in_check() ]);

    useEffect(() => {
        if (chess.in_check()) {
            $(`[data-testid^="${chess.turn()}K"]`).addClass('check');
        } else {
            $(`[data-testid^="${chess.turn()}K"]`).removeClass('check');
        }

        if (chess.in_stalemate()) {
            alert('Stalemate.');
        }

        if (chess.in_draw()) {
            if (chess.in_threefold_repetition()) {
                alert('Draw by repetition.');
            } else if (chess.insufficient_material()) {
                alert('Insufficient material.');
            } else {
                alert('Draw.');
            }
        }

        if (chess.in_checkmate()) {
            alert('Checkmate.');
        }
    });

    // @ts-ignore
    function handleMove(move: ShortMove) {
        if (chess.move(move)) {
            setFen(chess.fen());
        }
    }

    function handlePieceClick(piece: Piece) {
        console.log(chess.board());
        console.log(chess.SQUARES);
        console.log(chess.get('d8'));
    }

    // @ts-ignore
    // @ts-ignore
    return (
        <>
            <div className={'container'}>
                <main>
                    {/* @ts-ignore */}
                    <Chessboard orientation={orientation}
                        boardStyle={{
                            boxShadow: '0 0 0px 8px #333',
                            transform: 'scale(1.5)'
                        }}
                        position={fen}

                        onDrop={(move) => handleMove({
                            from: move.sourceSquare,
                            to: move.targetSquare,
                            promotion: 'q'
                        })}

                        onPieceClick={
                            // @ts-ignore
                            piece => handlePieceClick(piece)
                        }
                    />
                </main>
            </div>
        </>
    );
}

export default App;
