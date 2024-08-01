
const pythonCode = `\
import os
import numpy as np
import torch
from torch.utils.data import Dataset, DataLoader

class NumpyDataset(Dataset):
    def __init__(self, root_data_path, transform=None):
        self.root_data_path = root_data_path
        self.transform = transform
        self.data = []
        self.labels = []
        self.classes = sorted(os.listdir(root_data_path))

        for class_folder in self.classes:
            class_path = os.path.join(root_data_path, class_folder)
            if not os.path.isdir(class_path):
                continue
            for file_name in os.listdir(class_path):
                if file_name.endswith('.npy'):
                    file_path = os.path.join(class_path, file_name)
                    self.data.append(file_path)
                    self.labels.append(class_folder)

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):
        file_path = self.data[idx]
        array = np.load(file_path)
        label = self.labels[idx]

        if self.transform:
            array = self.transform(array)

        array = torch.from_numpy(array).float()

        return array, label

def get_data_loader(root_data_path, batch_size, transform=None, shuffle=True):
    dataset = NumpyDataset(root_data_path, transform=transform)
    data_loader = DataLoader(dataset, batch_size=batch_size, shuffle=shuffle)
    return data_loader

# Example usage
if __name__ == "__main__":
    root_data_path = 'path/to/root_folder'
    batch_size = 32

    # Define any transformations here if needed
    transform = None

    data_loader = get_data_loader(root_data_path, batch_size, transform)

    for arrays, labels in data_loader:
        print(arrays.shape, labels)
        break  # Just to demonstrate one batch
  `;


export { pythonCode };
