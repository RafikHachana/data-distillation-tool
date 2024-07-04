import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { fonts } from "../theme/fonts";
import { theme } from "../theme";
import Layout from "@/components/Layout";

const App = ({ Component, pageProps }: AppProps) => {
    return (
        <>
            <style jsx global>
                {`
          :root {
            --font-rubik: ${fonts.rubik.style.fontFamily};
          }
        `}
            </style>
            <ChakraProvider theme={theme}>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </ChakraProvider>
        </>
    );
};

export default App;
