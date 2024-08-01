import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import { Box, Container, Link, Text } from "@chakra-ui/react";
import SliderWithLabel from "@/components/Slider";
import MusicForm from "@/components/MusicForm";
import NextLink from "next/link";
import ZipFilePicker from "@/components/ZipFilePicker";
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "@/api/axios";
import { useRouter } from "next/router";
import { TaskStatus, DistillationType } from "@/types";

const inter = Inter({ subsets: ["latin"] });

const columnsNames = ["Data Type", "Name", "Status"];

interface HistoryTask {
    id: number;
    distillation_type: DistillationType;
    name: string;
    task_status: TaskStatus;
}

type History = HistoryTask[];

export default function Home() {
    const [history, setHistory] = useState<HistoryTask[]>();
    const router = useRouter();

    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get<History>("/tasks");
                if (response.status != 200)
                    throw new Error("Failed to fetch data");
                console.log(response.data);
                const sorted = response.data.sort(
                    (a, b) => a.id - b.id
                );
                // sorted.reverse();
                setHistory(response.data.reverse());
            } catch (e) {
                console.log(e);
            }
        })();
    }, []);

    return (
        <>
            <Head>
                <title>Universal Data Distiller</title>
                <meta
                    name="description"
                    content="Distill task history (Innopolis University Software system development)"
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
                    <TableContainer>
                        <Table variant="striped" colorScheme="teal">
                            <TableCaption>
                                History of all distillation tasks
                            </TableCaption>
                            <Thead>
                                <Tr>
                                    {/* <Th>To convert</Th>
                                    <Th>into</Th>
                                    <Th isNumeric>multiply by</Th> */}
                                    {columnsNames.map((elem, index) => (
                                        <Th key={index}>{elem}</Th>
                                    ))}
                                </Tr>
                            </Thead>
                            <Tbody>
                                {history &&
                                    history.map((task, index) => (
                                        <Tr
                                            key={task.id}
                                            onClick={() => {
                                                // redirect to the task page
                                                console.log(
                                                    "redirect to task page"
                                                );
                                                router.push(
                                                    `/distilledData/${task.id}`
                                                );
                                            }}
                                            cursor="pointer"
                                            // borderWidth={1}
                                            borderLeftWidth={3}
                                            // add radius to the border
                                            // borderTopLeftRadius={5}
                                            // borderBottomLeftRadius={5}
                                            // borderRightWidth={1}
                                            // padding={1}
                                            // add transition for color
                                            transition="all 0.5s"
                                            _hover={{
                                                borderLeftColor: "white",
                                                // borderRightColor: "white",
                                                // color: "red",
                                            }}
                                        >
                                            <Td>{task.distillation_type}</Td>
                                            <Td>{task.name}</Td>
                                            <Td>{task.task_status}</Td>
                                        </Tr>
                                    ))}
                                {/* <Tr>
                                    <Td>image</Td>
                                    <Td>CIFAR-10</Td>
                                    <Td>Done</Td>
                                </Tr>
                                <Tr>
                                    <Td>image</Td>
                                    <Td>CIFAR-100</Td>
                                    <Td>Done</Td>
                                </Tr> */}
                                {/* <Tr>
                                    <Td>feet</Td>
                                    <Td>centimetres (cm)</Td>
                                    <Td isNumeric>30.48</Td>
                                </Tr>
                                <Tr>
                                    <Td>yards</Td>
                                    <Td>metres (m)</Td>
                                    <Td isNumeric>0.91444</Td>
                                </Tr> */}
                            </Tbody>
                            <Tfoot>
                                <Tr>
                                    {/* <Th>To convert</Th>
                                    <Th>into</Th>
                                    <Th isNumeric>multiply by</Th> */}
                                    {columnsNames.map((elem, index) => (
                                        <Th key={index}>{elem}</Th>
                                    ))}
                                </Tr>
                            </Tfoot>
                        </Table>
                    </TableContainer>
                </Container>
            </Box>
        </>
    );
}
