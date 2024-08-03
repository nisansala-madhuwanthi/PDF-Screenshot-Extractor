const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { PDFDocument } = require("pdf-lib");
const puppeteer = require("puppeteer");
const pdf2img = require("pdf-img-convert");

const app = express();

const port = 3000;

// Serve static files from the 'public' directory
app.use(express.static("public"));
app.use("/screenshots", express.static("screenshots"));

// Set up storage engine for multer
const storage = multer.diskStorage({
  destination: "./uploads", // Directory to save uploaded files
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Save the file with its original name
  },
});

// Initialize upload variable
const upload = multer({
  storage: storage,
});

// Function to generate screenshot
const generateScreenshot = async (pdfPath) => {
  
    // Load the PDF document
  const pdfBytes = fs.readFileSync(pdfPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);

  // Ensure the PDF has pages
  const pageCount = pdfDoc.getPageCount();
  if (pageCount < 1) {
    throw new Error("PDF has no pages");
  }

  // Convert the first page to an image
  const images = await pdf2img.convert(pdfPath, { page_numbers: [1] });

  if (images.length < 1) {
    throw new Error("Failed to convert PDF to image");
  }

  const imageBuffer = images[0];
  const tempImagePath = path.join(__dirname, "temp.png");
  fs.writeFileSync(tempImagePath, imageBuffer);

  // Generate screenshot using Puppeteer
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1300, height: 1200 });
  await page.goto(`file://${tempImagePath}`, { waitUntil: "networkidle0" });
  const screenshotPath = `screenshots/${path.basename(pdfPath, ".pdf")}.png`;
  await page.screenshot({ path: screenshotPath, fullPage: true });
  await browser.close();

  // Clean up the temporary image
  fs.unlinkSync(tempImagePath);

  return screenshotPath;
};




// Endpoint to upload a new PDF
app.post("/api/upload", upload.single("pdf"), async (req, res) => {
  console.log(req.body); // Logs other form fields
  console.log(req.file); // Logs information about the uploaded file
  
  try {
    if (!req.file) {
      return res.status(400).send({ message: "Please upload a PDF file!" });
    }

    const pdfPath = req.file.path;
    const screenshotPath = await generateScreenshot(pdfPath);
    res.status(200).send({ screenshotPath });  
} catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }

});



// Endpoint to get the screenshot
app.get("/api/screenshots/:filename", (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(__dirname, "screenshots", filename);

  if (fs.existsSync(filepath)) {
    res.sendFile(filepath);
  } else {
    res.status(404).send({ message: "Screenshot not found!" });
  }
});



// Endpoint to get the list of PDFs and their screenshots
app.get("/api/pdflist", (req, res) => {
  try {
    // Read the files in the 'uploads' directory
    const pdfDir = path.join(__dirname, "uploads");
    const screenshotDir = path.join(__dirname, "screenshots");
    const pdfFiles = fs
      .readdirSync(pdfDir)
      .filter((file) => file.endsWith(".pdf"));

    // Map PDF files to their screenshot paths
    const pdfList = pdfFiles.map((pdfFile) => {
      const baseName = path.basename(pdfFile, ".pdf");
      const screenshotFile = `${baseName}.png`;
      const screenshotPath = path.join("/screenshots", screenshotFile);
      return {
        pdf: path.join("/uploads", pdfFile),
        screenshot: screenshotPath,
      };
    });

    res.status(200).json(pdfList);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error fetching PDF list" });
  }
});

app.listen(port, () =>
  console.log(`Server is running on http://localhost:${port}`)
);
