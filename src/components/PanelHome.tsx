import Stove from './Stove'
import Repertory from './Repertory'
import './PanelHome.css'

export default function PanelHome() {
  return (
    <div className="home_w">
      <Stove />
      <Repertory />
    </div>
  )
}
