import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
function UploadFileXlsx() {
    const user_token = Cookies.get('token');
    const token = user_token;
    const authorizationHeader = `Bearer ${token}`;
    const [file, setFile] = useState(null);

    const handleFileChange = (event: any) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async () => {
        if (!file) {
            alert('Please select a file first!');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            // استبدل 'your-endpoint-url' بعنوان URL الخاص بنقطة النهاية للخادم الخاص بك
            const response = await axios.post(
                'https://out-lit.kairo.aait-d.com/api/v1/dashboard/admin/admin/property/import',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: authorizationHeader,
                    },
                }
            );
            // هنا يمكن التعامل مع الرد من الخادم بعد الرفع بنجاح
            alert('File uploaded successfully!');
        } catch (error) {
            // التعامل مع الأخطاء
            console.error('Error uploading file: ', error);
            alert('Error uploading file');
        }
    };

    return (
        <div>
            <input type="file" accept=".xlsx" onChange={handleFileChange} />
            <button onClick={handleSubmit}>Upload File</button>
        </div>
    );
}

export default UploadFileXlsx;
