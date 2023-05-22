const tf = require('@tensorflow/tfjs');
const data = require('./routes/data.json');
const inputData = data.map(item => [item.mua, item.chay, item.doman]);
const outputData = data.map(item => item.mặn);
model.add(tf.layers.dense({ inputShape: [3], units: 4, activation: 'sigmoid' }));
model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));
model.compile({ loss: 'binaryCrossentropy', optimizer: 'adam' });
model.fit(tf.tensor(inputData), tf.tensor(outputData), { epochs: 100 })
    .then(() => {
        console.log('Mô hình đã được huấn luyện');
        // Lưu mô hình thành tệp riêng
        model.save('model.json')
            .then(() => {
                console.log('Mô hình đã được lưu');
            });
    });