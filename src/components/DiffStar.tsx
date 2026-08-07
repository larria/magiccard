import { StarOutlined, StarFilled } from '@ant-design/icons'

interface DiffStarProps {
  diff?: string | number
  size?: number
  color?: string
}

export default function DiffStar({
  diff = '1',
  size = 20,
  color = '#eb2f96',
}: DiffStarProps) {
  const diffNum = parseInt(String(diff), 10)
  return (
    <>
      {new Array(diffNum).fill(1).map((_, i) => (
        <span
          className="diff_star"
          key={`f${i}`}
          style={{ fontSize: `${size}px` }}
        >
          <StarFilled style={{ color }} />
        </span>
      ))}
      {new Array(5 - diffNum).fill(1).map((_, i) => (
        <span
          className="diff_star"
          key={`o${i}`}
          style={{ fontSize: `${size}px` }}
        >
          <StarOutlined style={{ color }} />
        </span>
      ))}
    </>
  )
}
