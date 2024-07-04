import { Flex } from "@chakra-ui/react";
import { Footer } from "./Footer";
// import { Main } from './Main'
import { Header } from "./Header";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
    return (
        <>
            {/* <div>
        <Header />
        {children}
        <Footer />
      </div> */}

            <Flex minHeight={"100vh"} direction="column" flex="1">
                <Header />
                {children}
                <Footer />
            </Flex>
        </>
    );
}
