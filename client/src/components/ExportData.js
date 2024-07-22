import React from 'react';
import axios from 'axios';

function ExportData() {
    const handleExport = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/export', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'text/csv'
                },
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'migraine_diary.csv');
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error('Error exporting data:', error);
        }
    };

    return (
        <div>
            <h2>Export Your Data</h2>
            <button onClick={handleExport}>Download CSV</button>
        </div>
    );
}

export default ExportData;