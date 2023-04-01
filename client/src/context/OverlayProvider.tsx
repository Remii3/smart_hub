import {
  Dispatch,
  createContext,
  SetStateAction,
  useState,
  useMemo,
} from 'react';

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

  const overlayValues = useMemo(
    () => ({
      shownOverlay,
      setShownOverlay,
    }),
    [shownOverlay]
  );
  return (
    <OverlayContext.Provider value={overlayValues}>
      {children}
    </OverlayContext.Provider>
  );
}

export default OverlayProvider;
