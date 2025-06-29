
# Huffman File Compressor

A modern web application that compresses files using the Huffman coding algorithm. This project features a beautiful, Apple-inspired frontend built with React and a Python backend that implements the Huffman compression algorithm.

## Features

- Elegant drag-and-drop file upload interface
- Real-time compression with visual feedback
- Detailed compression statistics
- Download compressed files
- Implementation of the Huffman coding algorithm

## Project Structure

The project is divided into two main parts:

1. **Frontend**: React application with a sleek, minimalist UI
2. **Backend**: Python Flask API implementing the Huffman coding algorithm

## Setup Instructions

### Frontend

1. Install dependencies:
```sh
npm install
```

2. Start the development server:
```sh
npm run dev
```

The application will be available at http://localhost:8080.

### Backend

1. Navigate to the server directory:
```sh
cd server
```

2. Install Python dependencies:
```sh
pip install -r requirements.txt
```

3. Start the Flask server:
```sh
python app.py
```

The API will be available at http://localhost:5000.

## How it Works

### Huffman Coding Algorithm

Huffman coding is a lossless data compression algorithm that uses variable-length codes to represent symbols (bytes in our case). Symbols that occur more frequently are represented by shorter codes, which leads to data compression.

The algorithm works in several steps:

1. Calculate the frequency of each symbol in the data
2. Build a Huffman tree based on these frequencies
3. Generate a mapping from symbols to binary codes
4. Encode the data using these codes
5. Store the encoded data and necessary metadata for decompression

### Compression Process

1. User uploads a file through the frontend
2. File is sent to the Python backend
3. Backend compresses the file using Huffman coding
4. Compression statistics are returned to the frontend
5. User can download the compressed file

## Technologies Used

### Frontend
- React
- TypeScript
- Tailwind CSS
- Shadcn UI

### Backend
- Python
- Flask
- Binary data manipulation

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
