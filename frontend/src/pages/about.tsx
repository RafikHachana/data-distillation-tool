"use client";

import { AddIcon } from "@chakra-ui/icons";
import { Box, Container, List, ListIcon, ListItem, Text, Link } from "@chakra-ui/react";
import Head from "next/head";
import NextLink from "next/link";
import React from "react";

export default function About() {
    return (
        <>
            <Head>
                <title>About</title>
                <meta name="description" content="About this app" />
            </Head>

            <Box role="main" bg="bg.default" p="4">
                <Container>
                    <Box  maxW="xl" borderWidth="1px" borderRadius="lg" py={4} px={10}>
                        <Text fontSize="xl">About</Text>

                        <Text fontSize="lg" mt="4">
            Universal Data Distiller
                        </Text>

                        <Text fontSize="lg" mt="4">
            This app was created as the final project of the Software System Development
            course in Innopolis University. It is a simple web app
            built with Next JS. You can use this app to generate music based on
            your mood. The app uses a pre-trained model to generate music based
            on the mood you select. The code repository for this app can be
            found on{" "}
                            <Link href="https://github.com/RafikHachana/emotion-based-music-gen">
              Github
                            </Link>
            .

                            {/* The model was trained on the Lakh MIDI dataset. The
            model is a transformer model that was trained using the
            <Link href="fdf">MIDI-VAE</Link> model. The model was trained on the
            <Link href="fdf">Lakh MIDI dataset</Link>. The model was trained on */}
                        </Text>


                        <Text>
            Contributors:
                        </Text>
                        <List>
                            <ListItem ml={5}>
                                <ListIcon as={AddIcon} color='green.500' />
                                    &#9;Kamil Sabbagh.{" "}
                                <Link as={NextLink} href="https://github.com/Kamil-Sabbagh">Github</Link>
                            </ListItem>
                            <ListItem ml={5}>
                                <ListIcon as={AddIcon} color='green.500' />
                                &#9;Mohammad Shahin.{" "}
                                <Link as={NextLink} href="https://github.com/MohammadShahin">Github</Link>
                            </ListItem>
                            <ListItem ml={5}>
                                <ListIcon as={AddIcon} color='green.500' />
                                &#9;Rafik Hachana.{" "}
                                <Link as={NextLink} href="https://github.com/RafikHachana">Github</Link>
                            </ListItem>
                        </List>
                        
                        {/* <Link href="https://www.flaticon.com/free-icons" title="icons">
          Flag icons credits
        </Link> */}
                    </Box>
                </Container>
            </Box>
        </>
    );
}
