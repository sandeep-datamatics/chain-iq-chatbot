import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './dashboard.scss';
const Dashboard = () => {
    const [data, setData] = useState(null);
    console.log(data)
    useEffect(() => {
        axios.get('https://jsonplaceholder.typicode.com/posts')
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the data!', error);
            });
    }, []);


    
    return (
        <div>
            <h1>Welcome to the Chatbot Dashboard Table</h1>
            {data ? (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Body</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(post => (
                            <tr key={post.id}>
                                <td>{post.id}</td>
                                <td>{post.title}</td>
                                <td>{post.body}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Loading data...</p>
            )}
        </div>
    );
};

export default Dashboard;