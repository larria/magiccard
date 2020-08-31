import React from 'react';
import { Divider, BackTop } from 'antd';
import { UpOutlined, CheckOutlined } from '@ant-design/icons';
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
            {(props.showType === 'byBlock' && <CardListByBlock {...props} />)}
            {(props.showType === 'byList' && <CardListByList {...props} />)}
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
                                    // 主题是否已收集
                                    let collected = props.themesColectedInfo && item.id in props.themesColectedInfo
                                    return (
                                        <li key={item.id} className={collected ? 'collected' : ''}>
                                            <ThemePreview
                                                theme_id={item.id}
                                                onCardThemeClick={props.handleThemeLogoClick.bind(this, item.id)}
                                                showName={item.name}>
                                            </ThemePreview>
                                        </li>
                                    )
                                })}
                            </ul>
                            <Divider></Divider>
                        </div>
                    )
                }
                return false
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
                                    // 主题是否已收集
                                    let collected = props.themesColectedInfo && item.id in props.themesColectedInfo
                                    return (
                                        <li key={item.id} className={collected ? 'collected' : ''}>
                                            <ThemeLogo
                                                theme_id={item.id}
                                                isBigLogo={false}
                                                onThemeLogoClick={props.handleThemeLogoClick.bind(this, item.id)}
                                                showName={item.name}
                                            ></ThemeLogo>
                                            {collected && (
                                                <CheckOutlined style={{ marginLeft: 5, fontSize: 16, color: '#1890ff' }} />
                                            )}
                                        </li>
                                    )
                                })}
                            </ul>
                            <Divider></Divider>
                        </div>
                    )
                }
                return false
            })}
        </div>
    )
}

ThemeList.defaultProps = {
    // 显示的主题列表
    themesList: getData.getThemeList(),
    // 用户已搜集的主题列表
    themesColectedInfo: null,
    // showType: 'byBlock',
    showType: 'byList',
    handleThemeLogoClick: (theme_id) => {
        let history = createHashHistory();
        history.push(`/theme_card/${theme_id}`)
    }
}

export default ThemeList;