package com.sholop.objects;

public class ResponseObject {

    String msg;
    Object object;

    public ResponseObject(String message, Object object) {
        this.msg = message;
        this.object = object;
    }
}
