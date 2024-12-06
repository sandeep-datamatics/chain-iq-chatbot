import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ChatContainer from '../../components/ChatContainer';
const Chat = () => {
    const { t } = useTranslation();
    return (
        <div>
            <h1>{t('attach_file')}</h1>
            <p>{t('input_placeholder')}</p>
            <ChatContainer />
        </div>
    );
};

export default Chat;