package com.okode.chat.model;

import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

@JsonInclude(Include.NON_NULL)
public class Message {

    private String text;
    private Instant timestamp;
    
    @JsonCreator
    public Message(@JsonProperty("text") String text) {
        this.text = text;
        timestamp = Instant.now();
    }
    
    public String getText() {
        return text;
    }
    
    public Instant getTimestamp() {
        return timestamp;
    }
    
}
