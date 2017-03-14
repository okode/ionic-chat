package com.okode.chat.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.okode.chat.model.Message;
import com.okode.chat.repository.MessageRepository;

@Service
public class MessageService {
    
    private MessageRepository messageRepository;

    @Autowired
    public MessageService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }
    
    public List<Message> findAll() {
        return messageRepository.findAll();
    }
    
    public void save(Message message) {
        messageRepository.save(message);
    }
    
}
