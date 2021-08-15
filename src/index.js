import React from 'react';
import ReactDOM from 'react-dom';
import './bootstrap.min.css';
import './index.css';

import Draggable from "react-draggable";
import Pusher from 'pusher-js';

//reglas https://www.hasbro.com/common/instruct/Battleship.PDF

class Ship extends React.Component {

    render() {
        let width;
        let height;
        if (this.props.shipData.isVertical) {
            width = 60;
            height = 60 * this.props.shipData.size;
        } else {
            width = 60 * this.props.shipData.size;
            height = 60;
        }

        let backgroundImageClass = '';
        switch (this.props.shipData.id) {
            case 'carrier':
                backgroundImageClass = this.props.shipData.isVertical ? 'carrierV' : 'carrierH';
                break;
            case 'battleship':
                backgroundImageClass = this.props.shipData.isVertical ? 'battleshipV' : 'battleshipH';
                break;
            case 'submarine':
                backgroundImageClass = this.props.shipData.isVertical ? 'submarineV' : 'submarineH';
                break;
            case 'destroyer':
                backgroundImageClass = this.props.shipData.isVertical ? 'destroyerV' : 'destroyerH';
                break
            case 'cruiser':
                backgroundImageClass = this.props.shipData.isVertical ? 'cruiserV' : 'cruiserH';
                break;
            default:
                backgroundImageClass = '';
                break;
        }

        const shipStyle = {
            height: `${height}px`,
            width: `${width}px`
        };

        const hitmarks = [];

        for (let i = 0; i < this.props.shipData.size; i++) {
            if (this.props.shipData.health[i]) {
                hitmarks.push(
                    <button key={i} className="btn" style={{fontSize: '25px', width: '60px', height: '60px'}}>
                        🔥
                    </button>
                )
            } else {
                hitmarks.push(
                    <button key={i} className="btn" style={{fontSize: '25px', width: '60px', height: '60px'}}>

                    </button>
                )
            }

        }

        return (
            <Draggable grid={[60, 60]} onDrag={this.props.onDrag}
                       bounds='body' onStart={() => this.props.dragEnabled}>
                <div style={shipStyle} className={backgroundImageClass} id={this.props.id}>

                    {function () {
                        if (this.props.dragEnabled) {
                            return (
                                <button className="btn" style={{fontSize: '25px'}} onClick={() => {
                                    this.props.rotate(this.props.id)
                                }}>🔄
                                </button>
                            )
                        } else {
                            return (
                                <div>
                                    {hitmarks}
                                </div>

                            )
                        }
                    }.call(this)}

                </div>
            </Draggable>

        )
    }
}


class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            joinCode: ''
        }
    }

    newGameRoom() {
        const chars = '0123456789';
        const roomId = new Array(4).fill('').map(() => chars[Math.floor(Math.random() * 100) % chars.length]).join('');

        this.props.joinRoom(true, roomId);
    }


    joinGameRoom() {
        this.props.joinRoom(false, this.state.joinCode);
    }


    render() {
        return (
            <div style={{height: '100vh', display: 'flex', alignItems: 'center'}}>
                <div style={{
                    display: 'grid',
                    height: '20rem',
                    width: '50%',
                    justifyItems: 'end',
                    position: 'relative',
                    top: '-15vh',
                    paddingRight: '2rem',
                    borderRightColor: 'black',
                    borderRightStyle: 'solid',
                }}>

                    <button className="btn btn-primary" style={{height: '5rem', alignSelf: "center"}} onClick={() => {
                        this.newGameRoom();
                    }}>Crear una Sala
                    </button>
                </div>
                <div style={{
                    display: 'grid',
                    height: '5rem',
                    width: '50%',
                    justifyItems: 'start',
                    position: 'relative',
                    top: '-15vh',
                    paddingLeft: '2rem'
                }}>
                    <input onChange={(e) => {
                        this.setState({
                            joinCode: e.target.value
                        })
                    }}
                           onKeyDown={(e) => {
                               if (e.code === 'Enter' || e.code === 'NumpadEnter') {
                                   this.joinGameRoom();
                               }
                           }}
                           type="text" id="gameId" name="gameId"/>
                    <br/>
                    <button className="btn btn-secondary" onClick={() => {
                        this.joinGameRoom();
                    }}>Unirse un Juego
                    </button>
                </div>
            </div>
        )
    }
}

