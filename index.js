const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');

app.use(bodyParser.json());

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
// Function to handle user input
const getUserInput = async () => {
  const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const data = await new Promise((resolve) => {
    readline.question("Enter your prompt (or type 'exit' to quit): ", (input) => {
      resolve(input);
      readline.close();
    });
  });

  return data;
};

// Function to interact with the AI model
const generateResponse = async (userInput) => {
  try {
    console.log("Waiting for response...");
    const result = await model.generateContent(userInput)
    console.log("AI Response:", result.response.text()|| "No response found.");
    return result.response.text()

  } catch (error) {
    console.error("Error generating response:", error.message);
  }
};


// ####################### USING CONSOLE INPUT ################

// Main loop to handle continuous user interaction
const main = async () => {
  console.log("Welcome to Google Generative AI Chat!");
  while (true) {
    const userInput = await getUserInput();
    // const userInput ="value of PI"

    if (userInput.toLowerCase() === "exit") {
      console.log("Goodbye!");
      break;
    }

    await generateResponse(userInput);
  }
};

// main();

// ##############################################################
// USING API CALL

app.get("/", (req, res) => {
  res.send("Welcome to Google Generative AI Chat!");
});

app.get('/api/content', async(req,res)=>{
  try{
    const data =await req.body.question;
    const result =await generateResponse(data);
    res.send({
      "response":result
    });
  }
  catch{

  }
})



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});