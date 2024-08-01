// pages/distillation.tsx

import { useState } from 'react';
import { NextPage } from 'next';
import {
  Tabs, TabList, TabPanels, Tab, TabPanel,
  FormControl, FormLabel, Select, Switch, Button, Box, Input
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';

const Distillation: NextPage = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const { register, handleSubmit } = useForm();
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({ accept: '.zip' });

  const onSubmit = async (data: any) => {
    const formData = new FormData();
    formData.append('distillation_hyperparameters', JSON.stringify(data));
    formData.append('distillation_type', tabIndex === 0 ? 'image' : 'text');
    formData.append('name', data.name);
    formData.append('user_id', '1');
    acceptedFiles.forEach(file => {
      formData.append('file', file);
    });

    await axios.post('/api/distillation', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  };

  return (
    <Box p={5}>
      <Tabs index={tabIndex} onChange={index => setTabIndex(index)}>
        <TabList>
          <Tab>Image Distillation</Tab>
          <Tab>Text Distillation</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl>
                <FormLabel>Expert Epochs</FormLabel>
                <Select {...register('expert_epochs')}>
                  <option value="1">1</option>
                  <option value="5">5</option>
                  <option value="25">25</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>IPC</FormLabel>
                <Select {...register('ipc')}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="5">5</option>
                  <option value="20">20</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>LR Img</FormLabel>
                <Select {...register('lr_img')}>
                  <option value="500">500</option>
                  <option value="1000">1000</option>
                  <option value="2000">2000</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>LR Teacher</FormLabel>
                <Select {...register('lr_teacher')}>
                  <option value="0.001">0.001</option>
                  <option value="0.01">0.01</option>
                  <option value="0.05">0.05</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Max Start Epoch</FormLabel>
                <Select {...register('max_start_epoch')}>
                  <option value="1">1</option>
                  <option value="5">5</option>
                  <option value="20">20</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Model</FormLabel>
                <Select {...register('model')}>
                  <option value="ConvNet">ConvNet</option>
                  <option value="ResNet18">ResNet18</option>
                  <option value="VGG11">VGG11</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Num Experts</FormLabel>
                <Select {...register('num_experts')}>
                  <option value="1">1</option>
                  <option value="5">5</option>
                  <option value="50">50</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Syn Steps</FormLabel>
                <Select {...register('syn_steps')}>
                  <option value="1">1</option>
                  <option value="5">5</option>
                  <option value="10">10</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Train Epochs</FormLabel>
                <Select {...register('train_epochs')}>
                  <option value="1">1</option>
                  <option value="5">5</option>
                  <option value="25">25</option>
                  <option value="100">100</option>
                </Select>
              </FormControl>
              <FormControl display="flex" alignItems="center">
                <FormLabel>Use ZCA</FormLabel>
                <Switch {...register('zca')} />
              </FormControl>
              <FormControl>
                <FormLabel>Upload Zip File</FormLabel>
                <Box {...getRootProps()} border="1px" borderColor="gray.300" p={2} textAlign="center" cursor="pointer">
                  <input {...getInputProps()} />
                  {acceptedFiles.length > 0 ? acceptedFiles.map(file => <p key={file.path}>{file.path}</p>) : <p>Drag 'n' drop some files here, or click to select files</p>}
                </Box>
              </FormControl>
              <Button type="submit" mt={4}>Submit</Button>
            </form>
          </TabPanel>

          <TabPanel>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl>
                <FormLabel>Epochs</FormLabel>
                <Select {...register('epochs')}>
                  <option value="1">1</option>
                  <option value="5">5</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Learning Rate</FormLabel>
                <Select {...register('learning_rate')}>
                  <option value="0.001">0.001</option>
                  <option value="0.01">0.01</option>
                  <option value="0.1">0.1</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Upload Zip File</FormLabel>
                <Box {...getRootProps()} border="1px" borderColor="gray.300" p={2} textAlign="center" cursor="pointer">
                  <input {...getInputProps()} />
                  {acceptedFiles.length > 0 ? acceptedFiles.map(file => <p key={file.path}>{file.path}</p>) : <p>Drag 'n' drop some files here, or click to select files</p>}
                </Box>
              </FormControl>
              <Button type="submit" mt={4}>Submit</Button>
            </form>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Distillation;
