package com.okode.chat.repository;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.okode.chat.model.Message;

@Repository
public class MessageRepositoryImpl implements MessageRepository {

    private final List<Message> messages = new ArrayList<>();
    
    @Override
    public List<Message> findAll() {
        return messages;
    }

    @Override
    public void save(Message message) {
        messages.add(message);
    }

}
