package com.okode.chat.model;

import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

@JsonInclude(Include.NON_NULL)
public class Message {

    private Integer userId;
    private String text;
    private Instant timestamp;
    
    @JsonCreator
    public Message(@JsonProperty("userId") Integer userId, @JsonProperty("text") String text) {
        this.userId = userId;
        this.text = text;
        timestamp = Instant.now();
    }

    public Integer getUserId() {
        return userId;
    }

    public String getText() {
        return text;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

}
