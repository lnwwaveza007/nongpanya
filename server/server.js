const express = require('express');
const app = express();
const port = 3000;
const MqttHandler = require('./utils/mqtt_handler.js');

const mqttClient = new MqttHandler();

const code = require('./utils/codeStore.js');

const bodyParser = require('body-parser');

const cors = require('cors');
const corsOptions = {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.get('/api/getcode', (req, res) => {
    res.status(200).json({
        code: code.generateCode()
    });
});

app.post('/api/submit-symptoms', (req, res) => {
    const formData = req.body;

    //Check code of the form that send is current working code?
    if (formData.code !== code.getCode()) {
        res.status(200).json({
            error: 'TimeoutQRCODE',
        });
        return;
    }
    //Reset Code
    code.resetCode();

    //Send Data To Vending Machine
    mqttClient.connect();
    mqttClient.sendMessage('nongpanya/order', JSON.stringify({
        'mockup': 'data',
    }));

    //Send Response
    res.status(200).json({
        message: 'susccess',
        receivedData: formData,
    });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
    }
);

