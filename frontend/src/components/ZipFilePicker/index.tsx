import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Button, Text, useColorModeValue, VStack, useToast } from '@chakra-ui/react';
import { FiUpload } from 'react-icons/fi';
import axios from '@/api/axios'
import { useRouter } from 'next/router';

const ZipFilePicker: React.FC = () => {
    const toast = useToast();
    const [isUploading, setIsUploading] = React.useState(false);
    const router = useRouter()

    const onDrop = useCallback((acceptedFiles: File[]) => {
        acceptedFiles.forEach((file) => {
            if (file.type === 'application/zip') {
                // Handle the zip file
                console.log('Zip file uploaded:', file);
                // You can process the file here, e.g., send it to your backend or extract contents
            } else {
                toast({
                    title: "Invalid file type",
                    description: "Please upload a zip file",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        });
    }, []);

    const uploadFile = async (file: File) => {
        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

    
        try {
            // const response = await axios.post('/submit', {});
            // if (response.status != 200) {
            //     throw new Error('Upload failed');
            // }
            toast({
                title: "Upload successful",
                description: "Rerouting you to the generated distilled data page.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            new Promise((resolve) => setTimeout(resolve, 5000)).then(() => {
                // todo
                router.push(`/distilledData/${5}`);
            })

        } catch (error) {
            toast({
                title: "Upload failed",
                description: error as string,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsUploading(false);
        }
    };

    const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
        onDrop,
        accept: {
            'application/zip': ['.zip'],
        },
        maxFiles: 1,
    });

    const borderColor = useColorModeValue('gray.200', 'gray.600');

    return (
        <VStack>

        
            <Box
                {...getRootProps()}
                border="2px dashed"
                borderColor={borderColor}
                borderRadius="md"
                p={6}
                textAlign="center"
            >
                {/* show the accepted file name if it exists */}
                {acceptedFiles.length > 0 && <Text>{acceptedFiles[0].name}</Text>}
                <input {...getInputProps()} />
                <VStack spacing={4}>
                    {isDragActive ? (
                        <Text>Drop the zip file here...</Text>
                    ) : (
                        <>
                            <FiUpload size="40px" />
                            <Text>Drag & drop a zip file here, or click to select one</Text>
                            <Button 
                                colorScheme="teal"
                                variant="solid" 
                                onClick={() => {
                                    const inputElement = 
                                    document.querySelector('input[type="file"]') as HTMLInputElement;
                                    inputElement?.click();
                                }}
                            >
              Choose File
                            </Button>
                        </>
                    )}
                </VStack>
                {/* submit button */}
            </Box>

            <Button
                mt={4}
                colorScheme="teal"
                variant="solid"
                isLoading={isUploading}
                isDisabled={!acceptedFiles.length}
                
                onClick={async () => {
                    setIsUploading(true);
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    uploadFile(acceptedFiles[0])
                }}
            >
        Upload
            </Button>
        </VStack>
    );
};

export default ZipFilePicker;
