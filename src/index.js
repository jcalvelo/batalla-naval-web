import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Draggable from "react-draggable";

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


        const shipStyle = {
            height: `${height}px`,
            width: `${width}px`
        };
        return (

            <Draggable grid={[60, 60]} onDrag={this.props.onDrag}
                       bounds='body' onStart={() => this.props.dragEnabled}>
                <div style={shipStyle} className="ship" id={this.props.id}>
                    <button onClick={() => {
                        this.props.rotate(this.props.id)
                    }}>R
                    </button>
                    <div>x: {this.props.shipData.deltaPosition.x.toFixed(0)},
                        y: {this.props.shipData.deltaPosition.y.toFixed(0)}</div>
                    {/*<img src='placeholderShip.png' alt='Ship Image'/>*/}
                </div>
            </Draggable>

        )
    }
}


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ships: Array(5).fill(null),
            dragEnabled: true
        }

        this.state.ships[0] = {
            id: 'carrier',
            deltaPosition: {
                x: 0, y: 0
            },
            size: 5,
            isVertical: false
        }
        this.state.ships[1] = {
            id: 'battleship',
            deltaPosition: {
                x: 0, y: 0
            },
            size: 4,
            isVertical: false
        }
        this.state.ships[2] = {
            id: 'cruiser',
            deltaPosition: {
                x: 0, y: 0
            },
            size: 3,
            isVertical: false
        }
        this.state.ships[3] = {
            id: 'submarine',
            deltaPosition: {
                x: 0, y: 0
            },
            size: 3,
            isVertical: false
        }
        this.state.ships[4] = {
            id: 'destroyer',
            deltaPosition: {
                x: 0, y: 0
            },
            size: 2,
            isVertical: false
        }


        // this.state.ships[0] = {
        //     id: 'carrier',
        //     deltaPosition: {
        //         x: 0, y: 0
        //     },
        //     size: 4,
        //     drag: true,
        //     isVertical: false
        // }
        // this.state.ships[1] = {
        //     id: 'battleship1',
        //     deltaPosition: {
        //         x: 0, y: 0
        //     },
        //     size: 3,
        //     drag: true,
        //     isVertical: false
        // }
        // this.state.ships[2] = {
        //     id: 'battleship2',
        //     deltaPosition: {
        //         x: 0, y: 0
        //     },
        //     size: 3,
        //     drag: true,
        //     isVertical: false
        // }
        // this.state.ships[3] = {
        //     id: 'battleship3',
        //     deltaPosition: {
        //         x: 0, y: 0
        //     },
        //     size: 3,
        //     drag: true,
        //     isVertical: false
        // }
        // this.state.ships[4] = {
        //     id: 'destroyer1',
        //     deltaPosition: {
        //         x: 0, y: 0
        //     },
        //     size: 2,
        //     drag: true,
        //     isVertical: false
        // }
        // this.state.ships[5] = {
        //     id: 'destroyer2',
        //     deltaPosition: {
        //         x: 0, y: 0
        //     },
        //     size: 2,
        //     drag: true,
        //     isVertical: false
        // }
        // this.state.ships[6] = {
        //     id: 'destroyer3',
        //     deltaPosition: {
        //         x: 0, y: 0
        //     },
        //     size: 2,
        //     drag: true,
        //     isVertical: false
        // }
        // this.state.ships[7] = {
        //     id: 'frigate1',
        //     deltaPosition: {
        //         x: 0, y: 0
        //     },
        //     size: 1,
        //     drag: true,
        //     isVertical: false
        // }
        // this.state.ships[8] = {
        //     id: 'frigate2',
        //     deltaPosition: {
        //         x: 0, y: 0
        //     },
        //     size: 1,
        //     drag: true,
        //     isVertical: false
        // }

    }


    // onControlledDrag = (e, position) => {
    //     const {x, y} = position;
    //     this.setState({controlledPosition: {x, y}});
    // };
    //
    // onControlledDragStop = (e, position) => {
    //     this.onControlledDrag(e, position);
    //     this.onStop();
    // };

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
            const ship = this.state.ships[i];
            const row = ship.deltaPosition.y / 60;
            const col = ship.deltaPosition.x / 60;
            if (ship.isVertical) {
                shipPositionIsValid = shipPositionIsValid && (this.inRange(row, 0, 10 - ship.size) && this.inRange(col, 0, 9));
                for (let j = 0; j < ship.size; j++) {
                    tableroShips[(row * 10) + (10 * j) + col] += 1;
                }
            } else {
                shipPositionIsValid = shipPositionIsValid && (this.inRange(row, 0, 9) && this.inRange(col, 0, 10 - ship.size));
                for (let j = 0; j < ship.size; j++) {
                    tableroShips[(row * 10) + j + col] += 1;
                }
            }

        }

        shipPositionIsValid = shipPositionIsValid && !(tableroShips.some(posCount => (posCount > 1)));


        if (shipPositionIsValid) {
            this.setState({
                dragEnabled: false
            })
        }

    }


    render() {

        const shipMarkup = [];

        for (let i = 0; i < this.state.ships.length; i++) {
            shipMarkup.push(this.renderShip(i))
        }

        const shipBoardMarkup = []

        for (let i = 0; i < 100; i++) {
            shipBoardMarkup.push(<div key={i} className="grid-item">{i}</div>)
        }

        return (
            <div>
                <h1>Batalla Naval</h1>

                <div className='board1Container'>

                    <div style={{display: "flex", columnCount: '2', columnGap: '60px'}}>
                        {shipMarkup}
                        <div className="grid-container">
                            {shipBoardMarkup}
                        </div>

                        <button style={{width: '100%', height: '60px'}}
                                onClick={() => this.confirmarPosicionBarcos()}>Confirmar Barcos
                        </button>


                    </div>


                </div>


                {/*<Draggable onStart={() => false}>*/}
                {/*    <div className="box">I don't want to be dragged</div>*/}
                {/*</Draggable>*/}
                {/*<Draggable onDrag={this.handleDrag} {...dragHandlers}>*/}
                {/*    <div className="box">*/}
                {/*        <div>I track my deltas</div>*/}
                {/*        <div>x: {deltaPosition.x.toFixed(0)}, y: {deltaPosition.y.toFixed(0)}</div>*/}
                {/*    </div>*/}
                {/*</Draggable>*/}


                {/*<Draggable grid={[25, 25]} {...dragHandlers}>*/}
                {/*    <div className="box">I snap to a 25 x 25 grid</div>*/}
                {/*</Draggable>*/}
                {/*<Draggable grid={[50, 50]} {...dragHandlers}>*/}
                {/*    <div className="box">I snap to a 50 x 50 grid</div>*/}
                {/*</Draggable>*/}

                {/*<Draggable {...dragHandlers}>*/}
                {/*    <div className="box drop-target" onMouseEnter={this.onDropAreaMouseEnter}*/}
                {/*         onMouseLeave={this.onDropAreaMouseLeave}>I can detect drops from the next box.*/}
                {/*    </div>*/}
                {/*</Draggable>*/}
                {/*<Draggable {...dragHandlers} onStop={this.onDrop}>*/}
                {/*    <div className={`box ${this.state.activeDrags ? "no-pointer-events" : ""}`}>I can be dropped onto*/}
                {/*        another box.*/}
                {/*    </div>*/}
                {/*</Draggable>*/}

                {/*<Draggable bounds="body" {...dragHandlers}>*/}
                {/*    <div className="box">*/}
                {/*        I can only be moved within the confines of the body element.*/}
                {/*    </div>*/}
                {/*</Draggable>*/}

                {/*<Draggable position={controlledPosition} {...dragHandlers} onDrag={this.onControlledDrag}>*/}
                {/*    <div className="box">*/}
                {/*        My position can be changed programmatically. <br/>*/}
                {/*        I have a drag handler to sync state.*/}
                {/*        <div>*/}
                {/*            <a href="#" onClick={this.adjustXPos}>Adjust x ({controlledPosition.x})</a>*/}
                {/*        </div>*/}
                {/*        <div>*/}
                {/*            <a href="#" onClick={this.adjustYPos}>Adjust y ({controlledPosition.y})</a>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</Draggable>*/}
                {/*<Draggable position={controlledPosition} {...dragHandlers} onStop={this.onControlledDragStop}>*/}
                {/*    <div className="box">*/}
                {/*        My position can be changed programmatically. <br/>*/}
                {/*        I have a dragStop handler to sync state.*/}
                {/*        <div>*/}
                {/*            <a href="#" onClick={this.adjustXPos}>Adjust x ({controlledPosition.x})</a>*/}
                {/*        </div>*/}
                {/*        <div>*/}
                {/*            <a href="#" onClick={this.adjustYPos}>Adjust y ({controlledPosition.y})</a>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</Draggable>*/}

            </div>
        );
    }


    //Aux func
    inRange(number, min, max) {
        return (number >= min && number <= max);
    }
}

//
// class RemWrapper extends React.Component {
//     // PropTypes is not available in this environment, but here they are.
//     // static propTypes = {
//     //   style: PropTypes.shape({
//     //     transform: PropTypes.string.isRequired
//     //   }),
//     //   children: PropTypes.node.isRequired,
//     //   remBaseline: PropTypes.number,
//     // }
//
//     translateTransformToRem(transform, remBaseline = 16) {
//         const convertedValues = transform.replace('translate(', '').replace(')', '')
//             .split(',')
//             .map(px => px.replace('px', ''))
//             .map(px => parseInt(px, 10) / remBaseline)
//             .map(x => `${x}rem`)
//         const [x, y] = convertedValues
//
//         return `translate(${x}, ${y})`
//     }
//
//     render() {
//         const {children, remBaseline = 16, style} = this.props
//         const child = React.Children.only(children)
//
//         const editedStyle = {
//             ...child.props.style,
//             ...style,
//             transform: this.translateTransformToRem(style.transform, remBaseline),
//         }
//
//         return React.cloneElement(child, {
//             ...child.props,
//             ...this.props,
//             style: editedStyle
//         })
//     }
// }
//

// ========================================

ReactDOM.render(
    <App/>,
    document.getElementById('root')
);

