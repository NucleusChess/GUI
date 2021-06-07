import React, {useEffect, useState} from 'react';
import Chessboard from "chessboardjsx";
import {ShortMove} from "chess.js";
import {Chess} from './util/chess';
import $ from 'jquery';

import "./App.scss";
import {Piece} from "chessboardjs";

const BLACK_KING_IMG = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0NSIgaGVpZ2h0PSI0NSI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0yMi41IDExLjYzVjYiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiLz48cGF0aCBkPSJNMjIuNSAyNXM0LjUtNy41IDMtMTAuNWMwIDAtMS0yLjUtMy0yLjVzLTMgMi41LTMgMi41Yy0xLjUgMyAzIDEwLjUgMyAxMC41IiBmaWxsPSIjMDAwIiBzdHJva2UtbGluZWNhcD0iYnV0dCIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIvPjxwYXRoIGQ9Ik0xMS41IDM3YzUuNSAzLjUgMTUuNSAzLjUgMjEgMHYtN3M5LTQuNSA2LTEwLjVjLTQtNi41LTEzLjUtMy41LTE2IDRWMjd2LTMuNWMtMy41LTcuNS0xMy0xMC41LTE2LTQtMyA2IDUgMTAgNSAxMFYzN3oiIGZpbGw9IiMwMDAiLz48cGF0aCBkPSJNMjAgOGg1IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIi8+PHBhdGggZD0iTTMyIDI5LjVzOC41LTQgNi4wMy05LjY1QzM0LjE1IDE0IDI1IDE4IDIyLjUgMjQuNWwuMDEgMi4xLS4wMS0yLjFDMjAgMTggOS45MDYgMTQgNi45OTcgMTkuODVjLTIuNDk3IDUuNjUgNC44NTMgOSA0Ljg1MyA5IiBzdHJva2U9IiNlY2VjZWMiLz48cGF0aCBkPSJNMTEuNSAzMGM1LjUtMyAxNS41LTMgMjEgMG0tMjEgMy41YzUuNS0zIDE1LjUtMyAyMSAwbS0yMSAzLjVjNS41LTMgMTUuNS0zIDIxIDAiIHN0cm9rZT0iI2VjZWNlYyIvPjwvZz48L3N2Zz4=`;
const WHITE_KING_IMG = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0NSIgaGVpZ2h0PSI0NSI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0yMi41IDExLjYzVjZNMjAgOGg1IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIi8+PHBhdGggZD0iTTIyLjUgMjVzNC41LTcuNSAzLTEwLjVjMCAwLTEtMi41LTMtMi41cy0zIDIuNS0zIDIuNWMtMS41IDMgMyAxMC41IDMgMTAuNSIgZmlsbD0iI2ZmZiIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiLz48cGF0aCBkPSJNMTEuNSAzN2M1LjUgMy41IDE1LjUgMy41IDIxIDB2LTdzOS00LjUgNi0xMC41Yy00LTYuNS0xMy41LTMuNS0xNiA0VjI3di0zLjVjLTMuNS03LjUtMTMtMTAuNS0xNi00LTMgNiA1IDEwIDUgMTBWMzd6IiBmaWxsPSIjZmZmIi8+PHBhdGggZD0iTTExLjUgMzBjNS41LTMgMTUuNS0zIDIxIDBtLTIxIDMuNWM1LjUtMyAxNS41LTMgMjEgMG0tMjEgMy41YzUuNS0zIDE1LjUtMyAyMSAwIi8+PC9nPjwvc3ZnPg==`;

function App() {
    // @ts-ignore
    const [chess] = useState(new Chess());
    const [fen, setFen] = useState(chess.fen());
    const [orientation, setOrientation] = useState('white');
    const [checked, setChecked] = useState(false);
    const [status, setStatus] = useState({type: 'info', icon: '', message: ''});

    // $(document).on('keydown', (e) => {
    //    if (e.code === 'KeyF') {
    //         setOrientation(prev => prev === 'white' ? 'black' : 'white');
    //    }
    // });

    useEffect(() => {
        const turn = chess.turn();

        if (checked) {
            $(`[data-testid^="${turn}K"]`).attr('checked', 'checked');
        } else {
            $(`[data-testid^="${turn}K"]`).removeAttr('checked');
        }
    }, [checked]);

    useEffect(() => {
        setStatus({
            type: 'info',
            icon: (chess.turn() === 'w' ? WHITE_KING_IMG : BLACK_KING_IMG),
            message: `${chess.turn() === 'w' ? 'White' : 'Black'}'s turn.`
        })
    }, [chess.turn()]);

    useEffect(() => {
        if (chess.in_stalemate()) {
            setStatus({type: 'warning', icon: '', message: 'Stalemate.'});
        }

        if (chess.in_draw()) {
            if (chess.in_threefold_repetition()) {
                setStatus({type: 'warning', icon: '', message: 'Draw by repetition.'});
            } else if (chess.insufficient_material()) {
                setStatus({type: 'warning', icon: '', message: 'Insufficient material.'});
            } else {
                setStatus({type: 'warning', icon: '', message: 'Draw.'});
            }
        }

        if (chess.in_checkmate()) {
            setStatus({type: 'info',  icon: '', message: `Checkmate. ${chess.turn() === 'w' ? 'Black' : 'White'} wins.`});
        }
    }, [chess.in_stalemate(), chess.in_draw(), chess.in_threefold_repetition(), chess.insufficient_material(), chess.in_checkmate()]);

    useEffect(() => {
        $(`[data-testid^="${chess.turn()}K"]`).attr('checked', chess.in_check());
    });

    // @ts-ignore
    function handleMove(move: ShortMove) {
        if (chess.move(move)) {
            setFen(chess.fen());
        }
    }

    function handlePieceClick(piece: Piece) {

    }

    // @ts-ignore
    // @ts-ignore
    return (
        <>
            <div className={'container'}>
                {status && (
                    <div className={`banner banner-${status.type}`}>
                        <img src={status.icon} alt={''} width={32} height={32} />
                        <span>{status.message}</span>
                    </div>
                )}

                <main>
                    {/* @ts-ignore */}
                    <Chessboard orientation={orientation}
                                boardStyle={{
                                    boxShadow: '0 0 0px 8px #333, 0 0 5px 10px #999',
                                    transform: 'scale(1.25)'
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
