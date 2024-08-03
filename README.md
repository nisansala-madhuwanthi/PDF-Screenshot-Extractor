# PDF Screenshot Extractor

This project allows users to upload PDF files, generate screenshots of the first page, and view the screenshots in a web interface.

## Prerequisites

- [Node.js](https://nodejs.org/) and npm installed on your machine.
- [Git](https://git-scm.com/) installed on your machine.

## Getting Started

### 1. Clone the Repository

```sh
git clone https://github.com/nisansala-madhuwanthi/PDF-Screenshot-Extractor.git
cd PDF-Screenshot-Extractor
```

### 2. Install Dependencies

```sh
npm install
```
### 3. Create Necessary Directories

Ensure that the directories for file uploads and screenshots exist. if the directories are exist, ignore this step:

```sh
mkdir -p uploads screenshots
```
### 4. Start the Server

```sh
node index.js
```

### 5. Access the Frontend Interface

Open your web browser and navigate to:

```sh
http://localhost:3000
```

### Project Structure

index.js: Contains the backend logic to handle PDF uploads and generate screenshots.

public: Directory for static frontend files.

uploads: Directory where uploaded PDF files are stored.

screenshots: Directory where screenshots are saved.

### Endpoints

1. Upload PDF
 <ul>
    <li>Method: POST</li>
    <li>URL: http://localhost:3000/api/upload</li>
    <li>Body: form-data</li>
      <ul>
        <li>Key: pdf (Type: File)</li>
        <li>Select a PDF file to upload.</li>
      </ul>
 </ul>  

<br>


2. Get Screenshot
   
<ul>
    <li>Method: GET</li>
    <li>URL: http://localhost:3000/api/screenshots/your-screenshot-file.png</li>
    <li>Replace your-screenshot-file.png with the actual screenshot file name.</li>
</ul>   

<br>

3. Get PDF List

<ul>
    <li>Method: GET</li>
    <li>URL: http://localhost:3000/api/pdflist</li>  
</ul>

<br>

### Frontend Interface
The frontend interface is a simple HTML page with a form to upload PDFs and display the generated screenshots. The form provides feedback during the upload process, showing a loading indicator and success message.

### Notes
<li>Ensure that the pdf-img-convert and puppeteer dependencies are correctly installed.</li>
<li>You can test the endpoints using Postman or any other API testing tool.</li>



