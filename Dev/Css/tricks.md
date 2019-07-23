* Multiline text truncation with ellipsis
```css
.event-header-race-overview-details-partial {
  overflow: hidden;
  position: relative;
  max-height: 5.6em;
  text-align: justify;
  margin-right: -1em;
  padding-right: 1em;
}

.event-header-race-overview-details-partial:before {
  content: '...';
  position: absolute;
  right: 0;
  bottom: 0;
}

.event-header-race-overview-details-partial:after {
  content: '';
  position: absolute;
  right: 0;
  width: 1em;
  height: 1em;
  margin-top: 0.2em;
  background: white;
}
```
