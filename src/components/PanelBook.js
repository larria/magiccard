import React, { useMemo } from 'react'
import { connect } from 'react-redux';
import { Tabs } from 'antd';

import ThemeList from './ThemeList'
import getData from '../getData'

import './PanelBook.css'

const { TabPane } = Tabs;

function PanelBook(props) {
    const collectedThemeList = useMemo(() => {
        return {
            collected: getData.getThemesInclude(props.bookStat),
            unCollected: getData.getThemesExclude(props.bookStat),
        }
    }, [props.bookStat])

    console.log('已收集列表' + collectedThemeList)
    return (
        <>
            <div className="book_w">
                {/* <h2>我的集卡册</h2> */}
                <Tabs
                    defaultActiveKey="gotten"
                    tabBarStyle={{ marginLeft: '20px', marginBottom: '0', fontWeight: 'bolder' }}>
                    <TabPane tab="已集齐" key="gotten">
                        <div className="booklist_w">
                            {
                                collectedThemeList.collected.length > 0 ? (
                                    <ThemeList
                                        showType='byBlock'
                                        themesList={collectedThemeList.collected} />) :
                                    (<p>您还没有集齐任何主题</p>)
                            }
                        </div>
                    </TabPane>
                    <TabPane tab="待收集" key="ungotten">
                        <div className="booklist_w">
                            {
                                collectedThemeList.unCollected.length > 0 ? (
                                    <ThemeList
                                        showType='byBlock'
                                        themesList={collectedThemeList.unCollected} />) :
                                    (<p>您已经没有需要集齐的主题</p>)
                            }
                        </div>
                    </TabPane>
                </Tabs>
            </div>
        </>
    )
}

PanelBook.defaultProps = {
}

const mapStateToProps = (state) => {
    return {
        bookStat: state.bookStat
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        setUserName: (name) => {
            let action = {
                type: 'setUserName',
                name: name
            }
            dispatch(action);
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PanelBook)