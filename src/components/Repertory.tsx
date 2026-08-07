import { useState } from 'react'
import RepertoryBox from './RepertoryBox'
import './Repertory.css'

export default function Repertory() {
  const [open, setOpen] = useState(false)

  return (
    <div className="repertory_w">
      <span className="repertory_icon" onClick={() => setOpen(!open)} />
      <div style={{ display: open ? 'flex' : 'none' }}>
        <RepertoryBox handleClickClose={() => setOpen(false)} />
      </div>
    </div>
  )
}
