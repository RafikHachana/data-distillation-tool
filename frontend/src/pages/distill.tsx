import Head from "next/head";
// import Image from "next/image";
import { Inter } from "next/font/google";
import { Image, useToast } from "@chakra-ui/react";
import {
    Box,
    Container,
    Flex,
    Link,
    SimpleGrid,
    Text,
    useColorModeValue,
    VStack,
} from "@chakra-ui/react";
import SliderWithLabel from "@/components/Slider";
import MusicForm from "@/components/MusicForm";
import NextLink from "next/link";
import ZipFilePicker from "@/components/ZipFilePicker";
import {
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    FormControl,
    FormLabel,
    Select,
    Switch,
    Button,
    // Box,
    Input,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "@/api/axios";
import { FiUpload } from "react-icons/fi";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

const sliders = [
    "danceability", // 0-100
    "energy", // 0-100
    "key", // 1-12 discrete
    "loudness", // 0-100
    "mode", // major or minor
    "acousticness",
    "valence", // 0-100
    "tempo", // BPM
    "time_signature", // 1-5 discrete
];

export default function Home() {
    const toast = useToast();
    const router = useRouter();
    const [tabIndex, setTabIndex] = useState(0);
    const { register, handleSubmit } = useForm();
    const { acceptedFiles, isDragActive, getRootProps, getInputProps } =
        useDropzone({
            accept: {
                "application/zip": [".zip"],
            },
            maxFiles: 1,
        });

    const onSubmit = async (data: any) => {
        const formData = new FormData();
        formData.append("distillation_hyperparameters", JSON.stringify(data));
        formData.append("distillation_type", tabIndex === 0 ? "image" : "text");
        formData.append("name", data.name);
        formData.append("user_id", "1");
        // acceptedFiles.forEach((file) => {
        //     formData.append("file", file);
        // });

        const response = await axios.post("/tasks", formData, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        const newTaskId = response.data.task_id;

        const fileForm = new FormData();
        fileForm.append("file", acceptedFiles[0]);
        await axios.put(`/upload-dataset/${newTaskId}`, fileForm, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        toast({
            title: "Upload successful",
            description: "Rerouting you to the generated distilled data page.",
            status: "success",
            duration: 5000,
            isClosable: true,
        });
        new Promise((resolve) => setTimeout(resolve, 5000)).then(() => {
            // todo
            router.push(`/distilledData/${newTaskId}`);
        });
    };

    const borderColor = useColorModeValue("gray.200", "gray.600");

    return (
        <>
            <Head>
                <title>Universal Data Distiller</title>
                <meta
                    name="description"
                    content="Distill text/images (Innopolis University Software system development)"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Box
                as="main"
                role="main"
                bg="bg.default"
                p="4"
                width={["100%", "80%", "60%"]}
                mx="auto"
            >
                <Container mb={30}>
                    {/* <Image src="/logo.svg" alt="logo" width={200} height={200} /> */}
                    {/* <Text fontSize="4xl" textAlign="center" mt="4">
                        Universal Data Distiller
                    </Text>
                    <Text fontSize="lg" textAlign="center" mt="2" mb="5">
                        To distill data from text/images, upload the zip file
                        that contains the data.
                    </Text>
                    <ZipFilePicker /> */}

                    <Box p={5}>
                        <Text fontSize="4xl" textAlign="center" mt="4">
                            Universal Data Distiller
                        </Text>
                        <Text fontSize="lg" textAlign="center" mt="2" mb="5">
                            To distill data from text/images, upload the zip
                            file that contains the data.
                        </Text>
                        <Tabs
                            index={tabIndex}
                            onChange={(index) => setTabIndex(index)}
                        >
                            <TabList>
                                <Tab>Image Distillation</Tab>
                                <Tab>Text Distillation</Tab>
                            </TabList>

                            <TabPanels>
                                <TabPanel>
                                    <Text mb={3}>
                                        The uploaded file should be a zip file.
                                        The file tree should be as follows:
                                    </Text>
                                    <Flex
                                        justifyContent="center"
                                        alignItems="center"
                                        flexDirection="column"
                                        mb={5}
                                    >
                                        <Image
                                            src="/image-format.png"
                                            alt="logo"
                                            // width={200}
                                            height={300}
                                        />
                                    </Flex>
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <SimpleGrid columns={2} spacing={4}>
                                            <FormControl>
                                                <FormLabel>
                                                    Expert Epochs
                                                </FormLabel>
                                                <Select
                                                    {...register(
                                                        "expert_epochs"
                                                    )}
                                                >
                                                    <option value="1">1</option>
                                                    <option value="5">5</option>
                                                    <option value="25">
                                                        25
                                                    </option>
                                                </Select>
                                            </FormControl>
                                            <FormControl>
                                                <FormLabel>IPC</FormLabel>
                                                <Select {...register("ipc")}>
                                                    <option value="1">1</option>
                                                    <option value="2">2</option>
                                                    <option value="5">5</option>
                                                    <option value="20">
                                                        20
                                                    </option>
                                                </Select>
                                            </FormControl>
                                            <FormControl>
                                                <FormLabel>LR Img</FormLabel>
                                                <Select {...register("lr_img")}>
                                                    <option value="500">
                                                        500
                                                    </option>
                                                    <option value="1000">
                                                        1000
                                                    </option>
                                                    <option value="2000">
                                                        2000
                                                    </option>
                                                </Select>
                                            </FormControl>
                                            <FormControl>
                                                <FormLabel>
                                                    LR Teacher
                                                </FormLabel>
                                                <Select
                                                    {...register("lr_teacher")}
                                                >
                                                    <option value="0.001">
                                                        0.001
                                                    </option>
                                                    <option value="0.01">
                                                        0.01
                                                    </option>
                                                    <option value="0.05">
                                                        0.05
                                                    </option>
                                                </Select>
                                            </FormControl>
                                            <FormControl>
                                                <FormLabel>
                                                    Max Start Epoch
                                                </FormLabel>
                                                <Select
                                                    {...register(
                                                        "max_start_epoch"
                                                    )}
                                                >
                                                    <option value="1">1</option>
                                                    <option value="5">5</option>
                                                    <option value="20">
                                                        20
                                                    </option>
                                                </Select>
                                            </FormControl>
                                            <FormControl>
                                                <FormLabel>Model</FormLabel>
                                                <Select {...register("model")}>
                                                    <option value="ConvNet">
                                                        ConvNet
                                                    </option>
                                                    <option value="ResNet18">
                                                        ResNet18
                                                    </option>
                                                    <option value="VGG11">
                                                        VGG11
                                                    </option>
                                                </Select>
                                            </FormControl>
                                            <FormControl>
                                                <FormLabel>
                                                    Num Experts
                                                </FormLabel>
                                                <Select
                                                    {...register("num_experts")}
                                                >
                                                    <option value="1">1</option>
                                                    <option value="5">5</option>
                                                    <option value="50">
                                                        50
                                                    </option>
                                                </Select>
                                            </FormControl>
                                            <FormControl>
                                                <FormLabel>Syn Steps</FormLabel>
                                                <Select
                                                    {...register("syn_steps")}
                                                >
                                                    <option value="1">1</option>
                                                    <option value="5">5</option>
                                                    <option value="10">
                                                        10
                                                    </option>
                                                </Select>
                                            </FormControl>
                                            <FormControl>
                                                <FormLabel>
                                                    Train Epochs
                                                </FormLabel>
                                                <Select
                                                    {...register(
                                                        "train_epochs"
                                                    )}
                                                >
                                                    <option value="1">1</option>
                                                    <option value="5">5</option>
                                                    <option value="25">
                                                        25
                                                    </option>
                                                    <option value="100">
                                                        100
                                                    </option>
                                                </Select>
                                            </FormControl>
                                            {/* add space */}
                                            {/* <Box h={4} /> */}
                                            <FormControl
                                                // display="flex"
                                                // alignItems="center"
                                                width="100%"
                                            >
                                                <FormLabel>Use ZCA</FormLabel>
                                                <Switch
                                                    mt={2}
                                                    {...register("zca")}
                                                />
                                            </FormControl>
                                            <Box h={4} />
                                        </SimpleGrid>
                                        <FormControl>
                                            <FormLabel>
                                                Upload Zip File
                                            </FormLabel>
                                            <Box
                                                {...getRootProps()}
                                                border="2px dashed"
                                                borderColor={borderColor}
                                                borderRadius="md"
                                                p={6}
                                                textAlign="center"
                                            >
                                                {/* show the accepted file name if it exists */}
                                                {acceptedFiles.length > 0 && (
                                                    <Text>
                                                        {acceptedFiles[0].name}
                                                    </Text>
                                                )}
                                                <input {...getInputProps()} />
                                                <VStack spacing={4}>
                                                    {isDragActive ? (
                                                        <Text>
                                                            Drop the zip file
                                                            here...
                                                        </Text>
                                                    ) : (
                                                        <>
                                                            <FiUpload size="40px" />
                                                            <Text>
                                                                Drag & drop a
                                                                zip file here,
                                                                or click to
                                                                select one
                                                            </Text>
                                                            <Button
                                                                colorScheme="teal"
                                                                variant="solid"
                                                                onClick={() => {
                                                                    const inputElement =
                                                                        document.querySelector(
                                                                            'input[type="file"]'
                                                                        ) as HTMLInputElement;
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
                                            {/* <Box
                                                {...getRootProps()}
                                                border="1px"
                                                borderColor="gray.300"
                                                p={2}
                                                textAlign="center"
                                                cursor="pointer"
                                            >
                                                <input {...getInputProps()} />
                                                {acceptedFiles.length > 0 ? (
                                                    acceptedFiles.map(
                                                        (file) => (
                                                            <p key={file.name}>
                                                                {file.name}
                                                            </p>
                                                        )
                                                    )
                                                ) : (
                                                    <p>
                                                        Drag 1 drop some files
                                                        here, or click to select
                                                        files
                                                    </p>
                                                )}
                                            </Box> */}
                                        </FormControl>
                                        <Flex justifyContent="center" mt={4}>
                                            <Button type="submit" mt={4}>
                                                Submit
                                            </Button>
                                        </Flex>
                                    </form>
                                </TabPanel>

                                <TabPanel>
                                    <Text mb={3}>
                                        The uploaded file should be a zip file.
                                        The content of the zip file should be a
                                        single csv file in the follwing format:
                                    </Text>
                                    <Flex
                                        justifyContent="center"
                                        alignItems="center"
                                        flexDirection="column"
                                        mb={5}
                                    >
                                        <Image
                                            src="/text-format.png"
                                            alt="logo"
                                            // width={200}
                                            // height={200}
                                        />
                                    </Flex>
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <SimpleGrid columns={2} spacing={4}>
                                            <FormControl>
                                                <FormLabel>Epochs</FormLabel>
                                                <Select {...register("epochs")}>
                                                    <option value="1">1</option>
                                                    <option value="5">5</option>
                                                </Select>
                                            </FormControl>
                                            <FormControl>
                                                <FormLabel>
                                                    Learning Rate
                                                </FormLabel>
                                                <Select
                                                    {...register(
                                                        "learning_rate"
                                                    )}
                                                >
                                                    <option value="0.001">
                                                        0.001
                                                    </option>
                                                    <option value="0.01">
                                                        0.01
                                                    </option>
                                                    <option value="0.1">
                                                        0.1
                                                    </option>
                                                </Select>
                                            </FormControl>
                                        </SimpleGrid>
                                        <FormControl>
                                            <FormLabel>
                                                Upload Zip File
                                            </FormLabel>
                                            <Box
                                                {...getRootProps()}
                                                border="2px dashed"
                                                borderColor={borderColor}
                                                borderRadius="md"
                                                p={6}
                                                textAlign="center"
                                            >
                                                {/* show the accepted file name if it exists */}
                                                {acceptedFiles.length > 0 && (
                                                    <Text>
                                                        {acceptedFiles[0].name}
                                                    </Text>
                                                )}
                                                <input {...getInputProps()} />
                                                <VStack spacing={4}>
                                                    {isDragActive ? (
                                                        <Text>
                                                            Drop the zip file
                                                            here...
                                                        </Text>
                                                    ) : (
                                                        <>
                                                            <FiUpload size="40px" />
                                                            <Text>
                                                                Drag & drop a
                                                                zip file here,
                                                                or click to
                                                                select one
                                                            </Text>
                                                            <Button
                                                                colorScheme="teal"
                                                                variant="solid"
                                                                onClick={() => {
                                                                    const inputElement =
                                                                        document.querySelector(
                                                                            'input[type="file"]'
                                                                        ) as HTMLInputElement;
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
                                            {/* <Box
                                                {...getRootProps()}
                                                border="1px"
                                                borderColor="gray.300"
                                                p={2}
                                                textAlign="center"
                                                cursor="pointer"
                                            >
                                                <input {...getInputProps()} />
                                                {acceptedFiles.length > 0 ? (
                                                    acceptedFiles.map(
                                                        (file) => (
                                                            <p key={file.name}>
                                                                {file.name}
                                                            </p>
                                                        )
                                                    )
                                                ) : (
                                                    <p>
                                                        Drag 1 drop some files
                                                        here, or click to select
                                                        files
                                                    </p>
                                                )}
                                            </Box> */}
                                        </FormControl>
                                        <Flex justifyContent="center" mt={4}>
                                            <Button type="submit" mt={4}>
                                                Submit
                                            </Button>
                                        </Flex>
                                        {/* <Button type="submit" mt={4}>
                                            Submit
                                        </Button> */}
                                    </form>
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </Box>
                </Container>
            </Box>
        </>
    );
}
