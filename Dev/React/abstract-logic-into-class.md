## Abstract logic from JSX into Class

Logic entangled with JSX:
```jsx
const Animal = ({ id, name, legCount, isFriendly }) => (
  <li>
    <a href={`url/animal/${id}`}>{name}</a> - {toString(legCount) || '?'} legs
    {isFriendly !== undefined &&
      ` - ${isFriendly ? 'Friendly' : 'Unfriendly'}`}
    {legCount === undefined && isFriendly === undefined &&
      ' - Not enough data!'}
  </li>
)
```

Move logic into class:
```jsx
class AnimalRenderData {
  constructor(data) {
    this.data = data
  }
  get name() {
    return this.data.name
  }
  get url() {
    return `url/animal/${this.data.id}`
  }
  get legCountStr() {
    return toString(this.data.legCount) || '?'
  }
  get friendliness() {
    return { true: 'Friendly', false: 'Unfriendly' }[this.data.isFriendly]
  }
  get hasNotEnoughData() {
    return this.data.legCount === undefined && this.data.isFriendly === undefined,
  }
}

const Animal = props => {
  const {
    name,
    url,
    legCountStr,
    friendliness,
    hasNotEnoughData,
  } = new AnimalRenderData(props)

  return (
    <li>
      <a href={url}>{name}</a> - {legCountStr} legs
      {friendliness && ` - ${friendliness}`}
      {hasNotEnoughData && ' - Not enough data!'}
    </li>
  )
}
```
