var express = require('express');
const bodyParser = require('body-parser');
const Expo = require('expo-server-sdk').Expo;
const expo = new Expo();
const moment = require('moment');

const loca0 = require('../models/dbsensor')
const loca2 = require('../models/loca2');
const test1 = require('../models/test1');
const info0 = require('../models/infodivice')
const fetch = require('node-fetch');
const fs = require('fs');
const route = express.Router();
const messages = [

];
route.use(bodyParser.urlencoded({
  extended: true
}))
route.use(bodyParser.json());

route.get('/', function (req, res) {
  loca0.find().then(loca0 => {
    loca2.find().then(loca2 => {
      test1.find().then(test1 => {
        res.render('easyu', {
          sensorlist: loca0,
          chart1: loca0,
          sensorlist1: loca2,
          hehe: test1
        });
      });
    })

  });
  // Tọa độ vị trí cần lấy thông tin thời tiết (ví dụ: Hanoi, Vietnam)
  const apiKey = 'a8844e320918c05c37bb69739a52e341';

});

route.get('/intro', function (req, res) {
  loca0.find(function (err, loca0) {

    res.render('intro', {
      chart1: loca0
    })
  }).sort({ _id: -1 }).limit(1);

})
route.get('/homepage', function (req, res) {
  res.json('homepage')
})
route.get('/testpage', function (req, res) {
  res.render('easyu', {
    chart1: loca0
  })
})
route.get('/api/data', (req, res) => {
  test1.find({}, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal server error');
    } else {
      res.send(data);
    }
  });
});
route.all('/search', (req, res) => {
  //const fromDate = req.body.fromDate; // Lấy giá trị từ input 'Date From'
  const location1 = req.body.location ? req.body.location.trim() : ''; // Lấy giá trị từ select 'Địa điểm'
  const date1 = req.body.date1 ? req.body.date1.trim() : '';

  console.log(location1);

  if (location1) {
    // Tìm kiếm trong MongoDB với điều kiện ngày >= fromDate và địa điểm chứa location
    test1.find({ diachis1: { $regex: location1 }, fullday: date1 }, (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal server error');
      } else {
        res.send(data);
      }
    });
  } else {
    res.status(400).send('Location is required');
  }
})

route.get('/appdata', function (req, res) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const time = new Date();
  const month = time.getMonth() + 1;
  const date = time.getDate();
  const day = time.getDay();
  const hour = time.getHours();
  const year = time.getFullYear();
  const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour
  const minutes = time.getMinutes();
  const ampm = hour >= 12 ? 'pm' : 'am'
  const day1 = days[day] + ', ' + date + ' ' + months[month];
  const day2 = date + "-" + month + "-" + year;

  //console.log(month)
  // test1.find({
  //   flashws: 30
  // }).exec().then(test1 => {
  //   loca2.find({
  //     flashw1: {
  //       $gte: 30
  //     }

  //   }).then(loca2 => {

  //     res.json({
  //       test1,
  //       loca2,

  //     });
  //     console.log(test1)

  //   })

  // });

  console.log(day2)
  test1.find({ fullday: day2 }, (err, results) => {
    if (err) {
      console.error(err);
    } else {
      arr = results.map(result => result.Percentsals1);
      console.log(arr)
      const sum = arr.reduce((acc, curr) => acc + parseFloat(curr), 0);
      const average = sum / arr.length;
      console.log(average);
    }
  });

})
function processData() {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const time = new Date();
  const month = time.getMonth() + 1;
  const date = time.getDate();
  const day = time.getDay();
  const hour = time.getHours();
  const year = time.getFullYear();
  const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour
  const minutes = time.getMinutes();
  const ampm = hour >= 12 ? 'pm' : 'am'
  const day1 = days[day] + ', ' + date + ' ' + months[month];
  const day2 = date + "-" + month + "-" + year;

  console.log(day2)
  test1.find({ fullday: day2 }, (err, results) => {
    if (err) {
      console.error(err);
    } else {
      arr = results.map(result => result.Percentsals1);
      console.log(arr)
      const sum = arr.reduce((acc, curr) => acc + parseFloat(curr), 0);
      const average = sum / arr.length;
      console.log(average);
    }
  });
}

// Thiết lập hàm setInterval() để thực thi hàm processData() sau mỗi nửa ngày
setInterval(processData, 12 * 60 * 60 * 1000); // 12 giờ = 12 * 60 phút * 60 giây * 1000 mili giây
const dataQueue = [];
// Biến boolean để đánh dấu xem có đang xử lý dữ liệu hay không
let isProcessing = false;

route.post('/device-data', (req, res) => {
  console.log(req.body);
  const { token, latitude, longitude } = req.body;

  // Trích xuất giá trị `data` từ thuộc tính `token` trong request body
  const tokenData = token.data;


  // Kiểm tra xem token đã tồn tại trong cơ sở dữ liệu hay chưa
  info0.findOne({ tokenData }, (err, existingToken) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
      return;
    }

    if (existingToken) {
      // Nếu token đã tồn tại, trả về mã lỗi và thông báo tương ứng
      console.log('Token already exists');
      res.status(400).send('Token already exists');
      return;
    }

    // Nếu token chưa tồn tại, tạo một document mới và lưu nó vào cơ sở dữ liệu
    const info0 = require('../models/infodivice'); // Import model info0
    const newInfo = new info0({ tokenData, latitude, longitude });
    newInfo.save((err) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      } else {
        console.log('Location saved successfully');
        res.status(200).send('Location saved successfully');
      }
    });
  });

});

