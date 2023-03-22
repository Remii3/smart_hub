import { Dispatch, createContext, SetStateAction, useState } from 'react';

interface ContextTypes {
  shownOverlay: boolean;
  setShownOverlay: Dispatch<SetStateAction<boolean>>;
}

export const OverlayContext = createContext<ContextTypes>({
  shownOverlay: false,
  setShownOverlay: () => {},
});

export function OverlayProvider({ children }: { children: React.ReactNode }) {
  const [shownOverlay, setShownOverlay] = useState(false);

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <OverlayContext.Provider value={{ shownOverlay, setShownOverlay }}>
      {children}
    </OverlayContext.Provider>
  );
}

export default OverlayProvider;
