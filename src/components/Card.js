import React from 'react';
import getData from '../getData'
import getURL from '../getURL'

import './Card.css'

class Card extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.onCardClick = this.onCardClick.bind(this)
        this._getHighlightStyle = this._getHighlightStyle.bind(this)
    }

    onCardClick() {
        if (typeof this.props.onCardThemeClick === 'function') {
            this.props.onCardThemeClick.call(this)
        }
    }

    _getHighlightStyle() {
        let res = {}
        if (this.props.highlightType === 'highlight1') {
            res = {
                transform: 'scale(1.1, 1.1)'
            }
        } else if (this.props.highlightType === 'highlight2') {
            res = {
                // transform: 'scale(1.1, 1.1) rotate(1deg)',
                animation: 'shakeTopx 2s infinite',
            }
        } else if (this.props.highlightType === 'fade') {
            res = {
                opacity: '0.3'
            }
        }
        return res
    }

    render() {
        const cardInfo = getData.getCardById(this.props.id)
        if (!this.props.isSmall) {
            return (
                <div className="card_wrap" onClick={this.props.onCardClick} style={this._getHighlightStyle()}>
                    <div className="card" style={{
                        backgroundImage: `url(${getURL.getThemeBackGround(cardInfo.theme_id)})`
                    }}>
                        <img className="card_img" src={getURL.getCard(this.props.id)} alt="" />
                        {this.props.showPrice && <span className="card_price">{cardInfo.price}</span>}
                        {this.props.showNameInBigCard && <span className="card_name_in_card">{cardInfo.name}</span>}
                    </div>
                    {this.props.showName && <span className="card_name">{cardInfo.name}</span>}
                </div>
            );
        } else {
            return (
                <div className="card_wrap_small" onClick={this.props.onCardClick} style={this._getHighlightStyle()}>
                    <div className="card_small">
                        <img className="card_img_small" src={getURL.getCardSmall(this.props.id)} alt="" />
                    </div>
                    {this.props.showName && <span className="card_name_small">{cardInfo.name}</span>}
                </div>
            );
        }
    }
}

Card.defaultProps = {
    id: '3660',
    isSmall: false,
    showName: false,
    showNameInBigCard: false,
    highlightType: false,
    showPrice: false,
    onCardClick: () => {
    }
}

export default Card;