function TargetingCell(props) {

    switch (props.status) {
        case 'hit':
            return (
                <div key={`targeting${props.i}`} className="grid-item">
                    🔥
                </div>
            )
        case 'water':
            return (
                <div key={`targeting${props.i}`} className="grid-item">
                    💧
                </div>
            )
        case 'shot':
            return (
                <div key={`targeting${props.i}`} className="grid-item">
                    ⏳
                </div>
            )
        default:
            return (
                <div key={`targeting${props.i}`} className="grid-item">
                    <button className="cellButton"
                            onClick={() => props.onClick(props.i)}>{getCoord(props.i)}</button>
                </div>
            )

    }
}


class TargetingBoard extends React.Component {


    render() {
        const shipBoardMarkup = []
        for (let i = 0; i < 100; i++) {
            shipBoardMarkup.push(
                <TargetingCell key={i} status={this.props.targetingBoard[i]} i={i}
                               onClick={() => this.props.fireShot(i)}
                > </TargetingCell>
            )
        }

        return (
            <div className="grid-container">{shipBoardMarkup}</div>

        );
    }
}


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ships: Array(5).fill(null),
            dragEnabled: true,
            gameState: 'home',
            roomCode: '',
            firstPlayer: null,
            SunkenShips: [],
        }

        this.state.ships[0] = {
            id: 'carrier',
            deltaPosition: {
                x: 0, y: 0
            },
            size: 5,
            health: Array(5).fill(false),
            occupiedCells: [],
            isAlive: true,
            isVertical: false
        }
        this.state.ships[1] = {
            id: 'battleship',
            deltaPosition: {
                x: 0, y: 0
            },
            size: 4,
            health: Array(4).fill(false),
            occupiedCells: [],
            isAlive: true,
            isVertical: false
        }
        this.state.ships[2] = {
            id: 'cruiser',
            deltaPosition: {
                x: 0, y: 0
            },
            size: 3,
            health: Array(3).fill(false),
            occupiedCells: [],
            isAlive: true,
            isVertical: false
        }
        this.state.ships[3] = {
            id: 'submarine',
            deltaPosition: {
                x: 0, y: 0
            },
            size: 3,
            health: Array(3).fill(false),
            occupiedCells: [],
            isAlive: true,
            isVertical: false
        }
        this.state.ships[4] = {
            id: 'destroyer',
            deltaPosition: {
                x: 0, y: 0
            },
            size: 2,
            health: Array(2).fill(false),
            occupiedCells: [],
            isAlive: true,
            isVertical: false
        }
    }


    handleDrag(e, ui) {

        const shipId = ui.node.id;

        const auxShipArray = this.state.ships;

        let auxShip = auxShipArray[shipId];


        const {x, y} = auxShip.deltaPosition;

        auxShip.deltaPosition = {
            x: x + ui.deltaX,
            y: y + ui.deltaY,
        }

        auxShipArray[shipId] = auxShip;

        this.setState({
            ships: auxShipArray
        })

    };


    rotateShip(shipId) {

        const auxShipArray = this.state.ships;

        let auxShip = auxShipArray[shipId];

        auxShip.isVertical = !auxShip.isVertical;

        auxShipArray[shipId] = auxShip;

        this.setState({
            ships: auxShipArray
        })

    }

    renderShip(i) {
        return <Ship
            rotate={(ship) => this.rotateShip(ship)}
            onDrag={(e, ui) => this.handleDrag(e, ui)}
            shipData={this.state.ships[i]}
            dragEnabled={this.state.dragEnabled}
            id={i}
            key={i}
        > </Ship>
    }

    confirmarPosicionBarcos() {
        const tableroShips = Array(100).fill(0);

        let shipPositionIsValid = true;
        for (let i = 0; i < this.state.ships.length; i++) {
            const ships = this.state.ships;
            const ship = ships[i];
            const row = ship.deltaPosition.y / 60;
            const col = ship.deltaPosition.x / 60;
            if (ship.isVertical) {
                shipPositionIsValid = shipPositionIsValid && (inRange(row, 0, 10 - ship.size) && inRange(col, 0, 9));
                for (let j = 0; j < ship.size; j++) {
                    tableroShips[(row * 10) + (10 * j) + col] += 1;
                    ship.occupiedCells.push(((row * 10) + (10 * j) + col).toString());
                }
            } else {
                shipPositionIsValid = shipPositionIsValid && (inRange(row, 0, 9) && inRange(col, 0, 10 - ship.size));
                for (let j = 0; j < ship.size; j++) {
                    tableroShips[(row * 10) + j + col] += 1;
                    ship.occupiedCells.push(((row * 10) + j + col).toString());
                }
            }
            this.setState({
                ships: ships
            })

        }

        shipPositionIsValid = shipPositionIsValid && !(tableroShips.some(posCount => (posCount > 1)));


        if (shipPositionIsValid) {

            const resultShipBoard = tableroShips.map((cell) => {
                return (cell === 1)
            })

            this.setState({
                targetingBoard: Array(100).fill(''),
                myBoardPos: resultShipBoard,
                dragEnabled: false,
                myShipsReady: true,
            })

            const data = {
                player: this.state.firstPlayer ? 1 : 2,
                roomCode: this.state.roomCode
            }
            this.postData('https://batalla-naval-functions.azurewebsites.net/api/ShipsReady?code=IlFCqJEehwONb7V4vayRl94ImqVUlboPTPYEGKOzxwSogjnxCaMaCg==', data)
                .then(data => {
                    // console.log(data); // JSON data parsed by `data.json()` call
                });


        }

    }

    joinRoom(firstPlayer, roomCode) {

        this.setState({
            player1Score: 0,
            player2Score: 0,
            gameResult: '',
            waitingForOpponent: firstPlayer,
            firstPlayer: firstPlayer,
            roomCode: roomCode,
            gameState: 'game',
            opponentShipsReady: false,
            myShipsReady: false,
        })
        if (!firstPlayer) {
            this.postData('https://batalla-naval-functions.azurewebsites.net/api/JoinRoom?code=kHiREw06ddtaKUB/wYxvdSvT8SXppY3k8k7Q7x7gXOkkMzOAamj6qQ==', {roomCode: roomCode})
                .then(data => {
                    // console.log(data); // JSON data parsed by `data.json()` call
                });

        }
        this.pusher(roomCode, firstPlayer);
    }

    pusher(roomCode, firstPlayer) {
        // const username = window.prompt('Username: ', 'Anonymous');
        // this.setState({username});
        const pusher = new Pusher('1ec2d1f70b84040e4f89', {
            cluster: 'us2',
            encrypted: true
        });
        const channel = pusher.subscribe(roomCode);
        if (firstPlayer) {
            channel.bind('playerConnected', data => {
                if (data === 'Opponent found') {
                    this.setState({
                        waitingForOpponent: false,
                        opponentShipsReady: false,
                        myShipsReady: false,
                    })
                }
            });
        }

        channel.bind('chat', data => {

        })

        channel.bind('shipSunk', data => {

            if ((this.state.firstPlayer && data.player === '2') || (!this.state.firstPlayer && data.player === '1')) {

                const sunkenshipsAux = this.state.SunkenShips;
                sunkenshipsAux.push(data.shipSunk);

                this.setState({SunkenShips: sunkenshipsAux})
            }
        })
        channel.bind('shipsReady', data => {
            if ((this.state.firstPlayer && data.player === '2') || (!this.state.firstPlayer && data.player === '1')) {
                this.setState({
                    opponentShipsReady: true
                })
            }
        })
        channel.bind('shots', data => {
            // console.log(data)
            if ((this.state.firstPlayer && data.player === '2') || (!this.state.firstPlayer && data.player === '1')) {
                this.setState({
                    incomingShotReady: true,
                    incomingShotCell: data.cellTarget,
                })
            }
            this.processShots();
        })
        channel.bind('shotsResult', data => {
            // console.log(data)

            if (data.player === '1' && data.result) {
                this.setState({
                    player2Score: this.state.player2Score + 1
                })
            } else if (data.player === '2' && data.result) {
                this.setState({
                    player1Score: this.state.player1Score + 1
                })
            }

            if (this.state.player1Score === 17 || this.state.player2Score === 17) {
                if (this.state.player1Score === 17 && this.state.player2Score === 17) {
                    this.setState({
                        gameState: 'finished',
                        gameStatus: 'Empate'
                    })
                } else if (this.state.player1Score === 17) {
                    this.setState({
                        gameState: 'finished',
                        gameStatus: 'Gana Jugador 1'
                    })
                } else {
                    this.setState({
                        gameState: 'finished',
                        gameStatus: 'Gana Jugador 2'
                    })
                }
            }


            if ((this.state.firstPlayer && data.player === '2') || (!this.state.firstPlayer && data.player === '1')) {

                const auxTargetingBoard = this.state.targetingBoard;

                auxTargetingBoard[this.state.myShotCell] = data.result ? 'hit' : 'water'

                this.setState({
                    targetingBoard: auxTargetingBoard,
                    incomingShotReady: false,
                    // incomingShotCell: -1,
                    myShotReady: false,
                    // myShotCell: -1,
                })
                // }
            } else if ((this.state.firstPlayer && data.player === '1') || (!this.state.firstPlayer && data.player === '2')) {

                const ships = this.state.ships;
                const ship = ships.find(elem => elem.occupiedCells.includes(this.state.incomingShotCell))
                if (ship) {
                    const shotPos = ship.occupiedCells.indexOf(this.state.incomingShotCell);

                    ship.health[shotPos] = true;

                    if (!(ship.health.some(h => !h))) {

                        const data = {
                            shipSunk: ship.id,
                            player: this.state.firstPlayer ? 1 : 2,
                            roomCode: this.state.roomCode
                        }
                        this.postData('https://batalla-naval-functions.azurewebsites.net/api/ShipSunk?code=bq3mxN5WpTolL19k2XYP8drSnqqNiX4uerkwfFXuKrG1a60W63ohQA==', data)
                            .then(data => {
                                // console.log(data); // JSON data parsed by `data.json()` call
                            });
                    }

                    this.setState({ships: ships})
                }
            }
        })
    }

    fireShot(i) {
        if (!this.state.myShotReady) {
            const shotConfirmed = window.confirm(`Confirme que quiere disparar en la posicion ${getCoord(i)}`)
            if (shotConfirmed) {


                const data = {
                    shot: i,
                    player: this.state.firstPlayer ? 1 : 2,
                    roomCode: this.state.roomCode
                }

                this.postData('https://batalla-naval-functions.azurewebsites.net/api/FireShot?code=GUicII27OCGNM2EXbQ/631qEHzUNVSF7svcPcjdnM9jYxNhxdFFIbw==', data)
                    .then(data => {
                        // console.log(data); // JSON data parsed by `data.json()` call
                    });


                const auxTargetingBoard = this.state.targetingBoard;
                auxTargetingBoard[i] = 'shot';
                this.setState({
                    targetingBoard: auxTargetingBoard,
                    myShotReady: true,
                    myShotCell: i,
                })
            }
        }
    }

    sunkenShipList() {
        const markup = [];
        if (this.state.SunkenShips.length > 0) {
            for (const sunkenShip of this.state.SunkenShips) {
                markup.push(<li className='list-unstyled'>{sunkenShip}</li>)
            }
        }
        return markup;
    }

    processShots() {
        if (this.state.incomingShotReady && this.state.myShotReady) {

            const data = {
                shotResult: this.state.myBoardPos[this.state.incomingShotCell],
                player: this.state.firstPlayer ? 1 : 2,
                roomCode: this.state.roomCode
            }

            this.postData('https://batalla-naval-functions.azurewebsites.net/api/ShotResult?code=qRX2msyeXqiajjtEwyGUEJDLag3HOaYlYK2sBPeFFReDTXPrzUm2EA==', data)
                .then(data => {
                    // console.log(data); // JSON data parsed by `data.json()` call
                });

        }
    }

    render() {


        switch (this.state.gameState) {
            case 'home':
                return (
                    <div>
                        <Home joinRoom={(firstPlayer, roomCode) => this.joinRoom(firstPlayer, roomCode)}> </Home>
                    </div>

                )
            case 'game':
                const shipMarkup = [];
                for (let i = 0; i < this.state.ships.length; i++) {
                    shipMarkup.push(this.renderShip(i))
                }
                const shipBoardMarkup = []
                for (let i = 0; i < 100; i++) {
                    shipBoardMarkup.push(<div key={i} className="grid-item">{getCoord(i)}</div>)
                }
                return (
                    <div>
                        <h1>Batalla Naval</h1>
                        <h2 style={{position: 'absolute', top: '0', right: '2rem'}}>Room
                            Code: {this.state.roomCode}</h2>
                        <h2 style={{
                            position: 'absolute',
                            top: '2rem',
                            right: '2rem'
                        }}>Jugador1{this.state.firstPlayer ? '(Yo)' : ''}: {this.state.player1Score} -
                            Jugador2{!this.state.firstPlayer ? '(Yo)' : ''}: {this.state.player2Score}</h2>
                        <div className='board1Container'>

                            <div style={{display: "flex", columnCount: '2', columnGap: '60px'}}>
                                {shipMarkup}
                                <div className="grid-container">
                                    {shipBoardMarkup}
                                </div>
                                {function () {
                                    if (this.state.waitingForOpponent) {
                                        return (
                                            <div>
                                                Esperando un oponente...
                                            </div>
                                        )
                                    } else if (!this.state.myShipsReady) {
                                        return (
                                            <button className="btn btn-outline-success"
                                                    style={{width: '600px', height: '60px'}}
                                                    onClick={() => this.confirmarPosicionBarcos()}>Confirmar Barcos
                                            </button>
                                        )
                                    } else if (!this.state.opponentShipsReady) {
                                        return (
                                            <div>
                                                Esperando que el oponente confirme su formación de Barcos...
                                            </div>
                                        )
                                    } else {
                                        return (
                                            <TargetingBoard
                                                myShotReady={this.state.myShotReady}
                                                fireShot={(i) => this.fireShot(i)}
                                                // fireShot={(i) => console.log(this)}
                                                targetingBoard={this.state.targetingBoard}> </TargetingBoard>
                                        )
                                    }
                                }.call(this)}
                            </div>
                        </div>

                        <div style={{position: 'absolute', top: '0.2rem', left: '40vw'}}>
                            Barcos undidos:
                            <hr style={{margin: '0', padding: '0'}}/>
                            <ul className="list-group" style={{fontSize: '12px'}}>
                                {this.sunkenShipList()}
                            </ul>

                        </div>

                    </div>
                );
            case 'finished':
                return (
                    <div>
                        <h1>{this.state.gameStatus}</h1>
                    </div>
                )
            default:
                return (
                    <div>Se rompio</div>
                )
        }
    }


    async postData(url = '', data = {}) {
        // Opciones por defecto estan marcadas con un *
        const response = await fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(data) // body data type must match "Content-Type" header
        });
        return response.json(); // parses JSON response into native JavaScript objects
    }
}

function getCoord(i) {
    const letterCoords = 'ABCDEFGHIJ'

    return `${letterCoords[Math.floor(i / 10)]}${(i % 10) + 1}`;
}

function inRange(number, min, max) {
    return (number >= min && number <= max);
}

ReactDOM.render(
    <App/>
    ,
    document.getElementById('root')
);

