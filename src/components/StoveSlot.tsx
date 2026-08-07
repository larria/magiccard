interface StoveSlotProps {
  slotType?: 'blank' | 'locked'
  slotChild?: string
}

export default function StoveSlot({
  slotType = 'locked',
  slotChild = '',
}: StoveSlotProps) {
  return (
    <>
      {slotType === 'blank' && <div className="stoveslot stoveslot_blank" />}
      {slotType === 'locked' && (
        <div className="stoveslot stoveslot_locked">
          <span className="stoveslot_locked_inner">{slotChild}</span>
        </div>
      )}
    </>
  )
}
