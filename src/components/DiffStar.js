import React from 'react';
import { StarOutlined, StarFilled } from '@ant-design/icons';

function DiffStar(props) {
    let diffNum = parseInt(props.diff, 10)
    return (
        <>
            {(new Array(diffNum)).fill(1).map(item => {
                return (
                    <span className="diff_star" key={Math.random()} style={{fontSize: `${props.size}px`}}>
                        <StarFilled style={{ color: props.color }} />
                    </span>
                )
            })}
            {(new Array(5 - diffNum)).fill(1).map(item => {
                return (
                    <span className="diff_star" key={Math.random()} style={{fontSize: `${props.size}px`}}>
                        <StarOutlined style={{ color: props.color }} />
                    </span>
                )
            })}
        </>
    )
}

DiffStar.defaultProps = {
    diff: 1,
    size: 20,
    color: '#eb2f96'
}

export default DiffStar;