## Hooks
* [useState](#useState)
* [useCallback](#useCallback)
* [useEffect](#useEffect)
* [Tips & Best practices](#Tips-n-best-practice)


### useState
When there is too many states to be managed, you can do this:
```js
const initialState = { loading: false, results: [], value: '' };

const App = () => {
  const [{ loading, results, value }, setState] = useState(initialState);
  
  // setState
  setState(prevState => ({ ...prevState, loading: true, value }));
  
  // reset all states
  setState(prevState => ({ ...initialState }));
};
```

### useCallback
For better performance. i.e avoid creating new func repeatedly. Put deps in the array as the 2nd argument, when you access them from inside the func.

```js
const { setNav } = props;
const [ value, setValue ] = useState('');

const onClick = useCallback(e => {
  setNav(value); // put value in dep array as you access it!

}, [setNav, value]);
```

### useEffect
Do something only once:
```js
useEffect(() => {
  api.fetch('/data');
}, []) // empty array means no dependency to watch on
```

See how you can refactor lifecycle hooks based code to `useEffect` one.
```js
// old
import React, { Component } from 'react';
import websockets from 'websockets';

class ChatChannel extends Component {
  state = {
    messages: [];
  }

  componentDidMount() {
    this.startListeningToChannel(this.props.channelId);
  }

  componentDidUpdate(prevProps) {
    if (this.props.channelId !== prevProps.channelId) {
      this.stopListeningToChannel(prevProps.channelId);
      this.startListeningToChannel(this.props.channelId);
    }
  }

  componentWillUnmount() {
    this.stopListeningToChannel(this.props.channelId);
  }

  startListeningToChannel(channelId) {
    websockets.listen(
      `channels.${channelId}`,
      message => {
        this.setState(state => {
          return { messages: [...state.messages, message] };
        });
      }
    );
  }

  stopListeningToChannel(channelId) {
    websockets.unlisten(`channels.${channelId}`);
  }

  render() {
    // ...
  }
}


// new
import React, { useEffect, useState } from 'react';
import websockets from 'websockets';

function ChatChannel({ channelId }) {
  const [messages, setMessages] = useState([]);
  
  // cleanup callback will be triggered either when channelId changes, or when the component unmounts.
  useEffect(() => {
    websockets.listen(
      `channels.${channelId}`,
      message => setMessages(messages => [...messages, message])
    );

    return () => websockets.unlisten(`channels.${channelId}`);
  }, [channelId]);

  // ...
}
```

>>>
Instead of thinking about when we should apply the side effect, we declare the side effect’s dependencies. This way React knows when it needs to run, update, or clean up.

That’s where the power of useEffect lies. The websocket listener doesn’t care about mounting and unmounting components, it cares about the value of channelId over time.


### Tips-n-best-practice
* Declare functions needed by an effect inside of it:
```js
// bad
function Example({ someProp }) {
  function doSomething() {
    console.log(someProp);
  }

  useEffect(() => {
    doSomething();
  }, [someProp]);
}

// good
function Example({ someProp }) {
  useEffect(() => {
    function doSomething() {
      console.log(someProp);
    }

    doSomething();
  }, [someProp]);
}
```

* React uses `Object.is(a, b)` to do referential equality check.
* The function passed to `useEffect` will run after the render is committed to the screen.
