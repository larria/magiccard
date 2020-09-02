import React from 'react';
// import getData from '../getData'
import getURL from '../getURL'

import './ThemePreview.css'

class ThemePreview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.onCardThemeClick = this.onCardThemeClick.bind(this)
    }

    onCardThemeClick() {
        if (typeof this.props.onCardThemeClick === 'function') {
            this.props.onCardThemeClick.call(this)
        }
    }

    render() {
        return (
            <>
                <div className="theme_preview_w">
                    <img className="theme_preview" src={getURL.getThemeMuseum(this.props.theme_id)} onClick={e => this.onCardThemeClick()} alt="" />
                    {this.props.showName && (<span className="theme_preview_name">{this.props.showName}</span>)}
                </div>
            </>
        );
    }
}

ThemePreview.defaultProps = {
    theme_id: '248',
    showName: false,
    onCardThemeClick: () => {
    }
}

export default ThemePreview;