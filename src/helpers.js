require('dotenv').config();

const axios = require('axios');

async function sendRequest(url, method, options = {}) {
   try {
      let response;
      if (method === 'GET') {
         response = await axios.get(url, { params: options.params });
      } else if (method === 'POST') {
         response = await axios.post(url, options.body, {
            params: options.params,
         });
      } else {
         console.log('Phương thức không được hỗ trợ');
         return;
      }

      // Kiểm tra mã trạng thái của phản hồi
      if (response.status === 200) {
         const data = response.data;
         return data;
      } else {
         console.log(
            'Yêu cầu không thành công. Mã trạng thái:',
            response.status
         );
         return;
      }
   } catch (error) {
      console.error('Đã xảy ra lỗi khi gửi yêu cầu:', error);
      throw error;
   }
}

module.exports = { sendRequest };
