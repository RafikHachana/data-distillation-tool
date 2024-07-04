import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import { Box, Container, Link, Text } from "@chakra-ui/react";
import SliderWithLabel from "@/components/Slider";
import MusicForm from "@/components/MusicForm";
import NextLink from "next/link";
import ZipFilePicker from "@/components/ZipFilePicker";

const inter = Inter({ subsets: ["latin"] });

const sliders = [
    "danceability", // 0-100
    "energy", // 0-100
    "key", // 1-12 discrete
    "loudness", // 0-100
    "mode", // major or minor
    "acousticness",
    "valence", // 0-100
    "tempo", // BPM
    "time_signature", // 1-5 discrete
];

export default function Home() {
    return (
        <>
            <Head>
                <title>Universal Data Distiller</title>
                <meta
                    name="description"
                    content="Distill text/images (Innopolis University Software system development)"
                />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Box as="main" role="main" bg="bg.default" p="4" width={["100%", "80%", "60%"]} mx="auto">
                <Container mb={30}>
                    {/* <Image src="/logo.svg" alt="logo" width={200} height={200} /> */}
                    <Text fontSize="4xl" textAlign="center" mt="4">
                    Universal Data Distiller
                    </Text>
                    <Text fontSize="lg" textAlign="center" mt="2" mb="5">
                    To distill data from text/images, upload the zip file that contains the data.
                    </Text>
                    <ZipFilePicker />
                </Container>
            </Box>
        </>
    );
}
