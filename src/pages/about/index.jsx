import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BOT_DIRECT_LINE_SECRET = 'SF4CLL7Oe8w.qh8jk1kw_A0rA03D-BA6AERkoal0CHhFylwt4anCGro'; // Your Direct Line Secret token
const directLineUrl = 'https://directline.botframework.com/v3/directline/conversations';

const About = () => {
    const [conversationId, setConversationId] = useState(null);
    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState([]);

    console.log(messages, "messages")

    useEffect(() => {
        startConversation();
    }, []);

    // Start the conversation with the bot
    const startConversation = async () => {
        try {
            const response = await axios.post(directLineUrl, {}, {
                headers: {
                    Authorization: `Bearer ${BOT_DIRECT_LINE_SECRET}`,
                },
            });
            const conversationData = response.data;
            setConversationId(conversationData.conversationId);
            // Poll the bot for new messages
            welcomeMessage(conversationData.conversationId);
        } catch (error) {
            console.error('Error starting conversation:', error);
        }
    };

    // Initialize a Welcome message to the bot
    const welcomeMessage = async (conversationId) => {
        try {
            const customEvent = {
                name: "customEvent",
                type: "event",
                value: {
                    token: ""
                },
                from: {
                    id: "user",  // You can dynamically generate or assign based on the user session
                    name: "User",
                    role: "user"
                },
            };

            await axios.post(`${directLineUrl}/${conversationId}/activities`, customEvent, {
                headers: {
                    Authorization: `Bearer ${BOT_DIRECT_LINE_SECRET}`,
                    'Content-Type': 'application/json',
                },
            });
            // Poll the bot for new messages
            pollMessages(conversationId);
        } catch (error) {
            console.error('Error Initialize a Welcome message:', error);
        }
    };


    // Poll for new messages from the bot
    const pollMessages = async (conversationId) => {
        try {
            const response = await axios.get(`${directLineUrl}/${conversationId}/activities`, {
                headers: {
                    Authorization: `Bearer ${BOT_DIRECT_LINE_SECRET}`,
                },
            });
            const activities = response.data.activities;
            console.log(activities, "activity");
            const messageActivities = activities.filter(activity => activity.type === "message");
            console.log(messageActivities, "messageActivities")
            setMessages(messageActivities);

        } catch (error) {
            console.error('Error polling messages:', error);
        }
    };



    // Send a message to the bot
    const sendMessage = async () => {
        if (!inputText || !conversationId) return;
        const message = {
            type: 'message',
            from: { id: 'user1' }, // This can be any user identifier
            text: inputText,
        };
        setInputText(''); // Clear the input field
        setMessages([...messages, message]); // Add the user message to the chat
        
        try {
            await axios.post(`${directLineUrl}/${conversationId}/activities`, message, {
                headers: {
                    Authorization: `Bearer ${BOT_DIRECT_LINE_SECRET}`,
                    'Content-Type': 'application/json',
                },
            });
            // Poll the bot for new messages
            pollMessages(conversationId);

        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <>
        <h3>About Us</h3>
        </>
    );
};

export default About;
