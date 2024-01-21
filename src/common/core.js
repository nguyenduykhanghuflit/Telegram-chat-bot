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

function checkRequiredFields(requiredFields) {
   const errors = [];

   Object.entries(requiredFields).forEach(([field, value]) => {
      if (!requiredFields[field]) {
         errors.push(`<${field} is required>`);
      }
   });

   return {
      status: errors.length === 0,
      errors: errors.join(' '),
   };
}

function getYesterdayDate() {
   const today = new Date();
   const yesterday = new Date(today);
   yesterday.setDate(today.getDate() - 1);
   return (
      yesterday.getDate() +
      '/' +
      yesterday.getMonth() +
      1 +
      '/' +
      yesterday.getFullYear()
   );
}

function getToDateString() {
   const today = new Date();

   const formatDatePart = (part) => {
      return part.toString().padStart(2, '0');
   };

   const day = formatDatePart(today.getDate());
   const month = formatDatePart(today.getMonth() + 1);
   const year = today.getFullYear();
   const hours = formatDatePart(today.getHours());
   const minutes = formatDatePart(today.getMinutes());
   const seconds = formatDatePart(today.getSeconds());

   const res = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
   return res;
}

const apiErr = (
   res,
   msg = 'Bot gặp lỗi vui lòng thử lại sau',
   code = 500,
   result = null
) => {
   return res.status(200).json({
      Success: false,
      Message: msg,
      Code: code,
      Result: result,
   });
};

const apiOk = (res, msg = 'Send successfully', code = 200, result = null) => {
   return res.status(200).json({
      Success: true,
      Message: msg,
      Code: code,
      Result: result,
   });
};

module.exports = {
   sendRequest,
   apiErr,
   apiOk,
   checkRequiredFields,
   getToDateString,
};
