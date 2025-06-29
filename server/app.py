from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import heapq
import pickle
from io import BytesIO
import time

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

UPLOAD_FOLDER = 'uploads'
COMPRESSED_FOLDER = 'compressed'

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(COMPRESSED_FOLDER, exist_ok=True)

class HuffmanNode:
    def __init__(self, char, freq):
        self.char = char
        self.freq = freq
        self.left = None
        self.right = None
    
    def __lt__(self, other):
        return self.freq < other.freq

def calculate_frequency(data):
    """Calculate frequency of each byte in the data."""
    frequency = {}
    for byte in data:
        if byte not in frequency:
            frequency[byte] = 0
        frequency[byte] += 1
    return frequency

def build_huffman_tree(frequency):
    """Build Huffman tree based on frequency dictionary."""
    priority_queue = [HuffmanNode(char, freq) for char, freq in frequency.items()]
    heapq.heapify(priority_queue)
    
    while len(priority_queue) > 1:
        left = heapq.heappop(priority_queue)
        right = heapq.heappop(priority_queue)
        
        internal_node = HuffmanNode(None, left.freq + right.freq)
        internal_node.left = left
        internal_node.right = right
        
        heapq.heappush(priority_queue, internal_node)
    
    return priority_queue[0]  # Root node

def build_encoding_map(node, code="", mapping=None):
    """Build encoding map from Huffman tree."""
    if mapping is None:
        mapping = {}
    
    if node is not None:
        if node.char is not None:  # Leaf node
            mapping[node.char] = code if code else "0"  # Special case for single character input
        build_encoding_map(node.left, code + "0", mapping)
        build_encoding_map(node.right, code + "1", mapping)
    
    return mapping

def encode_data(data, encoding_map):
    """Encode data using the encoding map."""
    encoded_bits = ""
    for byte in data:
        encoded_bits += encoding_map[byte]
    
    # Pad the encoded bits to make them a multiple of 8
    padding = 8 - (len(encoded_bits) % 8) if (len(encoded_bits) % 8) != 0 else 0
    encoded_bits += "0" * padding
    
    # Convert bit string to bytes
    encoded_bytes = bytearray()
    for i in range(0, len(encoded_bits), 8):
        byte = encoded_bits[i:i+8]
        encoded_bytes.append(int(byte, 2))
    
    return encoded_bytes, padding

def compress_file(file_data):
    """Compress file using Huffman coding."""
    # Calculate frequencies
    frequency = calculate_frequency(file_data)
    
    # Build Huffman tree
    root = build_huffman_tree(frequency)
    
    # Build encoding map
    encoding_map = build_encoding_map(root)
    
    # Encode the data
    encoded_data, padding = encode_data(file_data, encoding_map)
    
    # Prepare header (for decompression)
    header = {
        'frequency': frequency,
        'padding': padding
    }
    
    # Serialize the header
    serialized_header = pickle.dumps(header)
    header_size = len(serialized_header).to_bytes(4, byteorder='big')
    
    # Combine header and encoded data
    compressed_data = header_size + serialized_header + bytes(encoded_data)
    
    return compressed_data

@app.route('/api/compress', methods=['POST'])
def compress():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    try:
        # Read file data
        file_data = file.read()
        original_size = len(file_data)
        
        # Compress file
        compressed_data = compress_file(file_data)
        compressed_size = len(compressed_data)
        
        # Generate file ID
        file_id = f"{int(time.time())}_{file.filename}"
        
        # Save compressed file
        compressed_path = os.path.join(COMPRESSED_FOLDER, file_id)
        with open(compressed_path, 'wb') as f:
            f.write(compressed_data)
        
        # Return compression statistics
        compression_ratio = original_size / compressed_size if compressed_size > 0 else 0
        
        return jsonify({
            'originalSize': original_size,
            'compressedSize': compressed_size,
            'compressedFileId': file_id,
            'compressionRatio': compression_ratio
        })
    
    except Exception as e:
        print(f"Error during compression: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/download/<file_id>', methods=['GET'])
def download(file_id):
    try:
        file_path = os.path.join(COMPRESSED_FOLDER, file_id)
        if not os.path.exists(file_path):
            return jsonify({'error': 'File not found'}), 404
        
        # Extract original filename from file_id
        original_filename = "_".join(file_id.split("_")[1:])
        download_name = f"{original_filename.rsplit('.', 1)[0]}.huff"
        
        return send_file(
            file_path,
            as_attachment=True,
            download_name=download_name,
            mimetype='application/octet-stream'
        )
    
    except Exception as e:
        print(f"Error during download: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/status', methods=['GET'])
def status():
    return jsonify({'status': 'Huffman Compression API is running'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
