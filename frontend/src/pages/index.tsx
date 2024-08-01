import Head from "next/head";
import { Inter } from "next/font/google";
import { Box, Flex, Image, Text } from "@chakra-ui/react";


const inter = Inter({ subsets: ["latin"] });

export default function Home() {
    return (
        <>
            <Head>
                <title>Universal Data Distiller</title>
                <meta 
                    name="description" 
                    content="Universal Data Distiller (Innopolis University Software System Development)" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            
            <Box as="main" role="main" bg="bg.default" p="4">
                <Text fontSize="2xl" fontWeight="bold" textAlign="center">
                Universal Data Distiller
                </Text>
                <Text fontSize={'xl'} mt={10} textAlign={'center'}>
                    To distill data from text/images, please go to Distill!
                </Text>
                <Flex mt={5} justifyContent="center" alignItems="center" flexDir={'column'}>
                    {/* <Text>
                        The flow of distillation is described in the following images.
                    </Text> */}
                    {/* <Box mt={10} width={600} height={500} background={"white"}>
                        <Image src="/DD_plot.jpg" alt="dd-plot" />
                    </Box> */}

                    <Text mt={4}>
                    The architecture of the distillation process is described in the following image.
                    </Text>
                    
                    <Box mt={10} width={600} height={500} background={"white"}>
                        <Image src="/diagram.jpg" alt="architecture" />
                    </Box>
                </Flex>
            </Box>
        </>
    );
}
