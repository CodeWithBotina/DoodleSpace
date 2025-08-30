export default function ColorPicker({ color, onChange }) {
  return (
    <input
      aria-label="color"
      title="Color"
      type="color"
      value={color}
      onChange={e => onChange(e.target.value)}
      className="w-10 h-10 p-0 border-0 rounded"
    />
  )
}
