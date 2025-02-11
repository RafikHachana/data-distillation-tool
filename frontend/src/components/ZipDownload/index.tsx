import React from "react";
import { Box, Button, Text, VStack } from "@chakra-ui/react";
import { FiDownload } from "react-icons/fi";

interface ZipDownloadProps {
    downloadLink: string;
    description: string;
}

const ZipDownload: React.FC<ZipDownloadProps> = ({ downloadLink, description }) => {
    console.log("downloadLink: ", downloadLink);
    return (
        <Box
            textAlign="center"
            border="2px dashed"
            borderColor="gray.200"
            borderRadius="md"
            p={6}
        >
            <VStack spacing={4}>
                <FiDownload size="40px" />
                <Text>{description}</Text>
                <Button
                    as="a"
                    href={downloadLink}
                    download="dataset.zip"
                    colorScheme="teal"
                    variant="solid"
                >
                    Download Zip File
                </Button>
            </VStack>
        </Box>
    );
};

export default ZipDownload;
