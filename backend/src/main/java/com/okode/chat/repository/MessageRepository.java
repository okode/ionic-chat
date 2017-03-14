package com.okode.chat.repository;

import java.util.List;

import com.okode.chat.model.Message;

public interface MessageRepository {

    List<Message> findAll();
    void save(Message message);
    
}
