import React from 'react';
import { message } from 'antd';
import * as utils from '../utils';
import getData from '../getData'
import Card from './Card'
import DiffStar from './DiffStar'

import getURL from '../getURL'

import './ThemeCards.css'

message.config({
    maxCount: 1
})

// 主题卡片集列表
class ThemeCards extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // 所属卡片按面值price分组
            cardsSortByPrice: getData.getCardsByThemeIdAndSortByPrice(props.theme_id),
            // 显示卡片合成提示
            onShowCombByCardId: null,
        };
        this.showCombByCardId = this.showCombByCardId.bind(this)
        this._getCardHighlightType = this._getCardHighlightType.bind(this)
    }

    componentDidMount() {
        // 跳转到页面顶部
        window.scrollTo(0, 0)
    }

    // 显示该卡片合成信息
    showCombByCardId(card_id) {
        // console.log(getData.getCombineRuleByCardId(card_id))
        if (this.state.onShowCombByCardId && this.state.onShowCombByCardId.id === card_id) {
            // 如果已经在显示该卡片的合成信息（重复点击），则取消显示
            this.setState({
                onShowCombByCardId: null
            })
        } else {
            let combInfo = getData.getCombineRuleByCardId(card_id)
            if (!combInfo) {
                message.info('该卡片无法被合成');
                this.setState({
                    onShowCombByCardId: null
                })
            } else {
                message.success(`合成时长：${utils.getTimeFormat(combInfo.time)}`);
                this.setState({
                    onShowCombByCardId: combInfo
                })
            }
        }
    }

    _getCardHighlightType(id) {
        let res = false
        if (this.state.onShowCombByCardId) {
            if (this.state.onShowCombByCardId.id === id) {
                res = 'highlight1'
            } else if (this.state.onShowCombByCardId.from.split(',').includes(id)) {
                res = 'highlight2'
            } else {
                res = 'fade'
            }
        }
        return res
    }

    render() {
        let themeData = getData.getThemeById(this.props.theme_id)
        let typeName = '普通卡'
        // 0：普通卡套
        // 1：已下架卡套
        // 2：特殊卡套（可合成，基础牌只能抽取，已下架）
        // 3：特殊卡套（可合成，基础牌只能抽取，正在运作）
        // 5：绝版卡套
        // 9：闪卡套
        console.log(this.props.theme_id, themeData, themeData.type)
        switch (themeData.type) {
            case '0':
                typeName = '普通卡'
                break
            case '1':
                typeName = '已下架卡'
                break
            case '2':
                typeName = '活动卡（可合成，基础牌只能抽取，已下架）'
                break
            case '3':
                typeName = '活动卡（可合成，基础牌只能抽取，正在运作）'
                break
            case '5':
                typeName = '绝版卡'
                break
            case '9':
                typeName = '闪卡'
                break
            default:
                typeName = '普通卡'
                break
        }

        return (
            <>
                <h2 className="cards_of_theme_title">
                    <img className="cards_of_theme_logo" src={getURL.getThemeLogo(themeData.id)} alt=""/>
                    {themeData.name}
                </h2>
                <span className="cards_of_theme_diff">
                    <DiffStar diff={themeData.diff}></DiffStar>
                </span>
                <span className="cards_of_theme_type">
                    类型：{typeName} {themeData.type}
                </span>
                <ul className="cards_w">
                    {this.state.cardsSortByPrice.map(item => {
                        return (
                            <li key={item.price} className="cards_item">
                                <div className="cards_price">
                                    <h3>面值：{item.price}</h3>
                                </div>
                                <div className="cards_by_price_w">
                                    {item.cards.map(card => {
                                        return (
                                            <Card key={card.id} id={card.id} showName={true} onCardClick={this.showCombByCardId.bind(this, card.id)} highlightType={this._getCardHighlightType(card.id)} />
                                        )
                                    })}
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </>
        );
    }
}

ThemeCards.defaultProps = {
    theme_id: '287'
}

export default ThemeCards;