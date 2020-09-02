import React from 'react';
import getURL from '../getURL'

import './ThemeLogo.css'

class ThemeLogo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        if (!this.props.isBigLogo) {
            return (
                <>
                    <div className="theme_logo_w" onClick={e => this.props.onThemeLogoClick(this.props.theme_id)} >
                        <img className="theme_logo" src={getURL.getThemeLogo(this.props.theme_id)}alt="" />
                        {this.props.showName && (<span className="theme_logo_name">{this.props.showName}</span>)}
                    </div>
                </>
            );
        } else {
            return (
                <>
                    <div className="theme_logo_big_w" onClick={e => this.props.onThemeLogoClick(this.props.theme_id)}>
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

export default ThemeLogo