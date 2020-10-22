import { MutableRefObject } from 'react';

function useOnMouseItemEvent(element: MutableRefObject<HTMLElement | null>, className: string) {
  const handleMouseEnter = () => {
    element?.current?.classList.add(className);
  };

  const handleMouseLeave = () => {
    element?.current?.classList.remove(className);
  };

  return [handleMouseEnter, handleMouseLeave];
}

export default useOnMouseItemEvent;
