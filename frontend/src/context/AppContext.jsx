import { createContext, useCallback, useContext, useReducer } from 'react';

const AppContext = createContext(null);

const initialState = {
  toast: null,
  loading: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_TOAST':
      return { ...state, toast: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const showToast = useCallback((message, variant = 'success') => {
    dispatch({ type: 'SET_TOAST', payload: { message, variant } });
    setTimeout(() => dispatch({ type: 'SET_TOAST', payload: null }), 4000);
  }, []);

  const setLoading = useCallback((loading) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  return (
    <AppContext.Provider value={{ ...state, showToast, setLoading }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
