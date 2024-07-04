import Head from "next/head";
import { Box, Text, Button, Container, Flex, keyframes } from '@chakra-ui/react';
import axios from '@/api/axios'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AudioPlayer from "@/components/AudioPlayer";
import ZipDownload from "@/components/ZipDownload";

interface DistilledDataDetails {
  status: 'in_progress' | 'failed' | 'ready';
  downloadLink?: string;
}

const DistilledDataPage = () => {
    const router = useRouter();
    const { dataId } = router.query;

    // const [distilledDataDetails, setDistilledDataDetails] = useState<DistilledDataDetails | null>(null);
    const [distilledDataDetails, setDistilledDataDetails] = useState<DistilledDataDetails | null>({
        status: 'in_progress',
    });
    const [fetchInterval, setFetchInterval] = useState<NodeJS.Timeout | null>(null);
    
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (!dataId) return;

        // call the API to fetch the distilledData details every 5 seconds
        // const interval = setInterval(() => {
        //     fetchDistilledDataDetails(dataId as string);
        // }, 5000);

        // setFetchInterval(interval);
        // return () => clearInterval(interval);
    }, [dataId]);

    const fetchDistilledDataDetails = async (id: string) => {
        try {
            const response = await axios.get<DistilledDataDetails>(`/status`, {
                params: {
                    task_id: id,
                },
            });
            setDistilledDataDetails(response.data);
            fetchInterval && clearInterval(fetchInterval);
            if (response.data.status === 'ready') {
                // playDistilledData(response.data.distilledDataUrl);
            }
        } catch (err) {
            setError('Failed to fetch distilledData details.');
        }
    };

    const bounce = keyframes`
        0%, 80%, 100% { transform: scale(0); }
        40% { transform: scale(1.0); }
    `;

    const getDescription = (status: DistilledDataDetails['status']) => {
        switch (status) {
        case 'in_progress':
            return (
                <>
                    <Text fontSize="md">
                        Your distilled data is being generated. This may take time. Please come back later!
                    </Text>
                    <Box fontSize="xl" display="flex" justifyContent="center">
                        <Box as="span" color="blue.500" mx="1" animation={`${bounce} 1.4s infinite ease-in-out both`}>
                            .</Box>
                        <Box 
                            as="span"
                            color="green.500"
                            mx="1"
                            animation={`${bounce} 1.4s infinite ease-in-out both`} 
                            style={{ animationDelay: '0.2s' }}>.</Box>
                        <Box 
                            as="span" 
                            color="red.500" 
                            mx="1" 
                            animation={`${bounce} 1.4s infinite ease-in-out both`} 
                            style={{ animationDelay: '0.4s' }}>.</Box>
                    </Box>
                </>
            )
        case 'failed':
            return (
                <Text fontSize="md">
                    Your distilled data could not be generated. Please try again later.
                </Text>
            )
        case 'ready':
            return (
                <Text fontSize="md">
                    Your distilledData has been generated successfully. Click the button below to download it.
                </Text>
            )
        default:
            return '';
        }
    }

    return (
        <>
            <Head>
                <title>Universal Data Distiller</title>
                <meta
                    name="description"
                    content="Universal Data Distiller (Innopolis University Software System Development)"
                />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Box as="main" role="main" bg="bg.default" p="4">
                <Container mb={30}>
                    <Box  maxW="xl" borderWidth="1px" borderRadius="lg" py={4} px={10}>
                        <Text fontSize="xl">Distilled Data Details</Text>
                        {error && <Text color="red.500">{error}</Text>}
                        {distilledDataDetails ? (
                            <Box>
                                <Text size={'md'}>Status: {distilledDataDetails.status}</Text>
                                {getDescription(distilledDataDetails.status)}
                                {/* <Text>{getDescription(distilledDataDetails.status)}</Text> */}
                                <Text size={'md'}>Distilled Data ID: {dataId}</Text>
                                <Flex justifyContent={'center'}>
                                    {(distilledDataDetails.status === 'ready' && distilledDataDetails.downloadLink) && (
                                        <ZipDownload downloadLink={distilledDataDetails.downloadLink} />
                                    )}
                                    {/* 
                                    <Button 
                                        mt={4}
                                        onClick={() => playDistilledData()} 
                                        isDisabled={distilledDataDetails.status !== 'ready'}
                                    >
            Play DistilledData
                                    </Button> */}
                                </Flex>
                                {/* <AudioPlayer apiUrl={`/result?task_id=${dataId}`} /> */}
                            </Box>
                        ) : (
                            <Text>Loading...</Text>
                        )}
                    </Box>
                </Container>
            </Box>
        </>
    );
};

export default DistilledDataPage;
