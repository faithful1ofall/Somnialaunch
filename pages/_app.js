import { useEffect, useState } from "react";
import ContextProvider from "src/utils/ContextProvider";
import GlobalStyles from "@assets/styles/GlobalStyles";
import { ThirdwebProvider } from "thirdweb/react";

const App = ({ Component, pageProps }) => {
  const [showChild, setShowChild] = useState(false);

  useEffect(() => {
    setShowChild(true);
  }, []);

  if (!showChild) {
    return null;
  }

  return (
    <ThirdwebProvider>
    <ContextProvider>
      <GlobalStyles />
      <Component {...pageProps} />
    </ContextProvider>
  </ThirdwebProvider>
  );
};

export default App;
