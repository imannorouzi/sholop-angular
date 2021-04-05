package com.sholop.objects;

import java.util.Date;

/**
 * Created by Pooyan
 * on 5/4/2021.
 */
public class EventCount {

    public EventCount() {}

    Date date;
    Integer count;

    public EventCount(Date time, int count) {
        this.date = time;
        this.count = count;
    }
}
