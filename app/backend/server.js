
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const swaggerDocument = YAML.load(path.join(__dirname, 'openapi.yaml'));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

let products = [
  { id: uuidv4(), name: "Laptop", price: 499 },
  { id: uuidv4(), name: "Headphones", price: 99 },
  { id: uuidv4(), name: "Smartphone", price: 299 }
];

app.get('/', (req,res)=>res.send("Backend Running. Visit /docs for API docs"));

app.get('/api/health',(req,res)=>res.json({status:"ok"}));
app.get('/api/products',(req,res)=>res.json(products));
app.post('/api/products',(req,res)=>{
  const p={id:uuidv4(),...req.body};
  products.push(p);
  res.status(201).json(p);
});

const PORT=5000;
app.listen(PORT,()=>console.log("Backend on "+PORT));