route.get('/tiltleapp', function (req, res) {

  test1.find().then(test1 => {

    res.json({
      test1,

    });


  })
  //.sort({ _id: -1 }).limit(1)

})
route.get('/salary-sheet', function (req, res) {
  // var m1 = req.body.selectpicker
  // console.log(m1)
  // loca2.find({
  //   diachi1: m1
  // }).then(loca2 => {
  //   res.json({
  //     loca2,
  //   });
  // });
  // test1.find().then(test1 => {

  //   res.json({
  //     test1,

  //   });


  // })
  // const date = new Date('2023-05-23'); // thay đổi ngày cần lấy dữ liệu ở đây
  // const startOfDay = date - 1;
  // const endOfDay = date + 1;


  // test1.find({ fullday: { $gte: startOfDay, $lt: endOfDay } }, (err, results) => {
  //   if (err) {
  //     console.error(err);
  //   } else {
  //     results.forEach(record => {
  //       const samples = results.map(function (record) {
  //         return {
  //           input: [(moment(record.fullday, 'DD-MM-YYYY').toDate()) + 1], // chuyển đổi timestamp thành số nguyên
  //           output: [record.Percentsals1]
  //         };
  //       });
  //       fs.writeFileSync('trainingData.json', JSON.stringify(samples));
  //     });

  //   }




  const brain = require('brain.js');

  // Đọc dữ liệu từ tệp JSON
  const trainingData = JSON.parse(fs.readFileSync('trainingData.json', 'utf8'));
  // const trainingData = JSON.parse(rawData);
  const data = trainingData.map(item => ({
    input: [new Date(item.input[0]).getTime()], // chuyển đổi ngày thành timestamp để sử dụng trong brain.js
    output: [item.output[0]]
  }));
  console.log(data)
  // Xây dựng mô hình Neural Network
  const net = new brain.NeuralNetwork({
    hiddenLayers: [3, 2], // Số lượng nơ-ron trong các lớp ẩn
    activation: 'sigmoid', // Hàm kích hoạt của các nơ-ron
  });

  // Huấn luyện mô hình Neural Network
  net.train(data, {
  });

  // Dự đoán độ mặn của các ngày tiếp theo
  const nextDays = new Date();
  console.log(nextDays)
  const input = [new Date(nextDays.setDate(nextDays.getDate() + 1)).getTime()];
  const output = net.run(input);
  console.log(`Độ mặn dự đoán cho ngày ${nextDays} là ${output}`);

})



