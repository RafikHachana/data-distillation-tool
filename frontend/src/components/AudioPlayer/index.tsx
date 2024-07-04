// components/AudioPlayer.tsx
import { Button, Box, BoxProps } from '@chakra-ui/react';
import axios from '@/api/axios'
import { useEffect, useState } from 'react';

interface AudioPlayerProps extends BoxProps {
  apiUrl: string; // URL to fetch the .wav file
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ apiUrl, ...boxProps }) => {
    // const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState('00:00');

    // useEffect(() => {
    //     const fetchAudio = async () => {
    //         const response = await axios.get(apiUrl, { responseType: 'blob' });
    //         const url = URL.createObjectURL(response.data);
    //         setAudioUrl(url);
    //     };

    //     fetchAudio();
    // }, [apiUrl]);

    useEffect(() => {
        const baseUrl = axios.defaults.baseURL;
        const audioObj = new Audio(baseUrl + apiUrl);
        console.log("audioObj", baseUrl)
        audioObj.onloadedmetadata = () => {
            setDuration(formatDuration(audioObj.duration));
        };
        setAudio(audioObj);
    }, [apiUrl]);

    const formatDuration = (duration: number) => {
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const togglePlayPause = () => {
        if (!audio) return;

        if (audio.paused) {
            audio.play();
            setIsPlaying(true);
        } else {
            audio.pause();
            setIsPlaying(false);
        }
    };

    return (
        <Box {...boxProps} display={'flex'} justifyContent={'center'}>
            {duration && <p>Duration: {duration}</p>}
            <Button onClick={togglePlayPause}>
                {isPlaying ? 'Pause' : 'Play'}
            </Button>
        </Box>
    );
};

export default AudioPlayer;
