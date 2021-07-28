import React from 'react';
import './index.css';
import Draggable from "react-draggable";
//
// export class Ship extends React.Component {
//
//     render() {
//         let width;
//         let height;
//         if (this.props.shipData.isVertical) {
//             width = 60;
//             height = 60 * this.props.shipData.size;
//         } else {
//             width = 60 * this.props.shipData.size;
//             height = 60;
//         }
//
//
//         const shipStyle = {
//             height: `${height}px`,
//             width: `${width}px`
//         };
//         return (
//
//             <Draggable grid={[60, 60]} onDrag={this.props.onDrag}
//                        bounds='body' onStart={() => this.props.dragEnabled}>
//                 <div style={shipStyle} className="ship" id={this.props.id}>
//                     <button onClick={() => {
//                         this.props.rotate(this.props.id)
//                     }}>R
//                     </button>
//                     <div>x: {this.props.shipData.deltaPosition.x.toFixed(0)},
//                         y: {this.props.shipData.deltaPosition.y.toFixed(0)}</div>
//                     {/*<img src='placeholderShip.png' alt='Ship Image'/>*/}
//                 </div>
//             </Draggable>
//
//         )
//     }
// }
//
//
// export class Board extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             ships: Array(5).fill(null),
//             dragEnabled: true
//         }
//
//         this.state.ships[0] = {
//             id: 'carrier',
//             deltaPosition: {
//                 x: 0, y: 0
//             },
//             size: 5,
//             isVertical: false
//         }
//         this.state.ships[1] = {
//             id: 'battleship',
//             deltaPosition: {
//                 x: 0, y: 0
//             },
//             size: 4,
//             isVertical: false
//         }
//         this.state.ships[2] = {
//             id: 'cruiser',
//             deltaPosition: {
//                 x: 0, y: 0
//             },
//             size: 3,
//             isVertical: false
//         }
//         this.state.ships[3] = {
//             id: 'submarine',
//             deltaPosition: {
//                 x: 0, y: 0
//             },
//             size: 3,
//             isVertical: false
//         }
//         this.state.ships[4] = {
//             id: 'destroyer',
//             deltaPosition: {
//                 x: 0, y: 0
//             },
//             size: 2,
//             isVertical: false
//         }
//
//     }
//
//
//     handleDrag(e, ui) {
//
//         const shipId = ui.node.id;
//
//         const auxShipArray = this.state.ships;
//
//         let auxShip = auxShipArray[shipId];
//
//
//         const {x, y} = auxShip.deltaPosition;
//
//         auxShip.deltaPosition = {
//             x: x + ui.deltaX,
//             y: y + ui.deltaY,
//         }
//
//         auxShipArray[shipId] = auxShip;
//
//         this.setState({
//             ships: auxShipArray
//         })
//
//     };
//
//
//     rotateShip(shipId) {
//
//         const auxShipArray = this.state.ships;
//
//         let auxShip = auxShipArray[shipId];
//
//         auxShip.isVertical = !auxShip.isVertical;
//
//         auxShipArray[shipId] = auxShip;
//
//         this.setState({
//             ships: auxShipArray
//         })
//
//     }
//
//     renderShip(i) {
//         return <Ship
//             rotate={(ship) => this.rotateShip(ship)}
//             onDrag={(e, ui) => this.handleDrag(e, ui)}
//             shipData={this.state.ships[i]}
//             dragEnabled={this.state.dragEnabled}
//             id={i}
//             key={i}
//         > </Ship>
//     }
//
//     confirmarPosicionBarcos() {
//         const tableroShips = Array(100).fill(0);
//
//         let shipPositionIsValid = true;
//
//         for (let i = 0; i < this.state.ships.length; i++) {
//             const ship = this.state.ships[i];
//             const row = ship.deltaPosition.y / 60;
//             const col = ship.deltaPosition.x / 60;
//             if (ship.isVertical) {
//                 shipPositionIsValid = shipPositionIsValid && (this.inRange(row, 0, 10 - ship.size) && this.inRange(col, 0, 9));
//                 for (let j = 0; j < ship.size; j++) {
//                     tableroShips[(row * 10) + (10 * j) + col] += 1;
//                 }
//             } else {
//                 shipPositionIsValid = shipPositionIsValid && (this.inRange(row, 0, 9) && this.inRange(col, 0, 10 - ship.size));
//                 for (let j = 0; j < ship.size; j++) {
//                     tableroShips[(row * 10) + j + col] += 1;
//                 }
//             }
//
//         }
//
//         shipPositionIsValid = shipPositionIsValid && !(tableroShips.some(posCount => (posCount > 1)));
//
//
//         if (shipPositionIsValid) {
//             this.setState({
//                 dragEnabled: false
//             })
//         }
//
//
//         // fetch('http://localhost:7071/api/CrearSala')
//         // fetch('https://batalla-naval-functions.azurewebsites.net/api/CrearSala?code=rtbNwJJZUtihP6ZOMHv4PdbpYVqnDd6meR5ZIjAv8BcTQPmn8EkDaw==')
//         //     .then(res => {
//         //         console.log(res)
//         //         return res.json();
//         //     })
//         //     .then(res => {
//         //         // console.log(res)
//         //     });
//     }
//
//
//     render() {
//
//         const shipMarkup = [];
//
//         for (let i = 0; i < this.state.ships.length; i++) {
//             shipMarkup.push(this.renderShip(i))
//         }
//
//         const shipBoardMarkup = []
//
//         for (let i = 0; i < 100; i++) {
//             shipBoardMarkup.push(<div key={i} className="grid-item">{i}</div>)
//         }
//
//         return (
//
//
//             <div>
//                 <h1>Batalla Naval</h1>
//
//                 <div className='board1Container'>
//
//                     <div style={{display: "flex", columnCount: '2', columnGap: '60px'}}>
//                         {shipMarkup}
//                         <div className="grid-container">
//                             {shipBoardMarkup}
//                         </div>
//
//                         <button style={{width: '100%', height: '60px'}}
//                                 onClick={() => this.confirmarPosicionBarcos()}>Confirmar Barcos
//                         </button>
//
//
//                     </div>
//
//
//                 </div>
//             </div>
//         );
//     }
//
//
//     //Aux func
//     inRange(number, min, max) {
//         return (number >= min && number <= max);
//     }
// }