//sensor1/0.3/25/songsaigon/106.721/10.795
//sensor1/0.1/15/song tien/106.343/10.336
//sensor1/0.2/15/song hau/ 106.216/9.516
route.get('/sensor1/:Per/:spe/:address/:lon/:la', function (req, res) {

  const moment = require('moment-timezone');
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const gmt7 = moment().tz("Asia/Ho_Chi_Minh");
  const month = gmt7.month();
  const date = gmt7.date();
  const day = gmt7.day();
  const hour = gmt7.hour();
  const year = gmt7.year();
  const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour;
  const minutes = gmt7.minute();
  const ampm = hour >= 12 ? 'pm' : 'am';
  const day1 = days[day] + ', ' + date + ' ' + months[month];
  const day2 = date + "-" + month + "-" + year;
  const day3 = date + "-" + (month + 1) + "-" + year;
  const day4 = (date + 1) + "-" + (month + 1) + "-" + year;
  const LATITUDE = '10.762622';
  const LONGITUDE = '106.660172';

  // fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${LATITUDE}&lon=${LONGITUDE}&appid=51fef79751f95f83110a05eb71d00c03`)
  //   .then(response => response.json())
  //   .then(data => {
  //     var vwind = data.wind.speed;
  //     const rainVolume = data.rain ? data.rain['1h'] : 'Không có thông tin';
  //     console.log(`Lượng mưa tại vị trí (${LATITUDE}, ${LONGITUDE}): ${rainVolume} mm`);
  //   })
  //   .catch(error => {
  //     console.log(error);
  //   });

  var p = req.params.Per;
  var ad = req.params.address;
  var lon = req.params.lon;
  var la = req.params.la;

  //Cấp độ mặn
  let level1 = 0.1;
  let level2 = 0.2;
  let level3 = 0.4;
  let level4 = 0.6;
  // Thêm dữ liệu vào mảng chờ xử lý
  dataQueue.push({ p, la, lon });
  // Nếu đang không xử lý dữ liệu nào, bắt đầu xử lý dữ liệu đầu tiên trong mảng chờ xử lý
  console.log(dataQueue)
  console.log(dataQueue.length)
  console.log(isProcessing)
  if (!isProcessing) {
    isProcessing = false;
    // Lấy dữ liệu đầu tiên trong mảng chờ xử lý
    const { p, la, lon } = dataQueue[0];

    // Xóa dữ liệu đầu tiên khỏi mảng chờ xử lý
    dataQueue.shift();

    // Tiếp tục xử lý dữ liệu tiếp theo trong mảng chờ xử lý (nếu có)
    // if (dataQueue.length > 0) {
    //   processNextData();
    // }

    function deg2rad(deg) {
      return deg * (Math.PI / 180)
    }
    const radius = 20; // bán kính cho trước

    function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
      const R = 6371; // bán kính trái đất (km)
      const dLat = deg2rad(lat2 - lat1);
      const dLon = deg2rad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const d = R * c; // khoảng cách giữa 2 điểm trên trái đất (km)
      return d;
    }

    info0.find({}, (err, info0) => {
      if (err) {
        console.error(err);
        return;
      }
      const latitudes = info0.map(item => item.latitude);
      const longitude = info0.map(item => item.longitude);
      console.log(latitudes);
      // const { latitude, longitude } = info0;
      const distance2 = getDistanceFromLatLonInKm(la, lon, latitudes[0], longitude[0]);
      console.log(distance2)

      const brain = require('brain.js');

      // Đọc dữ liệu từ tệp JSON
      const trainingData = JSON.parse(fs.readFileSync('trainingData.json', 'utf8'));
      // const trainingData = JSON.parse(rawData);
      const data = trainingData.map(item => ({
        input: [new Date(item.input[0]).getTime()], // chuyển đổi ngày thành timestamp để sử dụng trong brain.js
        output: [item.output[0]]
      }));
      // Xây dựng mô hình Neural Network
      const net = new brain.NeuralNetwork({
        hiddenLayers: [3, 2], // Số lượng nơ-ron trong các lớp ẩn
        activation: 'sigmoid', // Hàm kích hoạt của các nơ-ron
      });

      // Huấn luyện mô hình Neural Network
      net.train(data, {
        errorThresh: 0.005
      });

      // Dự đoán độ mặn của các ngày tiếp theo
      const nextDays = new Date();
      console.log(nextDays)
      const input = [new Date(nextDays.setDate(nextDays.getDate() + 1)).getTime()];
      const output = net.run(input);
      test1.create({
        Percentsals1: p,
        times1: (hoursIn12HrFormat < 10 ? '0' + hoursIn12HrFormat : hoursIn12HrFormat) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ampm,
        diachis1: ad,
        dubaos1: 'ngày mai  độ mặn' + ' ' + parseFloat(output).toFixed(2),
        longitude: lon,
        latidude: la,
        hours1: days[day] + ', ' + date + ' ' + months[month],
        fullday: day3
      })
      test1.find({}, (err, results) => {
        if (err) {
          console.error(err);
        } else {
          results.forEach(record => {
            const samples = results.map(function (record) {
              return {
                input: [(moment(record.fullday, 'DD-MM-YYYY').toDate()) + 1], // chuyển đổi timestamp thành số nguyên
                output: [record.Percentsals1]
              };
            });
            fs.writeFileSync('trainingData.json', JSON.stringify(samples));
          });

        }


      });
      info0.forEach(info0 => {
        const { latitude, longitude } = info0;
        const distance = getDistanceFromLatLonInKm(la, lon, latitude, longitude);


        if (distance <= radius) {

          if (p >= 0.1) {
            // console.log('Mặn');
            let doman1 = '';
            if (level1 <= p && p < level2) {
              doman1 = 'cấp độ 1'
            }
            if (level2 <= p && p < level3) {
              doman1 = 'cấp độ 2'
            }
            if (level3 <= p && p < level4) {
              doman1 = 'cấp độ 3'
            }
            if (p > level4) {
              doman1 = 'Độ mặn vượt ngưỡng cách báo cao nhất'
            }
            async function getTokenAndSendMessage() {
              // Thông tin của thiết bị nhận thông báo
              const somePushTokens = [info0.tokenData];

              // Tạo các hàm async để lấy thông tin của thiết bị
              const chunks = expo.chunkPushNotifications(somePushTokens.map(token => ({
                to: token,
                sound: 'default',
                body: 'Cảnh báo độ mặn tăng cao' + ' ' + 'độ mặn' + ' ' + p,
                data: { withSome: 'data' },
              })));

              const tickets = [];
              for (const chunk of chunks) {
                try {
                  const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                  tickets.push(...ticketChunk);
                } catch (error) {
                  console.error(error);
                }
              }

              console.log(tickets);
            }

            getTokenAndSendMessage();
            const chunks = expo.chunkPushNotifications(messages);
            (async () => {
              for (const chunk of chunks) {
                try {
                  const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                  console.log(ticketChunk);
                } catch (error) {
                  console.error(error);
                }
              }
            })();
          } else {
            console.log('Không mặn');
          }


        }
        if (err) {
          console.error(err);
          return;
        }
        console.log(info0)

      })



    })

  }
  res.send('ok')
})



module.exports = route