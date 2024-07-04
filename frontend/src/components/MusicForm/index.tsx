"use client"

import {
    Box,
    FormControl,
    FormLabel,
    Slider,
    SliderFilledTrack,
    SliderThumb,
    SliderTrack,
    Select,
    FormHelperText,
    Button,
    Flex,
    SimpleGrid,
    SliderMark,
    BoxProps,
    useToast
} from '@chakra-ui/react';
import { useState } from 'react';
import { useBreakpointValue } from '@chakra-ui/media-query';
import axios from '@/api/axios'
import { useRouter } from 'next/router';
  
interface MusicFeature {
    danceability: number;
    energy: number;
    acousticness: number;
    instrumentalness: number;
    valence: number;
    tempo: number;
    key: number;
    mode: 'major' | 'minor';
    time_signature: number;
}

type SubmitState = 'idle' | 'loading';
  
const MusicForm = (props: BoxProps) => {
    const toast = useToast();
    const router = useRouter()
    const [features, setFeatures] = useState<MusicFeature>({
        danceability: 50,
        energy: 50,
        acousticness: 50,
        valence: 50,
        instrumentalness: 50,

        tempo: 105,
        key: 5,
        mode: 'major',
        time_signature: 3,
        
    });

    const minmaxValues = {
        danceability: {
            min: 0,
            max: 100,
        },
        energy: {
            min: 0, 
            max: 100,
        },
        acousticness: {
            min: 0, 
            max: 100,
        },
        valence: {
            min: 0, 
            max: 100,
        },
        tempo: {
            min: 60, 
            max: 150,
        },
    }

    const [submitState, setSubmitState] = useState<SubmitState>('idle');
  
    const handleChange = (value: number | string, field: keyof MusicFeature) => {
        setFeatures({
            ...features,
            [field]: value,
        });
    };
    
  
    const handleSubmit = async () => {
        const feats = {
            ...features,
            danceability: features.danceability / 100,
            energy: features.energy / 100,
            acousticness: features.acousticness / 100,
            valence: features.valence / 100,
            instrumentalness: features.instrumentalness / 100,
            mode: features.mode === "minor" ? 0 : 1,
        };
        console.log(feats);
        setSubmitState('loading');
        const { instrumentalness, key, mode, time_signature, ...rest } = features;
        axios.post('/submit', feats).then((res) => {
            console.log(res.data);
            toast({
                title: 'Your request has been submitted!',
                description: "Rerouting you to the generated music page.",
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            new Promise((resolve) => setTimeout(resolve, 5000)).then(() => {
                router.push(`/track/${res.data.task_id}`);
            })
        }).catch((err) => {
            console.log(err);
            toast({
                title: 'An error occurred.',
                description: "Please try again later.",
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            setSubmitState('idle');
        });
    };
  
    const columns = useBreakpointValue({ base: 1, md: 2 });
  
    const numberToKey = (key: number) => {
        switch (key) {
        case 1: return 'C';
        case 2: return 'C#';
        case 3: return 'D';
        case 4: return 'D#';
        case 5: return 'E';
        case 6: return 'F';
        case 7: return 'F#';
        case 8: return 'G';
        case 9: return 'G#';
        case 10: return 'A';
        case 11: return 'A#';
        case 12: return 'B';
        default: return 'C';
        }
    }

    return (
        <Box py={4} px={10} maxW="xl" borderWidth="1px" borderRadius="lg" {...props}>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                <SimpleGrid columns={columns} spacing={5}>
                    {Object.entries({
                        danceability: 'Ability to dance to the music.',
                        energy: 'Energy of the track.',
                        acousticness: 'Measure of acoustics.',
                        valence: 'Musical positiveness conveyed.',
                        tempo: 'Speed or pace of the given song.',
                    }).map(([key, description]) => (
                        <FormControl key={key}>
                            <FormLabel>{`${key.charAt(0).toUpperCase() + key.slice(1)}`}</FormLabel>
                            <Slider 
                                mt={7} 
                                defaultValue={key === 'tempo' ? 100 : 50} 
                                min={key === 'tempo' ? 60 : 0} max={key === 'tempo' ? 150 : 100}
                                onChange={(val) => 
                                    handleChange(val, key as keyof MusicFeature)}>
                                <SliderMark
                                    value={features[key as keyof MusicFeature] as number}
                                    textAlign="center"
                                    bg="blue.500"
                                    color="white"
                                    mt="-10"
                                    ml="-5"
                                    w="12"
                                >
                                    {features[key as keyof MusicFeature]}
                                </SliderMark>
                                <SliderTrack>
                                    <SliderFilledTrack />
                                </SliderTrack>
                                <SliderThumb />
                            </Slider>
                            <FormHelperText>{description}</FormHelperText>
                        </FormControl>
                    ))}
                </SimpleGrid>
  
                <Flex direction={columns === 1 ? "column" : "row"} mt={4} gap={4}>
                    <FormControl>
                        <FormLabel>Key</FormLabel>
                        <Select onChange={(e) => handleChange(parseInt(e.target.value), 'key')}>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(key => (
                                <option key={key} value={key}>{numberToKey(key)}</option>
                            ))}
                        </Select>
                        <FormHelperText>Key of the track.</FormHelperText>
                    </FormControl>
  
                    <FormControl>
                        <FormLabel>Mode</FormLabel>
                        <Select onChange={(e) => handleChange(e.target.value, 'mode')}>
                            <option value="major">Major</option>
                            <option value="minor">Minor</option>
                        </Select>
                        <FormHelperText>Musical scale mode.</FormHelperText>
                    </FormControl>
  
                    <FormControl>
                        <FormLabel>Time Signature</FormLabel>
                        <Select onChange={(e) => handleChange(parseInt(e.target.value), 'time_signature')}>
                            {Array.from({ length: 5 }, (_, i) => i + 3).map(time => (
                                <option key={time} value={time}>{time}/4</option>
                            ))}
                        </Select>
                        <FormHelperText>Number of beats in each bar.</FormHelperText>
                    </FormControl>
                </Flex>
                <Flex justifyContent={'center'}>
                    <Button 
                        mt={4} 
                        colorScheme="blue" 
                        type="submit" 
                        isLoading={submitState === 'loading'}
                    >
                        Generate!
                    </Button>
                </Flex>
                
            </form>
        </Box>
    );
};
  
export default MusicForm;
  