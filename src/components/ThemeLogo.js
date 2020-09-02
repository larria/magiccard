import React from 'react';
import getURL from '../getURL'

import './ThemeLogo.css'

class ThemeLogo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.onThemeLogoClick = this.onThemeLogoClick.bind(this)
    }

    onThemeLogoClick() {
        if (typeof this.props.onThemeLogoClick === 'function') {
            this.props.onThemeLogoClick.call(this)
        }
    }

    render() {
        if (!this.props.isBigLogo) {
            return (
                <>
                    <div className="theme_logo_w" onClick={e => this.onThemeLogoClick()} >
                        <img className="theme_logo" src={getURL.getThemeLogo(this.props.theme_id)}alt="" />
                        {this.props.showName && (<span className="theme_logo_name">{this.props.showName}</span>)}
                    </div>
                </>
            );
        } else {
            return (
                <>
                    <div className="theme_logo_big_w" onClick={e => this.onThemeLogoClick()}>
                        <img className="theme_logo_big" src={getURL.getThemeBigLogo(this.props.theme_id)} alt="" />
                        {this.props.showName && (<span className="theme_logo_name">{this.props.showName}</span>)}
                    </div>
                </>
            );
        }
    }
}

ThemeLogo.defaultProps = {
    isBigLogo: false,
    showName: false,
    theme_id: '248',
    onThemeLogoClick: () => {
    }
}

export default ThemeLogo;