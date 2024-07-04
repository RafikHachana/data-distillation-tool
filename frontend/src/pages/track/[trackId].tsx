import Head from "next/head";
import { Box, Text, Button, Container, Flex, keyframes } from '@chakra-ui/react';
import axios from '@/api/axios'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AudioPlayer from "@/components/AudioPlayer";

interface TrackDetails {
  status: 'in_progress' | 'failed' | 'ready';
}

const TrackPage = () => {
    const router = useRouter();
    const { trackId } = router.query;

    // const [trackDetails, setTrackDetails] = useState<TrackDetails | null>(null);
    const [trackDetails, setTrackDetails] = useState<TrackDetails | null>({
        status: 'in_progress',
    });
    const [fetchInterval, setFetchInterval] = useState<NodeJS.Timeout | null>(null);
    
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (!trackId) return;

        // call the API to fetch the track details every 5 seconds
        const interval = setInterval(() => {
            fetchTrackDetails(trackId as string);
        }, 5000);

        setFetchInterval(interval);
        return () => clearInterval(interval);
    }, [trackId]);

    const fetchTrackDetails = async (id: string) => {
        try {
            const response = await axios.get<TrackDetails>(`/status`, {
                params: {
                    task_id: id,
                },
            });
            setTrackDetails(response.data);
            fetchInterval && clearInterval(fetchInterval);
            if (response.data.status === 'ready') {
                // playTrack(response.data.trackUrl);
            }
        } catch (err) {
            setError('Failed to fetch track details.');
        }
    };

    const playTrack = () => {
        try {
            const url = axios.defaults.baseURL! + `/result?task_id=${trackId}`;
            console.log("url: ", url);
            const audio = new Audio(url);
            audio.play().catch(err => {
                setError('Could not play the track.');
            });
        }
        catch (err) {
            console.log("response: ", err);
            setError('Could not play the track.');
        }
    };
    const bounce = keyframes`
        0%, 80%, 100% { transform: scale(0); }
        40% { transform: scale(1.0); }
    `;

    const getDescription = (status: TrackDetails['status']) => {
        switch (status) {
        case 'in_progress':
            return (
                <>
                    <Text fontSize="md">
                        Your track is being generated. Please wait a few seconds.
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
                    Your track could not be generated. Please try again later.
                </Text>
            )
        case 'ready':
            return (
                <Text fontSize="md">
                    Your track has been generated successfully. Click the button below to play it.
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
                        <Text fontSize="xl">Track Details</Text>
                        {error && <Text color="red.500">{error}</Text>}
                        {trackDetails ? (
                            <Box>
                                <Text size={'md'}>Status: {trackDetails.status}</Text>
                                {getDescription(trackDetails.status)}
                                {/* <Text>{getDescription(trackDetails.status)}</Text> */}
                                <Text size={'md'}>Track ID: {trackId}</Text>

                                <Flex justifyContent={'center'}>

                                    <Button 
                                        mt={4}
                                        onClick={() => playTrack()} 
                                        isDisabled={trackDetails.status !== 'ready'}
                                    >
            Play Track
                                    </Button>
                                </Flex>
                                {/* <AudioPlayer apiUrl={`/result?task_id=${trackId}`} /> */}
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

export default TrackPage;
