import React from 'react';
import { Divider, BackTop } from 'antd';
import { UpOutlined } from '@ant-design/icons';
import { createHashHistory } from 'history';

import getData from '../getData'
// import getURL from '../getURL'
import ThemePreview from './ThemePreview'
import ThemeLogo from './ThemeLogo'
import DiffStar from './DiffStar'

import './ThemeList.css'


function ThemeList(props) {
    // const [showType, setShowType] = useState(props.showType)

    return (
        <>
            {(props.showType === 'byBlock' && <CardListByBlock themesList={props.themesList} />)}
            {(props.showType === 'byList' && <CardListByList themesList={props.themesList} />)}
            <BackTop>
                <div className="back_to_top"><UpOutlined /></div>
            </BackTop>
        </>
    );
}


function CardListByBlock(props) {
    return (
        <div className="cardlist_by_block">
            {[1, 2, 3, 4, 5].map(diff => {
                let themesByDiff = getData.getThemesByDiff(diff, props.themesList)
                if (themesByDiff.length) {
                    return (
                        <div key={diff}>
                            <h3 className="cardlist_diff_title">
                                星级 <DiffStar diff={diff}></DiffStar>
                            </h3>
                            <ul>
                                {themesByDiff.map(item => {
                                    return (
                                        <li key={item.id}>
                                            <ThemePreview
                                                theme_id={item.id}
                                                onCardThemeClick={_toTheme.bind(this, item.id)}
                                                showName={item.name}>
                                            </ThemePreview>
                                        </li>
                                    )
                                })}
                            </ul>
                            <Divider></Divider>
                        </div>
                    )
                } else {
                    return
                }
            })}
        </div>
    )
}

function CardListByList(props) {
    return (
        <div className="cardlist_by_list">
            {[1, 2, 3, 4, 5].map(diff => {
                let themesByDiff = getData.getThemesByDiff(diff, props.themesList)
                if (themesByDiff.length) {
                    return (
                        <div key={diff}>
                            <h3 className="cardlist_diff_title">
                                星级 <DiffStar diff={diff}></DiffStar>
                            </h3>
                            <ul>
                                {themesByDiff.map(item => {
                                    return (
                                        <li key={item.id}>
                                            <ThemeLogo
                                                theme_id={item.id}
                                                isBigLogo={false}
                                                onThemeLogoClick={_toTheme.bind(this, item.id)}
                                                showName={item.name}
                                            ></ThemeLogo>
                                        </li>
                                    )
                                })}
                            </ul>
                            <Divider></Divider>
                        </div>
                    )
                } else {
                    return
                }
            })}
        </div>
    )
}

ThemeList.defaultProps = {
    themesList: getData.getThemeList(),
    // showType: 'byBlock',
    showType: 'byList'
}

function _toTheme(theme_id) {
    let history = createHashHistory();
    history.push(`/theme_card/${theme_id}`)
}

export default ThemeList;