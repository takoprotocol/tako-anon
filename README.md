# tako-anon

## Overview

`tako-anon` is a versatile toolkit designed for use in web, React Native, and backend applications. It provides essential functionalities for generating proofs (via SDK, React Hook, Web Inject, React Native WebView Inject), verifying proofs, and creating zero-knowledge (zk) Merkle trees.

These features are specifically designed for integrating zero-knowledge data transmission and interaction into various platforms, enabling secure, privacy-preserving communication without the need for directly managing the transmission of sensitive data.

This approach enhances the platforms' capabilities by allowing them to process and verify data in a way that ensures privacy and security.

## Features

- **Proof Generation**: Tools for generating proofs using the SDK, React Hook, Web Inject, and React Native WebView Inject, offering flexibility across different platforms.
- **Proof Verification**: Features to verify proofs, ensuring data integrity and authenticity.
- **Zero-Knowledge Merkle Trees**: Implements advanced cryptographic techniques to create zk Merkle trees, guaranteeing data privacy and security.
- **Project Structure**: The core project is a web and API Next.js application, designed to integrate with optional packages such as React Hook, SDK, and zero-knowledge (zk) logic and circuits.

## Installation and Usage

1. Clone the repository:

   ```bash
   git clone https://github.com/takoprotocol/tako-anon
   ```

2. Navigate to the project directory:

   ```bash
   cd tako-anon
   ```

3. Install dependencies:

   ```bash
   bun install
   ```

4. Start the project:

   ```bash
   bun run start
   ```

5. Open your browser and visit `http://localhost:3000` to view the project.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

Special thanks to [anon.world](https://anon.world/) for their inspiration and support in structuring the project and providing circuit content. Their project served as a foundation, and we have built upon it. The original project is licensed under the MIT License, and we have included their license details in our project.

## Third-Party Licenses

### anon.world

```plaintext
MIT License

Copyright (c) 2024 Kartik Patel

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
