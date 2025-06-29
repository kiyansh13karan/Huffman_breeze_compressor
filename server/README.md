
# Huffman Compression Backend

This Python backend implements the Huffman coding algorithm for file compression.

## Setup Instructions

1. Ensure you have Python 3.7+ installed on your system.

2. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Run the Flask server:
   ```
   python app.py
   ```

The server will start on port 5000 and will be accessible at http://localhost:5000.

## API Endpoints

### `POST /api/compress`
Compresses a file using Huffman coding.

**Input**: Form data with a `file` field containing the file to compress.

**Output**: JSON with compression statistics:
```json
{
  "originalSize": 12345,
  "compressedSize": 5678,
  "compressedFileId": "1620000000_example.txt",
  "compressionRatio": 2.175
}
```

### `GET /api/download/<file_id>`
Downloads a compressed file.

**Input**: File ID in the URL.

**Output**: The compressed file as an attachment.

### `GET /api/status`
Checks if the API is running.

**Output**: 
```json
{
  "status": "Huffman Compression API is running"
}
```

## Huffman Coding Algorithm

The implementation includes:
- Frequency calculation of bytes in the input data
- Building a Huffman tree based on frequency
- Creating an encoding map from the Huffman tree
- Encoding the data using the map
- Storing metadata for decompression

## File Structure

- `app.py`: Main Flask application with API endpoints
- `uploads/`: Directory for temporarily storing uploaded files
- `compressed/`: Directory for storing compressed files
