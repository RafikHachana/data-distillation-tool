import { Box, Container, Flex, Image, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { Link } from "@chakra-ui/react";
import { useRouter } from "next/router";

const navItems = [
    { label: "Home", href: "/" },
    { label: "Distill!", href: "/distill" },
    { label: "About", href: "/about" },
];

export const Header = () => {
    const { pathname } = useRouter();

    return (
        <Box as="nav" role="navigation" bg="bg.accent.default" p={10}>
            <Flex justifyContent={"space-evenly"} alignItems={'center'}>
                <Link as={NextLink} href="/home">
                    <Box width={200} height={50}>
                        <Image src="/inno-logo.png" alt="innopolis-logo" />
                    </Box>
                </Link>

                <Flex>
                    {navItems.map(({ label, href }) => (
                        <Link
                            key={label}
                            as={NextLink}
                            href={href}
                            color={pathname === href ? "primary.default" : "text.default"}
                            mr={4}
                        >
                            <Text style={pathname === href ? { fontWeight: "bold" } : {}}>
                                {label}
                            </Text>
                        </Link>
                    ))}
                </Flex>

                <Link as={NextLink} href="/home">
                    <Box width={200} height={50}>
                        <Image src="/inno-logo.png" alt="innopolis-logo" />
                    </Box>
                </Link>
            </Flex>

            <Container>
                {/* add logo */}
                <Flex>{/* <Placeholder minH="20">Navigation</Placeholder> */}</Flex>
            </Container>
        </Box>
    );
};
