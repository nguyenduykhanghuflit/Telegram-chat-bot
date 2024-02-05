const axios = require('axios');
let data = JSON.stringify({
   title: 'Sample Title',
   chatId: '5312818365',
   totalSuccess: 10,
   totalFailure: 5,
   listBranchSuccess: [
      {
         branchName: 'Branch 1',
      },
      {
         branchName: 'Branch 2',
      },
   ],
   listBranchFailure: [
      {
         branchName: 'Branch 3',
         errorCheck: 'Error 1',
         errorCheckEod: 'Error EOD 1',
      },
      {
         branchName: 'Branch 4',
         errorCheck: 'Error 2',
         errorCheckEod: 'Error EOD 2',
      },
   ],
});

let config = {
   method: 'post',
   maxBodyLength: Infinity,
   url: 'http://localhost:8990/api/min-fast/send-data',
   headers: {
      'Content-Type': 'application/json',
   },
   data: data,
};

for (let i = 0; i < 5; i++) {
   setTimeout(() => {
      axios
         .request(config)
         .then((response) => {
            console.log(JSON.stringify(response.data));
         })
         .catch((error) => {
            console.log(error);
         });
   }, 1000);
}
