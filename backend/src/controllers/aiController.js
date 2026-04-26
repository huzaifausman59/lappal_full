import { PythonShell } from 'python-shell';

export const getAIResponse = (req, res) => {
  const laptopSpecs = req.body;

  if (!laptopSpecs || typeof laptopSpecs !== 'object' || Array.isArray(laptopSpecs)) {
    return res.status(400).json({ message: 'Laptop specifications are required as a JSON object' });
  }

  const requiredFields = [
    'Company',
    'Product',
    'Cpu',
    'Ram',
    'Memory',
    'Gpu',
    'Age_years',
    'Condition_10',
    'Battery_Health_%'
  ];

  const missingFields = requiredFields.filter((field) => !(field in laptopSpecs));
  if (missingFields.length > 0) {
    return res.status(400).json({
      message: 'Missing required laptop specification fields',
      missingFields
    });
  }

  const pyshell = new PythonShell('model.py', {
    mode: 'text',
    pythonPath: 'py',
    pythonOptions: ['-u'],
    scriptPath: './ai/',
    stdio: ['pipe', 'pipe', 'pipe']
  });

  let output = '';

  pyshell.on('message', (message) => {
    output += message;
  });

  pyshell.stdin.write(JSON.stringify(laptopSpecs));
  pyshell.stdin.end();

  pyshell.end((err, code, signal) => {
    if (err) {
      console.error('Error running Python script:', err);
      return res.status(500).json({ message: 'Error processing AI request', error: err.message });
    }

    const response = output.trim();
    const price = parseFloat(response);

    if (Number.isNaN(price)) {
  return res.status(500).json({
    message: 'Model did not return a valid numeric price',
    result: response
  });
}
const finalPrice = Math.round(price * 328 * 0.40);
res.json({ predictedPrice: finalPrice });
  });
};