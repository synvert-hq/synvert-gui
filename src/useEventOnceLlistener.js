import { useRef, useEffect } from 'react';

// This is copied from @use-it/event-listener,
// but it add/remove event listener with once: true option and
// add/remove event listener every time render a component
export default (eventName, handler) => {
    const savedHandler = useRef();

    useEffect(() => {
      savedHandler.current = handler;
    }, [handler]);

    useEffect(() => {
      const eventListener = (event) => savedHandler.current(event);
      window.addEventListener(eventName, eventListener, { once: true });
      return () => {
        window.removeEventListener(eventName, eventListener, { once: true });
      };
    });
}