import { Box, BoxProps, Container, Flex, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { Link } from "@chakra-ui/react";

export const Footer = (props: BoxProps) => {
    return (
        <Box as="footer" role="contentinfo" bg="bg.accent.default" {...props} mt='auto' p='5'>
            {/* <Container> */}
            <Flex justifyContent={'center'}>
                <Text fontSize="sm" color="text.accent.default">
                This project was done as part of the Software System Development course in{' '}
                    <Link as={NextLink} href="https://innopolis.university/en/">Innopolis University</Link>
                </Text>
            </Flex>
                
            {/* </Container> */}
        </Box>
    );
};
