import Head from "next/head";
import {
    Box,
    Text,
    Button,
    Container,
    Flex,
    keyframes,
    Progress,
} from "@chakra-ui/react";
import axios from "@/api/axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AudioPlayer from "@/components/AudioPlayer";
import ZipDownload from "@/components/ZipDownload";
import { TaskStatus, DistillationType } from "@/types";
import CodeBlock from "@/components/CodeBlock";
import { pythonCode } from "@/constants";

interface DistilledDataDetails {
    // status: "in_progress" | "failed" | "ready";
    // downloadLink?: string;
    celery_task_id: string;
    current_stage_percentage: number;
    data_url: string;
    distillation_hyperparameters?: any[];
    distillation_type: DistillationType;
    distilled_data_url?: string;
    evaluation_plot_url?: string;
    id: number;
    name: string;
    task_status: TaskStatus;
    user_id?: number;
}

const DistilledDataPage = () => {
    const router = useRouter();
    const { dataId } = router.query;

    // const [distilledDataDetails, setDistilledDataDetails] = useState<DistilledDataDetails | null>(null);
    const [distilledDataDetails, setDistilledDataDetails] =
        useState<DistilledDataDetails>();
    const [fetchInterval, setFetchInterval] = useState<NodeJS.Timeout>();

    const [error, setError] = useState<string>("");

    useEffect(() => {
        if (!dataId) return;

        // call the API to fetch the distilledData details every 20 seconds
        const interval = setInterval(() => {
            fetchDistilledDataDetails(dataId as string);
        }, 5000);

        setFetchInterval(interval);
        return () => clearInterval(interval);
    }, [dataId]);

    const fetchDistilledDataDetails = async (id: string) => {
        try {
            const response = await axios.get<DistilledDataDetails>(
                `/tasks/${id}`
            );
            if (response.status != 200) throw new Error("Failed to fetch data");
            console.log(response.data);
            setDistilledDataDetails(response.data);
            fetchInterval && clearInterval(fetchInterval);
            // if (response.data.task_status === "done") {
            // playDistilledData(response.data.distilledDataUrl);
            // }
        } catch (err) {
            setError("Failed to fetch distilledData details.");
        }
    };

    const bounce = keyframes`
        0%, 80%, 100% { transform: scale(0); }
        40% { transform: scale(1.0); }
    `;

    const getDescription = (status: DistilledDataDetails["task_status"]) => {
        switch (status) {
            case "uploading":
            case "distilling":
                return (
                    <>
                        <Text fontSize="md">
                            Your distilled data is being generated. This may
                            take time. Please come back later!
                        </Text>
                        <Progress
                            value={
                                distilledDataDetails!.current_stage_percentage
                            }
                            size="md"
                            colorScheme="teal"
                            hasStripe
                            isAnimated
                            mt={4}
                            mb={4}
                        />
                        {/* <Box
                            fontSize="xl"
                            display="flex"
                            justifyContent="center"
                        >
                            <Box
                                as="span"
                                color="blue.500"
                                mx="1"
                                animation={`${bounce} 1.4s infinite ease-in-out both`}
                            >
                                .
                            </Box>
                            <Box
                                as="span"
                                color="green.500"
                                mx="1"
                                animation={`${bounce} 1.4s infinite ease-in-out both`}
                                style={{ animationDelay: "0.2s" }}
                            >
                                .
                            </Box>
                            <Box
                                as="span"
                                color="red.500"
                                mx="1"
                                animation={`${bounce} 1.4s infinite ease-in-out both`}
                                style={{ animationDelay: "0.4s" }}
                            >
                                .
                            </Box>
                        </Box> */}
                    </>
                );
            case "failed":
                return (
                    <Text fontSize="md">
                        Your distilled data could not be generated. Please try
                        again later.
                    </Text>
                );
            case "done":
                return (
                    <Text fontSize="md">
                        Your distilled data has been generated successfully.
                        Click the button below to download it.
                    </Text>
                );
            default:
                return "";
        }
    };

    return (
        <>
            <Head>
                <title>Universal Data Distiller</title>
                <meta
                    name="description"
                    content="Universal Data Distiller (Innopolis University Software System Development)"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Box as="main" role="main" bg="bg.default" p="4">
                <Container
                    mb={30}
                    maxW={"80ch"}
                    // center
                    display={"flex"}
                    flexDir={"column"}
                    alignItems={"center"}
                    justifyContent={"center"}
                >
                    <Box
                        maxW="xl"
                        borderWidth="1px"
                        borderRadius="lg"
                        py={4}
                        px={10}
                    >
                        <Text fontSize="xl">Distilled Data Details</Text>
                        {error && <Text color="red.500">{error}</Text>}
                        {distilledDataDetails ? (
                            <Box>
                                <Text size={"md"}>
                                    Status: {distilledDataDetails.task_status}
                                </Text>
                                {getDescription(
                                    distilledDataDetails.task_status
                                )}
                                {/* <Text>{getDescription(distilledDataDetails.status)}</Text> */}
                                <Text size={"md"}>
                                    Distilled Data ID: {dataId}
                                </Text>
                                <Flex justifyContent={"center"} my={3}>
                                    <ZipDownload
                                        downloadLink={
                                            axios.defaults.baseURL +
                                            `/download-dataset/${dataId}`
                                        }
                                        description={
                                            "Click the button below to download the original dataset"
                                        }
                                    />
                                </Flex>

                                <Flex justifyContent={"center"} my={3}>
                                    {distilledDataDetails.task_status ===
                                        "done" &&
                                        distilledDataDetails.distilled_data_url && (
                                            <ZipDownload
                                                downloadLink={
                                                    axios.defaults.baseURL +
                                                    distilledDataDetails.distilled_data_url
                                                }
                                                description={
                                                    "Click the button below to download the distilled dataset"
                                                }
                                            />
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
                    {distilledDataDetails?.distillation_type === "text" &&
                        distilledDataDetails?.task_status == "done" && (
                            <>
                                <Text mt={10} fontSize={'large'}>
                                    To use the distilled data in your project, you can use the following Python code:
                                </Text>
                                <CodeBlock
                                    code={pythonCode}
                                    language="python"
                                />
                            </>
                        )}
                </Container>
            </Box>
        </>
    );
};

export default DistilledDataPage;
